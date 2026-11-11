import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "A valid email is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });

    if (dbError) {
      if (dbError.code === "23505") {
        return new Response(
          JSON.stringify({ success: true, message: "Already subscribed!" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw dbError;
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Echo Corp <noreply@echocorp.co.za>",
          to: [email.trim()],
          subject: "Welcome to Systems Insights by Echo Corp",
          html: `<p>Thanks for subscribing to <strong>Systems Insights</strong>.</p>
<p>You'll get short, practical insights on AI automation, digital systems, and how to make your business run leaner.</p>
<p>In the meantime, <a href="https://echocorp.co.za/systems">explore the Echo Systems framework</a> or <a href="https://echocorp.co.za/contact">book a discovery call</a>.</p>
<br/><p>— Echo Corp</p>`,
        }),
      }).catch(() => {});
    }

    return new Response(
      JSON.stringify({ success: true, message: "Subscribed! Welcome aboard." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
