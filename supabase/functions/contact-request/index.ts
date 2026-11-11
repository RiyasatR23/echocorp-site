import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOTIFY_EMAIL = "rrehman2303@gmail.com";
const NEEDS = [
  "A new website",
  "Redo my current website",
  "An online store",
  "Echo Assistant (AI chat)",
  "Ads management",
  "Not sure yet",
];
const BUDGETS = ["R4 500 – R8 500", "R8 500 – R15 000", "R15 000+", "Not sure yet"];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const readText = (value: unknown, maxLength: number, required: boolean) => {
  if (value === undefined || value === null || value === "") {
    return required ? null : "";
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (required && trimmed.length === 0) return null;
  return trimmed.length <= maxLength ? trimmed : null;
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

    const name = readText(body?.name, 120, true);
    const business = readText(body?.business, 160, false);
    const need = typeof body?.need === "string" ? body.need : "";
    const budget = typeof body?.budget === "string" ? body.budget : "";
    const message = readText(body?.message, 1000, false);

    if (!name || business === null || message === null || !NEEDS.includes(need) || !BUDGETS.includes(budget)) {
      return json({ error: "Please complete the form with valid details." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: enquiry, error: insertError } = await supabase
      .from("site_enquiries")
      .insert({ name, business: business || null, need, budget, message: message || null })
      .select("id")
      .single();

    if (insertError) throw insertError;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not configured");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Echo Corp <noreply@echocorp.co.za>",
        to: [NOTIFY_EMAIL],
        subject: `New enquiry: ${need} from ${business || name}`,
        html: `<h2>New website enquiry</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Business:</strong> ${escapeHtml(business || "Not given")}</p>
<p><strong>Needs:</strong> ${escapeHtml(need)}</p>
<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
<p><strong>Message:</strong> ${escapeHtml(message || "None")}</p>`,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Resend responded with status ${emailResponse.status}`);
    }

    const { error: updateError } = await supabase
      .from("site_enquiries")
      .update({ emailed_at: new Date().toISOString() })
      .eq("id", enquiry.id);

    if (updateError) throw updateError;

    return json({ success: true });
  } catch (error) {
    console.error("contact-request failed", error);
    return json({ error: "We couldn't send your enquiry. Please WhatsApp us directly." }, 500);
  }
});
