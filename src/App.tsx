import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { testFirebaseConnection } from '@/lib/firebase-test'
import { AuthProvider } from '@/components/custom/AuthProvider'
import { ProtectedRoute } from '@/components/custom/ProtectedRoute'
import { UserProfile } from '@/components/custom/UserProfile'
import { ContactForm } from '@/components/custom/ContactForm'
import { FirestoreExample } from '@/components/examples/FirestoreExample'
import { FormExample } from '@/components/examples/FormExample'
import CarouselExample from '@/components/examples/CarouselExample'
import { ChartsExample } from '@/components/examples/ChartsExample'
import { FramerMotionExample } from '@/components/examples/FramerMotionExample'
import { useAuth } from '@/hooks/useAuth'

function AppContent() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    // Test Firebase connection on app load
    testFirebaseConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-24 w-24 hover:drop-shadow-lg transition-all" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-24 w-24 hover:drop-shadow-lg transition-all animate-spin" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8">Vite + React + Tailwind + Shadcn/ui + Firebase Auth</h1>
        
        {/* User Profile Section */}
        {user && (
          <div className="flex justify-center mb-8">
            <UserProfile />
          </div>
        )}
        
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <Button onClick={() => setCount((count) => count + 1)}>
              Count is {count}
            </Button>
            <Button variant="outline" onClick={() => setCount(0)}>
              Reset
            </Button>
            <Button variant="secondary" onClick={() => setCount((count) => count - 1)}>
              Decrease
            </Button>
          </div>
          
          <div className="w-full max-w-md space-y-2">
            <Input 
              placeholder="Type something here..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
              <p className="text-sm text-muted-foreground">
                You typed: <span className="font-medium">{inputValue}</span>
              </p>
            )}
          </div>
          
          <p className="text-muted-foreground text-center max-w-md">
            Edit <code className="bg-muted px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test HMR
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Vite</CardTitle>
                <CardDescription>Lightning fast build tool</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Next generation frontend tooling with instant HMR</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>⚛️ React</CardTitle>
                <CardDescription>Modern UI library</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">A JavaScript library for building user interfaces</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>🎨 Tailwind + Shadcn/ui</CardTitle>
                <CardDescription>Beautiful components</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Utility-first CSS with beautiful, accessible components</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔥 Firebase Auth</CardTitle>
                <CardDescription>Authentication system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {user ? `Logged in as: ${user.email}` : 'Authentication configured'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* React Hook Form Examples */}
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-center">React Hook Form + Zod Examples</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ContactForm />
              <FormExample />
            </div>
          </div>
          
          {/* Carousel Examples */}
          <div className="mt-12">
            <CarouselExample />
          </div>
          
          {/* Charts Examples */}
          <div className="mt-12">
            <ChartsExample />
          </div>
          
          {/* Framer Motion Examples */}
          <div className="mt-12">
            <FramerMotionExample />
          </div>
          
          {/* Firestore Database Example */}
          <div className="mt-12">
            <FirestoreExample />
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App
