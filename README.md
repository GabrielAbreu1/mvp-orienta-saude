# Orienta Saúde

> Assistente educativo digital que orienta adultos sobre **nível de urgência** e **especialidade médica a buscar** a partir de sintomas selecionados — projeto de extensão universitária alinhado à **ODS 3 (Saúde e Bem-Estar)**.

🎓 Projeto de extensão universitária | 🤖 IA integrada (Groq / Llama 3.3) | 🇧🇷 Apenas adultos (≥18) | ⚠️ Não substitui consulta médica

🔗 **Deploy:** https://mvp-orienta-saude-production.up.railway.app

---

## Por que existe

Muita gente busca orientação em saúde online e cai em conteúdo alarmante ou genérico. O Orienta Saúde propõe um caminho **curto, transparente e seguro** — em aproximadamente 3 minutos o usuário recebe:

- **Nível de urgência** (autocuidado → emergência) com justificativa em linguagem simples
- **Especialidade médica** mais apropriada para o conjunto de sintomas
- **Hipóteses clínicas** — condições possivelmente relacionadas, descritas de forma acessível
- **Orientações práticas** sobre o que observar e quando reavaliar

A premissa é orientar com clareza, **sempre apontando o caminho do atendimento profissional**.

---

## O papel da IA no projeto

A inteligência artificial é a peça central de personalização do sistema, atuando em dois momentos:

### 1. Geração de perguntas dinâmicas (`/api/perguntas`)

Após o usuário selecionar sintomas e regiões corporais, a IA gera de **3 a 5 perguntas clínicas personalizadas** de aprofundamento — variando de acordo com o quadro específico de cada pessoa. Para sintomas respiratórios, pergunta sobre alérgenos; para sintomas digestivos, sobre padrão alimentar; e assim por diante.

### 2. Análise clínica e orientações (`/api/analisar`)

Com todos os dados coletados, a IA retorna:

- `riskLevel` — nível de risco sugerido (`low | medium | high | emergency`)
- `confidence` — grau de confiança (`low | medium | high`) — nunca porcentagens
- `hipoteses` — condições possivelmente relacionadas, com relevância e descrição acessível
- `especialidade` — especialidade principal, secundária e justificativa
- `orientacoesGerais` — ações práticas sem recomendação de medicamentos
- `avisoLegal` — reforço do caráter educativo

### O que a IA não decide

A IA **não tem a palavra final em emergências**. O motor de red flags (`lib/triagem-domain/src/redFlags.ts`) é uma camada determinística soberana que opera independentemente da IA. A reconciliação segue a regra:

```
nível final = max(motor_de_regras, ia)
```

O campo `source` na resposta indica qual camada determinou o resultado: `"rule_engine"` ou `"ai"`.

---

## Decisões de arquitetura

### Motor de regras é soberano

O motor de **red flags** roda em **dois momentos**:
1. **Cliente** — em `onChange` da seleção de sintomas (UX imediata)
2. **Servidor** — antes de chamar a IA, nas rotas `/api/perguntas` e `/api/analisar`

Sintomas individualmente críticos (desmaio, convulsão, fala alterada, sangramento, pensamentos de autolesão) e combinações perigosas (dor no peito + falta de ar, dor de cabeça + alterações neurológicas) sempre acionam emergência — independente do que a IA responda.

### Catálogos pré-definidos, não texto livre

Sintomas e regiões corporais são IDs estáveis (`SYMPTOMS`, `REGIONS`). Isso elimina falsos negativos por ambiguidade — `"dor_peito"` é uma string exata, não uma frase que precisa de interpretação.

### Confiança é enum, nunca porcentagem

A IA tende a inventar números de certeza. Forçamos `confidence: "low" | "medium" | "high"` — qualquer entrada ambígua cai em `"low"` (mais seguro).

### Fallback determinístico

Se a IA falhar, o sistema não retorna erro ao usuário. Um fallback determinístico assume o controle e entrega orientações baseadas apenas no nível de risco calculado pelas regras — sem hipóteses e com confiança marcada como baixa.

### Dados clínicos são efêmeros

O store (Zustand) é totalmente em memória — recarregar a página apaga tudo. **Nenhum dado clínico vai para o banco.** Apenas o feedback final (estrelas, útil sim/não, comentário opcional + metadados agregados anônimos) é persistido.

### Contrato OpenAPI primeiro

`lib/api-spec/openapi.yaml` define o contrato. Orval gera hooks React Query (`useGerarPerguntas`, `useAnalisarTriagem`, `useEnviarFeedback`) e schemas Zod — cliente e servidor sempre em sincronia.

---

## Fluxo do usuário (6 etapas)

```
1. Consentimento LGPD
2. Dados do paciente (idade ≥18, gênero, condições crônicas)
3. Seleção de sintomas (catálogo + red flag em tempo real)
4. Regiões corporais
5. Entrevista clínica (3 perguntas fixas + 3-5 geradas pela IA)
6. Resultado (urgência, especialidade, hipóteses, orientações) + Feedback
```

Em qualquer etapa com sinal crítico detectado, um banner vermelho exibe a recomendação e o número **192 (SAMU)**.

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 18, Vite, Tailwind 4, Zustand, Wouter, React Query, Framer Motion |
| Backend | Node.js, Express 5, Pino, express-rate-limit |
| IA | Groq API — modelo `llama-3.3-70b-versatile` |
| Banco de dados | PostgreSQL + Drizzle ORM |
| Validação | Zod (schemas compartilhados) |
| Contrato de API | OpenAPI 3.0 + Orval |
| Deploy | Railway (Nixpacks) |
| Monorepo | pnpm workspaces + TypeScript 5.9 |

### Estrutura

```
artifacts/
  triagem-web/        # React + Vite (landing + wizard 6 etapas)
  api-server/         # Express (rotas /api/perguntas, /api/analisar, /api/feedback)
lib/
  triagem-domain/     # Catálogos + motor de red flags
  triagem-schemas/    # Schemas Zod
  api-spec/           # OpenAPI YAML
  api-client-react/   # Hooks gerados (Orval)
  db/                 # Drizzle schema
  integrations-gemini-ai/  # Adaptador de IA (atualmente Groq)
```

---

## Como rodar localmente

Requisitos: Node 20+, pnpm, PostgreSQL (`DATABASE_URL` no env) e `GROQ_API_KEY` ([console.groq.com](https://console.groq.com)).

```bash
pnpm install
pnpm --filter @workspace/db run push            # cria a tabela feedbacks
pnpm --filter @workspace/api-server run dev     # API na porta 5000
pnpm --filter @workspace/triagem-web run dev    # frontend
```

### Variáveis de ambiente necessárias

```
GROQ_API_KEY=gsk_...          # chave do Groq (gratuito)
DATABASE_URL=postgresql://... # conexão PostgreSQL
NODE_ENV=development
SESSION_SECRET=...
```

### Comandos úteis

```bash
pnpm run typecheck                                        # typecheck completo do monorepo
pnpm run build                                            # build completo
pnpm --filter @workspace/api-spec run codegen            # regenera hooks/schemas a partir do OpenAPI
```

---

## Status

| Fase | Escopo | Status |
|------|--------|--------|
| 1 | Fundação (catálogos, rule engine, schemas, store, landing) | ✅ |
| 2 | Backend (integração IA, rotas, rate limit, feedback) | ✅ |
| 3 | Frontend (wizard 6 etapas, resultado, feedback form, deploy) | ✅ |

---

## Limitações do MVP

- **Adult-only** — usuários com menos de 18 anos são bloqueados. Pediatria fica para V2.
- **Português brasileiro** — sem internacionalização.
- **Sem login, sem histórico** — proposital para garantir zero exposição de dados clínicos.
- **Sem autenticação** — o sistema é anônimo por design.

---

## Licença e isenção

Ferramenta **educativa**. Não realiza diagnóstico, não prescreve medicamentos, não substitui consulta médica. Em emergência, ligue **192 (SAMU)**.

---

*Projeto de extensão universitária. Alinhado à ODS 3 — Saúde e Bem-Estar de Qualidade.*
