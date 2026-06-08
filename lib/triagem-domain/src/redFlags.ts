/**
 * RED FLAGS — Regras clínicas determinísticas baseadas em IDs de sintomas.
 *
 * Camada determinística SOBERANA — não depende da IA.
 * Executada em DOIS momentos:
 *   1. Cliente — imediatamente ao selecionar/desselecionar qualquer sintoma
 *   2. Servidor — nas rotas /api/perguntas e /api/analisar, antes de chamar a IA
 *
 * Princípio: em caso de dúvida, escalar o nível de risco.
 */

import type { RiskLevel } from "./riskLevel.js";

export interface RedFlagResult {
  detected: boolean;
  /** RiskLevel resultante quando há detecção, undefined caso contrário. */
  level: RiskLevel | undefined;
  /** Mensagem clínica curta — exibida no RedFlagAlert. */
  message: string;
  /** Ação recomendada — texto direto pro usuário. */
  action: string;
  /** Identificador da regra que disparou (analytics/debug). Sem dados clínicos. */
  ruleId: string | undefined;
  /** Número de emergência relevante (Brasil). */
  emergencyNumber: string;
}

export interface TriageSnapshot {
  /** IDs de symptoms.ts */
  sintomasSelecionados: readonly string[];
  /** 0-10. Use 0 se ainda não coletado. */
  intensidadeDor?: number;
}

/** IDs que individualmente já indicam emergência. */
const CRITICAL_SYMPTOM_IDS = new Set<string>([
  "desmaio",
  "convulsao",
  "fala_alterada",
  "fraqueza_facial",
  "confusao_mental",
  "tosse_sangue",
  "sangue_fezes",
  "urina_sangue",
  "manchas_roxas",
  "sangramento",
  "pensamentos_auto",
]);

interface CriticalCombo {
  id: string;
  symptoms: string[];
  pairedWith: string[];
  message: string;
}

const CRITICAL_COMBINATIONS: CriticalCombo[] = [
  {
    id: "cardiac_chest",
    symptoms: ["dor_peito", "aperto_peito"],
    pairedWith: [
      "falta_ar",
      "palpitacao",
      "suor_noturno",
      "cansaco",
      "inchaco_pernas",
    ],
    message:
      "Dor no peito combinada com outros sintomas pode indicar uma condição cardíaca grave.",
  },
  {
    id: "stroke",
    symptoms: ["dor_cabeca"],
    pairedWith: [
      "fala_alterada",
      "fraqueza_facial",
      "visao_alterada",
      "confusao_mental",
    ],
    message:
      "Dor de cabeça com alterações neurológicas pode indicar AVC ou outra condição grave.",
  },
  {
    id: "severe_infection",
    symptoms: ["febre"],
    pairedWith: ["manchas_roxas", "confusao_mental", "erupcao"],
    message:
      "Febre com manchas ou confusão pode indicar infecção grave.",
  },
];

const NO_FLAG: RedFlagResult = {
  detected: false,
  level: undefined,
  message: "",
  action: "",
  ruleId: undefined,
  emergencyNumber: "",
};

export function checkRedFlags(snapshot: TriageSnapshot): RedFlagResult {
  const ids = new Set<string>(snapshot.sintomasSelecionados);

  // 1) IDs críticos individuais → emergency
  for (const criticalId of CRITICAL_SYMPTOM_IDS) {
    if (ids.has(criticalId)) {
      return {
        detected: true,
        level: "emergency",
        message:
          "Um dos sintomas selecionados pode exigir atenção médica imediata.",
        action:
          "Não continue este formulário agora. Ligue para o SAMU ou vá ao pronto-socorro mais próximo.",
        ruleId: `critical_symptom:${criticalId}`,
        emergencyNumber: "192",
      };
    }
  }

  // 2) Combinações críticas → emergency
  for (const combo of CRITICAL_COMBINATIONS) {
    const hasPrimary = combo.symptoms.some((s) => ids.has(s));
    const hasPaired = combo.pairedWith.some((s) => ids.has(s));
    if (hasPrimary && hasPaired) {
      return {
        detected: true,
        level: "emergency",
        message: combo.message,
        action:
          "Ligue imediatamente para o SAMU (192) ou dirija-se a uma UPA ou pronto-socorro.",
        ruleId: `combo:${combo.id}`,
        emergencyNumber: "192",
      };
    }
  }

  // 3) Febre + dor intensa → high
  const intensidade = snapshot.intensidadeDor ?? 0;
  if (ids.has("febre") && intensidade >= 8) {
    return {
      detected: true,
      level: "high",
      message:
        "Febre combinada com dor de alta intensidade pode indicar uma infecção grave.",
      action: "Busque atendimento médico presencial com urgência.",
      ruleId: "febre_dor_intensa",
      emergencyNumber: "192",
    };
  }

  return NO_FLAG;
}
