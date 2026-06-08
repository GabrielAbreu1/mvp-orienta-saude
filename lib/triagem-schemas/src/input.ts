import { z } from "zod";
import { isValidSymptomId, isValidRegionId } from "@workspace/triagem-domain";

export const SexoSchema = z.enum([
  "masculino_cis",
  "masculino_trans",
  "feminino_cis",
  "feminino_trans",
  "outro",
  "nao_informado",
]);
export type Sexo = z.infer<typeof SexoSchema>;

export const ProgressaoSchema = z.enum(["piorando", "melhorando", "estavel"]);
export type Progressao = z.infer<typeof ProgressaoSchema>;

export const TipoDorSchema = z.enum(["continua", "intermitente"]);
export type TipoDor = z.infer<typeof TipoDorSchema>;

/**
 * Dados do paciente. MVP adult-only: idade mínima 18.
 */
export const PacienteSchema = z.object({
  idade: z.number().int().min(18).max(120),
  sexo: SexoSchema,
  condicoesCronicas: z.string().max(500).optional(),
});
export type Paciente = z.infer<typeof PacienteSchema>;

/**
 * Valida que o ID existe no catálogo de symptoms.ts.
 * Catálogo é a fonte única de verdade — IDs desconhecidos quebrariam o red flag check.
 */
const SymptomIdSchema = z
  .string()
  .min(1)
  .max(50)
  .refine(isValidSymptomId, { message: "ID de sintoma desconhecido" });

const RegionIdSchema = z
  .string()
  .min(1)
  .max(50)
  .refine(isValidRegionId, { message: "ID de região desconhecido" });

export const PerguntasRequestSchema = z.object({
  paciente: PacienteSchema,
  sintomasSelecionados: z.array(SymptomIdSchema).min(1).max(20),
  regioesSelecionadas: z.array(RegionIdSchema).min(0).max(10),
});
export type PerguntasRequest = z.infer<typeof PerguntasRequestSchema>;

export const RespostaSchema = z.object({
  perguntaId: z.string().min(1).max(50),
  valor: z.string().max(200),
});
export type Resposta = z.infer<typeof RespostaSchema>;

export const AnalisarRequestSchema = z.object({
  paciente: PacienteSchema,
  sintomasSelecionados: z.array(SymptomIdSchema).min(1).max(20),
  regioesSelecionadas: z.array(RegionIdSchema).min(0).max(10),
  duracao: z.string().min(1).max(60),
  intensidade: z.number().int().min(0).max(10),
  progressao: ProgressaoSchema,
  tipoDor: TipoDorSchema.nullable(),
  temFebre: z.boolean().nullable(),
  respostas: z.array(RespostaSchema).max(10),
});
export type AnalisarRequest = z.infer<typeof AnalisarRequestSchema>;
