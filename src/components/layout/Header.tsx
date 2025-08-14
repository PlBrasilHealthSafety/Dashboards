import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserProfile } from '@/lib/types'
import { getUserProfile } from '@/lib/firestore-services'

export function Header() {
  const { user, signOut } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentView, setCurrentView] = useState<'diretoria' | 'medicina' | 'comercial'>('diretoria')

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(profile => {
        if (profile) {
          setUserProfile(profile)
          setCurrentView(profile.role)
        }
      })
    }
  }, [user])

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'diretoria': return '👔 Diretoria'
      case 'medicina': return '⚕️ Medicina'
      case 'comercial': return '💼 Comercial'
      default: return role
    }
  }

  return (
    <header className="relative overflow-hidden border-b shadow-lg">
      {/* Background com gradiente PLBrasil */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00A298] via-[#1D3C44] to-[#00A298]" />
      
      {/* Elementos geométricos de fundo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-white/15 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#AECECB]/30 rounded-lg rotate-45" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-lg">PL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PLBrasil Health&Safety</h1>
                <p className="text-[#AECECB] text-sm">Dashboard de Gestão</p>
              </div>
            </div>
          </div>

          {/* Navegação e Perfil */}
          {user && userProfile && (
            <div className="flex items-center gap-6">
              {/* Seletor de Visão */}
              <div className="flex items-center gap-2">
                <span className="text-[#AECECB] text-sm font-medium">Visão:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/20 hover:text-white border border-white/30 backdrop-blur-sm"
                    >
                      {getRoleDisplayName(currentView)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-white/20">
                    <DropdownMenuItem onClick={() => setCurrentView('diretoria')}>
                      👔 Visão Diretoria
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentView('medicina')}>
                      ⚕️ Visão Medicina
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentView('comercial')}>
                      💼 Visão Comercial
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#AECECB] hover:bg-white/20 hover:text-white border border-white/20"
                >
                  📊 Relatório
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#AECECB] hover:bg-white/20 hover:text-white border border-white/20"
                >
                  ➕ Inserir Dados
                </Button>
              </div>

              {/* Perfil do Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8 border-2 border-white/30">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                    <AvatarFallback className="bg-white/20 text-white text-sm">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-white text-sm font-medium">
                      {user.displayName || 'Usuário'}
                    </p>
                    <p className="text-[#AECECB] text-xs">
                      {getRoleDisplayName(userProfile.role)}
                    </p>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-white/20">
                  <DropdownMenuItem>
                    👤 Ver Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    ⚙️ Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    🚪 Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}