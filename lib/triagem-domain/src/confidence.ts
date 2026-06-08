/**
 * Nível de confiança da análise da IA — sempre enum, nunca número.
 *
 * Se a IA retornar um valor numérico (escapou do prompt), normalizamos
 * para o enum no servidor antes de qualquer schema validation.
 */

export const CONFIDENCE_LEVEL_VALUES = ["low", "medium", "high"] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVEL_VALUES)[number];

export interface ConfidenceMeta {
  level: ConfidenceLevel;
  label: string;
  /** Texto exibido junto à análise para calibrar expectativa do usuário. */
  hedge: string;
}

const META: Record<ConfidenceLevel, ConfidenceMeta> = {
  low: {
    level: "low",
    label: "Confiança baixa",
    hedge:
      "As informações fornecidas não foram suficientes para uma análise mais segura. Considere conversar com um profissional para uma avaliação completa.",
  },
  medium: {
    level: "medium",
    label: "Confiança moderada",
    hedge:
      "Esta análise é orientativa. Um profissional poderá confirmar e aprofundar a avaliação.",
  },
  high: {
    level: "high",
    label: "Confiança boa",
    hedge:
      "Esta análise é educativa e não substitui uma consulta médica presencial.",
  },
};

export function getConfidenceMeta(level: ConfidenceLevel): ConfidenceMeta {
  return META[level];
}

/**
 * Normaliza qualquer entrada para ConfidenceLevel.
 * Aceita: enum válido, número 0-1, número 0-100, string.
 * Fallback seguro: 'low' (mais cauteloso).
 */
export function normalizeConfidence(input: unknown): ConfidenceLevel {
  if (input === "low" || input === "medium" || input === "high") return input;

  if (typeof input === "number" && Number.isFinite(input)) {
    const normalized = input > 1 ? input / 100 : input;
    if (normalized >= 0.75) return "high";
    if (normalized >= 0.4) return "medium";
    return "low";
  }

  if (typeof input === "string") {
    const lower = input.toLowerCase().trim();
    if (lower === "alta" || lower === "high") return "high";
    if (lower === "media" || lower === "média" || lower === "medium")
      return "medium";
    if (lower === "baixa" || lower === "low") return "low";

    const parsed = Number(lower);
    if (!Number.isNaN(parsed)) return normalizeConfidence(parsed);
  }

  return "low";
}
