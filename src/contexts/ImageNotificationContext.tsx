import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

interface ImageNotificationContextType {
  isImageVisible: boolean
  showImage: () => void
  hideImage: () => void
}

const ImageNotificationContext = createContext<ImageNotificationContextType | undefined>(undefined)

export function ImageNotificationProvider({ children }: { children: ReactNode }) {
  const [isImageVisible, setIsImageVisible] = useState(false)

  const showImage = useCallback(() => {
    setIsImageVisible(true)
  }, [])

  const hideImage = useCallback(() => {
    setIsImageVisible(false)
  }, [])

  return (
    <ImageNotificationContext.Provider value={{
      isImageVisible,
      showImage,
      hideImage
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
