# Orienta Saúde

> Assistente educativo, em português, que orienta adultos sobre **nível de urgência** e **especialidade médica a buscar** a partir de sintomas selecionados — projeto de extensão universitária alinhado à **ODS 3 (Saúde e Bem-Estar)**.

🎓 Projeto de portfólio | 🆓 Zero custo (Gemini free tier) | 🇧🇷 Adult-only (≥18) | ⚠️ Não substitui consulta médica

---

## Por que existe

Muita gente busca orientação em saúde online e cai em conteúdo alarmante ou genérico. O Orienta Saúde propõe um caminho **curto, transparente e seguro** — em ~3 minutos o usuário recebe:

- **Nível de urgência sugerido** (autocuidado → emergência), com justificativa em linguagem simples
- **Especialidade médica** mais apropriada para o conjunto de sintomas
- **Orientações práticas** sobre o que observar e quando reavaliar

A premissa é orientar com clareza, **sempre apontando o caminho do atendimento profissional**.

---

## Decisões de arquitetura

### 1. Regra determinística é soberana sobre a IA

O motor de **red flags** (`lib/triagem-domain/src/redFlags.ts`) é uma camada determinística pura, baseada em IDs de sintomas pré-definidos. Roda em **dois momentos**:

1. **Cliente** — em `onChange` da seleção de sintomas (UX imediata)
2. **Servidor** — antes de chamar a IA, nas rotas `/api/perguntas` e `/api/analisar`

A resposta da análise carrega um campo `source: "rule_engine" | "ai"` e o servidor aplica `max(risk_engine, risk_ia)` — **o nível mais alto sempre vence**. Isso garante que a IA nunca rebaixe um sinal de emergência detectado por regra.

### 2. Catálogos pré-definidos, não texto livre

Sintomas e regiões corporais são IDs estáveis (`SYMPTOMS`, `REGIONS`). Eliminamos falsos negativos por erro de digitação no red flag check — `dor_peito` é uma string, não uma frase ambígua.

### 3. Confiança é enum, nunca porcentagem

A IA tende a inventar números falsos de "% de certeza". Forçamos `confidence: "low" | "medium" | "high"` e qualquer entrada ambígua cai em `low` (mais seguro).

### 4. Dados clínicos são efêmeros, só feedback persiste

O store (Zustand) é totalmente em memória — recarregar a página apaga tudo. **Nenhum dado clínico vai para o banco.** Apenas o feedback final do usuário (estrelas, útil sim/não, comentário opcional + contexto agregado: riskLevel, especialidade, source) é gravado de forma anônima, para fins de melhoria.

Logs do servidor são sanitizados (registram `hasComentario: true/false`, nunca o texto).

### 5. Contrato OpenAPI primeiro

`lib/api-spec/openapi.yaml` define o contrato. Orval gera hooks React Query (`useGerarPerguntas`, `useAnalisarTriagem`, `useEnviarFeedback`) e schemas Zod, garantindo cliente e servidor sempre em sincronia.

---

## Fluxo do usuário (6 etapas)

```
Consentimento LGPD → Sobre você (idade ≥18, gênero, crônicas)
                  → Sintomas (catálogo + red flag em onChange)
                  → Regiões corporais
                  → Entrevista (3 perguntas estáticas + 3-7 dinâmicas geradas pela IA)
                  → Resultado (urgência, especialidade, hipóteses, orientações) + Feedback persistente
```

A qualquer momento em que um sinal crítico é detectado, um banner vermelho destaca a recomendação (incluindo o número de emergência **192 SAMU**).

---

## Stack

- **Frontend**: React 18 + Vite + Tailwind 4, Zustand (state machine), wouter (routing), React Query, Framer Motion
- **Backend**: Express 5, integração Gemini (Replit free tier), rate limit 5 req/min
- **DB**: PostgreSQL + Drizzle ORM (uma única tabela: `feedbacks`)
- **Contrato**: OpenAPI 3 + Orval (hooks tipados) + Zod
- **Monorepo**: pnpm workspaces + TypeScript 5.9 (composite libs)

### Estrutura

```
artifacts/
  triagem-web/        # React + Vite (landing + wizard 6 etapas)
  api-server/         # Express (rotas /api/perguntas, /api/analisar, /api/feedback)
lib/
  triagem-domain/     # Catálogos puros + rule engine (red flags, riskLevel, confidence)
  triagem-schemas/    # Schemas Zod (input + resposta IA + feedback)
  api-spec/           # OpenAPI YAML
  api-client-react/   # Hooks gerados (Orval)
  db/                 # Drizzle schema
```

---

## Como rodar

Requisitos: Node 24, pnpm, PostgreSQL (`DATABASE_URL` no env).

```bash
pnpm install
pnpm --filter @workspace/db run push            # cria a tabela feedbacks
pnpm --filter @workspace/api-server run dev     # API na porta 5000
pnpm --filter @workspace/triagem-web run dev    # web app
```

Na Replit, os workflows já estão configurados — basta abrir o preview.

### Comandos úteis

- `pnpm run typecheck` — typecheck completo do monorepo
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-spec run codegen` — regenera hooks/schemas a partir do OpenAPI

---

## Status

| Fase | Escopo                                                                  | Status |
|------|-------------------------------------------------------------------------|--------|
| 1    | Fundação (catálogos, rule engine, schemas, store, landing)              | ✅      |
| 2    | Backend (Gemini, rotas, rate limit, feedback persistente)               | ✅      |
| 3    | Frontend (tema v2, landing, wizard 6 etapas, resultado, feedback form)  | ✅      |

---

## Limites assumidos (MVP)

- **Adult-only** — usuários com menos de 18 anos são bloqueados no schema. Pediatria fica para uma futura V2.
- **Português brasileiro** — sem i18n.
- **Sem login, sem histórico** — o usuário não pode rever orientações passadas. É proposital: garante zero exposição de dados clínicos.
- **Demo via link de dev** — não publicado em produção. Projeto é para portfólio.

---

## Licença e isenção

Ferramenta **educativa**. Não realiza diagnóstico, não prescreve medicamentos, não substitui consulta médica. Em emergência, ligue **192 (SAMU)**.

---

_Projeto de extensão universitária. Alinhado à ODS 3 — Saúde e Bem-Estar de Qualidade._
