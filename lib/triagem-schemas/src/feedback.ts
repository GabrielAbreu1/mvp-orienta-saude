import { z } from "zod";

export const FeedbackSchema = z.object({
  estrelas: z.number().int().min(1).max(5),
  util: z.boolean(),
  comentario: z.string().max(500).optional(),
  riskLevel: z.enum(["low", "medium", "high", "emergency"]).optional(),
  especialidade: z.string().max(80).optional(),
  source: z.enum(["rule_engine", "ai"]).optional(),
});
export type Feedback = z.infer<typeof FeedbackSchema>;
