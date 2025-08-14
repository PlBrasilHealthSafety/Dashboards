import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Dados exatos da segunda imagem
const metasData = [
  { mes: 'Jan', Comercial: 95, Medicina: 102, Meta: 100, Operacoes: 98 },
  { mes: 'Fev', Comercial: 88, Medicina: 105, Meta: 100, Operacoes: 95 },
  { mes: 'Mar', Comercial: 92, Medicina: 108, Meta: 100, Operacoes: 97 },
  { mes: 'Abr', Comercial: 105, Medicina: 112, Meta: 100, Operacoes: 103 },
  { mes: 'Mai', Comercial: 98, Medicina: 115, Meta: 100, Operacoes: 100 },
  { mes: 'Jun', Comercial: 110, Medicina: 118, Meta: 100, Operacoes: 105 },
  { mes: 'Jul', Comercial: 115, Medicina: 122, Meta: 100, Operacoes: 108 },
  { mes: 'Ago', Comercial: 118, Medicina: 125, Meta: 100, Operacoes: 112 },
  { mes: 'Set', Comercial: 122, Medicina: 128, Meta: 100, Operacoes: 115 },
  { mes: 'Out', Comercial: 125, Medicina: 132, Meta: 100, Operacoes: 118 },
  { mes: 'Nov', Comercial: 128, Medicina: 135, Meta: 100, Operacoes: 120 },
  { mes: 'Dez', Comercial: 130, Medicina: 138, Meta: 100, Operacoes: 122 }
];

const evolucaoTrimestralData = [
  { trimestre: 'T1', Administrativo: 2.8, Comercial: 3.2, Medicina: 3.8, Operacoes: 3.1 },
  { trimestre: 'T2', Administrativo: 3.1, Comercial: 3.5, Medicina: 4.1, Operacoes: 3.3 },
  { trimestre: 'T3', Administrativo: 3.4, Comercial: 3.8, Medicina: 4.4, Operacoes: 3.6 },
  { trimestre: 'T4', Administrativo: 3.7, Comercial: 4.1, Medicina: 4.7, Operacoes: 3.9 }
];

export const ExecutiveLayoutDashboard = () => {
  return (
    <div className="w-full bg-gradient-to-b from-transparent via-slate-50/80 to-slate-100/60">
      {/* Header compactado com filtros e branding PLBrasil */}
      <div className="mx-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-xl p-4 shadow border">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #00A298, #1D3C44)' }}
              >
                PLBrasil Health & Safety
              </span>
              {' '}• Visão Executiva
            </h2>
            <p className="text-xs text-muted-foreground">Consolidado de metas e indicadores por setor</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[2021, 2022, 2023, 2024, 2025].map((year) => (
              <button
                key={year}
                className={`px-3 py-1 rounded border text-sm transition-colors ${
                  year === 2025
                    ? 'bg-[hsl(174,100%,32%)] text-white border-transparent'
                    : 'bg-white text-foreground border-border hover:bg-muted'
                }`}
              >
                {year}
              </button>
            ))}
            <select className="px-2 py-1 rounded border text-sm">
              <option>Todos os Meses</option>
              <option>1º Trimestre</option>
              <option>2º Trimestre</option>
              <option>3º Trimestre</option>
              <option>4º Trimestre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gráfico Principal - Metas vs Realizado */}
      <Card className="mb-8 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h2 className="text-xl font-bold">Metas vs Realizado - 2025</h2>
          </div>
          <p className="text-gray-600 mb-6">Acompanhamento mensal de desempenho por setor comparado à meta estabelecida</p>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={metasData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="Comercial" fill="#1D3C44" name="Comercial" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Medicina" fill="#00A298" name="Medicina" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Meta" fill="#AECECB" name="Meta Trimestral" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Operacoes" fill="#3B82F6" name="Operações" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Seção Visão Executiva */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-teal-600 mb-2">Visão Executiva - Diretoria</h2>
        <p className="text-gray-600">Acompanhamento consolidado de KPIs e metas</p>
      </div>

      {/* Cards de KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="text-center p-6 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-600 mb-2">Receita Total</div>
          <div className="text-3xl font-bold text-blue-600">R$ 2.94M</div>
          <div className="text-sm text-green-600 mt-1">+11.2%</div>
        </Card>
        
        <Card className="text-center p-6 border-l-4 border-l-teal-500">
          <div className="text-sm text-gray-600 mb-2">Clientes Ativos</div>
          <div className="text-3xl font-bold text-teal-600">1,847</div>
          <div className="text-sm text-green-600 mt-1">+8.8%</div>
        </Card>
        
        <Card className="text-center p-6 border-l-4 border-l-green-500">
          <div className="text-sm text-gray-600 mb-2">Satisfação Geral</div>
          <div className="text-3xl font-bold text-green-600">90%</div>
          <div className="text-sm text-green-600 mt-1">+2.1%</div>
        </Card>
        
        <Card className="text-center p-6 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-600 mb-2">Eficiência Operacional</div>
          <div className="text-3xl font-bold text-purple-600">87%</div>
          <div className="text-sm text-green-600 mt-1">+3.7%</div>
        </Card>
      </div>

      {/* Gráfico de Evolução Trimestral */}
      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h2 className="text-xl font-bold">Evolução Trimestral por Setor</h2>
          </div>
          <p className="text-gray-600 mb-6">Receita normalizada de todos os setores ao longo do ano</p>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoTrimestralData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="trimestre" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Administrativo"
                stroke="#8B8B8B"
                strokeWidth={3}
                dot={{ fill: '#8B8B8B', strokeWidth: 2, r: 4 }}
                name="Administrativo"
              />
              <Line
                type="monotone"
                dataKey="Comercial"
                stroke="#1D3C44"
                strokeWidth={3}
                dot={{ fill: '#1D3C44', strokeWidth: 2, r: 4 }}
                name="Comercial"
              />
              <Line
                type="monotone"
                dataKey="Medicina"
                stroke="#00A298"
                strokeWidth={3}
                dot={{ fill: '#00A298', strokeWidth: 2, r: 4 }}
                name="Medicina"
              />
              <Line
                type="monotone"
                dataKey="Operacoes"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Operações"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
