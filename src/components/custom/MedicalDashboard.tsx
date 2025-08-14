import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// PLBrasil color palette from CLAUDE.md
const COLORS = {
  primary: '#00A298',   // Verde PLBrasil
  secondary: '#1D3C44', // Verde Escuro
  accent: '#AECECB',    // Verde Água
  background: '#FFFFFF',
  text: '#1D3C44'
}

// Dados baseados na imagem fornecida
const consultasData = [
  { name: 'Realizadas', value: 85, color: COLORS.primary },
  { name: 'Pendentes', value: 15, color: COLORS.secondary }
]

const evolucaoMensalData = [
  { mes: 'Jan', atendimentos: 95 },
  { mes: 'Fev', atendimentos: 132 },
  { mes: 'Mar', atendimentos: 168 },
  { mes: 'Abr', atendimentos: 179 },
  { mes: 'Mai', atendimentos: 185 }
]

const tendenciaSemanalData = [
  { dia: 'Seg', valor: 110 },
  { dia: 'Ter', dia2: 'Qua', valor: 125 },
  { dia: 'Qua', valor: 85 },
  { dia: 'Qui', valor: 178 },
  { dia: 'Sex', valor: 160 },
  { dia: 'Sáb', valor: 65 },
  { dia: 'Dom', valor: 45 }
]

const metasRealizadoData = [
  { name: 'Atingido', value: 75, color: COLORS.primary },
  { name: 'Pendente', value: 25, color: COLORS.secondary }
]

const analiseComparativaData = [
  { mes: 'Jan', valor: 115 },
  { mes: 'Fev', valor: 125 },
  { mes: 'Mar', valor: 135 },
  { mes: 'Abr', valor: 145 },
  { mes: 'Mai', valor: 155 },
  { mes: 'Jun', valor: 175 },
  { mes: 'Jul', valor: 185 },
  { mes: 'Ago', valor: 195 },
  { mes: 'Set', valor: 205 },
  { mes: 'Out', valor: 215 },
  { mes: 'Nov', valor: 225 },
  { mes: 'Dez', valor: 235 }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function MedicalDashboard() {
  return (
    <div className="space-y-6 p-6" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Total Consultas</CardDescription>
            <CardTitle className="text-3xl font-bold" style={{ color: COLORS.primary }}>623</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Pacientes Ativos</CardDescription>
            <CardTitle className="text-3xl font-bold" style={{ color: COLORS.primary }}>287</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Satisfação</CardDescription>
            <CardTitle className="text-3xl font-bold" style={{ color: COLORS.primary }}>94%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Primeira linha de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição - Medicina */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Distribuição - Medicina</CardTitle>
              <Badge variant="secondary" className="text-xs">Hoje</Badge>
            </div>
            <CardDescription className="text-xs">Visualização dos dados por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={consultasData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {consultasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Evolução Mensal</CardTitle>
              <Badge variant="secondary" className="text-xs">Últimos 5 meses</Badge>
            </div>
            <CardDescription className="text-xs">Acompanhamento do desempenho ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={evolucaoMensalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke={COLORS.text} fontSize={12} />
                <YAxis stroke={COLORS.text} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="atendimentos" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendência Semanal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">📈 Tendência Semanal</CardTitle>
            </div>
            <CardDescription className="text-xs">Performance dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tendenciaSemanalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="dia" stroke={COLORS.text} fontSize={10} />
                <YAxis stroke={COLORS.text} fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="valor" fill={COLORS.primary} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Metas vs Realizado */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">🎯 Metas vs Realizado</CardTitle>
            </div>
            <CardDescription className="text-xs">Comparativo mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={metasRealizadoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      {metasRealizadoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-lg font-bold" style={{ color: COLORS.primary }}>75%</p>
                <p className="text-xs text-gray-600">Atingido</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicadores */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">⚡ Indicadores</CardTitle>
            </div>
            <CardDescription className="text-xs">Métricas em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Taxa de Sucesso</span>
              <span className="font-bold" style={{ color: COLORS.primary }}>94%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Produtividade</span>
              <span className="font-bold text-green-600">+12%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Eficiência</span>
              <span className="font-bold" style={{ color: COLORS.primary }}>87%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise Comparativa Anual */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">📊 Análise Comparativa Anual</CardTitle>
            <Badge variant="outline" className="text-xs">2024</Badge>
          </div>
          <CardDescription className="text-xs">Comparação entre diferentes métricas ao longo do ano</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analiseComparativaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke={COLORS.text} fontSize={12} />
              <YAxis stroke={COLORS.text} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Seção adicional - Análises médicas avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Eficiência por Especialidade */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              ⚡ Tempo por Especialidade
            </CardTitle>
            <p className="text-xs text-muted-foreground">Tempo médio de atendimento por área médica</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { especialidade: 'Cardiologia', tempo: 25 },
                { especialidade: 'Neurologia', tempo: 35 },
                { especialidade: 'Pediatria', tempo: 20 },
                { especialidade: 'Ortopedia', tempo: 30 },
                { especialidade: 'Dermatologia', tempo: 15 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="especialidade" 
                  stroke={COLORS.text} 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke={COLORS.text} fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="tempo" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  name="Tempo (min)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Satisfação por Área */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              😊 Satisfação por Área
            </CardTitle>
            <p className="text-xs text-muted-foreground">Índice de satisfação dos pacientes</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[
                { area: 'Cardiologia', satisfacao: 96 },
                { area: 'Neurologia', satisfacao: 94 },
                { area: 'Pediatria', satisfacao: 98 },
                { area: 'Ortopedia', satisfacao: 92 },
                { area: 'Dermatologia', satisfacao: 95 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="area" 
                  stroke={COLORS.text} 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke={COLORS.text} fontSize={10} domain={[90, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="satisfacao" 
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }}
                  name="Satisfação (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPIs médicos específicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Taxa de Cura</p>
              <p className="text-xl font-bold" style={{ color: COLORS.primary }}>97.2%</p>
              <span className="text-xs font-medium text-green-600">+2.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: COLORS.secondary }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Readmissões</p>
              <p className="text-xl font-bold" style={{ color: COLORS.secondary }}>2.8%</p>
              <span className="text-xs font-medium text-red-600">-0.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: COLORS.accent }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Tempo Médio</p>
              <p className="text-xl font-bold" style={{ color: COLORS.accent }}>18 min</p>
              <span className="text-xs font-medium text-green-600">-3 min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#10b981' }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Emergências</p>
              <p className="text-xl font-bold" style={{ color: '#10b981' }}>45</p>
              <span className="text-xs font-medium text-orange-600">+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">NPS Médico</p>
              <p className="text-xl font-bold" style={{ color: '#f59e0b' }}>87</p>
              <span className="text-xs font-medium text-green-600">+5 pts</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
