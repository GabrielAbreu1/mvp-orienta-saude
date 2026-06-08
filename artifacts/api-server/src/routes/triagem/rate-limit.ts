import rateLimit from "express-rate-limit";

/**
 * 5 requisições por minuto por IP. Janela deslizante em memória.
 * Adequado para MVP de baixo tráfego — para escala, trocar por Redis store.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error:
      "Muitas requisições em pouco tempo. Aguarde um momento e tente novamente.",
    retryAfterSeconds: 60,
  },
});
