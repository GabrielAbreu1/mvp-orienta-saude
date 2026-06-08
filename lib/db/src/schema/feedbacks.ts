import {
  pgTable,
  serial,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const feedbacksTable = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  estrelas: integer("estrelas").notNull(),
  util: boolean("util").notNull(),
  comentario: text("comentario"),
  riskLevel: text("risk_level"),
  especialidade: text("especialidade"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedbacksTable, {
  estrelas: z.number().int().min(1).max(5),
  comentario: z.string().max(500).nullable().optional(),
  riskLevel: z
    .enum(["low", "medium", "high", "emergency"])
    .nullable()
    .optional(),
  especialidade: z.string().max(80).nullable().optional(),
  source: z.enum(["rule_engine", "ai"]).nullable().optional(),
}).omit({ id: true, createdAt: true });

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacksTable.$inferSelect;
