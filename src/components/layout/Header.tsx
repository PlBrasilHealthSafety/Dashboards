import { useAuth } from '@/hooks/useAuth'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, signOut } = useAuth()
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
    <header className="relative border-b overflow-hidden">
      {/* Deep teal gradient background with subtle brand glows */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0c1f22_0%,#0f2d33_100%)]" />
      <div className="absolute inset-0 pointer-events-none">
        {/* Left spotlight to highlight logo */}
        <div className="absolute -left-24 top-0 h-64 w-96 bg-[radial-gradient(closest-side,rgba(0,162,152,0.35),transparent_70%)] blur-2xl" />
        {/* Right accent */}
        <div className="absolute right-0 top-0 h-72 w-96 bg-[radial-gradient(closest-side,rgba(29,60,68,0.35),transparent_70%)] blur-2xl" />
      </div>
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="rounded-md ring-1 ring-[#00A298]/30 bg-black/30 p-1 shadow-[0_0_20px_rgba(0,162,152,0.35)]">
            <img src={logoSrc} onError={handleLogoError} alt="PLBrasil" className="h-9 sm:h-11 w-auto select-none drop-shadow-[0_2px_12px_rgba(0,162,152,0.35)]" draggable={false} />
          </div>
          <h1 className="text-[22px] sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #26d9cc, #0f3a40)' }}>
            Health & Safety Dashboard
          </h1>
        </div>
        {user && (
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-white/85 hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" className="border-white/20 hover:border-white/30" onClick={signOut}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}