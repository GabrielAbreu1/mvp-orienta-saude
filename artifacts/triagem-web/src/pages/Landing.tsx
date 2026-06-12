import { Link } from "wouter";
import {
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  HeartPulse,
  ClipboardList,
  Info,
  AlertTriangle,
  User,
  Activity,
  PersonStanding,
  MessageSquare,
  Clock,
  Gauge,
  Sparkles,
  Lock,
} from "lucide-react";

const STEPS = [
  { icon: ShieldCheck, title: "Consentimento LGPD", desc: "Você lê os termos e autoriza o uso educativo. Nada clínico é armazenado." },
  { icon: User, title: "Sobre você", desc: "Idade e gênero — usados apenas para contextualizar a orientação." },
  { icon: Activity, title: "Seleção de sintomas", desc: "Marca o que está sentindo a partir de uma lista clara e objetiva." },
  { icon: PersonStanding, title: "Regiões do corpo", desc: "Indica onde os sintomas se localizam para refinar a análise." },
  { icon: MessageSquare, title: "Entrevista breve", desc: "De 3 a 7 perguntas curtas, geradas para o seu caso específico." },
  { icon: ClipboardList, title: "Orientação final", desc: "Nível de urgência sugerido, especialidade e próximos passos." },
] as const;

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#2D3748] font-['Open_Sans'] antialiased overflow-x-hidden">
      <header className="py-6 px-6 md:px-12 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0056b3]/10 flex items-center justify-center">
            <HeartPulse className="text-[#0056b3] w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Inter'] font-bold text-xl tracking-tight text-[#0056b3] leading-none">
              Orienta Saúde
            </span>
            <span className="text-xs font-medium text-[#718096] mt-1 tracking-wide">
              PROJETO UNIVERSITÁRIO
            </span>
          </div>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#como-funciona" className="text-sm font-semibold text-[#4A5568] hover:text-[#0056b3] transition-colors">Como funciona</a>
          <a href="#sobre" className="text-sm font-semibold text-[#4A5568] hover:text-[#0056b3] transition-colors">Sobre o projeto</a>
        </nav>
      </header>

      <main className="max-w-[860px] mx-auto px-6 pt-16 md:pt-24 pb-24 text-center">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-5 bg-[#e6f4f1] rounded-full mb-8 shadow-sm">
            <Stethoscope className="w-8 h-8 text-[#2e8b57]" strokeWidth={2.5} />
          </div>

          <h1 className="font-['Inter'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A202C] leading-[1.1] mb-6 tracking-tight">
            Entenda seus sintomas com clareza e segurança.
          </h1>

          <p className="text-lg md:text-xl text-[#4A5568] mb-12 max-w-2xl leading-relaxed">
            Um assistente educativo que te orienta sobre o nível de urgência e qual especialista procurar. Desenvolvido para a sua tranquilidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <Link
              href="/entrevista"
              data-testid="link-iniciar-hero"
              className="w-full sm:w-auto px-8 py-4 bg-[#0056b3] text-white rounded-2xl font-['Inter'] font-semibold text-lg hover:bg-[#004494] transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            >
              Começar triagem <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-12 text-sm text-[#4A5568] font-semibold">
            <div className="flex items-center gap-2 bg-[#f8f9fa] px-4 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#2e8b57]" /> Projeto acadêmico seguro
            </div>
            <div className="flex items-center gap-2 bg-[#f8f9fa] px-4 py-2 rounded-xl">
              <ClipboardList className="w-4 h-4 text-[#2e8b57]" /> Sem necessidade de cadastro
            </div>
            <div className="flex items-center gap-2 bg-[#f8f9fa] px-4 py-2 rounded-xl">
              <Info className="w-4 h-4 text-[#2e8b57]" /> 100% gratuito e educativo
            </div>
          </div>
        </div>

        <div className="mt-20 bg-[#f8f9fa] rounded-3xl p-6 md:p-8 text-left flex flex-col md:flex-row gap-6 items-start md:items-center border border-[#e2e8f0]/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#0056b3]"></div>
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-[#e2e8f0] flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-6 h-6 text-[#718096]" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h3 className="font-['Inter'] font-bold text-[#2D3748] text-lg">Avisos Importantes</h3>
              <span className="bg-[#cbd5e1]/50 text-[#2D3748] text-xs px-2.5 py-1 rounded-md font-bold tracking-wide">APENAS 18+</span>
            </div>
            <p className="text-[#4A5568] leading-relaxed text-sm md:text-base">
              O MVP do Orienta Saúde atende exclusivamente adultos. Esta ferramenta é educativa, <strong>não substitui consulta médica profissional</strong>, não realiza diagnósticos e não trata emergências.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-center">
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider mb-1">Em caso de emergência</span>
            <p className="text-base font-bold text-[#2D3748] flex items-center gap-2">
              Ligue imediatamente <span className="text-[#0056b3] bg-[#0056b3]/10 px-2 py-0.5 rounded-lg text-lg">192 (SAMU)</span>
            </p>
          </div>
        </div>

        <section id="como-funciona" className="mt-24 pt-16 border-t border-[#e2e8f0] text-left">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#2e8b57] uppercase mb-3">O percurso</span>
            <h2 className="font-['Inter'] text-3xl md:text-4xl font-bold text-[#1A202C] mb-4 tracking-tight">
              Como o Orienta Saúde funciona
            </h2>
            <p className="text-[#4A5568] text-base md:text-lg max-w-xl leading-relaxed mb-6">
              Um percurso curto, transparente e respeitoso. Você sabe exatamente o que vem em cada etapa.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e8b57] bg-[#e6f4f1] px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" /> Cerca de 3 minutos do início ao resultado
            </div>
          </div>

          <ol className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === STEPS.length - 1;
              return (
                <li
                  key={step.title}
                  className={`flex items-start gap-5 p-5 rounded-2xl border transition-colors ${
                    isLast ? "border-[#0056b3]/20 bg-[#0056b3]/[0.03]" : "border-[#e2e8f0] bg-white hover:bg-[#f8f9fa]"
                  }`}
                >
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLast ? "bg-[#0056b3] text-white" : "bg-[#e6f4f1] text-[#2e8b57]"}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <span className={`font-['Inter'] text-xs font-bold tracking-wider ${isLast ? "text-[#0056b3]" : "text-[#a0aec0]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h4 className="font-['Inter'] font-semibold text-lg text-[#1A202C] mb-1">{step.title}</h4>
                    <p className="text-[#4A5568] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-16 pt-12 border-t border-[#e2e8f0]">
            <h3 className="font-['Inter'] text-xl md:text-2xl font-bold text-[#1A202C] mb-8 text-center tracking-tight">
              O que você recebe no fim
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Gauge, title: "Nível de urgência", desc: "De autocuidado a emergência, com justificativa em linguagem simples." },
                { icon: Stethoscope, title: "Especialidade sugerida", desc: "A especialidade médica mais apropriada para o conjunto de sintomas informado." },
                { icon: Sparkles, title: "Orientações práticas", desc: "O que observar, quando reavaliar e quais sinais exigem atenção imediata." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f4f1] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#2e8b57]" />
                  </div>
                  <h4 className="font-['Inter'] font-semibold text-base text-[#1A202C] mb-1">{title}</h4>
                  <p className="text-[#4A5568] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="mt-20 pt-12 border-t border-[#e2e8f0]">
          <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start text-left bg-[#f8f9fa] rounded-3xl p-6 md:p-8 border border-[#e2e8f0]/80">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border border-[#e2e8f0] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <h3 className="font-['Inter'] font-bold text-lg text-[#1A202C] mb-2">Sobre o projeto</h3>
              <p className="text-[#4A5568] text-sm md:text-base leading-relaxed">
                O Orienta Saúde é um projeto de extensão universitária, alinhado à <strong>ODS 3 — Saúde e Bem-Estar</strong> da ONU.
                Funciona sem cadastro, sem armazenar suas respostas clínicas, e sem custo. A regra é simples: orientar com clareza, sempre apontando o caminho do atendimento profissional.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#f8f9fa] border-t border-[#e2e8f0] py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <HeartPulse className="text-[#a0aec0] w-5 h-5" />
              <span className="font-['Inter'] font-semibold text-[#718096]">Orienta Saúde</span>
            </div>
            <span className="text-xs text-[#a0aec0]">© {new Date().getFullYear()} Projeto de extensão universitária.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/stats"
              className="text-sm text-[#718096] hover:text-[#0056b3] transition-colors"
            >
              Ver feedbacks
            </Link>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-[#e2e8f0] shadow-sm">
              <div className="w-8 h-8 bg-[#2e8b57]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#2e8b57] font-bold text-xs">ODS</span>
              </div>
              <p className="text-[#4A5568] text-sm font-medium">Alinhado à ODS 3 — Saúde e Bem-Estar</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
