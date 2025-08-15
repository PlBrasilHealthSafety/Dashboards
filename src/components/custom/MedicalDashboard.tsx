import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Cores exatas da imagem
const COLORS = {
  primary: '#00A298',    // Verde agua (Consultas Realizadas)
  secondary: '#1D3C44',  // Azul escuro (Consultas Pendentes)
  tertiary: '#4A90E2',   // Azul (Operações)
  quaternary: '#F5A623', // Laranja (Meta Trimestral)
};

// Dados baseados na primeira imagem
const consultasData = [
  { name: 'Consultas Realizadas', value: 85, color: COLORS.primary },
  { name: 'Consultas Pendentes', value: 15, color: COLORS.secondary }
];

const evolucaoMensalData = [
  { mes: 'Jan', atendimentos: 90 },
  { mes: 'Fev', atendimentos: 110 },
  { mes: 'Mar', atendimentos: 130 },
  { mes: 'Abr', atendimentos: 145 },
  { mes: 'Mai', atendimentos: 160 }
];

const tendenciaSemanalData = [
  { dia: 'Seg', valor: 180 },
  { dia: 'Ter', valor: 135 },
  { dia: 'Qua', valor: 90 },
  { dia: 'Qui', valor: 165 },
  { dia: 'Sex', valor: 195 },
  { dia: 'Sáb', valor: 45 },
  { dia: 'Dom', valor: 0 }
];

const metasRealizadoData = [
  { setor: 'Medicina', meta: 75, realizado: 94 },
  { setor: 'Comercial', meta: 80, realizado: 87 },
  { setor: 'Operações', meta: 85, realizado: 91 }
];

const anualData = [
  { mes: 'Jan', valor: 115 },
  { mes: 'Fev', valor: 125 },
  { mes: 'Mar', valor: 135 },
  { mes: 'Abr', valor: 145 },
  { mes: 'Mai', valor: 155 },
  { mes: 'Jun', valor: 165 },
  { mes: 'Jul', valor: 175 },
  { mes: 'Ago', valor: 185 },
  { mes: 'Set', valor: 195 },
  { mes: 'Out', valor: 205 },
  { mes: 'Nov', valor: 215 },
  { mes: 'Dez', valor: 225 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Slide exatamente como na primeira imagem
export const MedicalOverviewSlide = () => {
  return (
    <div className="bg-white p-8 rounded-xl h-full space-y-6">
      {/* KPIs do topo - exatamente como na imagem */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-center bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Total Consultas</div>
          <div className="text-4xl font-bold text-cyan-600">623</div>
        </div>
        <div className="text-center bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Pacientes Ativos</div>
          <div className="text-4xl font-bold text-cyan-600">287</div>
        </div>
        <div className="text-center bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Satisfacao</div>
          <div className="text-4xl font-bold text-cyan-600">94%</div>
        </div>
      </div>

      {/* Seção principal com 2 gráficos lado a lado */}
      <div className="grid grid-cols-2 gap-8">
        {/* Distribuição - Medicina com gráfico pizza */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-semibold">Mapa</div>
              <CardTitle className="text-lg">Distribuição - Medicina</CardTitle>
            </div>
            <CardDescription>Visualização dos dados por categoria</CardDescription>
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
                >
                  {consultasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução Mensal com gráfico barras */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-semibold">Últimos 5 meses</div>
              <CardTitle className="text-lg">Evolução Mensal</CardTitle>
            </div>
            <CardDescription>Acompanhamento do desempenho ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={evolucaoMensalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="atendimentos" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Seção inferior com 3 blocos - como na imagem original */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Tendência Semanal */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <CardTitle className="text-base">Tendência Semanal</CardTitle>
            </div>
            <CardDescription className="text-xs">Performance dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={tendenciaSemanalData.slice(0, 4)}>
                <XAxis dataKey="dia" fontSize={10} />
                <YAxis fontSize={10} />
                <Bar dataKey="valor" fill={COLORS.primary} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Metas vs Realizado */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <CardTitle className="text-base">Metas vs Realizado</CardTitle>
            </div>
            <CardDescription className="text-xs">Comparativo mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">75%</div>
              <div className="text-xs text-gray-600">Atingido</div>
              <div className="text-xs text-gray-600 mt-2">Pendente 25%</div>
            </div>
          </CardContent>
        </Card>

        {/* Indicadores */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <CardTitle className="text-base">Indicadores</CardTitle>
            </div>
            <CardDescription className="text-xs">Métricas em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">Taxa de Sucesso</span>
                <span className="text-sm font-bold text-cyan-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Produtividade</span>
                <span className="text-sm font-bold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Eficiência</span>
                <span className="text-sm font-bold text-cyan-600">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Slide para Tendência Semanal
export const WeeklyTrendSlide = () => {
  return (
    <div className="bg-white p-8 rounded-xl h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <h2 className="text-2xl font-bold">Tendência Semanal</h2>
      </div>
      <p className="text-gray-600 mb-8">Performance dos últimos 7 dias</p>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={tendenciaSemanalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Slide para Metas vs Realizado
export const GoalsVsActualSlide = () => {
  return (
    <div className="bg-white p-8 rounded-xl h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <h2 className="text-2xl font-bold">Metas vs Realizado</h2>
      </div>
      <p className="text-gray-600 mb-8">Comparativo mensal</p>
      
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={[
              { name: 'Atingido', value: 75, color: COLORS.primary },
              { name: 'Pendente', value: 25, color: COLORS.secondary }
            ]}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            <Cell fill={COLORS.primary} />
            <Cell fill={COLORS.secondary} />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="text-center mt-4">
        <p className="text-3xl font-bold text-cyan-600">75%</p>
        <p className="text-gray-600">Taxa de Sucesso</p>
      </div>
    </div>
  );
};

// Slide para Indicadores
export const IndicatorsSlide = () => {
  const indicadores = [
    { nome: 'Taxa de Sucesso', valor: '94%' },
    { nome: 'Produtividade', valor: '+12%' },
    { nome: 'Eficiência', valor: '87%' }
  ];

  return (
    <div className="bg-white p-8 rounded-xl h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <h2 className="text-2xl font-bold">Indicadores</h2>
      </div>
      <p className="text-gray-600 mb-8">Métricas em tempo real</p>
      
      <div className="grid grid-cols-3 gap-8 h-64">
        {indicadores.map((item, index) => (
          <div key={index} className="text-center bg-gray-50 rounded-lg p-6 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-2">{item.nome}</div>
            <div className="text-5xl font-bold text-cyan-600">{item.valor}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Slide para Análise Anual
export const AnnualAnalysisSlide = () => {
  return (
    <div className="bg-white p-8 rounded-xl h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <h2 className="text-2xl font-bold">Análise Comparativa Anual</h2>
        <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded">2024</div>
      </div>
      <p className="text-gray-600 mb-8">Comparação entre diferentes métricas ao longo do ano</p>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={anualData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
