import { AlertOctagon, PhoneCall } from "lucide-react";
import type { RedFlagResult } from "@workspace/triagem-domain";

interface Props {
  redFlag: RedFlagResult;
  variant?: "inline" | "block";
}

/**
 * Banner crítico — único lugar autorizado a usar vermelho/coral na UI.
 * Sempre visível enquanto a flag estiver ativa.
 */
export function RedFlagAlert({ redFlag, variant = "block" }: Props) {
  if (!redFlag.detected) return null;

  const isEmergency = redFlag.level === "emergency";
  const bg = isEmergency ? "bg-[#fff5f5] border-[#e53e3e]" : "bg-[#fffaf0] border-[#dd6b20]";
  const fg = isEmergency ? "text-[#9b2c2c]" : "text-[#9c4221]";
  const icon = isEmergency ? "bg-[#e53e3e] text-white" : "bg-[#dd6b20] text-white";

  return (
    <div
      data-testid="red-flag-alert"
      role="alert"
      className={`${bg} border-2 rounded-2xl p-5 ${variant === "block" ? "md:p-6" : ""} shadow-sm`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${icon} flex items-center justify-center`}>
          <AlertOctagon className="w-6 h-6" strokeWidth={2.4} />
        </div>
        <div className={`flex-1 ${fg}`}>
          <h3 className="font-['Inter'] font-bold text-base md:text-lg mb-1">
            {isEmergency ? "Sinal de emergência detectado" : "Atenção: sinal de alerta"}
          </h3>
          <p className="text-sm md:text-base leading-relaxed mb-3">{redFlag.message}</p>
          <p className="text-sm md:text-base font-semibold leading-relaxed mb-3">{redFlag.action}</p>
          <div className="inline-flex items-center gap-2 bg-white border border-current/20 px-3 py-2 rounded-xl">
            <PhoneCall className="w-4 h-4" />
            <span className="font-bold">Emergência: {redFlag.emergencyNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
