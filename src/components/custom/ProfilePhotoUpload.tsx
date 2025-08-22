import { useState, useRef, useEffect } from 'react'
import { Camera, Trash2, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLocalProfilePhoto } from '@/hooks/useLocalProfilePhoto'

interface ProfilePhotoUploadProps {
  size?: 'sm' | 'md' | 'lg'
  showControls?: boolean
  className?: string
}

export function ProfilePhotoUpload({ 
  size = 'md', 
  showControls = true,
  className = '' 
}: ProfilePhotoUploadProps) {
  const { user } = useAuth()
  const { uploadProfilePhoto, removeProfilePhoto, getProfilePhoto, uploading, error, clearError } = useLocalProfilePhoto()
  const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Atualizar foto quando o usuário mudar
  useEffect(() => {
    if (user) {
      const photoURL = getProfilePhoto()
      setCurrentPhotoURL(photoURL)
    }
  }, [user, getProfilePhoto])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      clearError()
      const photoURL = await uploadProfilePhoto(file)
      setCurrentPhotoURL(photoURL)
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err)
    }
    
    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = async () => {
    try {
      clearError()
      await removeProfilePhoto()
      setCurrentPhotoURL(null)
    } catch (err) {
      console.error('Erro ao remover foto:', err)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Avatar */}
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#00A298] to-[#1D3C44] flex items-center justify-center shadow-lg overflow-hidden`}>
        {currentPhotoURL ? (
          <img 
            src={currentPhotoURL} 
            alt="Foto do perfil" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <User className={`${iconSizes[size]} text-white ${currentPhotoURL ? 'hidden' : ''}`} />
      </div>
      
      {/* Controles de upload */}
      {showControls && (
        <>
          {/* Overlay com botões de ação */}
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex gap-1">
              <button
                onClick={triggerFileInput}
                disabled={uploading}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 disabled:opacity-50"
                title="Alterar foto"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
              {currentPhotoURL && (
                <button
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 disabled:opacity-50"
                  title="Remover foto"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>
          
          {/* Loading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 z-10">
          {error}
        </div>
      )}
    </div>
  )
}