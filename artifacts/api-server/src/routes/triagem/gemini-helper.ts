import { ai } from "@workspace/integrations-gemini-ai";
import { logger } from "../../lib/logger.js";

export const GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Chama o Gemini com timeout e 1 retry em falha transitória.
 * Lança o erro final se ambas tentativas falharem (caller decide fallback).
 */
export async function callGeminiJSON(opts: {
  system: string;
  user: string;
  maxOutputTokens?: number;
  /** ms */
  timeoutMs?: number;
}): Promise<string> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = 1;
  let lastErr: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: opts.user }] }],
        config: {
          systemInstruction: opts.system,
          responseMimeType: "application/json",
          maxOutputTokens: opts.maxOutputTokens ?? 8192,
          abortSignal: controller.signal,
        },
      });
      const text = response.text ?? "";
      if (!text.trim()) {
        throw new Error("Empty response from Gemini");
      }
      return text;
    } catch (err) {
      lastErr = err;
      if (attempt === maxRetries) break;
      await new Promise((r) => setTimeout(r, 1_000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Gemini call failed");
}

/**
 * Extrai JSON do texto retornado pela IA. Aceita JSON puro, fenced blocks
 * (```json ... ```), ou texto com JSON embutido (extrai o primeiro { ou [).
 */
export function extractJSON(raw: string): unknown {
  const trimmed = raw.trim();

  // Remove fences ```json ... ``` ou ``` ... ```
  const fenced = trimmed.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, "$1");
  const candidate = fenced.trim();

  try {
    return JSON.parse(candidate);
  } catch {
    // fallback: tenta achar primeiro { ou [
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
  // Sanitizado — nunca inclui sintomas, textos do usuário, idade, etc.
  logger[level](rest);
}
