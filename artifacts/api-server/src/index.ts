import app from "./app";
import { logger } from "./lib/logger";
import { db, feedbacksTable } from "@workspace/db";
import { lt, isNotNull } from "drizzle-orm";

async function limparComentariosAntigos() {
  const noventa_dias_atras = new Date();
  noventa_dias_atras.setDate(noventa_dias_atras.getDate() - 90);
  try {
    const result = await db
      .update(feedbacksTable)
      .set({ comentario: null })
      .where(
        lt(feedbacksTable.createdAt, noventa_dias_atras),
      );
    logger.info({ event: "lgpd_cleanup", removidos: (result as any).rowCount ?? 0 }, "Comentários com mais de 90 dias removidos");
  } catch (err) {
    logger.error({ err }, "lgpd_cleanup_failed");
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // LGPD: limpa comentários com mais de 90 dias na inicialização e depois a cada 24h
  limparComentariosAntigos();
  setInterval(limparComentariosAntigos, 24 * 60 * 60 * 1000);
});
