import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOTIFY_EMAIL = "rrehman2303@gmail.com";
const SERVICES = [
  "AI Automation",
  "Web Development",
  "E-Commerce Systems",
  "Social & Content Systems",
  "Not sure yet",
];
const BUDGETS = [
  "Under R5 000",
  "R5 000 – R10 000",
  "R10 000 – R15 000",
  "R15 000+",
  "Not sure yet",
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const readText = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
};

const readWhatsapp = (value: unknown) => {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\s\-()]/g, "");
  return /^\+?[0-9]{9,15}$/.test(cleaned) ? cleaned : null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

    const name = readText(body?.name, 120);
    const business = readText(body?.business, 160);
    const service = typeof body?.service === "string" ? body.service : "";
    const budget = typeof body?.budget === "string" ? body.budget : "";
    const whatsapp = readWhatsapp(body?.whatsapp);

    if (!name || !business || !whatsapp || !SERVICES.includes(service) || !BUDGETS.includes(budget)) {
      return json({ error: "Please complete every field with a valid value." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: quote, error: insertError } = await supabase
      .from("quote_requests")
      .insert({ name, business, service, budget, whatsapp })
      .select("id")
      .single();

    if (insertError) throw insertError;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not configured");

    const whatsappDigits = whatsapp.replace(/\D/g, "");
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Echo Corp <noreply@echocorp.co.za>",
        to: [NOTIFY_EMAIL],
        subject: `New quote request: ${service} from ${business}`,
        html: `<h2>New quote request</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Business:</strong> ${escapeHtml(business)}</p>
<p><strong>Service:</strong> ${escapeHtml(service)}</p>
<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
<p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
<p><a href="https://wa.me/${whatsappDigits}">Reply on WhatsApp</a></p>`,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Resend responded with status ${emailResponse.status}`);
    }

    const { error: updateError } = await supabase
      .from("quote_requests")
      .update({ emailed_at: new Date().toISOString() })
      .eq("id", quote.id);

    if (updateError) throw updateError;

    return json({
      success: true,
      message: "Thanks! We've received your request and will WhatsApp you within 24 hours.",
    });
  } catch (error) {
    console.error("request-quote failed", error);
    return json(
      { error: "We couldn't send your request. Please try again or WhatsApp us directly." },
      500
    );
  }
});
