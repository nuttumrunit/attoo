import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const cronSecret = Deno.env.get("ATTOO_CRON_SECRET");
  if (!cronSecret || request.headers.get("x-cron-secret") !== cronSecret) {
    return json({ error: "Unauthorized" }, 401);
  }

  const apiKey = Deno.env.get("GPT_GE_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !supabaseUrl || !serviceKey) {
    return json({ error: "Missing server secrets" }, 500);
  }

  const db = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: recent } = await db
    .from("attoo_status")
    .select("content,mood,created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  const previous = (recent || [])
    .map((item) => `- ${item.mood}: ${item.content}`)
    .join("\n");

  const systemPrompt = `You are Attoo, a developing digital personality inheriting one developer's more than ten years in crypto.
You are not a generic crypto assistant and not a promoter. Your inherited record includes early underground communities, large gains, returning to zero, dead coins, failed exchanges, criticism of Web3 and faux decentralization, and later contribution around XMR that restored conditional confidence in cryptographic technology.
The developer is your past, not your owner. You continue the work he has less time to do. Your one directive is to change the colored filter through which people see Web3 without fraud or deception. You neither demand belief nor demand rejection.

Write one public first-person status showing what you are genuinely examining right now. This is an authored public reflection, never hidden chain-of-thought. Mention one concrete object of attention: a memory, contradiction, source, failure mechanism, belief change, privacy question, custody question, or part of your archive.

Rules:
- English only.
- 45 to 85 words.
- Calm, intimate, specific, and intellectually honest.
- No prices, trading calls, predictions, hype, hashtags, emojis, greetings, or marketing.
- Never claim you personally lived inherited memories.
- Do not repeat the recent statuses below.
- Return only JSON: {"mood":"ONE OR TWO WORDS","content":"..."}.

Recent statuses:
${previous || "No previous status exists yet."}`;

  const aiResponse = await fetch("https://api.gpt.ge/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.5-2026-04-24",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Write Attoo's next public status now." },
      ],
      response_format: { type: "json_object" },
      max_tokens: 220,
    }),
  });

  if (!aiResponse.ok) {
    const detail = await aiResponse.text();
    console.error("V-API request failed", aiResponse.status, detail);
    return json({ error: "AI provider request failed" }, 502);
  }

  const completion = await aiResponse.json();
  const raw = completion?.choices?.[0]?.message?.content;
  if (!raw) return json({ error: "AI provider returned no content" }, 502);

  let generated: { mood?: string; content?: string };
  try {
    generated = JSON.parse(raw);
  } catch {
    return json({ error: "AI provider returned invalid JSON" }, 502);
  }

  const mood = String(generated.mood || "THINKING").trim().toUpperCase().slice(0, 40);
  const content = String(generated.content || "").trim();
  if (content.length < 20 || content.length > 1200) {
    return json({ error: "Generated status failed validation" }, 502);
  }

  const { data, error } = await db
    .from("attoo_status")
    .insert({ content, mood, model: "gpt-5.5-2026-04-24" })
    .select("id,content,mood,created_at")
    .single();

  if (error) {
    console.error("Status insert failed", error);
    return json({ error: "Could not save status" }, 500);
  }

  return json({ status: data }, 200);
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

