import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { UserProfile } from '@/lib/types'
import { getUserProfile } from '@/lib/firestore-services'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import { DirectorDashboard } from '@/components/custom/DirectorDashboard'
import { MedicalDashboard } from '@/components/custom/MedicalDashboard'
import { CommercialDashboard } from '@/components/custom/CommercialDashboard'
import { 
  ImageSlide1, 
  ImageSlide2, 
  ImageSlide3, 
  ImageSlide4, 
  ImageSlide5, 
  ImageSlide6, 
  ImageSlide7, 
  ImageSlide8,
  GeneralChart1,
  GeneralChart2,
  GeneralChart3
} from '@/components/custom/CarouselSlides'

export function HomePage() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'diretoria' | 'medicina' | 'comercial'>('diretoria')

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid)
          if (profile) {
            setUserProfile(profile)
            setCurrentView(profile.role)
          }
        } catch (error) {
          console.error('Erro ao buscar perfil do usuário:', error)
        }
      }
      setLoading(false)
    }

    fetchUserProfile()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A298] mx-auto mb-4"></div>
          <p className="text-[#1D3C44]">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    if (!userProfile) return null
    
    switch (currentView) {
      case 'medicina':
        return <MedicalDashboard />
      case 'comercial':
        return <CommercialDashboard />
      case 'diretoria':
      default:
        return <DirectorDashboard />
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Principal com Gradientes PLBrasil */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50" />
      
      {/* Camadas de Background Complexas */}
      <div className="fixed inset-0 opacity-60">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#00A298]/10 via-transparent to-[#1D3C44]/10" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#AECECB]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#00A298]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#1D3C44]/10 rounded-full blur-2xl" />
      </div>

      {/* Elementos Geométricos Decorativos */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-br from-[#00A298]/20 to-[#AECECB]/20 rounded-lg rotate-12 blur-sm" />
        <div className="absolute bottom-32 left-1/5 w-24 h-24 bg-[#1D3C44]/15 rounded-full blur-sm" />
        <div className="absolute top-1/3 right-1/6 w-16 h-16 bg-[#AECECB]/25 rounded-lg rotate-45" />
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-gradient-to-r from-[#00A298]/15 to-[#1D3C44]/15 rounded-full blur-sm" />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header da Página */}
        <div className="text-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00A298] to-[#1D3C44] bg-clip-text text-transparent mb-2">
              Dashboard PLBrasil Health&Safety
            </h1>
            <p className="text-[#1D3C44]/70 text-lg">
              {userProfile ? `Bem-vindo, ${user?.displayName || 'Usuário'}` : 'Carregando dados...'}
            </p>
            {userProfile && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-sm text-[#1D3C44]/60">Perfil:</span>
                <span className="bg-gradient-to-r from-[#00A298] to-[#AECECB] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {userProfile.role === 'diretoria' ? '👔 Diretoria' : 
                   userProfile.role === 'medicina' ? '⚕️ Medicina' : '💼 Comercial'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Principal */}
        <div className="mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <h2 className="text-2xl font-bold text-[#1D3C44] text-center mb-6">
              📊 Visão Geral da Empresa
            </h2>
            
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet-custom',
                  bulletActiveClass: 'swiper-pagination-bullet-active-custom'
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{
                  crossFade: true
                }}
                loop={true}
                className="h-full w-full"
              >
                {/* Slides de Imagem */}
                <SwiperSlide><ImageSlide1 /></SwiperSlide>
                <SwiperSlide><ImageSlide2 /></SwiperSlide>
                <SwiperSlide><ImageSlide3 /></SwiperSlide>
                <SwiperSlide><ImageSlide4 /></SwiperSlide>
                <SwiperSlide><ImageSlide5 /></SwiperSlide>
                <SwiperSlide><ImageSlide6 /></SwiperSlide>
                <SwiperSlide><ImageSlide7 /></SwiperSlide>
                <SwiperSlide><ImageSlide8 /></SwiperSlide>
                
                {/* Slides de Gráficos */}
                <SwiperSlide><GeneralChart1 /></SwiperSlide>
                <SwiperSlide><GeneralChart2 /></SwiperSlide>
                <SwiperSlide><GeneralChart3 /></SwiperSlide>
              </Swiper>
              
              {/* Botões de Navegação Customizados */}
              <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/90 transition-all shadow-lg border border-white/50">
                <span className="text-[#00A298] text-lg">‹</span>
              </div>
              <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/90 transition-all shadow-lg border border-white/50">
                <span className="text-[#00A298] text-lg">›</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Específico por Role */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1D3C44]">
              {currentView === 'diretoria' ? '👔 Dashboard Diretoria' :
               currentView === 'medicina' ? '⚕️ Dashboard Medicina' : '💼 Dashboard Comercial'}
            </h2>
            <div className="flex gap-2">
              {userProfile && ['diretoria', 'medicina', 'comercial'].map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentView(role as typeof currentView)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === role 
                      ? 'bg-gradient-to-r from-[#00A298] to-[#AECECB] text-white shadow-md' 
                      : 'bg-white/70 text-[#1D3C44] hover:bg-white/90'
                  }`}
                >
                  {role === 'diretoria' ? '👔 Diretoria' :
                   role === 'medicina' ? '⚕️ Medicina' : '💼 Comercial'}
                </button>
              ))}
            </div>
          </div>
          
          {renderDashboard()}
        </div>
      </div>
    </div>
  )
}