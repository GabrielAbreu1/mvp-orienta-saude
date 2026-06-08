import { GoogleGenAI } from "@google/genai";

if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
  throw new Error(
    "AI_INTEGRATIONS_GEMINI_API_KEY must be set.\n" +
      "  • No Replit: provisione a integração Gemini no painel.\n" +
      "  • Em outro provedor: obtenha uma chave gratuita em https://aistudio.google.com e defina esta variável de ambiente.",
  );
}

const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

export const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  // Se rodando no Replit, usa o proxy gerenciado.
  // Fora do Replit, omite o baseUrl e a SDK usa o endpoint padrão do Google.
  ...(baseUrl
    ? { httpOptions: { apiVersion: "", baseUrl } }
    : {}),
});
