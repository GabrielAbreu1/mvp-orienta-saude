import { z } from "zod";
import {
  RiskLevelSchema,
  ConfidenceLevelSchema,
  SourceSchema,
} from "./common.js";

export const PerguntaTipoSchema = z.enum(["escala", "opcoes"]);
export type PerguntaTipo = z.infer<typeof PerguntaTipoSchema>;

export const PerguntaSchema = z.object({
  id: z.string().min(1).max(50),
  pergunta: z.string().min(5).max(300),
  tipo: PerguntaTipoSchema,
  opcoes: z.array(z.string().max(100)).max(12).optional(),
});
export type Pergunta = z.infer<typeof PerguntaSchema>;

export const PerguntasResponseSchema = z.object({
  perguntas: z.array(PerguntaSchema).min(3).max(7),
  fallback: z.boolean().default(false),
});
export type PerguntasResponse = z.infer<typeof PerguntasResponseSchema>;

export const HipoteseSchema = z.object({
  nome: z.string().min(1).max(120),
  relevancia: z.enum(["alta", "media", "baixa"]),
  descricao: z.string().min(1).max(400),
});
export type Hipotese = z.infer<typeof HipoteseSchema>;

export const EspecialidadeSchema = z.object({
  principal: z.string().min(1).max(80),
  secundaria: z.string().max(80).optional(),
  justificativa: z.string().min(1).max(300),
});
export type Especialidade = z.infer<typeof EspecialidadeSchema>;

export const AnaliseResponseSchema = z.object({
  /** Origem da decisão de urgência. Determinístico vence IA. */
  source: SourceSchema,
  riskLevel: RiskLevelSchema,
  confidence: ConfidenceLevelSchema,
  hipoteses: z.array(HipoteseSchema).max(5),
  especialidade: EspecialidadeSchema,
  orientacoesGerais: z.array(z.string().min(1).max(300)).min(1).max(5),
  dadosInsuficientes: z.boolean(),
  avisoLegal: z.string().min(1).max(300),
});
export type AnaliseResponse = z.infer<typeof AnaliseResponseSchema>;
