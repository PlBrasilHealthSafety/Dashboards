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

      <div className="relative z-10 flex flex-col h-full min-h-screen p-3 md:p-4">
        {/* Título Principal */}
        <div className="text-center mb-4 flex-shrink-0">
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="text-3xl">📢</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
              COMUNICADO!
            </h1>
            <div className="text-3xl">📢</div>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00A298] mb-2">
            Aniversariantes de Setembro 🎉
          </h2>
          <div className="w-48 h-1.5 bg-gradient-to-r from-transparent via-[#00A298]/60 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Data e Local - Destaque */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 md:p-5 border-2 border-[#00A298]/60 shadow-2xl mb-4 mx-auto max-w-3xl">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-[#00A298]" />
              <div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1D3C44]">
                  18 DE SETEMBRO
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <Clock className="w-5 h-5 text-[#00A298]" />
                  <p className="text-xl md:text-2xl font-bold text-[#0B5C5B]">
                    16h30
                  </p>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-[#00A298]" />
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <MapPin className="w-5 h-5 text-[#00A298]" />
              <p className="text-lg md:text-xl font-semibold text-[#1D3C44]">
                Sede PLBrasil Health - Auditório Interno
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal - Grid de Programação - Cards compactos horizontalmente */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto px-3">
          
          {/* Bloco 1: Palestras */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3 border-2 border-[#00A298]/40 shadow-2xl">
            <div className="text-center mb-2">
              <Users className="w-10 h-10 text-[#00A298] mx-auto mb-1" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D3C44] mb-2">
                Palestras Saúde & IA
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="bg-[#00A298]/15 rounded-xl p-3 border-2 border-[#00A298]/30">
                <h4 className="text-base md:text-lg font-bold text-[#1D3C44] mb-1">
                  Saúde Mental
                </h4>
                <p className="text-sm md:text-base text-[#0B5C5B] font-semibold">
                  Taymara 
                </p>
              </div>
              
              <div className="bg-[#00A298]/15 rounded-xl p-3 border-2 border-[#00A298]/30">
                <h4 className="text-base md:text-lg font-bold text-[#1D3C44] mb-1">
                  Ferramentas de IA no Trabalho
                </h4>
                <p className="text-sm md:text-base text-[#0B5C5B] font-semibold">
                  Evandro 
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Dinâmica Kahoot */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3 border-2 border-[#00A298]/40 shadow-2xl">
            <div className="text-center mb-2">
              <Trophy className="w-10 h-10 text-[#00A298] mx-auto mb-1" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D3C44] mb-2">
                Dinâmica do Kahoot!
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="bg-[#00A298]/15 rounded-xl p-3 border-2 border-[#00A298]/30">
                <p className="text-sm md:text-base text-[#1D3C44] font-semibold text-center mb-2">
                  Quiz com curiosidades sobre:
                </p>
                <ul className="text-xs md:text-sm text-[#0B5C5B] space-y-0.5">
                  <li>• Empresa e cultura</li>
                  <li>• Valores PLBrasil</li>
                  <li>• Conteúdos das palestras</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-[#00A298]/25 to-[#0B5C5B]/25 rounded-xl p-2 border-2 border-[#00A298]/40">
                <p className="text-center text-[#1D3C44] font-bold text-sm md:text-base">
                  🏆 O vencedor entra para o
                </p>
                <p className="text-center text-[#00A298] font-black text-base md:text-lg">
                  Hall dos Sabe Tudo PLHealth!
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 3: Celebração */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3 border-2 border-[#00A298]/40 shadow-2xl">
            <div className="text-center mb-2">
              <Cake className="w-10 h-10 text-[#00A298] mx-auto mb-1" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D3C44] mb-2">
                Celebração
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="bg-[#00A298]/15 rounded-xl p-3 border-2 border-[#00A298]/30 text-center">
                <div className="text-2xl md:text-3xl mb-2">🎂</div>
                <h4 className="text-base md:text-lg font-bold text-[#1D3C44] mb-1">
                  Bolo e Parabéns
                </h4>
                <p className="text-sm md:text-base text-[#0B5C5B] font-semibold">
                  Para todos os aniversariantes do mês!
                </p>
              </div>
              
              <div className="text-center mt-3">
                <div className="flex justify-center gap-3 text-2xl md:text-3xl">
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