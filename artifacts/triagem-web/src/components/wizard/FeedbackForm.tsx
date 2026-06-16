import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useEnviarFeedback } from "@workspace/api-client-react";
import type { AnaliseResponse } from "@workspace/triagem-schemas";

interface Props {
  resultado: AnaliseResponse;
}

export function FeedbackForm({ resultado }: Props) {
  const [estrelas, setEstrelas] = useState(0);
  const [hover, setHover] = useState(0);
  const [util, setUtil] = useState<boolean | null>(null);
  const [comentario, setComentario] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = useEnviarFeedback({
    mutation: {
      onSuccess: () => setSent(true),
    },
  });

  const canSubmit = estrelas > 0 && util !== null && !mutation.isPending && !sent;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    mutation.mutate({
      data: {
        estrelas,
        util,
        comentario: comentario.trim() || undefined,
        riskLevel: resultado.riskLevel,
        especialidade: resultado.especialidade.principal,
        source: resultado.source,
      },
    });
  }

  if (sent) {
    return (
      <div
        data-testid="feedback-thanks"
        className="bg-[#e6f4f1] border border-[#2e8b57]/30 rounded-3xl p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2e8b57] text-white mb-4">
          <Check className="w-7 h-7" strokeWidth={2.5} />
        </div>
        <h3 className="font-['Inter'] font-bold text-xl text-[#1A202C] mb-2">
          Obrigado pelo seu feedback!
        </h3>
        <p className="text-[#4A5568] text-sm leading-relaxed max-w-md mx-auto">
          Sua avaliação ajuda a melhorar continuamente esta ferramenta educativa.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="form-feedback"
      className="bg-white border border-[#D1E8DA] rounded-3xl p-6 md:p-8 shadow-sm"
    >
      <h3 className="font-['Inter'] font-bold text-xl text-[#1A202C] mb-2">
        Como foi sua experiência?
      </h3>
      <p className="text-[#4A5568] text-sm mb-6 leading-relaxed">
        Seu feedback é anônimo e ajuda a melhorar o projeto. Avalie a orientação que você recebeu.
      </p>

      {/* Estrelas */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#2D3748] mb-3 font-['Inter']">
          Avaliação geral
        </label>
        <div className="flex gap-2" role="radiogroup" aria-label="Avaliação em estrelas">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || estrelas) >= n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={estrelas === n}
                data-testid={`button-estrelas-${n}`}
                onClick={() => setEstrelas(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    active ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#cbd5e1]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Útil */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#2D3748] mb-3 font-['Inter']">
          A orientação foi útil?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="button-util-sim"
            onClick={() => setUtil(true)}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
              util === true
                ? "border-[#2e8b57] bg-[#e6f4f1] text-[#2e8b57]"
                : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
            }`}
          >
            <ThumbsUp className="w-4 h-4" /> Sim, ajudou
          </button>
          <button
            type="button"
            data-testid="button-util-nao"
            onClick={() => setUtil(false)}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
              util === false
                ? "border-[#dd6b20] bg-[#fffaf0] text-[#9c4221]"
                : "border-[#D1E8DA] bg-white text-[#4A5568] hover:border-[#a0aec0]"
            }`}
          >
            <ThumbsDown className="w-4 h-4" /> Não muito
          </button>
        </div>
      </div>

      {/* Comentário */}
      <div className="mb-6">
        <label
          htmlFor="comentario"
          className="block text-sm font-semibold text-[#2D3748] mb-3 font-['Inter']"
        >
          Comentário (opcional)
        </label>
        <textarea
          id="comentario"
          data-testid="input-comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value.slice(0, 500))}
          maxLength={500}
          rows={3}
          placeholder="Conte o que funcionou bem ou o que pode melhorar."
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#D1E8DA] focus:border-[#1B4D3E] focus:outline-none text-sm text-[#2D3748] resize-none font-['Open_Sans']"
        />
        <div className="flex justify-between items-start mt-1.5 gap-2">
          <p className="text-xs text-[#718096] leading-relaxed">
            Não inclua seu nome, CPF ou outros dados pessoais neste campo.
          </p>
          <p className="text-xs text-[#718096] flex-shrink-0">
            {comentario.length}/500
          </p>
        </div>
      </div>

      {mutation.isError && (
        <p
          data-testid="text-feedback-error"
          className="text-sm text-[#9c4221] bg-[#fffaf0] border border-[#dd6b20]/40 rounded-xl px-4 py-3 mb-4"
        >
          Não foi possível enviar agora. Tente novamente em instantes.
        </p>
      )}

      <button
        type="submit"
        data-testid="button-enviar-feedback"
        disabled={!canSubmit}
        className="w-full px-6 py-3.5 bg-[#1B4D3E] text-white rounded-2xl font-['Inter'] font-semibold text-base hover:bg-[#163D31] disabled:bg-[#cbd5e1] disabled:cursor-not-allowed active:scale-[0.99] transition-all shadow-sm"
      >
        {mutation.isPending ? "Enviando…" : "Enviar feedback"}
      </button>
    </form>
  );
}

