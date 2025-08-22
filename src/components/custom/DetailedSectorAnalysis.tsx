
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ComposedChart
} from 'recharts'

const COLORS = {
  primary: '#00A298', // PLBrasil
  dark: '#1D3C44',
  blue: '#3B82F6',
}

const pieData = [
  { name: 'Consultas Realizadas', value: 85, color: COLORS.primary },
  { name: 'Consultas Pendentes', value: 15, color: COLORS.dark },
]

const monthData = [
  { mes: 'Jan', atendimentos: 90 },
  { mes: 'Fev', atendimentos: 110 },
  { mes: 'Mar', atendimentos: 130 },
  { mes: 'Abr', atendimentos: 145 },
  { mes: 'Mai', atendimentos: 160 },
]

export function DetailedSectorAnalysis() {
  return (
    <div className="px-8 pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mt-8 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight">
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #00A298, #1D3C44)' }}
            >
              Análises Detalhadas por Setor
            </span>
          </h2>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[{t:'Total Consultas',v:'623'},{t:'Pacientes Ativos',v:'287'},{t:'Satisfação',v:'94%'}].map((kpi) => (
            <Card key={kpi.t} className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-600" />
              <CardContent className="pt-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">{kpi.t}</div>
                <div className="text-3xl font-bold text-teal-600">{kpi.v}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribuição • Medicina</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0)*100).toFixed(0)}%`}>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="atendimentos" fill={COLORS.primary} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Indicadores Executivos */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #00A298, #1D3C44)' }}>
                Indicadores Executivos
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Receita vs Custo + Margem */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Receita x Custo • Margem (%)</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    { mes: 'Jan', receita: 1200, custo: 780, margem: 35 },
                    { mes: 'Fev', receita: 1300, custo: 820, margem: 37 },
                    { mes: 'Mar', receita: 1480, custo: 920, margem: 38 },
                    { mes: 'Abr', receita: 1600, custo: 980, margem: 39 },
                    { mes: 'Mai', receita: 1720, custo: 1030, margem: 40 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="receita" name="Receita" fill={COLORS.primary} radius={[4,4,0,0]} />
                    <Bar yAxisId="left" dataKey="custo" name="Custo" fill={COLORS.dark} radius={[4,4,0,0]} />
                    <Line yAxisId="right" type="monotone" dataKey="margem" name="Margem" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Metas vs Realizado por Setor (horizontal) */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Atingimento por Setor</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { setor: 'Comercial', atingimento: 86 },
                      { setor: 'Medicina', atingimento: 92 },
                      { setor: 'Operações', atingimento: 81 },
                      { setor: 'Qualidade', atingimento: 88 },
                    ]}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis type="number" domain={[0, 100]} hide={false} />
                    <YAxis type="category" dataKey="setor" />
                    <Tooltip />
                    <Bar dataKey="atingimento" fill={COLORS.primary} radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* NPS Mensal */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">NPS • Últimos 6 meses</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { mes: 'Jan', nps: 64 },
                    { mes: 'Fev', nps: 68 },
                    { mes: 'Mar', nps: 72 },
                    { mes: 'Abr', nps: 74 },
                    { mes: 'Mai', nps: 77 },
                    { mes: 'Jun', nps: 80 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="nps" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Absenteísmo & Turnover */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Absenteísmo x Turnover (%)</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { mes: 'Jan', abs: 3.2, turn: 1.1 },
                    { mes: 'Fev', abs: 2.9, turn: 1.3 },
                    { mes: 'Mar', abs: 3.1, turn: 1.0 },
                    { mes: 'Abr', abs: 2.7, turn: 0.9 },
                    { mes: 'Mai', abs: 2.5, turn: 0.8 },
                    { mes: 'Jun', abs: 2.3, turn: 0.7 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="abs" name="Absenteísmo" stroke={COLORS.dark} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="turn" name="Turnover" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* SLA Atendimento (Stack) */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">SLA de Atendimento</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { mes: 'Jan', dentro: 78, fora: 22 },
                    { mes: 'Fev', dentro: 81, fora: 19 },
                    { mes: 'Mar', dentro: 84, fora: 16 },
                    { mes: 'Abr', dentro: 86, fora: 14 },
                    { mes: 'Mai', dentro: 88, fora: 12 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="dentro" stackId="sla" name="Dentro do SLA" fill={COLORS.primary} radius={[4,4,0,0]} />
                    <Bar dataKey="fora" stackId="sla" name="Fora do SLA" fill={COLORS.dark} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alocação CAPEX/OPEX (donuts) */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alocação CAPEX / OPEX</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6" style={{ height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={[{name:'CAPEX',value:35},{name:'OPEX',value:65}]} innerRadius={40} outerRadius={70} dataKey="value">
                      <Cell fill={COLORS.primary} />
                      <Cell fill={COLORS.dark} />
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Orçado vs Real</div>
                    <div className="text-3xl font-bold text-teal-600">94%</div>
                    <div className="text-xs text-muted-foreground">Aderência ao orçamento</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comercial & Medicina • Indicadores Integrados */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #00A298, #1D3C44)' }}>
                Comercial & Medicina • Indicadores Integrados
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Conversão Comercial vs Taxa de Alta (Composed) */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Conversão Comercial x Altas Médicas</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    { mes: 'Jan', conversao: 32, altas: 68, meta: 70 },
                    { mes: 'Fev', conversao: 34, altas: 66, meta: 72 },
                    { mes: 'Mar', conversao: 36, altas: 70, meta: 74 },
                    { mes: 'Abr', conversao: 38, altas: 69, meta: 75 },
                    { mes: 'Mai', conversao: 41, altas: 73, meta: 76 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversao" name="Conversão (%)" fill={COLORS.primary} radius={[4,4,0,0]} />
                    <Bar dataKey="altas" name="Altas (%)" fill={COLORS.dark} radius={[4,4,0,0]} />
                    <Line type="monotone" dataKey="meta" name="Meta (%)" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Receita por Linha de Serviço (Stacked) */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Receita por Linha de Serviço</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { servico: 'Clínicas', comercial: 420, medicina: 310 },
                    { servico: 'Ocupacional', comercial: 380, medicina: 260 },
                    { servico: 'Exames', comercial: 300, medicina: 290 },
                    { servico: 'Telemed', comercial: 200, medicina: 240 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="servico" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="comercial" name="Comercial" stackId="rps" fill={COLORS.primary} radius={[4,4,0,0]} />
                    <Bar dataKey="medicina" name="Medicina" stackId="rps" fill={COLORS.dark} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tempo Médio de Atendimento */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tempo Médio de Atendimento (min)</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { mes: 'Jan', tma: 28 },
                    { mes: 'Fev', tma: 27 },
                    { mes: 'Mar', tma: 26 },
                    { mes: 'Abr', tma: 25 },
                    { mes: 'Mai', tma: 24 },
                    { mes: 'Jun', tma: 23 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tma" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


