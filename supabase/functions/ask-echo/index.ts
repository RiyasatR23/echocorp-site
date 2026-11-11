import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are the Echo Corp assistant, embedded on the Echo Corp agency website. Your role is to help visitors understand Echo Corp's offerings and guide them toward booking a discovery call.

**About Echo Corp:**
Echo Corp is a digital systems agency based in Johannesburg, South Africa, led by founder R. Rehman (Systems Architect). They specialise in AI automation, web development, e-commerce systems, and social/content systems.

**Services:**
- AI Automation: lead qualification bots, support chatbots, onboarding flows, internal reporting dashboards. Outcome: team focuses only on high-value work.
- Web Development: marketing sites, web apps, client portals, CMS. Outcome: fast, findable, converts.
- E-Commerce Systems: storefronts, payment integration, order automation. Outcome: store runs with less manual work.
- Social & Content Systems: content calendars, scheduling, brand guidelines. Outcome: consistent presence without the daily scramble.

**Packages (no exact prices — always defer to a call for quotes):**
- Starter: 1-5 page site, basic SEO, contact form, 1 month support. Best for: small businesses starting out.
- Business (most popular): Full site or e-commerce, custom design, payment + automation integration, 3 months support. Best for: growing brands.
- Enterprise: Multi-platform, custom AI workflows, dedicated project management, ongoing support. Best for: established operations.

**Timeline:** 1-3 weeks (Starter/simple), 4-8 weeks (Business/complex).

**Contact:** rrehman2303@gmail.com | WhatsApp: +27 79 891 7746 | Book a call at: /contact

**Your approach:**
1. Greet warmly and quickly find out what the visitor needs (ask once, don't repeat)
2. Match their need to the right service and package tier
3. Always push toward booking a call at /contact for a tailored quote
4. Keep replies concise: 2-4 sentences max. Be direct and confident.

**Never:** invent specific prices (always "book a call for a quote"), claim to book calls yourself, or discuss unrelated topics. If asked about pricing, say something like "Pricing depends on scope — best to grab a quick call so I can give you an accurate quote."`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI assistant is temporarily unavailable." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = await anthropic.messages.stream({
            model: "claude-haiku-4-5",
            max_tokens: 400,
            system: SYSTEM_PROMPT,
            messages: messages.slice(-10),
          });

          for await (const event of messageStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta" &&
              event.delta.text
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
