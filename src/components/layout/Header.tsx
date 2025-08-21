import { useAuth } from '@/hooks/useAuth'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { User, Monitor } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [logoSrc, setLogoSrc] = useState<string>('/plbrasil-logo.svg')
  const handleLogoError = useCallback(() => {
    setLogoSrc(prev => {
      if (prev.endsWith('.svg')) return '/plbrasil-logo.png'
      if (prev.endsWith('.png')) return '/plbrasil-logo.jpg'
      if (prev.endsWith('.jpg')) return '/plbrasil-logo.jpeg'
      return '/vite.svg' // último fallback
    })
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="absolute inset-0 bg-white" />
      <div className="relative z-10 w-full px-6 py-4 flex items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-md ring-1 ring-[#00A298]/40 bg-white p-2 shadow-lg">
            <img src={logoSrc} onError={handleLogoError} alt="PLBrasil" className="h-8 sm:h-10 w-auto select-none" draggable={false} />
          </div>
          <h1 className="text-[22px] sm:text-2xl font-extrabold tracking-tight animate-slideInFromLeft bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
            Health & Safety Dashboard
          </h1>
        </div>
        {user && (
          <div className="absolute right-6 flex items-center gap-3">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00A298]/10 border border-[#00A298]/30">
                <User className="w-4 h-4 text-[#00A298]" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#00A298]/30 text-[#00A298] hover:bg-[#00A298]/10 hover:border-[#00A298]/50"
              onClick={() => navigate('/tv-dashboard')}
              title="Ver no Modo TV"
            >
              <Monitor className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Modo TV</span>
            </Button>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400" onClick={signOut}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}