import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel } from '@/components/custom/Carousel'
import { ChartsExample } from '@/components/examples/ChartsExample'
import { useAuth } from '@/hooks/useAuth'
import { useDocument } from '@/hooks/useFirestore'

type Role = 'diretoria' | 'medicina' | 'comercial'

export function HomePage() {
  const { user } = useAuth()
  const { data: profile } = useDocument<{ role: Role }>('users', user?.uid ?? null)

  const role: Role = profile?.role || 'diretoria'

  const carouselItems = useMemo(() => {
    const baseSlides = [
      { id: 1, content: <ChartsExample /> },
      { id: 2, content: <ChartsExample /> },
      { id: 3, content: <ChartsExample /> },
      { id: 4, content: <ChartsExample /> },
      { id: 5, content: <ChartsExample /> },
      { id: 6, content: <ChartsExample /> },
      { id: 7, content: <ChartsExample /> },
      { id: 8, content: <ChartsExample /> },
    ]
    return baseSlides
  }, [])

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(65%_65%_at_50%_0%,rgba(56,189,248,0.10)_0%,rgba(255,255,255,0)_60%)]" />
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bem-vinda(o) ao seu painel</h2>
          <p className="text-sm text-muted-foreground mt-2">Visualização de métricas {role === 'diretoria' ? 'de todos os setores' : `do setor de ${role}`}</p>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <Carousel
            items={carouselItems}
            className="rounded-xl bg-background/50 shadow-lg p-2"
            slidesPerView={1}
            spaceBetween={16}
            loop
            centeredSlides
            showNavigation
            showPagination
            autoplay={{ delay: 3750, disableOnInteraction: false }}
            // 8 slides in 30s -> ~3750ms per slide
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(role === 'diretoria' || role === 'medicina') && (
            <Card>
              <CardHeader>
                <CardTitle>Métricas - Medicina</CardTitle>
                <CardDescription>Indicadores do setor de saúde</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartsExample />
              </CardContent>
            </Card>
          )}

          {(role === 'diretoria' || role === 'comercial') && (
            <Card>
              <CardHeader>
                <CardTitle>Métricas - Comercial</CardTitle>
                <CardDescription>Indicadores do setor comercial</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartsExample />
              </CardContent>
            </Card>
          )}

          {role === 'diretoria' && (
            <Card>
              <CardHeader>
                <CardTitle>Visão Geral - Direção</CardTitle>
                <CardDescription>Sumário de todos os setores</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartsExample />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}