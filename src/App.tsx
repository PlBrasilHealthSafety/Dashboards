import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/components/custom/AuthProvider'
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
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
