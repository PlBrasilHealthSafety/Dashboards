import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { UserCircle, FileText, Plus, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLocation } from 'react-router-dom'
import { ProfilePhotoUpload } from './ProfilePhotoUpload'

interface UserProfileDropdownProps {
  onViewProfile?: () => void
  onCadastros?: () => void
  onNovoContrato?: () => void
}

export function UserProfileDropdown({ 
  onViewProfile, 
  onCadastros, 
  onNovoContrato 
}: UserProfileDropdownProps) {
  const { user } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; minWidth?: number }>({ top: -9999, left: -9999 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Verificar se está na página de diretoria
  const isDirectorPage = location.pathname === '/direcao'

  // Calcular posição do dropdown baseada no espaço disponível
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      // Usar requestAnimationFrame para garantir que o DOM esteja completamente renderizado
      requestAnimationFrame(() => {
        if (!buttonRef.current) return
        
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const dropdownWidth = 224 // Largura mínima do dropdown
        const dropdownHeight = 300 // Altura estimada do dropdown
        const buffer = 16 // Margem de segurança
        
        // Posição vertical: abaixo do botão
        let top = buttonRect.bottom + 8
        
        // Posição horizontal: alinhar a borda esquerda do dropdown com a borda esquerda do botão
        let left = buttonRect.left
        
        // Se o dropdown for maior que o botão e sair da tela à direita, ajustar
        if (left + dropdownWidth > viewportWidth - buffer) {
          // Tentar alinhar à direita (borda direita do dropdown = borda direita do botão)
          left = buttonRect.right - dropdownWidth
        }
        
        // Se ainda não couber, usar margem mínima
        if (left < buffer) {
          left = buffer
        }
        
        // Se sair da tela à direita, ajustar
        if (left + dropdownWidth > viewportWidth - buffer) {
          left = viewportWidth - dropdownWidth - buffer
        }
        
        // Se não couber abaixo, posicionar acima
        if (top + dropdownHeight > viewportHeight - buffer) {
          top = buttonRect.top - dropdownHeight - 8
        }
        
        // Garantir limites da tela
        top = Math.max(buffer, Math.min(top, viewportHeight - dropdownHeight - buffer))
        left = Math.max(buffer, left)
        
        // Usar a largura do botão como largura mínima
        const finalWidth = Math.max(buttonRect.width, dropdownWidth)
        
        setDropdownPosition({ top, left, minWidth: finalWidth })
      })
    }
  }, [isOpen])

  // Fechar dropdown ao clicar fora ou ao rolar a tela
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleScroll() {
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll, true)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [isOpen])

  const handleViewProfile = () => {
    setIsOpen(false)
    onViewProfile?.()
  }

  const handleCadastros = () => {
    setIsOpen(false)
    onCadastros?.()
  }

  const handleNovoContrato = () => {
    setIsOpen(false)
    onNovoContrato?.()
  }

  return (
    <>
      {/* Botão do perfil */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200 group"
      >
        <ProfilePhotoUpload size="sm" showControls={false} />
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          {user?.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown usando Portal */}
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className={`fixed bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 duration-200 ${dropdownPosition.top === -9999 ? 'opacity-0' : 'opacity-100'}`}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            minWidth: dropdownPosition.minWidth || 224,
            width: Math.max(dropdownPosition.minWidth || 224, 224),
            zIndex: 99999,
            transition: 'opacity 0.1s ease-in-out'
          }}
        >
          {/* Header do dropdown */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#00A298]/10 via-[#0B5C5B]/10 to-[#1D3C44]/10 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <ProfilePhotoUpload size="md" showControls={false} />
              <div>
                <p className="text-sm font-semibold text-slate-800">Perfil</p>
                <p className="text-xs text-slate-600 truncate max-w-[140px]">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Opções do dropdown */}
          <div className="py-2">
            {/* Ver Perfil - Funcional */}
            <button
              onClick={handleViewProfile}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#00A298]/5 hover:to-[#1D3C44]/5 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A298]/10 to-[#1D3C44]/10 flex items-center justify-center group-hover:from-[#00A298]/20 group-hover:to-[#1D3C44]/20 transition-all duration-200">
                <UserCircle className="w-4 h-4 text-[#00A298]" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Ver Perfil
              </span>
            </button>

            {/* Cadastros - Apenas visual */}
            <button
              onClick={handleCadastros}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#00A298]/5 hover:to-[#1D3C44]/5 transition-all duration-200 group opacity-75 cursor-not-allowed"
              disabled
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A298]/10 to-[#1D3C44]/10 flex items-center justify-center group-hover:from-[#00A298]/20 group-hover:to-[#1D3C44]/20 transition-all duration-200">
                <FileText className="w-4 h-4 text-[#00A298]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Cadastros
                </span>
                <span className="text-xs text-slate-500">Em breve</span>
              </div>
            </button>

            {/* Novo Contrato - Apenas na página de diretoria */}
            {isDirectorPage && (
              <button
                onClick={handleNovoContrato}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#00A298]/5 hover:to-[#1D3C44]/5 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A298]/10 to-[#1D3C44]/10 flex items-center justify-center group-hover:from-[#00A298]/20 group-hover:to-[#1D3C44]/20 transition-all duration-200">
                  <Plus className="w-4 h-4 text-[#00A298]" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Novo Contrato
                </span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}