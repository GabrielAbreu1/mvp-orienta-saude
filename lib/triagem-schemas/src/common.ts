import { z } from "zod";
import {
  RISK_LEVEL_VALUES,
  CONFIDENCE_LEVEL_VALUES,
  type RiskLevel,
  type ConfidenceLevel,
} from "@workspace/triagem-domain";

/**
 * Schemas derivados das constantes do domínio.
 * Mudar o enum no domínio propaga automaticamente para validação.
 */
export const RiskLevelSchema = z.enum(RISK_LEVEL_VALUES);
export const ConfidenceLevelSchema = z.enum(CONFIDENCE_LEVEL_VALUES);

// Re-export do tipo para conveniência — mesmo tipo do domínio.
export type RiskLevelZ = RiskLevel;
export type ConfidenceLevelZ = ConfidenceLevel;

export const SourceSchema = z.enum(["rule_engine", "ai"]);
export type Source = z.infer<typeof SourceSchema>;
