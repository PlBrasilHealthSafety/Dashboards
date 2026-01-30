import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ImageNotificationContextType {
  isImageVisible: boolean
  showImage: () => Promise<void>
  hideImage: () => Promise<void>
  toggleImage: () => Promise<void>
}

const ImageNotificationContext = createContext<ImageNotificationContextType | undefined>(undefined)

// Documento no Firestore para controlar o estado da imagem em todas as TVs
const IMAGE_CONTROL_DOC = 'settings/imageDisplay'

export function ImageNotificationProvider({ children }: { children: ReactNode }) {
  const [isImageVisible, setIsImageVisible] = useState(false)

  // Escuta mudanças no Firestore em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, IMAGE_CONTROL_DOC),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          setIsImageVisible(data.isVisible === true)
          console.log('ImageNotification: Estado atualizado do Firestore:', data.isVisible)
        } else {
          setIsImageVisible(false)
        }
      },
      (error) => {
        console.error('Erro ao escutar mudanças de imagem:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  // Mostrar imagem em TODAS as TVs
  const showImage = useCallback(async () => {
    try {
      await setDoc(doc(db, IMAGE_CONTROL_DOC), {
        isVisible: true,
        updatedAt: new Date(),
        updatedBy: 'direcao'
      })
      console.log('ImageNotification: Comando enviado para mostrar imagem em todas as TVs')
    } catch (error) {
      console.error('Erro ao enviar comando de mostrar imagem:', error)
    }
  }, [])

  // Esconder imagem em TODAS as TVs
  const hideImage = useCallback(async () => {
    try {
      await setDoc(doc(db, IMAGE_CONTROL_DOC), {
        isVisible: false,
        updatedAt: new Date(),
        updatedBy: 'direcao'
      })
      console.log('ImageNotification: Comando enviado para esconder imagem em todas as TVs')
    } catch (error) {
      console.error('Erro ao enviar comando de esconder imagem:', error)
    }
  }, [])

  // Alternar estado da imagem
  const toggleImage = useCallback(async () => {
    try {
      const docSnap = await getDoc(doc(db, IMAGE_CONTROL_DOC))
      const currentState = docSnap.exists() ? docSnap.data().isVisible : false
      
      await setDoc(doc(db, IMAGE_CONTROL_DOC), {
        isVisible: !currentState,
        updatedAt: new Date(),
        updatedBy: 'direcao'
      })
      console.log('ImageNotification: Comando enviado para alternar imagem:', !currentState)
    } catch (error) {
      console.error('Erro ao enviar comando de alternar imagem:', error)
    }
  }, [])

  return (
    <ImageNotificationContext.Provider value={{
      isImageVisible,
      showImage,
      hideImage,
      toggleImage
    }}>
      {children}
    </ImageNotificationContext.Provider>
  )
}

export function useImageNotification() {
  const context = useContext(ImageNotificationContext)
  if (context === undefined) {
    throw new Error('useImageNotification must be used within an ImageNotificationProvider')
  }
  return context
}
