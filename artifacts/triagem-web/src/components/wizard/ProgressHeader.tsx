import { Link } from "wouter";
import { HeartPulse, ArrowLeft } from "lucide-react";

const STEP_LABELS = [
  "Consentimento",
  "Sobre você",
  "Sintomas",
  "Regiões",
  "Entrevista",
  "Resultado",
] as const;

interface Props {
  etapaAtual: number;
  podeVoltar: boolean;
  onVoltar: () => void;
}

export function ProgressHeader({ etapaAtual, podeVoltar, onVoltar }: Props) {
  const total = STEP_LABELS.length;
  const progresso = ((etapaAtual + 1) / total) * 100;

  return (
    <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            data-testid="link-home"
            className="flex items-center gap-2 text-sm font-semibold text-[#1B4D3E] hover:opacity-80"
          >
            <HeartPulse className="w-5 h-5" />
            <span className="font-['Inter']">Orienta Saúde</span>
          </Link>
          {podeVoltar && (
            <button
              onClick={onVoltar}
              data-testid="button-voltar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A5568] hover:text-[#1B4D3E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B4D3E] transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#4A5568] tabular-nums whitespace-nowrap">
            Etapa {etapaAtual + 1} de {total}
          </span>
        </div>
        <p className="text-xs text-[#718096] mt-1.5 font-medium">
          {STEP_LABELS[etapaAtual]}
        </p>
      </div>
    </header>
  );
}

