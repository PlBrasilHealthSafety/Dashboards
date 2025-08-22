import { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NovoContratoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NovoContratoModal({ isOpen, onClose }: NovoContratoModalProps) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica será implementada posteriormente
    console.log('Novo contrato:', { titulo, descricao })
    onClose()
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
              className="flex-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] hover:from-[#00A298]/90 hover:to-[#1D3C44]/90 text-white shadow-lg"
            >
              Criar Contrato
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}