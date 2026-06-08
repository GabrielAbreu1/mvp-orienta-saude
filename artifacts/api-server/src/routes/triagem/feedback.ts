import { Router, type Request, type Response } from "express";
import { FeedbackSchema } from "@workspace/triagem-schemas";
import { db, feedbacksTable } from "@workspace/db";
import { logTechnical } from "./gemini-helper.js";

export const feedbackRouter: Router = Router();

feedbackRouter.post(
  "/feedback",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = FeedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Entrada inválida" });
      return;
    }

    const data = parsed.data;

    try {
      await db.insert(feedbacksTable).values({
        estrelas: data.estrelas,
        util: data.util,
        comentario: data.comentario ?? null,
        riskLevel: data.riskLevel ?? null,
        especialidade: data.especialidade ?? null,
        source: data.source ?? null,
      });
    } catch (err) {
      req.log.error(
        { err, route: "/api/feedback" },
        "feedback_insert_failed",
      );
      res.status(500).json({ error: "Não foi possível salvar o feedback." });
      return;
    }

    // Log sanitizado — registra estrelas/util/contexto, NUNCA o comentário em texto.
    req.log.info(
      {
        event: "feedback_submitted",
        route: "/api/feedback",
        estrelas: data.estrelas,
        util: data.util,
        hasComentario: Boolean(data.comentario),
        riskLevel: data.riskLevel,
        source: data.source,
      },
      "feedback_submitted",
    );
    logTechnical({
      level: "info",
      event: "feedback_submitted",
      route: "/api/feedback",
    });

    res.status(204).end();
  },
);
