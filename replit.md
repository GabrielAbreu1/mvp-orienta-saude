# Orienta Saúde — Assistente Inteligente de Orientação em Saúde

Ferramenta educativa em português que orienta adultos sobre nível de urgência e especialidade a buscar a partir de sintomas selecionados — projeto de extensão universitária alinhado à ODS 3.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/triagem-web/` — frontend React+Vite (rota `/`)
- `artifacts/api-server/` — Express, futuras rotas `/api/perguntas` e `/api/analisar`
- `lib/triagem-domain/` — catálogos puros (`symptoms.ts`, `regions.ts`) + `riskLevel.ts`, `confidence.ts`, `redFlags.ts` (rule engine determinístico)
- `lib/triagem-schemas/` — schemas Zod (input do usuário + resposta normalizada da IA + feedback)
- `lib/api-spec/openapi.yaml` — contrato OpenAPI (a expandir na Fase 2)
- `artifacts/triagem-web/src/store/triageStore.ts` — Zustand store com state machine + registry de AbortControllers
- `artifacts/triagem-web/src/index.css` — tema (Fraunces + DM Sans, paleta sálvia + off-white)

## Architecture decisions

- **Rule engine determinístico é soberano sobre a IA.** `checkRedFlags()` roda no cliente (onChange de sintomas) e no servidor (antes de chamar Claude). Resposta carrega `source: 'rule_engine' | 'ai'` e `maxRisk(rule, ai)` sempre vence o mais alto.
- **Catálogos pré-definidos** (IDs estáveis) em vez de texto livre — elimina falsos negativos por erro de digitação no red flag check.
- **Confiança é enum** (`low | medium | high`), nunca número/porcentagem. `normalizeConfidence()` aceita qualquer entrada e cai em `low` (seguro) se ambígua.
- **Dados clínicos são efêmeros, só feedback persiste.** Store é em memória (perdida ao recarregar) e nada clínico vai ao DB. Apenas a tabela `feedbacks` (estrelas, útil sim/não, comentário opcional, contexto agregado: riskLevel/especialidade/source) é gravada — anônima, para melhoria. Logs server-side sanitizados (nunca o comentário em texto, nunca sintomas).
- **Adult-only** (≥18) no MVP — banner na landing + bloqueio no schema `PacienteSchema`.

## Product

Fluxo de 6 etapas: consentimento LGPD → dados do paciente (≥18) → seleção de sintomas (catálogo + red flag em onChange) → seleção de regiões corporais → entrevista dinâmica (3-7 perguntas geradas pela IA) → resultado (nível de urgência, especialidade sugerida, orientações).

**Status atual:**
- Fase 1 ✅ — fundação: catálogos, rule engine, schemas, store, landing inicial
- Fase 2 ✅ — backend: integração Gemini (free tier), rotas `/api/perguntas` (com cache 5min + red flag soberano + fallback determinístico), `/api/analisar` (reconciliação rule_engine vs IA), `/api/feedback` persistente (tabela `feedbacks` via Drizzle), rate limit 5/min, trust proxy, logs sanitizados
- Fase 3 ✅ — frontend completo: tema v2 (Inter+Open Sans, Azul Clássico + Verde Menta), landing portada do mockup ClinicoTranquilo, wizard de 6 etapas (Consentimento → Paciente → Sintomas com red flag onChange → Regiões → Entrevista estática+dinâmica IA → Resultado), formulário de feedback (estrelas + útil + comentário) que persiste no DB, README de portfólio

## User preferences

- Idioma da interface e comunicação: **português brasileiro**.
- **Guia de estilo (v2 — confirmado pelo usuário em 18/05/2026):**
  - **Cores:** Azul Clássico (primária — confiança), Verde Menta (acento — saúde/calma) e Cinza Claro (neutro). Vermelho/coral é reservado ao `RedFlagAlert` — nunca aplicar em UI geral.
  - **Tipografia:** **Inter** (títulos) + **Open Sans** (corpo) — modernidade, precisão, clareza.
  - **Formas:** cantos arredondados, linhas fluidas e contínuas — acolhimento e segurança.
  - **Estilo:** minimalista, limpo, muito espaço em branco — organização e seriedade.
- IA: usar a integração **Gemini** do Replit (free tier, sem chave própria, sem custo).
- Demo via link de dev da Replit — **não publicar/deployar**. Projeto é para portfólio no GitHub.
- Sem Sentry e sem Upstash no MVP — adiados.

### Histórico
- v1 (Fase 1, descontinuada): Fraunces + DM Sans, paleta sálvia + off-white quente. Substituída pela v2 acima.

## Gotchas

- Não usar `console.log` em código de servidor — usar `req.log` em handlers e o `logger` singleton em outros lugares.
- Após mudar `lib/api-spec/openapi.yaml`, rodar `pnpm --filter @workspace/api-spec run codegen` antes de typecheck.
- Schemas de body no OpenAPI devem ter nomes de entidade (`PerguntasInput`, não `CreatePerguntasBody`) para evitar colisão TS2308.
- Red flag check **sempre** roda no servidor antes da IA, mesmo quando já rodou no cliente (cliente é hint de UX, servidor é a autoridade).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
