import { useState } from 'react'
import { X, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { FirestoreService } from '@/lib/firestore-services'
import type { Contrato } from '@/lib/types'

interface NovoContratoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NovoContratoModal({ isOpen, onClose }: NovoContratoModalProps) {
  const { user } = useAuth()
  const [razaoSocial, setRazaoSocial] = useState('')
  const [nomeFantasia, setNomeFantasia] = useState('')
  const [dataInicioContrato, setDataInicioContrato] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const contratoService = new FirestoreService<Contrato>('contratos')

  if (!isOpen) return null



  const checkForDuplicates = async (razaoSocial: string, nomeFantasia: string): Promise<boolean> => {
    try {
      // Normalizar os valores de entrada para comparação case-insensitive
      const normalizedRazaoSocial = razaoSocial.trim().toLowerCase()
      const normalizedNomeFantasia = nomeFantasia.trim().toLowerCase()

      // Buscar todos os contratos (como não podemos fazer consulta case-insensitive no Firestore)
      // Vamos buscar todos e filtrar no cliente
      const allContratos = await contratoService.getAll()

      // Verificar se já existe um contrato com a mesma razão social E nome fantasia (case-insensitive)
      const duplicateExists = allContratos.some(contrato => {
        const existingRazaoSocial = contrato.razaoSocial.toLowerCase()
        const existingNomeFantasia = contrato.nomeFantasia.toLowerCase()
        
        return existingRazaoSocial === normalizedRazaoSocial && 
               existingNomeFantasia === normalizedNomeFantasia
      })

      return duplicateExists
    } catch (error) {
      console.error('Erro ao verificar duplicatas:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !razaoSocial.trim() || !nomeFantasia.trim() || !dataInicioContrato.trim()) {
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // Verificar se já existe um contrato com os mesmos dados
      const isDuplicate = await checkForDuplicates(razaoSocial, nomeFantasia)
      
      if (isDuplicate) {
        setError('Já existe um contrato cadastrado com essa Razão Social e Nome Fantasia (independente de maiúsculas/minúsculas). Por favor, verifique os dados.')
        setIsLoading(false)
        return
      }

      // Verificar se o usuário tem um token válido
      await user.getIdToken()
      
      const docData = {
        razaoSocial: razaoSocial.trim(),
        nomeFantasia: nomeFantasia.trim(),
        dataInicioContrato: dataInicioContrato.trim(),
        userId: user.uid,
        displayedOnTV: false, // Novo campo para controlar exibição na TV
      }
      
      // Salvar no Firestore usando o serviço - a TV detectará automaticamente
      console.log('NovoContratoModal: Salvando contrato no Firestore:', docData)
      const docId = await contratoService.create(docData)
      console.log('NovoContratoModal: Contrato salvo com ID:', docId)
      
      // Limpar campos e fechar modal
      setRazaoSocial('')
      setNomeFantasia('')
      setDataInicioContrato('')
      setError('')
      onClose()
      
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      setError('Erro ao criar contrato. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRazaoSocial('')
    setNomeFantasia('')
    setDataInicioContrato('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00A298] to-[#1D3C44] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Novo Contrato
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensagem de boas-vindas */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[#1D3C44] mb-2">
              O mais novo cliente da PLBrasil
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto rounded-full"></div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">
                  Contrato duplicado
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Campo Razão Social */}
          <div className="space-y-2">
            <label 
              htmlFor="razaoSocial" 
              className="text-sm font-medium text-slate-700"
            >
              Razão Social *
            </label>
            <input
              id="razaoSocial"
              type="text"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              placeholder="Digite a razão social da empresa"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          {/* Campo Nome Fantasia */}
          <div className="space-y-2">
            <label 
              htmlFor="nomeFantasia" 
              className="text-sm font-medium text-slate-700"
            >
              Nome Fantasia *
            </label>
            <input
              id="nomeFantasia"
              type="text"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              placeholder="Digite o nome fantasia da empresa"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          {/* Campo Data de Início do Contrato */}
          <div className="space-y-2">
            <label 
              htmlFor="dataInicioContrato" 
              className="text-sm font-medium text-slate-700"
            >
              Data de Início do Contrato *
            </label>
            <input
              id="dataInicioContrato"
              type="date"
              value={dataInicioContrato}
              onChange={(e) => setDataInicioContrato(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700"
              required
            />
          </div>

          {/* Buttons */}
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
              disabled={isLoading || !razaoSocial.trim() || !nomeFantasia.trim() || !dataInicioContrato.trim()}
              className="flex-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] hover:from-[#00A298]/90 hover:to-[#1D3C44]/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Criando...' : 'Criar Contrato'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}