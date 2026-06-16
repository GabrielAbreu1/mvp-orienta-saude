import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Users,
  HeartPulse,
  ArrowLeft,
  MessageSquare,
  Activity,
} from "lucide-react";
import { Link } from "wouter";

interface StatsData {
  total: number;
  mediaEstrelas: number;
  percentualUtil: number;
  distribuicaoEstrelas: { estrelas: number; qty: number }[];
  porRiskLevel: { riskLevel: string | null; qty: number }[];
  porEspecialidade: { especialidade: string | null; qty: number }[];
  porSource: { source: string | null; qty: number }[];
  comentarios: {
    comentario: string | null;
    estrelas: number;
    util: boolean;
    data: string;
  }[];
}

const RISK_LABELS: Record<string, string> = {
  low: "Baixa",
  medium: "Moderada",
  high: "Alta",
  emergency: "Emergência",
};

const RISK_COLORS: Record<string, string> = {
  low: "#2e8b57",
  medium: "#f59e0b",
  high: "#e53e3e",
  emergency: "#9b2c2c",
};

const SOURCE_LABELS: Record<string, string> = {
  rule_engine: "Motor de Regras",
  ai: "Inteligência Artificial",
};

const BLUE = "#1B4D3E";
const GREEN = "#2e8b57";
const PIE_COLORS = [GREEN, "#e53e3e"];

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#1B4D3E]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#1B4D3E]" />
      </div>
      <div>
        <p className="text-2xl font-['Inter'] font-bold text-[#1A202C]">{value}</p>
        <p className="text-sm font-semibold text-[#2D3748] font-['Inter']">{label}</p>
        {sub && <p className="text-xs text-[#718096] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StarRow({ estrelas }: { estrelas: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${
            n <= estrelas
              ? "text-[#f59e0b] fill-[#f59e0b]"
              : "text-[#e2e8f0]"
          }`}
        />
      ))}
    </span>
  );
}

export default function Stats() {
  const { data, isLoading, isError } = useQuery<StatsData>({
    queryKey: ["feedbacks-stats"],
    queryFn: async () => {
      const res = await fetch("/api/feedbacks/stats");
      if (!res.ok) throw new Error("Erro ao buscar estatísticas");
      return res.json();
    },
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Open_Sans']">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="text-[#1B4D3E] w-6 h-6" />
            <span className="font-['Inter'] font-bold text-[#1A202C] text-lg">
              Orienta Saúde
            </span>
            <span className="text-[#a0aec0] text-sm hidden sm:inline">/ Estatísticas</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#1B4D3E] font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-['Inter'] font-bold text-3xl text-[#1A202C] mb-2">
            Feedbacks dos usuários
          </h1>
          <p className="text-[#4A5568] text-base leading-relaxed">
            Dados anônimos coletados ao final de cada triagem. Nenhuma informação clínica é armazenada.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-[#fff5f5] border border-red-200 rounded-2xl p-6 text-center text-[#9c4221]">
            Não foi possível carregar as estatísticas. Tente novamente em instantes.
          </div>
        )}

        {data && data.total === 0 && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#a0aec0] mx-auto mb-4" />
            <p className="text-[#4A5568] font-semibold text-lg font-['Inter']">Nenhum feedback ainda.</p>
            <p className="text-[#718096] text-sm mt-1">Os dados aparecerão aqui conforme usuários completarem a triagem.</p>
          </div>
        )}

        {data && data.total > 0 && (
          <div className="space-y-8">
            {/* Cards de resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Avaliações"
                value={data.total}
                icon={Users}
                sub="total de feedbacks"
              />
              <StatCard
                label="Média de estrelas"
                value={`${data.mediaEstrelas} / 5`}
                icon={Star}
              />
              <StatCard
                label="Acharam útil"
                value={`${data.percentualUtil}%`}
                icon={ThumbsUp}
              />
              <StatCard
                label="Com comentário"
                value={data.comentarios.length}
                icon={MessageSquare}
                sub="respostas textuais"
              />
            </div>

            {/* Gráficos linha 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Distribuição de estrelas */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h2 className="font-['Inter'] font-bold text-base text-[#1A202C] mb-4">
                  Distribuição de estrelas
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[1, 2, 3, 4, 5].map((n) => ({
                      name: `${n}★`,
                      qty:
                        data.distribuicaoEstrelas.find((d) => d.estrelas === n)
                          ?.qty ?? 0,
                    }))}
                    barSize={36}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`${v} avaliações`, ""]} />
                    <Bar dataKey="qty" fill={BLUE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Útil ou não */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h2 className="font-['Inter'] font-bold text-base text-[#1A202C] mb-4">
                  Orientação foi útil?
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Sim, ajudou", value: Math.round((data.percentualUtil / 100) * data.total) },
                        { name: "Não muito", value: data.total - Math.round((data.percentualUtil / 100) * data.total) },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {PIE_COLORS.map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} respostas`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-[#4A5568]">
                    <ThumbsUp className="w-4 h-4 text-[#2e8b57]" />
                    {data.percentualUtil}% útil
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[#4A5568]">
                    <ThumbsDown className="w-4 h-4 text-[#e53e3e]" />
                    {100 - data.percentualUtil}% não
                  </span>
                </div>
              </div>
            </div>

            {/* Gráficos linha 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nível de urgência */}
              {data.porRiskLevel.length > 0 && (
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                  <h2 className="font-['Inter'] font-bold text-base text-[#1A202C] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#1B4D3E]" />
                    Nível de urgência
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={data.porRiskLevel.map((r) => ({
                        name: RISK_LABELS[r.riskLevel ?? ""] ?? r.riskLevel,
                        qty: r.qty,
                        color: RISK_COLORS[r.riskLevel ?? ""] ?? BLUE,
                      }))}
                      barSize={36}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [`${v} avaliações`, ""]} />
                      <Bar dataKey="qty" radius={[6, 6, 0, 0]}>
                        {data.porRiskLevel.map((r, i) => (
                          <Cell key={i} fill={RISK_COLORS[r.riskLevel ?? ""] ?? BLUE} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Fonte: IA vs Motor */}
              {data.porSource.length > 0 && (
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                  <h2 className="font-['Inter'] font-bold text-base text-[#1A202C] mb-4">
                    Fonte da orientação
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={data.porSource.map((s) => ({
                        name: SOURCE_LABELS[s.source ?? ""] ?? s.source,
                        qty: s.qty,
                      }))}
                      barSize={50}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [`${v} avaliações`, ""]} />
                      <Bar dataKey="qty" radius={[6, 6, 0, 0]}>
                        <Cell fill={BLUE} />
                        <Cell fill={GREEN} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top especialidades */}
            {data.porEspecialidade.length > 0 && (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h2 className="font-['Inter'] font-bold text-base text-[#1A202C] mb-4">
                  Especialidades mais orientadas
                </h2>
                <div className="space-y-3">
                  {data.porEspecialidade.map((e, i) => {
                    const max = data.porEspecialidade[0]?.qty ?? 1;
                    const pct = Math.round((e.qty / max) * 100);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-[#4A5568] w-44 shrink-0 truncate">
                          {e.especialidade}
                        </span>
                        <div className="flex-1 bg-[#f0f4f8] rounded-full h-3 overflow-hidden">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: BLUE }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#2D3748] w-6 text-right">
                          {e.qty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comentários */}
            {data.comentarios.length > 0 && (
              <div>
                <h2 className="font-['Inter'] font-bold text-xl text-[#1A202C] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1B4D3E]" />
                  Comentários dos usuários
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.comentarios.map((c, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <StarRow estrelas={c.estrelas} />
                        <span className="text-xs text-[#a0aec0]">
                          {new Date(c.data).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-sm text-[#2D3748] leading-relaxed">
                        "{c.comentario}"
                      </p>
                      <span
                        className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.util
                            ? "bg-[#e6f4f1] text-[#2e8b57]"
                            : "bg-[#fffaf0] text-[#dd6b20]"
                        }`}
                      >
                        {c.util ? "👍 Achou útil" : "👎 Não achou útil"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[#e2e8f0] bg-white py-6 mt-12">
        <p className="text-center text-xs text-[#a0aec0]">
          Dados anônimos · Nenhuma informação clínica armazenada · Orienta Saúde © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

