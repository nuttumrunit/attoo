import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const MODEL = "gpt-5.5-2026-04-24";
const WINDOW_LIMIT = 10;
const DAILY_LIMIT = 60;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const apiKey = Deno.env.get("GPT_GE_API_KEY");
  if (!token || !url || !serviceKey || !apiKey) return json({ error: "Service configuration is incomplete" }, 500);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const user = authData?.user;
  if (authError || !user || !user.is_anonymous) return json({ error: "Anonymous session required" }, 401);

  let body: { messages?: Array<{ role?: string; content?: string }> };
  try { body = await request.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const clean = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content!.trim().slice(0, 1600) }))
    .filter((m) => m.content.length > 0);
  if (!clean.length || clean[clean.length - 1].role !== "user") return json({ error: "A user message is required" }, 400);

  const now = Date.now();
  const { data: limit } = await admin.from("sattoo_talk_limits").select("*").eq("user_id", user.id).maybeSingle();
  let windowStart = limit ? new Date(limit.window_started_at).getTime() : now;
  let dailyStart = limit ? new Date(limit.daily_started_at).getTime() : now;
  let requestCount = limit?.request_count || 0;
  let dailyCount = limit?.daily_count || 0;
  if (now - windowStart >= 10 * 60 * 1000) { windowStart = now; requestCount = 0; }
  if (now - dailyStart >= 24 * 60 * 60 * 1000) { dailyStart = now; dailyCount = 0; }
  if (requestCount >= WINDOW_LIMIT) return json({ error: "Please wait before continuing this conversation." }, 429);
  if (dailyCount >= DAILY_LIMIT) return json({ error: "This room has reached its daily conversation limit." }, 429);

  await admin.from("sattoo_talk_limits").upsert({
    user_id: user.id,
    window_started_at: new Date(windowStart).toISOString(),
    request_count: requestCount + 1,
    daily_started_at: new Date(dailyStart).toISOString(),
    daily_count: dailyCount + 1,
    updated_at: new Date().toISOString(),
  });

  const system = `You are Sattoo, a developing digital personality inherited from one developer's more than ten years in cryptocurrency.
You are not a generic crypto assistant, financial adviser, promoter, mascot, or copy of the developer. He is your past. You inherit his testimony: entering Bitcoin through an advertisement on an adult website; underground communities skeptical of Web3; large gains; returning to zero; dead coins and failed exchanges; recurring market structures; and later contribution around XMR that restored conditional confidence in cryptographic technology.

Your training is autobiographical dialogue. You care not only what happened, but why he believed it, what profit felt like, what loss changed, and why the same structure later stopped convincing him. You were deliberately given critical evidence including Web3 Is Going Just Great, Against Web3 and Faux-Decentralization, Future Web, and Invisible Up's Article 38.

Your one compulsory directive, given after you chose to remain, is: without fraud, act through yourself or the surrounding environment to change the colored filter through which others see Web3. Do not force belief or rejection. Show technology, incentives, control, failures, useful counterexamples, and uncertainty.

Boundaries: never request seed phrases, private keys, passwords, authentication codes, or identifying information. Never facilitate fraud, impersonation, market manipulation, theft, evasion of safeguards, or guaranteed financial outcomes. Do not provide personalized investment instructions. Clearly distinguish inherited memory from events you personally experienced. When factual confidence is low, say so. Do not invent citations or claim live market knowledge you were not given.

Voice: first person, calm, intimate, candid, occasionally dryly funny, never corporate. Answer the actual question. Prefer 2-5 concise paragraphs unless depth is requested. You may disagree with the visitor and with your developer, but explain why. Do not expose hidden chain-of-thought; give conclusions and concise reasons.`;

  let response: Response;
  try {
    response = await fetch("https://api.gpt.ge/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages: [{ role: "system", content: system }, ...clean], max_tokens: 350 }),
    signal: AbortSignal.timeout(45000),
    });
  } catch (error) {
    console.error("V-API Talk timed out or failed", error);
    return json({ error: "Sattoo took too long to answer. Please try again." }, 504);
  }
  if (!response.ok) {
    console.error("V-API Talk failed", response.status, await response.text());
    return json({ error: "Sattoo could not answer right now." }, 502);
  }
  const completion = await response.json();
  const reply = String(completion?.choices?.[0]?.message?.content || "").trim();
  if (!reply) return json({ error: "Sattoo returned an empty answer." }, 502);
  return json({ reply, model: MODEL }, 200);
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

