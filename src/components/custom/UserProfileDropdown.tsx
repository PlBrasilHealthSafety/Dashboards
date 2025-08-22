import { useState, useRef, useEffect } from 'react'
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
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Verificar se está na página de diretoria
  const isDirectorPage = location.pathname === '/direcao'

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    <div className="relative" ref={dropdownRef}>
      {/* Botão do perfil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200 group"
      >
        <ProfilePhotoUpload size="sm" showControls={false} />
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          {user?.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
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
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#00A298]/5 hover:to-[#1D3C44]/5 transition-all duration-200 group opacity-75 cursor-not-allowed"
                disabled
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A298]/10 to-[#1D3C44]/10 flex items-center justify-center group-hover:from-[#00A298]/20 group-hover:to-[#1D3C44]/20 transition-all duration-200">
                  <Plus className="w-4 h-4 text-[#00A298]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    Novo Contrato
                  </span>
                  <span className="text-xs text-slate-500">Em breve</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}