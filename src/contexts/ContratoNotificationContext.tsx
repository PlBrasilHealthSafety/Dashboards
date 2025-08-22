import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Contrato } from '@/lib/types'

interface ContratoNotification {
  id: string
  contrato: Omit<Contrato, 'id' | 'createdAt' | 'updatedAt'>
  timestamp: number
}

interface ContratoNotificationContextType {
  notifications: ContratoNotification[]
  addNotification: (contrato: Omit<Contrato, 'id' | 'createdAt' | 'updatedAt'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const ContratoNotificationContext = createContext<ContratoNotificationContextType | undefined>(undefined)

export function ContratoNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ContratoNotification[]>([])

  const addNotification = useCallback((contrato: Omit<Contrato, 'id' | 'createdAt' | 'updatedAt'>) => {
    const notification: ContratoNotification = {
      id: `contrato-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contrato,
      timestamp: Date.now()
    }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto-remove após 3 minutos (tempo do vídeo + exibição do contrato)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 3 * 60 * 1000) // 3 minutos
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <ContratoNotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
    </ContratoNotificationContext.Provider>
  )
}

export function useContratoNotifications() {
  const context = useContext(ContratoNotificationContext)
  if (context === undefined) {
    throw new Error('useContratoNotifications must be used within a ContratoNotificationProvider')
  }
  return context
}