import { useState } from 'react'
import { X, User, Mail, Edit2, Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ProfilePhotoUpload } from './ProfilePhotoUpload'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  if (!isOpen) return null

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Salvando alterações:', { displayName })
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-[#00A298] to-[#1D3C44]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Perfil do Usuário</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <ProfilePhotoUpload size="lg" showControls={true} />
          </div>

          {/* User Info */}
          <div className="space-y-4">
            {/* Nome de exibição */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="w-4 h-4 text-[#00A298]" />
                Nome de Exibição
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A298] focus:border-transparent"
                  placeholder="Digite seu nome"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border">
                  <span className="text-slate-800">
                    {displayName || 'Não informado'}
                  </span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="w-4 h-4 text-[#00A298]" />
                Email
              </label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg border">
                <span className="text-slate-800">{user?.email}</span>
              </div>
            </div>


          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] hover:from-[#00A298]/90 hover:to-[#1D3C44]/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-slate-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] hover:from-[#00A298]/90 hover:to-[#1D3C44]/90 text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}