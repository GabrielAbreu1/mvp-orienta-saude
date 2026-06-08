import React from 'react';
import { 
  ShieldCheck, 
  User, 
  Activity, 
  PersonStanding, 
  MessageSquare, 
  ClipboardList, 
  ArrowRight,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MapaDeCuidado() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Open_Sans'] overflow-x-hidden selection:bg-blue-100">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Warning banner */}
      <div className="bg-red-50 text-red-800 px-4 py-3 text-sm flex items-center justify-center gap-3 text-center">
        <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
        <p>
          <strong>Aviso Importante:</strong> Esta ferramenta é educativa e não substitui consulta médica. Em emergência, ligue <strong>192 (SAMU)</strong>.
        </p>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20 lg:py-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero Column - 5 cols */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Projeto de Extensão Universitária
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Inter'] text-slate-900 leading-tight tracking-tight">
                Orienta <span className="text-blue-800">Saúde</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Alinhado à ODS 3 — Saúde e Bem-Estar. Avalie seus sintomas e descubra se você precisa de atendimento de urgência, consulta agendada ou autocuidado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-800 hover:bg-blue-900 text-white rounded-full px-8 py-6 text-lg h-auto font-['Inter'] shadow-lg shadow-blue-900/20 border-0">
                Começar triagem
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg h-auto font-['Inter'] border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent">
                Como funciona
              </Button>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3 text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm inline-flex">
                <div className="bg-[#E5F9E0] text-[#2E8B57] p-2 rounded-full">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Uso exclusivo para maiores de 18 anos</p>
                  <p className="text-xs">Foco na saúde do adulto.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column - 7 cols */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-['Inter'] text-slate-900">O seu mapa de cuidado</h2>
              <div className="flex items-center gap-2 text-sm font-medium text-[#2E8B57] bg-[#E5F9E0] px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                ~3 minutos
              </div>
            </div>

            <div className="relative">
              {/* Vertical line connector */}
              <div className="absolute left-6 md:left-8 top-8 bottom-8 w-0.5 bg-slate-100 rounded-full hidden sm:block"></div>

              <div className="space-y-6 relative">
                
                {/* Step 1 */}
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-50 border-4 border-white rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E5F9E0] text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">1</span>
                    <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-blue-800" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-lg font-bold font-['Inter'] text-slate-900">Consentimento LGPD</h3>
                    <p className="text-sm text-slate-500 mt-1">Seus dados estão seguros e não são armazenados.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-50 border-4 border-white rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E5F9E0] text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">2</span>
                    <User className="w-6 h-6 md:w-8 md:h-8 text-blue-800" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-lg font-bold font-['Inter'] text-slate-900">Você</h3>
                    <p className="text-sm text-slate-500 mt-1">Informações básicas para personalizar o atendimento.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-50 border-4 border-white rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E5F9E0] text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">3</span>
                    <Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-800" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-lg font-bold font-['Inter'] text-slate-900">Sintomas</h3>
                    <p className="text-sm text-slate-500 mt-1">O que você está sentindo no momento?</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-50 border-4 border-white rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E5F9E0] text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">4</span>
                    <PersonStanding className="w-6 h-6 md:w-8 md:h-8 text-blue-800" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-lg font-bold font-['Inter'] text-slate-900">Regiões do corpo</h3>
                    <p className="text-sm text-slate-500 mt-1">Onde os sintomas estão localizados?</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-50 border-4 border-white rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E5F9E0] text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">5</span>
                    <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-blue-800" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-lg font-bold font-['Inter'] text-slate-900">Entrevista breve</h3>
                    <p className="text-sm text-slate-500 mt-1">Algumas perguntas rápidas da nossa inteligência artificial.</p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 bg-blue-800 border-4 border-white rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E5F9E0] text-[#2E8B57] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">6</span>
                    <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-lg font-bold font-['Inter'] text-blue-900">Orientação</h3>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Seu nível de urgência e especialidade recomendada.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
