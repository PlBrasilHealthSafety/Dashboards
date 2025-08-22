import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/components/custom/AuthProvider'
import { ContratoNotificationProvider } from '@/contexts/ContratoNotificationContext'
import { AppRoutes } from '@/routes'
import { testFirebaseConnection } from '@/lib/firebase-test'

function App() {
  useEffect(() => {
    // Test Firebase connection on app load
    testFirebaseConnection()
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <ContratoNotificationProvider>
          <AppRoutes />
        </ContratoNotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
