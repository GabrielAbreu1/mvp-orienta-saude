import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  HeartPulse,
  ClipboardList,
  AlertTriangle,
  User,
  Activity,
  PersonStanding,
  MessageSquare,
  Clock,
  Gauge,
  Sparkles,
  Lock,
  Star,
  ChevronRight,
} from "lucide-react";

interface Highlight {
  comentario: string | null;
  estrelas: number;
  util: boolean;
  data: string;
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= value ? "text-[#4CAF82] fill-[#4CAF82]" : "text-[#CBD5E0]"}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ highlight }: { highlight: Highlight }) {
  return (
    <div className="bg-white border border-[#D1E8DA] rounded-2xl p-5 flex flex-col gap-3">
      <StarRating value={highlight.estrelas} />
      <p className="text-[#2D3748] text-sm leading-relaxed flex-1 italic">
        "{highlight.comentario}"
      </p>
      <span className="text-xs text-[#718096]">
        {new Date(highlight.data).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  );
}

const STEPS = [
  { icon: ShieldCheck, title: "Consentimento LGPD", desc: "Você lê os termos e autoriza o uso educativo. Nenhuma resposta clínica é armazenada." },
  { icon: User, title: "Sobre você", desc: "Idade e gênero, usados apenas para contextualizar a orientação." },
  { icon: Activity, title: "Seus sintomas", desc: "Selecione o que está sentindo em uma lista clara e estruturada." },
  { icon: PersonStanding, title: "Regiões do corpo", desc: "Indica onde os sintomas se localizam para refinar a análise." },
  { icon: MessageSquare, title: "Entrevista breve", desc: "Perguntas geradas pela IA especificamente para o seu quadro." },
  { icon: ClipboardList, title: "Orientação final", desc: "Nível de urgência, especialidade recomendada e próximos passos." },
] as const;

export default function Landing() {
  const { data: highlights } = useQuery<Highlight[]>({
    queryKey: ["feedbacks-highlights"],
    queryFn: async () => {
      const res = await fetch("/api/feedbacks/highlights");
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 5 * 60_000,
  });

  const visibleHighlights = (highlights ?? []).filter((h) => h.comentario).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#1A202C] font-['Open_Sans'] antialiased overflow-x-hidden">

      {/* HEADER */}
      <header className="bg-white border-b border-[#D1E8DA] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B4D3E] flex items-center justify-center">
              <HeartPulse className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="font-['Inter'] font-bold text-lg text-[#1B4D3E] leading-none block">
                Orienta Saúde
              </span>
              <span className="text-[10px] font-semibold text-[#2D7A5F] tracking-widest uppercase">
                Projeto Universitário
              </span>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#como-funciona" className="text-sm font-medium text-[#4A5568] hover:text-[#1B4D3E] transition-colors">
              Como funciona
            </a>
            <a href="#sobre" className="text-sm font-medium text-[#4A5568] hover:text-[#1B4D3E] transition-colors">
              Sobre
            </a>
            <Link
              href="/stats"
              className="text-sm font-medium text-[#2D7A5F] hover:text-[#1B4D3E] transition-colors flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-[#4CAF82] text-[#4CAF82]" /> Feedbacks
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-[#D1E8DA] bg-gradient-to-br from-white via-[#F0F9F4] to-[#EBF5EE]">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#EBF5EE] text-[#1B4D3E] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
              <Stethoscope className="w-3.5 h-3.5" />
              Orientação em saúde · gratuito · educativo
            </div>
            <h1 className="font-['Inter'] text-4xl md:text-5xl font-bold text-[#1B4D3E] leading-[1.1] mb-5 tracking-tight">
              Entenda seus sintomas.<br />
              <span className="text-[#2D7A5F]">Saiba o próximo passo.</span>
            </h1>
            <p className="text-base md:text-lg text-[#4A5568] mb-8 leading-relaxed max-w-xl">
              Em 3 minutos, o Orienta Saúde analisa seus sintomas com inteligência artificial e indica o nível de urgência e a especialidade médica ideal para o seu caso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Link
                href="/entrevista"
                data-testid="link-iniciar-hero"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1B4D3E] text-white rounded-xl font-['Inter'] font-semibold text-base hover:bg-[#163D31] transition-colors shadow-sm"
              >
                Começar agora <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 text-[#2D7A5F] font-semibold text-base hover:text-[#1B4D3E] transition-colors"
              >
                Ver como funciona <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: ShieldCheck, text: "Sem cadastro" },
                { icon: Lock, text: "Dados não armazenados" },
                { icon: Clock, text: "Cerca de 3 minutos" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs font-semibold text-[#718096]">
                  <Icon className="w-3.5 h-3.5 text-[#4CAF82]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AVISO */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-[#FFFBEB] border border-[#F6D860] rounded-xl p-4 flex gap-3 items-start">
          <AlertTriangle className="w-4 h-4 text-[#B7791F] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#744210] leading-relaxed">
            <strong>Apenas para adultos (18+).</strong> Esta ferramenta é educativa e{" "}
            <strong>não substitui consulta médica</strong>. Em caso de emergência, ligue{" "}
            <strong>192 (SAMU)</strong> imediatamente.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest text-[#4CAF82] uppercase block mb-2">
            O percurso
          </span>
          <h2 className="font-['Inter'] text-2xl md:text-3xl font-bold text-[#1B4D3E] mb-2">
            Como o Orienta Saúde funciona
          </h2>
          <p className="text-[#4A5568] text-sm md:text-base max-w-lg leading-relaxed">
            Um percurso curto e transparente. Você sabe exatamente o que vem em cada etapa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <div
                key={step.title}
                className={`flex items-start gap-4 p-5 rounded-xl border ${
                  isLast
                    ? "bg-[#EBF5EE] border-[#A8D5B5]"
                    : "bg-white border-[#D1E8DA] hover:border-[#4CAF82] transition-colors"
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLast ? "bg-[#1B4D3E]" : "bg-[#EBF5EE]"}`}>
                    <Icon className={`w-5 h-5 ${isLast ? "text-white" : "text-[#2D7A5F]"}`} strokeWidth={2.2} />
                  </div>
                  <span className="block text-center text-[10px] font-bold text-[#A0AEC0] mt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="pt-0.5">
                  <h4 className="font-['Inter'] font-semibold text-sm text-[#1B4D3E] mb-1">{step.title}</h4>
                  <p className="text-[#4A5568] text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section className="bg-[#1B4D3E] py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest text-[#4CAF82] uppercase block mb-2">
              O resultado
            </span>
            <h2 className="font-['Inter'] text-2xl md:text-3xl font-bold text-white mb-2">
              O que você recebe no fim
            </h2>
            <p className="text-[#A8D5B5] text-sm md:text-base max-w-lg leading-relaxed">
              Orientação clara, personalizada e em linguagem simples.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Gauge, title: "Nível de urgência", desc: "De autocuidado a emergência, com justificativa em linguagem acessível." },
              { icon: Stethoscope, title: "Especialidade sugerida", desc: "A especialidade médica mais indicada para o conjunto de sintomas informado." },
              { icon: Sparkles, title: "Orientações práticas", desc: "O que observar, quando reavaliar e quais sinais exigem atenção imediata." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#163D31] rounded-xl p-5 border border-[#2D7A5F]/40">
                <div className="w-9 h-9 rounded-lg bg-[#4CAF82]/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#4CAF82]" />
                </div>
                <h4 className="font-['Inter'] font-semibold text-sm text-white mb-1.5">{title}</h4>
                <p className="text-[#A8D5B5] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/entrevista"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CAF82] text-[#1B4D3E] rounded-xl font-['Inter'] font-bold text-sm hover:bg-[#3D9E72] transition-colors"
            >
              Começar triagem <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEEDBACKS */}
      {visibleHighlights.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest text-[#4CAF82] uppercase block mb-2">
              Depoimentos
            </span>
            <h2 className="font-['Inter'] text-2xl md:text-3xl font-bold text-[#1B4D3E] mb-1">
              O que dizem os usuários
            </h2>
            <p className="text-[#4A5568] text-sm">
              Avaliações reais e anônimas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {visibleHighlights.map((h, i) => (
              <TestimonialCard key={i} highlight={h} />
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/stats"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D7A5F] hover:text-[#1B4D3E] transition-colors"
            >
              Ver todos os feedbacks <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* SOBRE */}
      <section id="sobre" className="bg-white border-t border-[#D1E8DA]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EBF5EE] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#2D7A5F]" />
            </div>
            <div>
              <h3 className="font-['Inter'] font-bold text-base text-[#1B4D3E] mb-1">Sobre o projeto</h3>
              <p className="text-[#4A5568] text-sm leading-relaxed max-w-2xl">
                O Orienta Saúde é um projeto de extensão universitária alinhado à{" "}
                <strong>ODS 3 — Saúde e Bem-Estar</strong> da ONU. Funciona sem cadastro,
                sem armazenar respostas clínicas e sem custo. A regra é simples: orientar
                com clareza, sempre apontando o caminho do atendimento profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F7FAF8] border-t border-[#D1E8DA] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-[#4CAF82] w-4 h-4" />
            <span className="text-xs text-[#718096] font-medium">
              Orienta Saúde © {new Date().getFullYear()} — Projeto de extensão universitária
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D1E8DA]">
            <span className="text-[10px] font-bold text-[#2D7A5F] tracking-wider uppercase">ODS 3</span>
            <span className="text-[10px] text-[#718096]">Saúde e Bem-Estar</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
