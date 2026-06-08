import { useEffect } from "react";
import { useTriageStore } from "../store/triageStore";
import { ProgressHeader } from "../components/wizard/ProgressHeader";
import {
  Step0Consentimento,
  Step1Paciente,
  Step2Sintomas,
  Step3Regioes,
  Step4Entrevista,
  Step5Resultado,
} from "../components/wizard/steps";

export default function Entrevista() {
  const { draft, status, setStatus, voltarEtapa, resetar, resultado } =
    useTriageStore();

  // Reset ao entrar/reentrar: se já existe resultado anterior ou já estamos
  // na tela final, começamos uma triagem totalmente nova.
  useEffect(() => {
    if (resultado !== null || draft.etapaAtual >= 5) {
      resetar();
    }
    // Intencional: só rodamos no mount, não a cada mudança de etapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Garante transição idle → collecting na entrada do wizard.
  useEffect(() => {
    if (status === "idle") {
      setStatus("collecting");
    }
  }, [status, setStatus]);

  // Volta para o topo da tela em cada troca de etapa.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [draft.etapaAtual]);

  const etapa = draft.etapaAtual;
  const podeVoltar = etapa > 0 && etapa < 5;

  return (
    <div className="min-h-screen bg-white text-[#2D3748] font-['Open_Sans']">
      <ProgressHeader
        etapaAtual={etapa}
        podeVoltar={podeVoltar}
        onVoltar={voltarEtapa}
      />
      <main>
        {etapa === 0 && <Step0Consentimento />}
        {etapa === 1 && <Step1Paciente />}
        {etapa === 2 && <Step2Sintomas />}
        {etapa === 3 && <Step3Regioes />}
        {etapa === 4 && <Step4Entrevista />}
        {etapa === 5 && <Step5Resultado />}
      </main>
    </div>
  );
}
