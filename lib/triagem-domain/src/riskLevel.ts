/**
 * Nível de risco — fonte única de verdade.
 *
 * Usado por:
 * - Red flag rule engine (camada determinística)
 * - Resposta da IA (após normalização)
 * - UI (cores, ícones, mensagens, CTAs)
 * - Analytics
 *
 * Nunca duplicar essa enumeração em outros pontos do código.
 */

export const RISK_LEVEL_VALUES = [
  "low",
  "medium",
  "high",
  "emergency",
] as const;

export type RiskLevel = (typeof RISK_LEVEL_VALUES)[number];

export interface RiskLevelMeta {
  level: RiskLevel;
  /** Ordinal para comparação. Maior = mais urgente. */
  priority: 1 | 2 | 3 | 4;
  /** Texto curto para badge/UI. */
  label: string;
  /** Mensagem padrão exibida no card de urgência. */
  message: string;
  /** Texto do CTA principal recomendado. */
  ctaText: string;
  /** Chave estável para analytics — nunca renomear. */
  analyticsKey: string;
  /**
   * Tokens semânticos de cor (resolvidos no tema CSS).
   * Valores são nomes de CSS variables, não cores diretas.
   */
  tone: "calm" | "neutral" | "warning" | "danger";
}

const META: Record<RiskLevel, RiskLevelMeta> = {
  low: {
    level: "low",
    priority: 1,
    label: "Baixa urgência",
    message:
      "Seus sintomas, no momento, sugerem cuidado de baixa urgência. Acompanhar e observar costuma ser apropriado.",
    ctaText: "Ver orientações",
    analyticsKey: "risk_low",
    tone: "calm",
  },
  medium: {
    level: "medium",
    priority: 2,
    label: "Atenção",
    message:
      "Seus sintomas merecem atenção. Considere buscar avaliação médica nos próximos dias.",
    ctaText: "Buscar atendimento em breve",
    analyticsKey: "risk_medium",
    tone: "neutral",
  },
  high: {
    level: "high",
    priority: 3,
    label: "Alta urgência",
    message:
      "Seus sintomas indicam alta urgência. Procure atendimento médico ainda hoje.",
    ctaText: "Procurar UPA ou pronto-socorro",
    analyticsKey: "risk_high",
    tone: "warning",
  },
  emergency: {
    level: "emergency",
    priority: 4,
    label: "Emergência",
    message:
      "Seus sintomas podem indicar uma condição grave. Não continue este formulário. Busque atendimento de emergência agora.",
    ctaText: "Ligue 192 (SAMU) imediatamente",
    analyticsKey: "risk_emergency",
    tone: "danger",
  },
};

export function getRiskLevelMeta(level: RiskLevel): RiskLevelMeta {
  return META[level];
}

/**
 * Retorna o RiskLevel de maior prioridade entre dois.
 * Em caso de empate, retorna o primeiro.
 * IA nunca pode reduzir o risco identificado pela regra determinística.
 */
export function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
  return META[a].priority >= META[b].priority ? a : b;
}

export const RISK_LEVELS: readonly RiskLevel[] = RISK_LEVEL_VALUES;
