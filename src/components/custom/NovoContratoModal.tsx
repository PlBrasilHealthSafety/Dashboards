import { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
// import { contratosService } from '@/lib/contratos-service' // Não usado no momento
import { useContratoNotifications } from '@/contexts/ContratoNotificationContext'

interface NovoContratoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NovoContratoModal({ isOpen, onClose }: NovoContratoModalProps) {
  const { user } = useAuth()
  const { addNotification } = useContratoNotifications()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  // Debug: log user info when modal opens
  console.log('Modal aberto - User info:', {
    user: user ? {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    } : null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !titulo.trim() || !descricao.trim()) {
      console.log('Validação falhou:', {
        user: !!user,
        titulo: titulo.trim(),
        descricao: descricao.trim()
      })
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Criando contrato com dados:', {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        userId: user.uid,
        userEmail: user.email
      })
      
      // Teste direto com Firebase
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      const docData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      console.log('Dados que serão enviados:', docData)
      
      // Verificar se o usuário tem um token válido
      const token = await user.getIdToken()
      console.log('Token do usuário obtido:', !!token)
      
      const docRef = await addDoc(collection(db, 'contratos'), docData)
      console.log('Documento criado com ID:', docRef.id)
      
      // Enviar notificação para o modo TV
      addNotification({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        userId: user.uid
      })
      
      // Limpar campos e fechar modal
      setTitulo('')
      setDescricao('')
      onClose()
      
      // Opcional: mostrar notificação de sucesso
      console.log('Contrato criado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      // Opcional: mostrar notificação de erro
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTitulo('')
    setDescricao('')
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
          {/* Campo Título */}
          <div className="space-y-2">
            <label 
              htmlFor="titulo" 
              className="text-sm font-medium text-slate-700"
            >
              Título *
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do contrato"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          {/* Campo Descrição */}
          <div className="space-y-2">
            <label 
              htmlFor="descricao" 
              className="text-sm font-medium text-slate-700"
            >
              Descrição *
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição do contrato"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#00A298] focus:ring-2 focus:ring-[#00A298]/20 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400 resize-none"
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
              disabled={isLoading || !titulo.trim() || !descricao.trim()}
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