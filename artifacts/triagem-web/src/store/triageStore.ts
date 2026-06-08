import { create } from "zustand";
import type {
  RedFlagResult,
  RiskLevel,
} from "@workspace/triagem-domain";
import type {
  AnaliseResponse,
  Pergunta,
  Progressao,
  Resposta,
  Sexo,
  TipoDor,
} from "@workspace/triagem-schemas";

/**
 * State machine do fluxo principal — transições explícitas.
 *
 *  idle ──▶ collecting ──▶ analyzing ──▶ success
 *                              │   ▲       │
 *                              │   │ retry │
 *                              ▼   │       ▼
 *                          retrying ──▶ fallback
 *                              │
 *                              ▼
 *                         unavailable
 *                              │
 *                              ▼
 *                            error
 *
 * Transições inválidas são silenciosamente ignoradas (log em dev).
 */
export type FlowStatus =
  | "idle"
  | "collecting"
  | "analyzing"
  | "retrying"
  | "success"
  | "fallback"
  | "unavailable"
  | "error";

const ALLOWED_TRANSITIONS: Record<FlowStatus, readonly FlowStatus[]> = {
  idle: ["collecting"],
  collecting: ["analyzing", "idle"],
  analyzing: ["success", "retrying", "fallback", "error", "unavailable"],
  retrying: ["success", "fallback", "error", "unavailable"],
  success: ["idle"],
  fallback: ["idle", "analyzing"],
  unavailable: ["idle"],
  error: ["idle", "collecting"],
};

/** Número total de etapas do fluxo de coleta (0..MAX_ETAPA). */
export const MAX_ETAPA = 5;

export interface PacienteDraft {
  idade: number | null;
  sexo: Sexo | null;
  condicoesCronicas: string;
}

export interface EntrevistaDraft {
  /** 0 = consentimento LGPD, 1 = paciente, 2 = sintomas, 3 = regiões, 4 = entrevista, 5 = resultado */
  etapaAtual: number;

  consentimentoLGPD: boolean;
  consentimentoDados: boolean;

  paciente: PacienteDraft;
  sintomasSelecionados: string[];
  regioesSelecionadas: string[];

  duracao: string;
  /** null = ainda não selecionado. Quando submetemos, mapeamos null → 0 (sem dor). */
  intensidade: number | null;
  progressao: Progressao | null;
  tipoDor: TipoDor | null;
  /** true quando o usuário clicou em qualquer botão de tipoDor (incl. "Não sinto dor", que mantém tipoDor=null). */
  tipoDorTocado: boolean;
  temFebre: boolean | null;

  perguntas: Pergunta[];
  respostas: Resposta[];
}

const draftInicial: EntrevistaDraft = {
  etapaAtual: 0,
  consentimentoLGPD: false,
  consentimentoDados: false,
  paciente: { idade: null, sexo: null, condicoesCronicas: "" },
  sintomasSelecionados: [],
  regioesSelecionadas: [],
  duracao: "",
  intensidade: null,
  progressao: null,
  tipoDor: null,
  tipoDorTocado: false,
  temFebre: null,
  perguntas: [],
  respostas: [],
};

interface TriageStore {
  status: FlowStatus;
  isSubmitting: boolean;
  draft: EntrevistaDraft;
  redFlag: RedFlagResult | null;
  resultado: AnaliseResponse | null;
  /** Override determinístico — quando rule_engine dispara red flag, fixa o nível mínimo. */
  ruleRiskFloor: RiskLevel | null;

  // Actions
  /** Tenta transicionar. Retorna true se aceito. */
  setStatus: (next: FlowStatus) => boolean;
  /** Força status sem validar transição (uso restrito: reset/recovery). */
  forceStatus: (next: FlowStatus) => void;
  setIsSubmitting: (value: boolean) => void;
  setDraft: (partial: Partial<EntrevistaDraft>) => void;
  setPaciente: (partial: Partial<PacienteDraft>) => void;
  setRedFlag: (flag: RedFlagResult | null) => void;
  setResultado: (resultado: AnaliseResponse | null) => void;
  avancarEtapa: () => void;
  voltarEtapa: () => void;

  /** Registra controller no inflight set. Retorna fn de unregister. */
  registerAbort: (controller: AbortController) => () => void;
  resetar: () => void;
}

export const useTriageStore = create<TriageStore>((set, get) => {
  const inflight = new Set<AbortController>();

  return {
    status: "idle",
    isSubmitting: false,
    draft: draftInicial,
    redFlag: null,
    resultado: null,
    ruleRiskFloor: null,

    setStatus: (next) => {
      const current = get().status;
      if (current === next) return true;
      const allowed = ALLOWED_TRANSITIONS[current];
      if (!allowed.includes(next)) {
        if (import.meta.env.DEV) {
          console.warn(
            `[triageStore] transição inválida ignorada: ${current} → ${next}`,
          );
        }
        return false;
      }
      set({ status: next });
      return true;
    },
    forceStatus: (next) => set({ status: next }),
    setIsSubmitting: (value) => set({ isSubmitting: value }),
    setDraft: (partial) =>
      set((state) => ({ draft: { ...state.draft, ...partial } })),
    setPaciente: (partial) =>
      set((state) => ({
        draft: {
          ...state.draft,
          paciente: { ...state.draft.paciente, ...partial },
        },
      })),
    setRedFlag: (flag) =>
      set({
        redFlag: flag,
        ruleRiskFloor: flag?.level ?? null,
      }),
    setResultado: (resultado) => set({ resultado }),
    avancarEtapa: () =>
      set((state) => ({
        draft: {
          ...state.draft,
          etapaAtual: Math.min(MAX_ETAPA, state.draft.etapaAtual + 1),
        },
      })),
    voltarEtapa: () =>
      set((state) => ({
        draft: {
          ...state.draft,
          etapaAtual: Math.max(0, state.draft.etapaAtual - 1),
        },
      })),

    registerAbort: (controller) => {
      inflight.add(controller);
      const cleanup = () => inflight.delete(controller);
      controller.signal.addEventListener("abort", cleanup, { once: true });
      // Retorna unregister para uso no finally do caller (sucesso/erro normal).
      return cleanup;
    },

    resetar: () => {
      for (const controller of inflight) {
        controller.abort();
      }
      inflight.clear();
      set({
        status: "idle",
        isSubmitting: false,
        draft: draftInicial,
        redFlag: null,
        resultado: null,
        ruleRiskFloor: null,
      });
    },
  };
});
