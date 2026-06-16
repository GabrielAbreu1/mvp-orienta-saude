import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ShieldCheck,
  Lock,
  Check,
  ChevronRight,
  ChevronDown,
  Search,
  Loader2,
  AlertTriangle,
  Stethoscope,
  Activity,
  Gauge,
  Sparkles,
  RotateCcw,
  Info,
  HeartPulse,
} from "lucide-react";
import {
  SYMPTOMS,
  REGIONS,
  checkRedFlags,
  type RegionGroup,
  type RedFlagResult,
} from "@workspace/triagem-domain";
import type {
  Sexo,
  Progressao,
  TipoDor,
  Resposta,
  AnaliseResponse,
} from "@workspace/triagem-schemas";
import {
  useGerarPerguntas,
  useAnalisarTriagem,
} from "@workspace/api-client-react";
import { useTriageStore } from "../../store/triageStore";
import { RedFlagAlert } from "./RedFlagAlert";
import { FeedbackForm } from "./FeedbackForm";

// =====================================================================
//  Componentes utilitários
// =====================================================================

function StepShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
      <h2 className="font-['Inter'] text-2xl md:text-3xl font-bold text-[#1A202C] tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#4A5568] text-base leading-relaxed mb-8 max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="space-y-6">{children}</div>
      {footer && <div className="mt-10">{footer}</div>}
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  testId,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1B4D3E] text-white rounded-2xl font-['Inter'] font-semibold text-base hover:bg-[#163D31] disabled:bg-[#cbd5e1] disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm"
    >
      {children}
    </button>
  );
}

// =====================================================================
//  ETAPA 0 — Consentimento LGPD
// =====================================================================

export function Step0Consentimento() {
  const { draft, setDraft, avancarEtapa } = useTriageStore();

  const podeAvancar = draft.consentimentoLGPD && draft.consentimentoDados;

  return (
    <StepShell
      title="Antes de começar"
      subtitle="Leia e confirme os termos abaixo. O Orienta Saúde é educativo, gratuito, e não armazena suas respostas clínicas."
    >
      <div className="bg-[#F7FAF8] border border-[#D1E8DA] rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-[#2D7A5F]" />
          </div>
          <div>
            <h3 className="font-['Inter'] font-bold text-lg text-[#1A202C] mb-1">
              Privacidade e LGPD
            </h3>
            <p className="text-[#4A5568] text-sm leading-relaxed">
              Suas respostas clínicas (sintomas, regiões, perguntas) <strong>não são
              armazenadas</strong>. Apenas seu feedback final (avaliação em estrelas e
              comentário opcional) pode ser salvo de forma anônima, para fins de melhoria
              do projeto. Comentários são automaticamente excluídos após <strong>90 dias</strong>.
              Não inclua dados pessoais (nome, CPF, e-mail) no campo de comentário.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 bg-white border border-[#D1E8DA] rounded-2xl cursor-pointer hover:border-[#2D7A5F]/50 transition-colors">
          <input
            type="checkbox"
            checked={draft.consentimentoLGPD}
            onChange={(e) => setDraft({ consentimentoLGPD: e.target.checked })}
            data-testid="checkbox-consentimento-lgpd"
            className="mt-1 w-5 h-5 accent-[#2D7A5F] cursor-pointer flex-shrink-0"
          />
          <span className="text-sm text-[#2D3748] leading-relaxed">
            Li e concordo com o uso <strong>educativo</strong> da ferramenta, alinhado à
            LGPD. Entendo que o resultado <strong>não é diagnóstico médico</strong>.
          </span>
        </label>

        <label className="mt-3 flex items-start gap-3 p-4 bg-white border border-[#D1E8DA] rounded-2xl cursor-pointer hover:border-[#2D7A5F]/50 transition-colors">
          <input
            type="checkbox"
            checked={draft.consentimentoDados}
            onChange={(e) => setDraft({ consentimentoDados: e.target.checked })}
            data-testid="checkbox-consentimento-dados"
            className="mt-1 w-5 h-5 accent-[#2D7A5F] cursor-pointer flex-shrink-0"
          />
          <span className="text-sm text-[#2D3748] leading-relaxed">
            Confirmo que tenho <strong>18 anos ou mais</strong> e que o uso é por minha
            conta, sem substituir consulta médica profissional.
          </span>
        </label>
      </div>

      <div className="bg-[#EBF5EE] border border-[#4CAF82]/30 rounded-2xl p-4 flex gap-3 items-start">
        <ShieldCheck className="w-5 h-5 text-[#2D7A5F] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#1A202C] leading-relaxed">
          Em caso de emergência, ligue <strong>192 (SAMU)</strong> imediatamente.
        </p>
      </div>

      <div className="flex justify-end">
        <PrimaryButton
          disabled={!podeAvancar}
          onClick={avancarEtapa}
          testId="button-avancar-consentimento"
        >
          Continuar <ChevronRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </StepShell>
  );
}

// =====================================================================
//  ETAPA 1 — Sobre você
// =====================================================================

export function Step1Paciente() {
  const { draft, setPaciente, avancarEtapa } = useTriageStore();
  const { idade, sexo, condicoesCronicas } = draft.paciente;
  const [generoInfoAberto, setGeneroInfoAberto] = useState(false);

  const podeAvancar = idade !== null && idade >= 18 && idade <= 120 && sexo !== null;

  const sexoOptions: { value: Sexo; label: string }[] = [
    { value: "masculino_cis", label: "Masculino cisgênero" },
    { value: "masculino_trans", label: "Masculino transgênero" },
    { value: "feminino_cis", label: "Feminino cisgênero" },
    { value: "feminino_trans", label: "Feminino transgênero" },
    { value: "outro", label: "Outro / Não-binário" },
    { value: "nao_informado", label: "Prefiro não informar" },
  ];

  return (
    <StepShell
      title="Sobre você"
      subtitle="Apenas o essencial para contextualizar a orientação. Nada disso é armazenado."
    >
      <div className="bg-white border border-[#D1E8DA] rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <label
            htmlFor="idade"
            className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']"
          >
            Idade
          </label>
          <input
            id="idade"
            type="number"
            inputMode="numeric"
            min={18}
            max={120}
            value={idade ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setPaciente({ idade: v === "" ? null : Number(v) });
            }}
            data-testid="input-idade"
            placeholder="Ex.: 32"
            className="w-full px-4 py-3 rounded-2xl border-2 border-[#D1E8DA] focus:border-[#2D7A5F] focus:outline-none text-base text-[#2D3748] font-['Open_Sans']"
          />
          {idade !== null && (idade < 18 || idade > 120) && (
            <p
              data-testid="text-idade-erro"
              className="text-xs text-[#9c4221] mt-1.5 font-semibold"
            >
              Esta versão atende apenas pessoas com 18 anos ou mais.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']">
            Gênero
          </label>
          <button
            type="button"
            onClick={() => setGeneroInfoAberto((v) => !v)}
            className="mb-3 flex items-center gap-1.5 text-xs text-[#2D7A5F] font-semibold hover:underline"
          >
            <Info className="w-3.5 h-3.5" />
            O que significa cisgênero / transgênero?
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${generoInfoAberto ? "rotate-180" : ""}`}
            />
          </button>
          {generoInfoAberto && (
            <div className="mb-3 text-xs text-[#4A5568] leading-relaxed bg-[#EBF5EE] border border-[#4CAF82]/30 rounded-xl px-4 py-3">
              <p><strong>Cisgênero</strong> — sua identidade de gênero é a mesma do sexo que recebeu ao nascer.</p>
              <p className="mt-1"><strong>Transgênero</strong> — sua identidade de gênero é diferente do sexo que recebeu ao nascer.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sexoOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                data-testid={`button-sexo-${opt.value}`}
                onClick={() => setPaciente({ sexo: opt.value })}
                className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all text-left ${
                  sexo === opt.value
                    ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F]"
                    : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="cronicas"
            className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']"
          >
            Condições crônicas conhecidas{" "}
            <span className="text-[#718096] font-normal">(opcional)</span>
          </label>
          <textarea
            id="cronicas"
            value={condicoesCronicas}
            onChange={(e) =>
              setPaciente({ condicoesCronicas: e.target.value.slice(0, 500) })
            }
            rows={2}
            placeholder="Ex.: hipertensão, diabetes tipo 2…"
            data-testid="input-condicoes-cronicas"
            className="w-full px-4 py-3 rounded-2xl border-2 border-[#D1E8DA] focus:border-[#2D7A5F] focus:outline-none text-sm text-[#2D3748] resize-none font-['Open_Sans']"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton
          disabled={!podeAvancar}
          onClick={avancarEtapa}
          testId="button-avancar-paciente"
        >
          Continuar <ChevronRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </StepShell>
  );
}

// =====================================================================
//  ETAPA 2 — Sintomas (com red flag check em onChange)
// =====================================================================

/** Sintetiza uma resposta de emergência usando exclusivamente o rule engine. */
function emergencyResultFromRedFlag(flag: RedFlagResult): AnaliseResponse {
  return {
    source: "rule_engine",
    riskLevel: flag.level ?? "emergency",
    confidence: "low",
    hipoteses: [],
    especialidade: {
      principal: "Pronto-socorro",
      justificativa:
        flag.message ||
        "Sinais identificados pelo sistema indicam necessidade de avaliação presencial imediata.",
    },
    orientacoesGerais: [
      flag.action || "Procure atendimento médico de urgência agora.",
      flag.emergencyNumber
        ? `Ligue ${flag.emergencyNumber} (SAMU) ou vá ao pronto-socorro mais próximo.`
        : "Em caso de piora, ligue 192 (SAMU) ou vá ao pronto-socorro mais próximo.",
      "Não dirija sozinho. Peça ajuda a alguém ou chame transporte de emergência.",
    ],
    dadosInsuficientes: true,
    avisoLegal:
      "Esta orientação foi gerada automaticamente a partir de sinais de alerta detectados nos sintomas informados. Não substitui consulta médica presencial.",
  };
}

export function Step2Sintomas() {
  const {
    draft,
    setDraft,
    avancarEtapa,
    redFlag,
    setRedFlag,
    resultado,
    setResultado,
    forceStatus,
  } = useTriageStore();
  const [filtro, setFiltro] = useState("");

  // Red flag em onChange — autoridade no cliente como hint de UX.
  // Quando detectado, pula direto para a tela de resultado com resposta
  // sintetizada pelo rule engine (sem chamar a IA).
  useEffect(() => {
    const result = checkRedFlags({
      sintomasSelecionados: draft.sintomasSelecionados,
    });
    setRedFlag(result.detected ? result : null);

    if (result.detected && result.level && resultado === null) {
      setResultado(emergencyResultFromRedFlag(result));
      forceStatus("success");
      setDraft({ etapaAtual: 5 });
    }
  }, [
    draft.sintomasSelecionados,
    setRedFlag,
    resultado,
    setResultado,
    forceStatus,
    setDraft,
  ]);

  const categorias = useMemo(() => {
    const filtered = filtro.trim()
      ? SYMPTOMS.filter((s) =>
          s.label.toLowerCase().includes(filtro.trim().toLowerCase()),
        )
      : SYMPTOMS;
    const groups = new Map<string, typeof SYMPTOMS>();
    for (const s of filtered) {
      const existing = groups.get(s.category);
      if (existing) existing.push(s);
      else groups.set(s.category, [s]);
    }
    return Array.from(groups.entries());
  }, [filtro]);

  function toggle(id: string) {
    const sel = new Set(draft.sintomasSelecionados);
    if (sel.has(id)) sel.delete(id);
    else if (sel.size < 20) sel.add(id);
    setDraft({ sintomasSelecionados: Array.from(sel) });
  }

  const podeAvancar = draft.sintomasSelecionados.length >= 1;

  return (
    <StepShell
      title="Seleção de sintomas"
      subtitle="Escolha o que você está sentindo. Selecione no mínimo 1 sintoma."
    >
      {redFlag && <RedFlagAlert redFlag={redFlag} />}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
        <input
          type="search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          data-testid="input-filtro-sintomas"
          placeholder="Buscar sintoma…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-[#D1E8DA] focus:border-[#2D7A5F] focus:outline-none text-sm font-['Open_Sans']"
        />
      </div>

      <div className="text-sm text-[#4A5568] font-semibold">
        {draft.sintomasSelecionados.length} selecionado
        {draft.sintomasSelecionados.length === 1 ? "" : "s"}
      </div>

      <div className="space-y-6">
        {categorias.map(([cat, items]) => (
          <div key={cat}>
            <h3 className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#2D7A5F] mb-3">
              {cat}
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {items.map((s) => {
                const checked = draft.sintomasSelecionados.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    data-testid={`button-sintoma-${s.id}`}
                    onClick={() => toggle(s.id)}
                    aria-pressed={checked}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-sm text-left transition-all ${
                      checked
                        ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F] font-semibold"
                        : "border-[#D1E8DA] bg-white text-[#2D3748] hover:border-[#a0aec0]"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                        checked ? "border-[#2D7A5F] bg-[#1B4D3E]" : "border-[#cbd5e1]"
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="flex-1">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <PrimaryButton
          disabled={!podeAvancar}
          onClick={avancarEtapa}
          testId="button-avancar-sintomas"
        >
          Continuar <ChevronRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </StepShell>
  );
}

// =====================================================================
//  ETAPA 3 — Regiões corporais
// =====================================================================

const GROUP_LABELS: Record<RegionGroup, string> = {
  superior: "Cabeça, pescoço e membros superiores",
  tronco: "Tronco",
  inferior: "Membros inferiores",
  geral: "Geral / outras",
};

export function Step3Regioes() {
  const { draft, setDraft, avancarEtapa, redFlag } = useTriageStore();

  function toggle(id: string) {
    const sel = new Set(draft.regioesSelecionadas);
    if (sel.has(id)) sel.delete(id);
    else if (sel.size < 10) sel.add(id);
    setDraft({ regioesSelecionadas: Array.from(sel) });
  }

  const groups = useMemo(() => {
    const m = new Map<RegionGroup, typeof REGIONS>();
    for (const r of REGIONS) {
      const existing = m.get(r.group);
      if (existing) existing.push(r);
      else m.set(r.group, [r]);
    }
    return Array.from(m.entries());
  }, []);

  return (
    <StepShell
      title="Onde os sintomas se localizam?"
      subtitle="Selecione uma ou mais regiões do corpo. Pode pular se não souber localizar."
    >
      {redFlag && <RedFlagAlert redFlag={redFlag} />}

      <div className="text-sm text-[#4A5568] font-semibold">
        {draft.regioesSelecionadas.length} selecionada
        {draft.regioesSelecionadas.length === 1 ? "" : "s"}
      </div>

      <div className="space-y-6">
        {groups.map(([g, items]) => (
          <div key={g}>
            <h3 className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#2D7A5F] mb-3">
              {GROUP_LABELS[g]}
            </h3>
            <div className="grid sm:grid-cols-3 gap-2">
              {items.map((r) => {
                const checked = draft.regioesSelecionadas.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    data-testid={`button-regiao-${r.id}`}
                    onClick={() => toggle(r.id)}
                    aria-pressed={checked}
                    className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                      checked
                        ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F]"
                        : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={avancarEtapa} testId="button-avancar-regioes">
          Continuar <ChevronRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </StepShell>
  );
}

// =====================================================================
//  ETAPA 4 — Entrevista (estática + dinâmica IA)
// =====================================================================

export function Step4Entrevista() {
  const {
    draft,
    setDraft,
    avancarEtapa,
    redFlag,
    setRedFlag,
    setResultado,
    setStatus,
  } = useTriageStore();

  const [fetched, setFetched] = useState(false);

  const perguntasMutation = useGerarPerguntas();
  const analisarMutation = useAnalisarTriagem();

  // Se "febre" foi selecionada nos sintomas, deduzimos automaticamente temFebre=true
  // e ocultamos a pergunta redundante.
  const febreNoCatalogo = draft.sintomasSelecionados.includes("febre");

  const baseEstatica =
    draft.duracao.trim().length > 0 &&
    draft.progressao !== null &&
    draft.tipoDorTocado &&
    // Só exige intensidade quando o usuário disse que SENTE dor.
    (draft.tipoDor === null || draft.intensidade !== null);

  async function buscarPerguntas() {
    try {
      const res = await perguntasMutation.mutateAsync({
        data: {
          paciente: {
            idade: draft.paciente.idade!,
            sexo: draft.paciente.sexo!,
            condicoesCronicas: draft.paciente.condicoesCronicas || undefined,
          },
          sintomasSelecionados: draft.sintomasSelecionados,
          regioesSelecionadas: draft.regioesSelecionadas,
        },
      });
      if (res.redFlag) {
        setRedFlag({
          detected: true,
          level: res.redFlag.level,
          message: res.redFlag.message,
          action: res.redFlag.action,
          ruleId: undefined,
          emergencyNumber: res.redFlag.emergencyNumber,
        });
      }
      setDraft({ perguntas: res.perguntas, respostas: [] });
      setFetched(true);
    } catch {
      setFetched(true);
      setDraft({ perguntas: [] });
    }
  }

  function setResposta(perguntaId: string, valor: string) {
    const outros = draft.respostas.filter((r) => r.perguntaId !== perguntaId);
    const nova: Resposta = { perguntaId, valor };
    setDraft({ respostas: [...outros, nova] });
  }

  const respostasCompletas =
    draft.perguntas.length === 0 ||
    draft.perguntas.every((p) =>
      draft.respostas.some((r) => r.perguntaId === p.id && r.valor.length > 0),
    );

  async function submeter() {
    if (!baseEstatica) return;
    // Retry após erro: error → collecting → analyzing é o caminho válido no FSM.
    setStatus("collecting");
    setStatus("analyzing");
    try {
      const resultado = await analisarMutation.mutateAsync({
        data: {
          paciente: {
            idade: draft.paciente.idade!,
            sexo: draft.paciente.sexo!,
            condicoesCronicas: draft.paciente.condicoesCronicas || undefined,
          },
          sintomasSelecionados: draft.sintomasSelecionados,
          regioesSelecionadas: draft.regioesSelecionadas,
          duracao: draft.duracao,
          intensidade: draft.intensidade ?? 0,
          progressao: draft.progressao!,
          tipoDor: draft.tipoDor,
          // Se "febre" está nos sintomas, força true; caso contrário usamos null
          // (assume não / desconhecido — IA decide).
          temFebre: febreNoCatalogo ? true : draft.temFebre,
          respostas: draft.respostas,
        },
      });
      if (resultado.redFlag) {
        setRedFlag({
          detected: true,
          level: resultado.redFlag.level,
          message: resultado.redFlag.message,
          action: resultado.redFlag.action,
          ruleId: undefined,
          emergencyNumber: resultado.redFlag.emergencyNumber,
        });
      }
      setResultado(resultado);
      setStatus("success");
      avancarEtapa();
    } catch {
      setStatus("error");
    }
  }

  const progressaoOptions: { value: Progressao; label: string }[] = [
    { value: "piorando", label: "Piorando" },
    { value: "estavel", label: "Estável" },
    { value: "melhorando", label: "Melhorando" },
  ];
  const tipoDorOptions: { value: TipoDor; label: string }[] = [
    { value: "continua", label: "Constante (sempre presente)" },
    { value: "intermitente", label: "Vai e volta (em crises)" },
  ];
  const duracaoOptions: string[] = [
    "Menos de 24h",
    "1 a 3 dias",
    "4 a 7 dias",
    "1 a 2 semanas",
    "Mais de 2 semanas",
    "Mais de 1 mês",
  ];

  // Cor "viva" por faixa (1-4 verde, 5-7 âmbar, 8-10 vermelho).
  function intensidadeCor(n: number): { vivo: string; texto: string } {
    if (n <= 4) return { vivo: "bg-[#48bb78]", texto: "text-white" };
    if (n <= 7) return { vivo: "bg-[#ed8936]", texto: "text-white" };
    return { vivo: "bg-[#e53e3e]", texto: "text-white" };
  }

  return (
    <StepShell
      title="Entrevista clínica"
      subtitle="Conte mais sobre como o quadro tem evoluído. As perguntas finais são adaptadas ao seu caso."
    >
      {redFlag && <RedFlagAlert redFlag={redFlag} />}

      <div className="bg-white border border-[#D1E8DA] rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-['Inter'] font-bold text-lg text-[#1A202C]">
          Como você está se sentindo
        </h3>

        <div>
          <span className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']">
            Há quanto tempo os sintomas começaram?
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {duracaoOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                data-testid={`button-duracao-${opt}`}
                onClick={() => setDraft({ duracao: opt })}
                className={`px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  draft.duracao === opt
                    ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F]"
                    : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']">
            Como tem evoluído?
          </span>
          <div className="grid grid-cols-3 gap-2">
            {progressaoOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                data-testid={`button-progressao-${opt.value}`}
                onClick={() => setDraft({ progressao: opt.value })}
                className={`px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  draft.progressao === opt.value
                    ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F]"
                    : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']">
            Você está sentindo dor?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {tipoDorOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                data-testid={`button-tipodor-${opt.value}`}
                onClick={() =>
                  setDraft({ tipoDor: opt.value, tipoDorTocado: true })
                }
                className={`px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  draft.tipoDor === opt.value && draft.tipoDorTocado
                    ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F]"
                    : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              data-testid="button-tipodor-na"
              onClick={() =>
                setDraft({ tipoDor: null, tipoDorTocado: true, intensidade: null })
              }
              className={`px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                draft.tipoDor === null && draft.tipoDorTocado
                  ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F]"
                  : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
              }`}
            >
              Não sinto dor
            </button>
          </div>
        </div>

        {/* Intensidade da dor — só aparece quando o usuário disse que sente dor. */}
        {draft.tipoDorTocado && draft.tipoDor !== null && (
          <div>
            <span className="block text-sm font-semibold text-[#2D3748] mb-2 font-['Inter']">
              Intensidade DA DOR{" "}
              <span className="text-[#718096] font-normal">
                (0 = nenhuma, 10 = a pior possível)
              </span>
            </span>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                const { vivo, texto } = intensidadeCor(n);
                const selecionado = draft.intensidade === n;
                const algumSelecionado = draft.intensidade !== null;
                // Estado: vivo (nenhum selecionado) | selecionado-vivo+ring | acinzentado
                const classes = selecionado
                  ? `${vivo} ${texto} ring-2 ring-offset-2 ring-[#1A202C]/60 scale-105`
                  : algumSelecionado
                    ? "bg-[#e2e8f0] text-[#a0aec0]"
                    : `${vivo} ${texto} opacity-90 hover:opacity-100`;
                return (
                  <button
                    key={n}
                    type="button"
                    data-testid={`button-intensidade-${n}`}
                    onClick={() => setDraft({ intensidade: n })}
                    className={`h-12 rounded-xl font-['Inter'] font-bold text-base tabular-nums transition-all ${classes}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            {draft.intensidade !== null && (
              <p
                data-testid="text-intensidade-valor"
                className="text-xs text-[#4A5568] mt-2 font-semibold"
              >
                Você marcou intensidade <strong>{draft.intensidade}</strong> de 10.
              </p>
            )}
          </div>
        )}
      </div>

      {!fetched && (
        <div className="flex justify-end">
          <PrimaryButton
            onClick={buscarPerguntas}
            disabled={!baseEstatica || perguntasMutation.isPending}
            testId="button-buscar-perguntas"
          >
            {perguntasMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Gerando perguntas…
              </>
            ) : (
              <>
                Próximas perguntas <ChevronRight className="w-5 h-5" />
              </>
            )}
          </PrimaryButton>
        </div>
      )}

      {fetched && draft.perguntas.length > 0 && (
        <div className="bg-white border border-[#D1E8DA] rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="font-['Inter'] font-bold text-lg text-[#1A202C]">
            Perguntas adaptadas aos seus sintomas
          </h3>
          {draft.perguntas.map((p, idx) => {
            const valorAtual =
              draft.respostas.find((r) => r.perguntaId === p.id)?.valor ?? "";
            return (
              <div key={p.id} data-testid={`pergunta-${p.id}`}>
                <p className="text-sm font-semibold text-[#2D3748] mb-3 font-['Inter']">
                  {idx + 1}. {p.pergunta}
                </p>
                {p.tipo === "opcoes" && p.opcoes && p.opcoes.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {p.opcoes.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        data-testid={`button-resposta-${p.id}-${opt}`}
                        onClick={() => setResposta(p.id, opt)}
                        className={`px-4 py-3 rounded-2xl border-2 text-sm text-left transition-all ${
                          valorAtual === opt
                            ? "border-[#2D7A5F] bg-[#1B4D3E]/5 text-[#2D7A5F] font-semibold"
                            : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                      {Array.from({ length: 11 }, (_, i) => i).map((n) => {
                        const cor = n <= 3
                          ? { vivo: "bg-[#48bb78]", texto: "text-white" }
                          : n <= 6
                            ? { vivo: "bg-[#ed8936]", texto: "text-white" }
                            : { vivo: "bg-[#e53e3e]", texto: "text-white" };
                        const sel = valorAtual === String(n);
                        const temSel = valorAtual !== "";
                        const classes = sel
                          ? `${cor.vivo} ${cor.texto} ring-2 ring-offset-1 ring-[#1A202C]/50 scale-105`
                          : temSel
                            ? "bg-[#e2e8f0] text-[#a0aec0]"
                            : `${cor.vivo} ${cor.texto} opacity-85 hover:opacity-100`;
                        return (
                          <button
                            key={n}
                            type="button"
                            data-testid={`button-escala-${p.id}-${n}`}
                            onClick={() => setResposta(p.id, String(n))}
                            className={`h-11 rounded-xl font-['Inter'] font-bold text-sm tabular-nums transition-all ${classes}`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#718096] mt-1.5 px-0.5">
                      <span>0 = nada</span>
                      <span>10 = máximo</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {fetched && draft.perguntas.length === 0 && (
        <div
          data-testid="text-perguntas-erro"
          className="bg-[#fffaf0] border border-[#dd6b20]/30 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-[#9c4221] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#9c4221] leading-relaxed">
            Não foi possível gerar perguntas adicionais agora — mas você pode prosseguir
            com a análise baseada nos dados já informados.
          </div>
        </div>
      )}

      {fetched && (
        <>
          {analisarMutation.isError && (
            <div
              data-testid="text-analise-erro"
              className="bg-[#fffaf0] border border-[#dd6b20]/40 rounded-2xl p-4 text-sm text-[#9c4221]"
            >
              Não foi possível concluir a análise. Tente novamente em instantes.
            </div>
          )}
          {analisarMutation.isPending && (
            <div
              data-testid="card-analisando"
              className="bg-white border-2 border-[#4CAF82]/40 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#EBF5EE] flex items-center justify-center flex-shrink-0">
                <HeartPulse className="w-7 h-7 text-[#2D7A5F] animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="font-['Inter'] font-bold text-base text-[#1A202C] mb-1">
                  Analisando seu caso com cuidado…
                </h4>
                <p className="text-sm text-[#4A5568] leading-relaxed">
                  Estamos cruzando seus sintomas com as orientações clínicas
                  educativas. Isso pode levar alguns segundos — fique tranquilo,
                  não feche esta página.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#2D7A5F] font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processando com inteligência artificial
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <PrimaryButton
              onClick={submeter}
              disabled={!respostasCompletas || analisarMutation.isPending}
              testId="button-finalizar-entrevista"
            >
              {analisarMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analisando…
                </>
              ) : (
                <>
                  Ver orientação <ChevronRight className="w-5 h-5" />
                </>
              )}
            </PrimaryButton>
          </div>
        </>
      )}
    </StepShell>
  );
}

// =====================================================================
//  ETAPA 5 — Resultado + Feedback persistente
// =====================================================================

const RISK_META: Record<
  string,
  { label: string; bg: string; border: string; text: string; barra: string }
> = {
  low: {
    label: "Baixa urgência — autocuidado",
    bg: "bg-[#EBF5EE]",
    border: "border-[#4CAF82]/40",
    text: "text-[#22543d]",
    barra: "bg-[#4CAF82]",
  },
  medium: {
    label: "Urgência moderada — busque atendimento em breve",
    bg: "bg-[#fffaf0]",
    border: "border-[#dd6b20]/30",
    text: "text-[#9c4221]",
    barra: "bg-[#dd6b20]",
  },
  high: {
    label: "Urgência alta — busque atendimento hoje",
    bg: "bg-[#fffaf0]",
    border: "border-[#c05621]/50",
    text: "text-[#7b341e]",
    barra: "bg-[#c05621]",
  },
  emergency: {
    label: "EMERGÊNCIA — procure socorro imediato",
    bg: "bg-[#fff5f5]",
    border: "border-[#e53e3e]",
    text: "text-[#9b2c2c]",
    barra: "bg-[#9b2c2c]",
  },
};

export function Step5Resultado() {
  const { resultado, redFlag, resetar } = useTriageStore();

  if (!resultado) {
    return (
      <StepShell title="Carregando resultado…">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D7A5F]" />
      </StepShell>
    );
  }

  const meta = RISK_META[resultado.riskLevel] ?? RISK_META.low;

  return (
    <StepShell
      title="Sua orientação"
      subtitle="Resultado educativo, baseado nos sintomas informados. Não substitui consulta médica."
    >
      {redFlag && <RedFlagAlert redFlag={redFlag} />}

      {/* Nível de urgência */}
      <div
        data-testid="card-nivel-urgencia"
        className={`${meta.bg} ${meta.border} border-2 rounded-2xl p-6 md:p-8`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${meta.barra} text-white flex items-center justify-center flex-shrink-0`}>
            <Gauge className="w-6 h-6" strokeWidth={2.4} />
          </div>
          <div className={`flex-1 ${meta.text}`}>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
              Nível de urgência sugerido
            </span>
            <h3 className="font-['Inter'] font-bold text-xl md:text-2xl mt-1 mb-2">
              {meta.label}
            </h3>

          </div>
        </div>
      </div>

      {/* Especialidade */}
      <div className="bg-white border border-[#D1E8DA] rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5EE] text-[#2D7A5F] flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D7A5F]">
              Especialidade sugerida
            </span>
            <h3
              data-testid="text-especialidade-principal"
              className="font-['Inter'] font-bold text-xl text-[#1A202C] mt-1 mb-1"
            >
              {resultado.especialidade.principal}
            </h3>
            {resultado.especialidade.secundaria && (
              <p className="text-sm text-[#4A5568] mb-2">
                Alternativa: <strong>{resultado.especialidade.secundaria}</strong>
              </p>
            )}
            <p className="text-sm text-[#4A5568] leading-relaxed">
              {resultado.especialidade.justificativa}
            </p>
          </div>
        </div>
      </div>

      {/* Hipóteses */}
      {resultado.hipoteses.length > 0 && (
        <div className="bg-white border border-[#D1E8DA] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#2D7A5F]" />
            <h3 className="font-['Inter'] font-bold text-lg text-[#1A202C]">
              Possibilidades a considerar
            </h3>
          </div>
          <ul className="space-y-3">
            {resultado.hipoteses.map((h) => (
              <li
                key={h.nome}
                className="p-4 bg-[#F7FAF8] border border-[#D1E8DA] rounded-2xl"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-['Inter'] font-semibold text-[#1A202C]">
                    {h.nome}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D7A5F]">
                    {h.relevancia}
                  </span>
                </div>
                <p className="text-sm text-[#4A5568] leading-relaxed">{h.descricao}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Orientações */}
      <div className="bg-white border border-[#D1E8DA] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-[#2D7A5F]" />
          <h3 className="font-['Inter'] font-bold text-lg text-[#1A202C]">
            Orientações práticas
          </h3>
        </div>
        <ul className="space-y-3">
          {resultado.orientacoesGerais.map((o, i) => (
            <li key={i} className="flex gap-3">
              <Check className="w-4 h-4 text-[#2D7A5F] flex-shrink-0 mt-1" strokeWidth={3} />
              <span className="text-sm text-[#2D3748] leading-relaxed">{o}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Aviso legal — destacado, com símbolo de alerta vermelho sobre amarelo */}
      <div
        data-testid="card-aviso-legal"
        className="bg-[#fffbeb] border-2 border-[#dd6b20] rounded-2xl p-5 md:p-6 flex gap-4 items-start shadow-sm"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#e53e3e] text-white flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6" strokeWidth={2.6} />
        </div>
        <div className="flex-1">
          <h4 className="font-['Inter'] font-bold text-base text-[#9b2c2c] mb-1.5 uppercase tracking-wider">
            Aviso importante
          </h4>
          <p className="text-sm text-[#7b341e] leading-relaxed font-medium">
            {resultado.avisoLegal}
          </p>
        </div>
      </div>

      {/* Feedback persistente */}
      <FeedbackForm resultado={resultado} />

      {/* Ações finais */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={resetar}
          data-testid="button-nova-triagem"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#D1E8DA] text-[#4A5568] hover:border-[#2D7A5F] hover:text-[#2D7A5F] rounded-2xl font-['Inter'] font-semibold text-base transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Nova triagem
        </button>
        <Link
          href="/"
          data-testid="link-voltar-inicio"
          className="flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-[#1B4D3E] text-white rounded-2xl font-['Inter'] font-semibold text-base hover:bg-[#163D31] active:scale-[0.98] transition-all shadow-sm"
        >
          Voltar ao início
        </Link>
      </div>
    </StepShell>
  );
}
