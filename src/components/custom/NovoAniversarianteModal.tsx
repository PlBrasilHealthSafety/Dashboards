import { useState } from 'react'
import { X, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { FirestoreService } from '@/lib/firestore-services'

interface Aniversariante {
  nome: string
  dataAniversario: string | any // Pode ser string ou Timestamp do Firebase
  userId: string
}

interface NovoAniversarianteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NovoAniversarianteModal({ isOpen, onClose }: NovoAniversarianteModalProps) {
  const { user } = useAuth()
  const [nome, setNome] = useState('')
  const [dataAniversario, setDataAniversario] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const aniversariantesService = new FirestoreService<Aniversariante>('aniversariantes')

  const checkForDuplicates = async (nome: string, dataAniversario: string): Promise<boolean> => {
    try {
      // Normalizar o nome para comparação case-insensitive
      const normalizedNome = nome.trim().toLowerCase()

      // Buscar todos os aniversariantes
      const allAniversariantes = await aniversariantesService.getAll()
      console.log('NovoAniversarianteModal: Aniversariantes encontrados:', allAniversariantes.length)

      // Verificar se já existe um aniversariante com o mesmo nome E data
      const duplicateExists = allAniversariantes.some(aniversariante => {
        const existingNome = aniversariante.nome.toLowerCase()
        
        // Converter a data do Firebase para comparação
        let existingData: string
        if (typeof aniversariante.dataAniversario === 'string') {
          existingData = aniversariante.dataAniversario.split('T')[0]
        } else if (aniversariante.dataAniversario?.toDate) {
          const date = aniversariante.dataAniversario.toDate()
          existingData = date.toISOString().split('T')[0]
        } else {
          const date = new Date(aniversariante.dataAniversario)
          existingData = date.toISOString().split('T')[0]
        }
        
        const isDuplicate = existingNome === normalizedNome && existingData === dataAniversario
        if (isDuplicate) {
          console.log('NovoAniversarianteModal: Duplicata encontrada:', { existingNome, normalizedNome, existingData, dataAniversario })
        }
        
        return isDuplicate
      })

      return duplicateExists
    } catch (error) {
      console.error('Erro ao verificar duplicatas:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !nome.trim() || !dataAniversario.trim()) {
      console.log('NovoAniversarianteModal: Dados inválidos', { user: !!user, nome: nome.trim(), dataAniversario: dataAniversario.trim() })
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      console.log('NovoAniversarianteModal: Iniciando cadastro para:', { nome: nome.trim(), dataAniversario })
      
      // Verificar se já existe um aniversariante com os mesmos dados
      const isDuplicate = await checkForDuplicates(nome, dataAniversario)
      console.log('NovoAniversarianteModal: Resultado da verificação de duplicatas:', isDuplicate)
      
      if (isDuplicate) {
        console.log('NovoAniversarianteModal: Duplicata encontrada, cancelando cadastro')
        setError('Já existe um aniversariante cadastrado com esse nome e data. Por favor, verifique os dados.')
        setIsLoading(false)
        return
      }

      console.log('NovoAniversarianteModal: Nenhuma duplicata encontrada, prosseguindo com o cadastro')

      // Verificar se o usuário tem um token válido
      await user.getIdToken()
      
      // Converter a data para timestamp do Firebase
      const dataTimestamp = new Date(dataAniversario.trim())
      
      const docData = {
        nome: nome.trim(),
        dataAniversario: dataTimestamp.toISOString(),
        userId: user.uid,
      }
      
      // Salvar no Firestore
      console.log('NovoAniversarianteModal: Salvando aniversariante no Firestore:', docData)
      const docId = await aniversariantesService.create(docData)
      console.log('NovoAniversarianteModal: Aniversariante salvo com sucesso! ID:', docId)
      
      // Limpar campos e fechar modal
      setNome('')
      setDataAniversario('')
      setError('')
      onClose()
      
    } catch (error) {
      console.error('NovoAniversarianteModal: Erro ao criar aniversariante:', error)
      setError('Erro ao cadastrar aniversariante. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNome('')
    setDataAniversario('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A298] to-[#1D3C44] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D3C44]">
              Novo Aniversariante
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensagem de boas-vindas */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[#1D3C44] mb-2">
              Cadastrar Aniversariante do Mês 🎂
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto rounded-full"></div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <User className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">
                  Aniversariante duplicado
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Campo Nome */}
          <div className="space-y-2">
            <label 
              htmlFor="nome" 
              className="text-sm font-medium text-slate-700"
            >
              Nome Completo *
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Digite o nome completo"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Campo Data de Aniversário */}
          <div className="space-y-2">
            <label 
              htmlFor="dataAniversario" 
              className="text-sm font-medium text-slate-700"
            >
              Data de Aniversário *
            </label>
            <input
              id="dataAniversario"
              type="date"
              value={dataAniversario}
              onChange={(e) => setDataAniversario(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-200 text-slate-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !nome.trim() || !dataAniversario.trim()}
              className="flex-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] hover:from-[#00A298]/90 hover:to-[#1D3C44]/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Aniversariante'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}