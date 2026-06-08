import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Stethoscope, ArrowRight, Heart, Activity, CheckCircle2 } from "lucide-react";

export function ConversaAcolhedora() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-['Open_Sans'] flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap');
        :root {
          --primary: 215 100% 35%; /* Azul Clássico #0056B3 approx */
          --primary-foreground: 210 40% 98%;
          --accent: 152 69% 51%; /* Verde Menta #28C76F approx */
          --accent-foreground: 222.2 47.4% 11.2%;
        }
      `}} />

      <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#28C76F]" />
          <span className="font-['Inter'] font-semibold text-xl tracking-tight text-[#0F172A]">Orienta Saúde</span>
        </div>
        <div className="hidden md:flex gap-4">
          <a href="#como-funciona" className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors flex items-center">
            Como funciona
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
        
        {/* Banner 18+ */}
        <div className="mb-8 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">Para maiores de 18 anos</span>
        </div>

        <h1 className="font-['Inter'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight md:leading-tight tracking-tight mb-6">
          Como você está<br/> se sentindo hoje?
        </h1>
        
        <p className="text-lg md:text-xl text-[#475569] max-w-xl mx-auto mb-10 leading-relaxed">
          Selecione seus sintomas e nós te contamos qual o nível de cuidado faz sentido para você — em até 3 minutos.
        </p>

        <Button className="rounded-full bg-[#0056B3] hover:bg-[#004494] text-white text-lg h-14 px-8 md:px-12 shadow-md hover:shadow-lg transition-all" size="lg">
          Começar triagem
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Disclaimer integrado */}
        <div className="mt-8 bg-slate-100/50 p-4 rounded-2xl max-w-lg mx-auto border border-slate-200/50">
          <p className="text-sm text-slate-600 font-medium">
            Esta ferramenta é educativa e não substitui consulta médica. 
            <br/><span className="text-slate-800 font-semibold">Em emergência, ligue 192 (SAMU).</span>
          </p>
        </div>

        <div id="como-funciona" className="mt-24 w-full">
          <h2 className="font-['Inter'] text-2xl font-semibold text-[#0F172A] mb-8">O que você recebe</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white rounded-3xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#E5F9ED] flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-[#28C76F]" />
                </div>
                <h3 className="font-['Inter'] font-semibold text-lg mb-2">Nível de Urgência</h3>
                <p className="text-slate-600 text-sm">Saiba se deve procurar o pronto-socorro, agendar consulta ou se cuidar em casa.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-3xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#E5F9ED] flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-[#28C76F]" />
                </div>
                <h3 className="font-['Inter'] font-semibold text-lg mb-2">Especialidade</h3>
                <p className="text-slate-600 text-sm">Sugestão do melhor especialista médico para investigar seus sintomas.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-3xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#E5F9ED] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#28C76F]" />
                </div>
                <h3 className="font-['Inter'] font-semibold text-lg mb-2">Próximos Passos</h3>
                <p className="text-slate-600 text-sm">Orientações claras e baseadas em protocolos para agir com segurança.</p>
              </CardContent>
            </Card>
          </div>
        </div>

      </main>

      <footer className="w-full py-8 text-center text-slate-500 border-t border-slate-200 mt-12">
        <p className="text-sm font-medium mb-1">Projeto de Extensão Universitária</p>
        <p className="text-xs">Alinhado à ODS 3 — Saúde e Bem-Estar</p>
      </footer>
    </div>
  );
}
