import { useMemo, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carousel } from '@/components/custom/Carousel'


import { 
  PowerPointSlide1, 
  PowerPointSlide2, 
  PowerPointSlide3, 
  PowerPointSlide4, 
  PowerPointSlide5, 
  PowerPointSlide6, 
  PowerPointSlide7, 
  PowerPointSlide8 
} from '@/components/custom/PowerPointSlides'
import { AniversariantesSlide } from '@/components/slides/AniversariantesSlide'
import { ContratoNotificationOverlay } from '@/components/custom/ContratoNotificationOverlay'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoute } from '@/lib/utils'
import type { Contrato } from '@/lib/types'

export function TVDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentContrato, setCurrentContrato] = useState<(Contrato & { id: string }) | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const swiperRef = useRef<any>(null)

  const carouselItems = useMemo(() => {
    // 8 slides de PowerPoint + slide de aniversariantes
    const slides = [
      { id: 1, content: <PowerPointSlide1 /> },
      { id: 2, content: <PowerPointSlide2 /> },
      { id: 3, content: <PowerPointSlide3 /> },
      { id: 4, content: <PowerPointSlide4 /> },
      { id: 5, content: <AniversariantesSlide /> }, // Slide de aniversariantes entre 4 e 5
      { id: 6, content: <PowerPointSlide5 /> },
      { id: 7, content: <PowerPointSlide6 /> },
      { id: 8, content: <PowerPointSlide7 /> },
      { id: 9, content: <PowerPointSlide8 /> },
    ]
    return slides
  }, [])

  // Listener em tempo real para novos contratos
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = async () => {
      try {
        console.log('TVDashboard: Configurando listener do Firestore...')
        const { collection, onSnapshot } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        // Escutar todos os contratos (simplificado para debug)
        const q = collection(db, 'contratos')
        
        console.log('TVDashboard: Query configurada, iniciando listener...')

        unsubscribe = onSnapshot(q, (snapshot) => {
          console.log('TVDashboard: Listener ativado, total de documentos:', snapshot.size)
          
          // Filtrar contratos não exibidos
          const contratosNaoExibidos = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Contrato & { id: string }))
            .filter(contrato => contrato.displayedOnTV === false)
            .sort((a, b) => {
              // Ordenar por createdAt se disponível
              if (a.createdAt && b.createdAt) {
                return b.createdAt.toMillis() - a.createdAt.toMillis()
              }
              return 0
            })
          
          console.log('TVDashboard: Contratos não exibidos encontrados:', contratosNaoExibidos.length)
          
          if (contratosNaoExibidos.length > 0 && !currentContrato) {
            const contrato = contratosNaoExibidos[0]
            console.log('TVDashboard: Novo contrato detectado:', contrato)
            setCurrentContrato(contrato)
            
            // Delay de 1 minuto antes de mostrar o overlay
            setTimeout(() => {
              setShowOverlay(true)
            }, 60000) // 1 minuto
          } else if (contratosNaoExibidos.length === 0) {
            console.log('TVDashboard: Nenhum contrato pendente encontrado')
          } else if (currentContrato) {
            console.log('TVDashboard: Já existe um contrato sendo exibido')
          }
        })
      } catch (error) {
        console.error('Erro ao configurar listener de contratos:', error)
      }
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [currentContrato])

  // Listener para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const userRoute = getUserRoute(user?.email || null)
        navigate(userRoute)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate])

  // Controlar autoplay (30 segundos fixo para todos os slides)
  const handleSlideChange = () => {
    // Manter comportamento padrão do autoplay
    // Todos os slides terão 30 segundos
  }

  const handleNotificationComplete = async () => {
    if (currentContrato) {
      try {
        // Marcar contrato como exibido na TV
        const { doc, updateDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        
        await updateDoc(doc(db, 'contratos', currentContrato.id), {
          displayedOnTV: true,
          updatedAt: new Date()
        })
        
        setCurrentContrato(null)
        setShowOverlay(false)
      } catch (error) {
        console.error('Erro ao marcar contrato como exibido:', error)
        setCurrentContrato(null)
        setShowOverlay(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Botão flutuante discreto para voltar */}
      <button
        onClick={() => {
          const userRoute = getUserRoute(user?.email || null)
          navigate(userRoute)
        }}
        className="fixed top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 opacity-70 hover:opacity-100 transition-all duration-300 group"
        title="Pressione ESC ou clique para voltar ao dashboard"
      >
        <X className="w-5 h-5" />
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ESC ou clique para voltar
        </div>
      </button>



      {/* Carousel Fullscreen para TV 55 polegadas */}
      <div className="h-screen w-screen">
        <Carousel
          items={carouselItems}
          className="w-full h-full"
          slidesPerView={1}
          spaceBetween={0}
          loop
          centeredSlides
          showNavigation={false}
          showPagination={false}
          autoplay={{ 
            delay: 30000, // 30 segundos por slide (padrão)
            disableOnInteraction: false,
            pauseOnMouseEnter: false
          }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
        />
      </div>

      {/* Overlay de notificação de contrato */}
      {currentContrato && showOverlay && (
        <ContratoNotificationOverlay
          contrato={{
            razaoSocial: currentContrato.razaoSocial,
            nomeFantasia: currentContrato.nomeFantasia,
            dataInicioContrato: currentContrato.dataInicioContrato,
            userId: currentContrato.userId
          }}
          onComplete={handleNotificationComplete}
        />
      )}
    </div>
  )
}