import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOTIFY_EMAIL = "rrehman2303@gmail.com";
const BUDGETS = [
  "Under R5,000",
  "R5,000–R15,000",
  "R15,000–R30,000",
  "R30,000–R60,000",
  "R60,000+",
  "Not sure yet",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const email = readText(body?.email, 254);
    const message = readText(body?.message, 2000);
    const company = typeof body?.company === "string" ? body.company.trim().slice(0, 160) : "";
    const budget = typeof body?.budget === "string" ? body.budget : "";

    if (!name || !email || !EMAIL_PATTERN.test(email) || !message || company.length > 160) {
      return json({ error: "Please complete every required field with a valid value." }, 400);
    }
    if (budget && !BUDGETS.includes(budget)) {
      return json({ error: "Please choose a budget from the list." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, company: company || null, message, budget: budget || null });

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
        reply_to: email,
        subject: `New message from ${name}${company ? ` (${company})` : ""}`,
        html: `<h2>New message from the website</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
<p><strong>Budget:</strong> ${escapeHtml(budget || "Not provided")}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Resend responded with status ${emailResponse.status}`);
    }

    return json({ success: true, message: "Message sent! We'll be in touch within 24 hours." });
  } catch (error) {
    console.error("contact-message failed", error);
    return json(
      { error: "We couldn't send your message. Please try again or WhatsApp us directly." },
      500
    );
  }
});
