import { Calendar, Clock, MapPin, Users, Trophy, Cake } from 'lucide-react'
import { useEffect } from 'react'

export function ComunicadoSlide() {
  console.log('ComunicadoSlide renderizado - Timer deveria ser 180000ms (3 minutos)')
  console.log('Slide do Comunicado carregado - verificando se timer vai funcionar')
  
  // Log quando o componente é montado
  useEffect(() => {
    console.log('ComunicadoSlide montado - timer deveria iniciar')
    const timeout = setTimeout(() => {
      console.log('3 minutos se passaram no slide do comunicado - slide deveria avançar agora')
    }, 180000)
    
    return () => clearTimeout(timeout)
  }, [])
  
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-green-100 text-gray-800 relative overflow-hidden">
      {/* Padrão de fundo decorativo - mais visível */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 text-9xl animate-pulse text-[#00A298]">📢</div>
        <div className="absolute top-20 right-20 text-7xl animate-pulse delay-1000 text-[#0B5C5B]">🎉</div>
        <div className="absolute bottom-20 left-20 text-8xl animate-pulse delay-500 text-[#00A298]">🎂</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-pulse delay-700 text-[#1D3C44]">🏆</div>
        <div className="absolute top-1/2 left-1/4 text-7xl opacity-50 text-[#AECECB]">🎊</div>
        <div className="absolute top-1/3 right-1/3 text-6xl opacity-40 text-[#00A298]">📅</div>
      </div>

      {/* Elementos decorativos flutuantes - mais visíveis */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#00A298]/50 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-5 h-5 bg-[#0B5C5B]/50 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#00A298]/50 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#1D3C44]/40 rounded-full animate-ping delay-300"></div>

      {/* Overlay sutil para dar profundidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00A298]/5 via-transparent to-[#0B5C5B]/5"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen p-4 md:p-6">
        {/* Título Principal */}
        <div className="text-center mb-6 flex-shrink-0">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="text-5xl">📢</div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
              COMUNICADO!
            </h1>
            <div className="text-5xl">📢</div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00A298] mb-3">
            Aniversariantes de Setembro 🎉
          </h2>
          <div className="w-64 h-2 bg-gradient-to-r from-transparent via-[#00A298]/60 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Data e Local - Destaque */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 md:p-8 border-2 border-[#00A298]/60 shadow-2xl mb-6 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Calendar className="w-12 h-12 text-[#00A298]" />
              <div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1D3C44]">
                  18 DE SETEMBRO
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Clock className="w-6 h-6 text-[#00A298]" />
                  <p className="text-2xl md:text-3xl font-bold text-[#0B5C5B]">
                    16h30
                  </p>
                </div>
              </div>
              <Calendar className="w-12 h-12 text-[#00A298]" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <MapPin className="w-6 h-6 text-[#00A298]" />
              <p className="text-xl md:text-2xl font-semibold text-[#1D3C44]">
                Sede PLBrasil Health - Auditório Interno
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal - Grid de Programação - Cards redimensionados para TV 55" */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          
          {/* Bloco 1: Palestras */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-2 border-[#00A298]/40 shadow-2xl">
            <div className="text-center mb-6">
              <Users className="w-16 h-16 text-[#00A298] mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1D3C44] mb-4">
                Palestras Saúde & IA
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#00A298]/15 rounded-2xl p-6 border-2 border-[#00A298]/30">
                <h4 className="text-xl md:text-2xl font-bold text-[#1D3C44] mb-3">
                  Saúde Mental
                </h4>
                <p className="text-lg md:text-xl text-[#0B5C5B] font-semibold">
                  Taymara 
                </p>
              </div>
              
              <div className="bg-[#00A298]/15 rounded-2xl p-6 border-2 border-[#00A298]/30">
                <h4 className="text-xl md:text-2xl font-bold text-[#1D3C44] mb-3">
                  Ferramentas de IA no Trabalho
                </h4>
                <p className="text-lg md:text-xl text-[#0B5C5B] font-semibold">
                  Evandro 
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Dinâmica Kahoot */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-2 border-[#00A298]/40 shadow-2xl">
            <div className="text-center mb-6">
              <Trophy className="w-16 h-16 text-[#00A298] mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1D3C44] mb-4">
                Dinâmica do Kahoot!
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#00A298]/15 rounded-2xl p-6 border-2 border-[#00A298]/30">
                <p className="text-lg md:text-xl text-[#1D3C44] font-semibold text-center mb-4">
                  Quiz com curiosidades sobre:
                </p>
                <ul className="text-base md:text-lg text-[#0B5C5B] space-y-2">
                  <li>• Empresa e cultura</li>
                  <li>• Valores PLBrasil</li>
                  <li>• Conteúdos das palestras</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-[#00A298]/25 to-[#0B5C5B]/25 rounded-2xl p-4 border-2 border-[#00A298]/40">
                <p className="text-center text-[#1D3C44] font-bold text-lg md:text-xl">
                  🏆 O vencedor entra para o
                </p>
                <p className="text-center text-[#00A298] font-black text-xl md:text-2xl">
                  Hall dos Sabe Tudo PLHealth!
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 3: Celebração */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border-2 border-[#00A298]/40 shadow-2xl">
            <div className="text-center mb-6">
              <Cake className="w-16 h-16 text-[#00A298] mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1D3C44] mb-6">
                Celebração
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#00A298]/15 rounded-2xl p-6 border-2 border-[#00A298]/30 text-center">
                <div className="text-4xl md:text-5xl mb-4">🎂</div>
                <h4 className="text-xl md:text-2xl font-bold text-[#1D3C44] mb-3">
                  Bolo e Parabéns
                </h4>
                <p className="text-lg md:text-xl text-[#0B5C5B] font-semibold">
                  Para todos os aniversariantes do mês!
                </p>
              </div>
              
              <div className="text-center mt-8">
                <div className="flex justify-center gap-4 text-4xl md:text-5xl">
                  <span className="animate-bounce">🎉</span>
                  <span className="animate-bounce delay-300">🎈</span>
                  <span className="animate-bounce delay-500">🎊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}