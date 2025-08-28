import { useState } from 'react'
import { X, UserPlus, ChevronRight, TrendingUp, Users, Target, Award, Calendar, Activity, FileText, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoute } from '@/lib/utils'

interface NovoCadastroModalProps {
  isOpen: boolean
  onClose: () => void
}

type CadastroCategory = 'receita' | 'clientes' | 'metas' | 'satisfacao' | 'agendamentos' | 'exames' | 'ocorrencias' | null

export function NovoCadastroModal({ isOpen, onClose }: NovoCadastroModalProps) {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState<CadastroCategory>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Verificar se é perfil de medicina
  const isMedicinaProfile = getUserRoute(user?.email || null) === '/medicina'
  
  // Estados para Receita
  const [valorReceita, setValorReceita] = useState('')
  const [setor, setSetor] = useState('')
  const [mesReferencia, setMesReferencia] = useState('')
  
  // Estados para Clientes
  const [quantidadeClientes, setQuantidadeClientes] = useState('')
  const [tipoCliente, setTipoCliente] = useState('')
  
  // Estados para Metas
  const [valorMeta, setValorMeta] = useState('')
  const [setorMeta, setSetorMeta] = useState('')
  const [periodoMeta, setPeriodoMeta] = useState('')
  
  // Estados para Satisfação
  const [percentualSatisfacao, setPercentualSatisfacao] = useState('')
  const [categoriaAvaliacao, setCategoriaAvaliacao] = useState('')
  const [mesAvaliacao, setMesAvaliacao] = useState('')
  
  // Estados para Agendamentos (medicina)
  const [quantidadeAgendamentos, setQuantidadeAgendamentos] = useState('')
  const [dataAgendamento, setDataAgendamento] = useState('')
  
  // Estados para Exames (medicina)
  const [tiposExameSelecionados, setTiposExameSelecionados] = useState<string[]>([])
  const [quantidadesExames, setQuantidadesExames] = useState<Record<string, string>>({})
  const [dataExame, setDataExame] = useState('')
  
  // Estados para Ocorrências (medicina)
  const [tiposOcorrenciaSelecionados, setTiposOcorrenciaSelecionados] = useState<string[]>([])
  const [descricoesOcorrencias, setDescricoesOcorrencias] = useState<Record<string, string>>({})
  const [dataOcorrencia, setDataOcorrencia] = useState('')

  if (!isOpen) return null
  
  // Função para lidar com seleção múltipla de tipos de exame
  const handleTipoExameChange = (tipo: string) => {
    setTiposExameSelecionados(prev => {
      if (prev.includes(tipo)) {
        // Remover tipo e sua quantidade
        setQuantidadesExames(prevQtd => {
          const novasQtd = { ...prevQtd }
          delete novasQtd[tipo]
          return novasQtd
        })
        return prev.filter(t => t !== tipo)
      } else {
        return [...prev, tipo]
      }
    })
  }
  
  // Função para lidar com mudança de quantidade por tipo
  const handleQuantidadeExameChange = (tipo: string, quantidade: string) => {
    setQuantidadesExames(prev => ({
      ...prev,
      [tipo]: quantidade
    }))
  }

  // Função para lidar com seleção múltipla de tipos de ocorrência
  const handleTipoOcorrenciaChange = (tipo: string) => {
    setTiposOcorrenciaSelecionados(prev => {
      if (prev.includes(tipo)) {
        // Remover tipo e sua descrição
        setDescricoesOcorrencias(prevDesc => {
          const novasDesc = { ...prevDesc }
          delete novasDesc[tipo]
          return novasDesc
        })
        return prev.filter(t => t !== tipo)
      } else {
        return [...prev, tipo]
      }
    })
  }
  
  // Função para lidar com mudança de descrição por tipo
  const handleDescricaoOcorrenciaChange = (tipo: string, descricao: string) => {
    setDescricoesOcorrencias(prev => ({
      ...prev,
      [tipo]: descricao
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !activeCategory) {
      return
    }

    setIsLoading(true)
    
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      let docData: any = {
        categoria: activeCategory,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Dados específicos por categoria
      switch (activeCategory) {
        case 'receita':
          if (!valorReceita.trim() || !setor.trim()) return
          docData = {
            ...docData,
            valor: parseFloat(valorReceita),
            setor: setor.trim(),
            mesReferencia: mesReferencia || new Date().toISOString().slice(0, 7)
          }
          break
        case 'clientes':
          if (!quantidadeClientes.trim()) return
          docData = {
            ...docData,
            quantidade: parseInt(quantidadeClientes),
            tipoCliente: tipoCliente || 'Novos',
            mesReferencia: new Date().toISOString().slice(0, 7)
          }
          break
        case 'metas':
          if (!valorMeta.trim() || !setorMeta.trim()) return
          docData = {
            ...docData,
            valor: parseFloat(valorMeta),
            setor: setorMeta.trim(),
            periodo: periodoMeta || 'Mensal'
          }
          break
        case 'satisfacao':
          if (!percentualSatisfacao.trim()) return
          docData = {
            ...docData,
            percentual: parseFloat(percentualSatisfacao),
            categoria: categoriaAvaliacao || 'Geral',
            mesReferencia: mesAvaliacao || new Date().toISOString().slice(0, 7)
          }
          break
        case 'agendamentos':
          if (!quantidadeAgendamentos.trim()) return
          docData = {
            ...docData,
            quantidade: parseInt(quantidadeAgendamentos),
            dataReferencia: dataAgendamento || new Date().toISOString().slice(0, 10)
          }
          break
        case 'exames':
          if (tiposExameSelecionados.length === 0) return
          // Verificar se pelo menos um tipo tem quantidade preenchida
          const temQuantidade = tiposExameSelecionados.some(tipo => 
            quantidadesExames[tipo] && quantidadesExames[tipo].trim() !== ''
          )
          if (!temQuantidade) return
          
          // Criar objeto com tipos e quantidades
          const examesDetalhados = tiposExameSelecionados
            .filter(tipo => quantidadesExames[tipo] && quantidadesExames[tipo].trim() !== '')
            .map(tipo => ({
              tipo,
              quantidade: parseInt(quantidadesExames[tipo])
            }))
          
          docData = {
            ...docData,
            exames: examesDetalhados,
            totalExames: examesDetalhados.reduce((sum, exame) => sum + exame.quantidade, 0),
            dataReferencia: dataExame || new Date().toISOString().slice(0, 10)
          }
          break
        case 'ocorrencias':
          if (tiposOcorrenciaSelecionados.length === 0) return
          
          // Criar objeto com tipos e descrições
          const ocorrenciasDetalhadas = tiposOcorrenciaSelecionados.map(tipo => ({
            tipo,
            descricao: descricoesOcorrencias[tipo] || ''
          }))
          
          docData = {
            ...docData,
            ocorrencias: ocorrenciasDetalhadas,
            totalOcorrencias: ocorrenciasDetalhadas.length,
            dataOcorrencia: dataOcorrencia || new Date().toISOString().slice(0, 10)
          }
          break
      }
      
      await user.getIdToken()
      
      console.log('NovoCadastroModal: Salvando', activeCategory, 'no Firestore:', docData)
      const docRef = await addDoc(collection(db, 'dashboard_data'), docData)
      console.log('NovoCadastroModal:', activeCategory, 'salvo com ID:', docRef.id)
      
      handleClose()
      
    } catch (error) {
      console.error('Erro ao criar cadastro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setActiveCategory(null)
    setValorReceita('')
    setSetor('')
    setMesReferencia('')
    setQuantidadeClientes('')
    setTipoCliente('')
    setValorMeta('')
    setSetorMeta('')
    setPeriodoMeta('')
    setPercentualSatisfacao('')
    setCategoriaAvaliacao('')
    setMesAvaliacao('')
    setQuantidadeAgendamentos('')
    setDataAgendamento('')
    setTiposExameSelecionados([])
    setQuantidadesExames({})
    setDataExame('')
    setTiposOcorrenciaSelecionados([])
    setDescricoesOcorrencias({})
    setDataOcorrencia('')
    onClose()
  }

  const resetCategory = () => {
    setActiveCategory(null)
    setValorReceita('')
    setSetor('')
    setMesReferencia('')
    setQuantidadeClientes('')
    setTipoCliente('')
    setValorMeta('')
    setSetorMeta('')
    setPeriodoMeta('')
    setPercentualSatisfacao('')
    setCategoriaAvaliacao('')
    setMesAvaliacao('')
    setQuantidadeAgendamentos('')
    setDataAgendamento('')
    setTiposExameSelecionados([])
    setQuantidadesExames({})
    setDataExame('')
    setTiposOcorrenciaSelecionados([])
    setDescricoesOcorrencias({})
    setDataOcorrencia('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#00A298] to-[#1D3C44] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Novo Cadastro
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[#1D3C44] mb-2">
              Adicionar dados aos dashboards
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto rounded-full"></div>
          </div>

          {/* Seleção de Categoria */}
          {!activeCategory ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 text-center mb-4">
                Escolha o tipo de dado que deseja cadastrar:
              </p>
              
              {/* Botões de Categoria - Condicional para Medicina */}
              {isMedicinaProfile ? (
                <>
                  <button
                    onClick={() => setActiveCategory('agendamentos')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20">
                        <Calendar className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Agendamentos</p>
                        <p className="text-xs text-slate-500">Quantidade de agendamentos</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>

                  <button
                    onClick={() => setActiveCategory('exames')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Exames</p>
                        <p className="text-xs text-slate-500">Exames realizados</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>

                  <button
                    onClick={() => setActiveCategory('ocorrencias')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Ocorrências</p>
                        <p className="text-xs text-slate-500">Eventos e intercorrências</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveCategory('receita')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00A298]/10 flex items-center justify-center group-hover:bg-[#00A298]/20">
                        <TrendingUp className="w-5 h-5 text-[#00A298]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Receita</p>
                        <p className="text-xs text-slate-500">Valores por setor/mês</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>

                  <button
                    onClick={() => setActiveCategory('clientes')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1D3C44]/10 flex items-center justify-center group-hover:bg-[#1D3C44]/20">
                        <Users className="w-5 h-5 text-[#1D3C44]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Clientes</p>
                        <p className="text-xs text-slate-500">Quantidade de novos clientes</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>

                  <button
                    onClick={() => setActiveCategory('metas')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20">
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Metas</p>
                        <p className="text-xs text-slate-500">Definir metas por setor</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>

                  <button
                    onClick={() => setActiveCategory('satisfacao')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#00A298] hover:bg-[#00A298]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20">
                        <Award className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700">Satisfação</p>
                        <p className="text-xs text-slate-500">Índices de satisfação</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A298]" />
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Formulários Dinâmicos */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header da categoria ativa */}
              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={resetCategory}
                  className="text-[#00A298] hover:text-[#1D3C44] transition-colors text-sm mb-3 block mx-auto"
                >
                  ← Voltar às categorias
                </button>
                <h4 className="text-lg font-semibold text-[#1D3C44] capitalize">
                  Cadastrar {activeCategory}
                </h4>
                <div className="w-12 h-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto mt-2 rounded-full"></div>
              </div>

              {/* Campos por Categoria */}
              {activeCategory === 'receita' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Valor da Receita *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valorReceita}
                      onChange={(e) => setValorReceita(e.target.value)}
                      placeholder="Ex: 150000.00"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Setor *</label>
                    <select
                      value={setor}
                      onChange={(e) => setSetor(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    >
                      <option value="">Selecione o setor</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Operacoes">Operações</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mês de Referência</label>
                    <input
                      type="month"
                      value={mesReferencia}
                      onChange={(e) => setMesReferencia(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    />
                  </div>
                </>
              )}

              {activeCategory === 'clientes' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Quantidade de Novos Clientes *</label>
                    <input
                      type="number"
                      min="0"
                      value={quantidadeClientes}
                      onChange={(e) => setQuantidadeClientes(e.target.value)}
                      placeholder="Ex: 15"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Período</label>
                    <select
                      value={tipoCliente}
                      onChange={(e) => setTipoCliente(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    >
                      <option value="Mensal">Mensal</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mês/Período de Referência</label>
                    <input
                      type="month"
                      value={mesReferencia}
                      onChange={(e) => setMesReferencia(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    />
                  </div>
                </>
              )}

              {activeCategory === 'metas' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Valor da Meta *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valorMeta}
                      onChange={(e) => setValorMeta(e.target.value)}
                      placeholder="Ex: 100.00"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Setor *</label>
                    <select
                      value={setorMeta}
                      onChange={(e) => setSetorMeta(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    >
                      <option value="">Selecione o setor</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Operacoes">Operações</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Período</label>
                    <select
                      value={periodoMeta}
                      onChange={(e) => setPeriodoMeta(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    >
                      <option value="Mensal">Mensal</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                </>
              )}

              {activeCategory === 'satisfacao' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Percentual de Satisfação *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={percentualSatisfacao}
                      onChange={(e) => setPercentualSatisfacao(e.target.value)}
                      placeholder="Ex: 89.5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Categoria de Avaliação</label>
                    <select
                      value={categoriaAvaliacao}
                      onChange={(e) => setCategoriaAvaliacao(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    >
                      <option value="Geral">Satisfação Geral</option>
                      <option value="Atendimento">Atendimento</option>
                      <option value="Servicos">Serviços</option>
                      <option value="Infraestrutura">Infraestrutura</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mês de Avaliação</label>
                    <input
                      type="month"
                      value={mesAvaliacao}
                      onChange={(e) => setMesAvaliacao(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    />
                  </div>
                </>
              )}

              {activeCategory === 'agendamentos' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Quantidade de Agendamentos *</label>
                    <input
                      type="number"
                      min="0"
                      value={quantidadeAgendamentos}
                      onChange={(e) => setQuantidadeAgendamentos(e.target.value)}
                      placeholder="Ex: 24"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data</label>
                    <input
                      type="date"
                      value={dataAgendamento}
                      onChange={(e) => setDataAgendamento(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    />
                  </div>
                </>
              )}

              {activeCategory === 'exames' && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Tipos de Exames</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Admissional', 'Periódico', 'Demissional', 'Retorno'].map((tipo) => (
                        <label key={tipo} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={tiposExameSelecionados.includes(tipo)}
                            onChange={() => handleTipoExameChange(tipo)}
                            className="w-4 h-4 text-[#00A298] border-gray-300 rounded focus:ring-[#00A298] focus:ring-1"
                          />
                          <span className="text-xs text-slate-700">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Campos de quantidade para cada tipo selecionado */}
                  {tiposExameSelecionados.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">Quantidades *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {tiposExameSelecionados.map((tipo) => (
                          <div key={tipo} className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">{tipo}</label>
                            <input
                              type="number"
                              min="0"
                              value={quantidadesExames[tipo] || ''}
                              onChange={(e) => handleQuantidadeExameChange(tipo, e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-sm"
                              required
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Mostrar total compacto */}
                      {Object.values(quantidadesExames).some(qtd => qtd && qtd.trim() !== '') && (
                        <div className="text-xs text-[#00A298] bg-[#00A298]/5 p-2 rounded-lg text-center">
                          <strong>Total: {
                            Object.entries(quantidadesExames)
                              .filter(([_, qtd]) => qtd && qtd.trim() !== '')
                              .reduce((sum, [_, qtd]) => sum + parseInt(qtd || '0'), 0)
                          } exames</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data</label>
                    <input
                      type="date"
                      value={dataExame}
                      onChange={(e) => setDataExame(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200"
                    />
                  </div>
                </>
              )}

              {activeCategory === 'ocorrencias' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Tipos de Ocorrências</label>
                      <div className="space-y-1">
                        {['Ausência', 'Atraso', 'Equipamento'].map((tipo) => (
                          <label key={tipo} className="flex items-center gap-2 p-1.5 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={tiposOcorrenciaSelecionados.includes(tipo)}
                              onChange={() => handleTipoOcorrenciaChange(tipo)}
                              className="w-3 h-3 text-[#00A298] border-gray-300 rounded focus:ring-[#00A298] focus:ring-1"
                            />
                            <span className="text-xs text-slate-700">{tipo}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">&nbsp;</label>
                      <div className="space-y-1">
                        {['Emergência', 'Intercorrência', 'Outros'].map((tipo) => (
                          <label key={tipo} className="flex items-center gap-2 p-1.5 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={tiposOcorrenciaSelecionados.includes(tipo)}
                              onChange={() => handleTipoOcorrenciaChange(tipo)}
                              className="w-3 h-3 text-[#00A298] border-gray-300 rounded focus:ring-[#00A298] focus:ring-1"
                            />
                            <span className="text-xs text-slate-700">{tipo}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Campos de descrição para cada tipo selecionado */}
                  {tiposOcorrenciaSelecionados.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Descrições</label>
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {tiposOcorrenciaSelecionados.map((tipo) => (
                          <div key={tipo}>
                            <input
                              type="text"
                              value={descricoesOcorrencias[tipo] || ''}
                              onChange={(e) => handleDescricaoOcorrenciaChange(tipo, e.target.value)}
                              placeholder={`${tipo} - Descrição (opcional)`}
                              className="w-full px-2 py-1.5 rounded border border-gray-200 focus:border-[#00A298] focus:ring-1 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data</label>
                    <input
                      type="date"
                      value={dataOcorrencia}
                      onChange={(e) => setDataOcorrencia(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetCategory}
                  className="flex-1 border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] hover:from-[#00A298]/90 hover:to-[#1D3C44]/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </div>
            </form>
          )}

          {/* Botão de Cancelar quando não há categoria ativa */}
          {!activeCategory && (
            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}