// Multi-Engine-KI-Sichtbarkeit: Fragt ChatGPT (OpenAI), Google Gemini,
// Perplexity und Claude (Anthropic) mit Buyer-Fragen und prüft, ob die Ziel-
// Domain/Firma genannt/zitiert wird. Jede Engine ist isoliert (try/catch +
// Timeout); fehlt ein Key, wird die Engine als "skipped" markiert.

export type EngineId = "chatgpt" | "gemini" | "perplexity" | "claude";

export interface EngineQuestionResult {
  engine: EngineId;
  mentioned: boolean;
  skipped: boolean;
  citations: string[]; // Domains, die zitiert wurden
  error?: string;
}

export interface QuestionResult {
  topic: string;
  question: string;
  perEngine: EngineQuestionResult[];
}

export interface AiVisibilityResult {
  questions: QuestionResult[];
  engineCoverage: Record<EngineId, { hits: number; total: number; skipped: boolean }>;
  overallCoveragePct: number;
  citedInstead: { domain: string; count: number }[];
}

const CALL_TIMEOUT_MS = 25000;
const MAX_TOKENS = 500;

function domainOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// Sammelt alle URLs aus beliebigem JSON (robuster Citation-Fallback).
function harvestUrls(obj: any): string[] {
  const urls = new Set<string>();
  const walk = (n: any) => {
    if (n == null) return;
    if (typeof n === "string") {
      const m = n.match(/https?:\/\/[^\s"'<>)\]]+/g);
      if (m) m.forEach((u) => urls.add(u));
    } else if (Array.isArray(n)) {
      n.forEach(walk);
    } else if (typeof n === "object") {
      Object.values(n).forEach(walk);
    }
  };
  walk(obj);
  return Array.from(urls);
}

function evaluate(
  engine: EngineId,
  text: string,
  rawJson: any,
  target: { domain: string; firma: string }
): EngineQuestionResult {
  const urls = harvestUrls(rawJson);
  const citationDomains = Array.from(
    new Set(urls.map(domainOf).filter((d): d is string => !!d))
  );
  const hay = (text || "").toLowerCase();
  const targetDomain = target.domain.toLowerCase();
  const firmaLc = target.firma.trim().toLowerCase();
  const mentioned =
    citationDomains.some((d) => d === targetDomain || d.endsWith("." + targetDomain)) ||
    hay.includes(targetDomain) ||
    (firmaLc.length > 3 && hay.includes(firmaLc));
  // Fremd-Domains (ohne Zieldomain, ohne KI-/Redirect-Rauschen)
  const NOISE = /(googleusercontent|vertexaisearch|gstatic|google\.com|bing\.com)/i;
  const citations = citationDomains.filter(
    (d) => d !== targetDomain && !d.endsWith("." + targetDomain) && !NOISE.test(d)
  );
  return { engine, mentioned, skipped: false, citations };
}

function withTimeout(init: RequestInit): RequestInit & { signal: AbortSignal } {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), CALL_TIMEOUT_MS);
  return { ...init, signal: ctrl.signal };
}

const skip = (engine: EngineId): EngineQuestionResult => ({
  engine, mentioned: false, skipped: true, citations: [],
});

// ── OpenAI (ChatGPT) via Responses API + web_search ──
async function askOpenAI(q: string, target: any): Promise<EngineQuestionResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return skip("chatgpt");
  try {
    const res = await fetch("https://api.openai.com/v1/responses", withTimeout({
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1",
        tools: [{ type: "web_search_preview" }],
        input: q,
        max_output_tokens: MAX_TOKENS,
      }),
    }));
    const data = await res.json();
    if (!res.ok) return { ...skip("chatgpt"), skipped: false, error: data?.error?.message || `HTTP ${res.status}` };
    const text = data.output_text || JSON.stringify(data.output || "");
    return evaluate("chatgpt", text, data, target);
  } catch (e) {
    return { ...skip("chatgpt"), skipped: false, error: (e as Error).message };
  }
}

// ── Google Gemini via google_search grounding ──
async function askGemini(q: string, target: any): Promise<EngineQuestionResult> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) return skip("gemini");
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      withTimeout({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: q }] }],
          tools: [{ google_search: {} }],
        }),
      })
    );
    const data = await res.json();
    if (!res.ok) return { ...skip("gemini"), skipped: false, error: data?.error?.message || `HTTP ${res.status}` };
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join(" ") || "";
    return evaluate("gemini", text, data, target);
  } catch (e) {
    return { ...skip("gemini"), skipped: false, error: (e as Error).message };
  }
}

// ── Perplexity (sonar) ──
async function askPerplexity(q: string, target: any): Promise<EngineQuestionResult> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) return skip("perplexity");
  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", withTimeout({
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "sonar",
        messages: [{ role: "user", content: q }],
        max_tokens: MAX_TOKENS,
      }),
    }));
    const data = await res.json();
    if (!res.ok) return { ...skip("perplexity"), skipped: false, error: data?.error?.message || `HTTP ${res.status}` };
    const text = data?.choices?.[0]?.message?.content || "";
    return evaluate("perplexity", text, data, target);
  } catch (e) {
    return { ...skip("perplexity"), skipped: false, error: (e as Error).message };
  }
}

// ── Anthropic (Claude) via web_search tool ──
async function askClaude(q: string, target: any): Promise<EngineQuestionResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return skip("claude");
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", withTimeout({
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: MAX_TOKENS,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
        messages: [{ role: "user", content: q }],
      }),
    }));
    const data = await res.json();
    if (!res.ok) return { ...skip("claude"), skipped: false, error: data?.error?.message || `HTTP ${res.status}` };
    const text = (data?.content || [])
      .map((b: any) => (typeof b.text === "string" ? b.text : ""))
      .join(" ");
    return evaluate("claude", text, data, target);
  } catch (e) {
    return { ...skip("claude"), skipped: false, error: (e as Error).message };
  }
}

const ENGINES: EngineId[] = ["chatgpt", "gemini", "perplexity", "claude"];

const DRY_RUN = process.env.AUDIT_DRY_RUN === "1";

export async function checkAiVisibility(
  target: { domain: string; firma: string },
  questions: { topic: string; question: string }[]
): Promise<AiVisibilityResult> {
  const results: QuestionResult[] = [];
  const citedCount = new Map<string, number>();

  for (const q of questions) {
    const [chatgpt, gemini, perplexity, claude] = DRY_RUN
      ? [skip("chatgpt"), skip("gemini"), skip("perplexity"), skip("claude")]
      : await Promise.all([
          askOpenAI(q.question, target),
          askGemini(q.question, target),
          askPerplexity(q.question, target),
          askClaude(q.question, target),
        ]);
    const perEngine = [chatgpt, gemini, perplexity, claude];
    for (const r of perEngine) {
      if (!r.mentioned) {
        for (const d of r.citations) citedCount.set(d, (citedCount.get(d) || 0) + 1);
      }
    }
    results.push({ topic: q.topic, question: q.question, perEngine });
  }

  const engineCoverage = {} as AiVisibilityResult["engineCoverage"];
  for (const e of ENGINES) {
    const cells = results.map((r) => r.perEngine.find((x) => x.engine === e)!);
    const active = cells.filter((c) => !c.skipped);
    engineCoverage[e] = {
      hits: active.filter((c) => c.mentioned).length,
      total: active.length,
      skipped: active.length === 0,
    };
  }

  const allActive = results.flatMap((r) => r.perEngine).filter((c) => !c.skipped);
  const overallCoveragePct = allActive.length
    ? Math.round((allActive.filter((c) => c.mentioned).length / allActive.length) * 100)
    : 0;

  const citedInstead = Array.from(citedCount.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { questions: results, engineCoverage, overallCoveragePct, citedInstead };
}
