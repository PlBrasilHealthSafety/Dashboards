import { useState } from 'react'
import { useAuth } from './useAuth'
import { updateProfile } from 'firebase/auth'

export function useLocalProfilePhoto() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado')
    
    setUploading(true)
    setError(null)

    try {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione um arquivo de imagem válido')
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('A imagem deve ter no máximo 5MB')
      }

      // Criar nome único para o arquivo
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const fileName = `${user.uid}-${timestamp}.${extension}`
      
      // Converter arquivo para base64 para salvar localmente
      const base64 = await fileToBase64(file)
      
      // Salvar no localStorage (simulando upload local)
      const photoData = {
        fileName,
        base64,
        uploadDate: new Date().toISOString(),
        userId: user.uid
      }
      
      // Salvar dados da foto no localStorage
      localStorage.setItem(`profile-photo-${user.uid}`, JSON.stringify(photoData))
      
      // Criar URL local para a imagem
      const localPhotoURL = base64
      
      // Atualizar perfil do usuário no Firebase Auth
      await updateProfile(user, {
        photoURL: localPhotoURL
      })

      return localPhotoURL
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload da foto'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const removeProfilePhoto = async (): Promise<void> => {
    if (!user) return

    setUploading(true)
    setError(null)

    try {
      // Remover foto do localStorage
      localStorage.removeItem(`profile-photo-${user.uid}`)

      // Atualizar perfil do usuário no Firebase Auth
      await updateProfile(user, {
        photoURL: null
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover foto'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const getProfilePhoto = (): string | null => {
    if (!user) return null
    
    try {
      const photoData = localStorage.getItem(`profile-photo-${user.uid}`)
      if (photoData) {
        const parsed = JSON.parse(photoData)
        return parsed.base64
      }
    } catch (err) {
      console.error('Erro ao recuperar foto do perfil:', err)
    }
    
    return user.photoURL
  }

  return {
    uploadProfilePhoto,
    removeProfilePhoto,
    getProfilePhoto,
    uploading,
    error,
    clearError: () => setError(null)
  }
}

// Função auxiliar para converter arquivo para base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}