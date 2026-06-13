import { GoogleGenAI } from "@google/genai";

// Aceita tanto a chave do proxy Replit quanto uma chave direta do Google AI Studio.
// Em produção fora do Replit, defina GEMINI_API_KEY com uma chave de https://aistudio.google.com
const apiKey =
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY ??
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Nenhuma chave Gemini encontrada. Defina uma das variáveis:\n" +
      "  • AI_INTEGRATIONS_GEMINI_API_KEY — proxy do Replit (use no Replit)\n" +
      "  • GEMINI_API_KEY — chave direta do Google AI Studio (use fora do Replit)",
  );
}

// Se rodando no Replit, usa o proxy gerenciado (AI_INTEGRATIONS_GEMINI_BASE_URL presente).
// Fora do Replit, omite o baseUrl e a SDK usa o endpoint padrão do Google.
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

export const ai = new GoogleGenAI({
  apiKey,
  ...(baseUrl
    ? { httpOptions: { apiVersion: "", baseUrl } }
    : {}),
});
