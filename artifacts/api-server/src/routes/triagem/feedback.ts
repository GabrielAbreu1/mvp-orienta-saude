import { Router, type Request, type Response } from "express";
import { count, avg, isNotNull, desc, sql, gte, and } from "drizzle-orm";
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

feedbackRouter.get(
  "/feedbacks/highlights",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const highlights = await db
        .select({
          comentario: feedbacksTable.comentario,
          estrelas: feedbacksTable.estrelas,
          util: feedbacksTable.util,
          createdAt: feedbacksTable.createdAt,
        })
        .from(feedbacksTable)
        .where(
          and(
            isNotNull(feedbacksTable.comentario),
            gte(feedbacksTable.estrelas, 4),
          ),
        )
        .orderBy(desc(feedbacksTable.estrelas), desc(feedbacksTable.createdAt))
        .limit(6);

      res.json(
        highlights.map((h) => ({
          comentario: h.comentario,
          estrelas: h.estrelas,
          util: h.util,
          data: h.createdAt,
        })),
      );
    } catch (err) {
      req.log.error({ err }, "highlights_query_failed");
      res.status(500).json({ error: "Não foi possível carregar os destaques." });
    }
  },
);

feedbackRouter.get(
  "/feedbacks/stats",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const [summary] = await db
        .select({
          total: count(),
          mediaEstrelas: avg(feedbacksTable.estrelas),
          totalUtil: count(
            sql`CASE WHEN ${feedbacksTable.util} = true THEN 1 END`,
          ),
        })
        .from(feedbacksTable);

      const starsDist = await db
        .select({ estrelas: feedbacksTable.estrelas, qty: count() })
        .from(feedbacksTable)
        .groupBy(feedbacksTable.estrelas)
        .orderBy(feedbacksTable.estrelas);

      const riskDist = await db
        .select({ riskLevel: feedbacksTable.riskLevel, qty: count() })
        .from(feedbacksTable)
        .where(isNotNull(feedbacksTable.riskLevel))
        .groupBy(feedbacksTable.riskLevel);

      const espDist = await db
        .select({ especialidade: feedbacksTable.especialidade, qty: count() })
        .from(feedbacksTable)
        .where(isNotNull(feedbacksTable.especialidade))
        .groupBy(feedbacksTable.especialidade)
        .orderBy(desc(count()))
        .limit(10);

      const sourceDist = await db
        .select({ source: feedbacksTable.source, qty: count() })
        .from(feedbacksTable)
        .where(isNotNull(feedbacksTable.source))
        .groupBy(feedbacksTable.source);

      const comentarios = await db
        .select({
          comentario: feedbacksTable.comentario,
          estrelas: feedbacksTable.estrelas,
          util: feedbacksTable.util,
          createdAt: feedbacksTable.createdAt,
        })
        .from(feedbacksTable)
        .where(isNotNull(feedbacksTable.comentario))
        .orderBy(desc(feedbacksTable.createdAt))
        .limit(50);

      const total = Number(summary.total ?? 0);
      const totalUtil = Number(summary.totalUtil ?? 0);

      res.json({
        total,
        mediaEstrelas: summary.mediaEstrelas
          ? Number(Number(summary.mediaEstrelas).toFixed(1))
          : 0,
        percentualUtil:
          total > 0 ? Math.round((totalUtil / total) * 100) : 0,
        distribuicaoEstrelas: starsDist.map((r) => ({
          estrelas: r.estrelas,
          qty: Number(r.qty),
        })),
        porRiskLevel: riskDist.map((r) => ({
          riskLevel: r.riskLevel,
          qty: Number(r.qty),
        })),
        porEspecialidade: espDist.map((r) => ({
          especialidade: r.especialidade,
          qty: Number(r.qty),
        })),
        porSource: sourceDist.map((r) => ({
          source: r.source,
          qty: Number(r.qty),
        })),
        comentarios: comentarios.map((c) => ({
          comentario: c.comentario,
          estrelas: c.estrelas,
          util: c.util,
          data: c.createdAt,
        })),
      });
    } catch (err) {
      req.log.error({ err }, "stats_query_failed");
      res
        .status(500)
        .json({ error: "Não foi possível carregar as estatísticas." });
    }
  },
);
