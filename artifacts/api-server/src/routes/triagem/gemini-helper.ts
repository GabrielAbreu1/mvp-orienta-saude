import OpenAI from "openai";
import { logger } from "../../lib/logger.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const DEFAULT_TIMEOUT_MS = 30_000;

export async function callGeminiJSON(opts: {
  system: string;
  user: string;
  maxOutputTokens?: number;
  timeoutMs?: number;
}): Promise<string> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = 1;
  let lastErr: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await client.chat.completions.create(
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: opts.system },
            { role: "user", content: opts.user },
          ],
          response_format: { type: "json_object" },
          max_tokens: opts.maxOutputTokens ?? 4096,
        },
        { signal: controller.signal }
      );
      const text = response.choices[0]?.message?.content ?? "";
      if (!text.trim()) throw new Error("Empty response from Groq");
      return text;
    } catch (err) {
      lastErr = err;
      if (attempt === maxRetries) break;
      await new Promise((r) => setTimeout(r, 1_000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Groq call failed");
}

export function extractJSON(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, "$1");
  const candidate = fenced.trim();
  try {
    return JSON.parse(candidate);
  } catch {
    const firstObj = candidate.indexOf("{");
    const firstArr = candidate.indexOf("[");
    const starts = [firstObj, firstArr].filter((i) => i >= 0);
    if (starts.length === 0) throw new Error("No JSON found in response");
    const start = Math.min(...starts);
    const lastObj = candidate.lastIndexOf("}");
    const lastArr = candidate.lastIndexOf("]");
    const end = Math.max(lastObj, lastArr);
    if (end <= start) throw new Error("Malformed JSON in response");
    return JSON.parse(candidate.slice(start, end + 1));
  }
}

export function logTechnical(event: {
  level: "info" | "warn" | "error";
  event: string;
  route: string;
  durationMs?: number;
  hadFallback?: boolean;
  hadRedFlag?: boolean;
  errorType?: string;
}): void {
  const { level, ...rest } = event;
  logger[level](rest);
}