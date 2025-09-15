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
      {/* Elementos decorativos flutuantes - mais visíveis */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#00A298]/50 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-5 h-5 bg-[#0B5C5B]/50 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#00A298]/50 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#1D3C44]/40 rounded-full animate-ping delay-300"></div>

      {/* Overlay sutil para dar profundidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00A298]/5 via-transparent to-[#0B5C5B]/5"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen p-3 md:p-4">
        {/* Título Principal */}
        <div className="text-center mb-6 flex-shrink-0 mt-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="text-4xl">📢</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
              COMUNICADO!
            </h1>
            <div className="text-4xl">📢</div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00A298] mb-3">
            Aniversariantes de Setembro 🎉
          </h2>
          <div className="w-56 h-2 bg-gradient-to-r from-transparent via-[#00A298]/60 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Data e Local - Destaque */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 md:p-7 border-2 border-[#00A298]/60 shadow-2xl mb-12 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Calendar className="w-10 h-10 text-[#00A298]" />
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
              <Calendar className="w-10 h-10 text-[#00A298]" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <MapPin className="w-6 h-6 text-[#00A298]" />
              <p className="text-xl md:text-2xl font-semibold text-[#1D3C44]">
                Sede PLBrasil Health - Auditório Interno
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal - Grid de Programação */}
        <div className="flex-1 flex items-center justify-center py-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-10 max-w-8xl mx-auto px-3 w-full">
          
            {/* Bloco 1: Palestras - Cards verticais */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 border-2 border-[#00A298]/40 shadow-2xl">
              {/* Cabeçalho centralizado */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Users className="w-10 h-10 text-[#00A298] flex-shrink-0" />
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D3C44]">
                  Palestras Saúde & IA
                </h3>
              </div>
              
              {/* Conteúdo em coluna (um embaixo do outro) */}
              <div className="space-y-4">
                <div className="bg-[#00A298]/15 rounded-lg p-4 border border-[#00A298]/30">
                  <h4 className="text-base md:text-lg font-bold text-[#1D3C44] mb-2">Saúde Mental</h4>
                  <p className="text-sm md:text-base text-[#0B5C5B] font-semibold">Taymara</p>
                </div>
                
                <div className="bg-[#00A298]/15 rounded-lg p-4 border border-[#00A298]/30">
                  <h4 className="text-base md:text-lg font-bold text-[#1D3C44] mb-2">IA no Trabalho</h4>
                  <p className="text-sm md:text-base text-[#0B5C5B] font-semibold">Evandro</p>
                </div>
              </div>
            </div>

            {/* Bloco 2: Dinâmica Kahoot - Mais largo */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 border-2 border-[#00A298]/40 shadow-2xl">
              {/* Cabeçalho centralizado */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-10 h-10 text-[#00A298] flex-shrink-0" />
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D3C44]">
                  Dinâmica do Kahoot!
                </h3>
              </div>
              
              {/* Conteúdo dividido horizontalmente */}
              <div className="flex gap-4">
                <div className="flex-1 bg-[#00A298]/15 rounded-lg p-4 border border-[#00A298]/30">
                  <p className="text-base md:text-lg text-[#1D3C44] font-semibold mb-3">Quiz sobre:</p>
                  <div className="text-base md:text-lg text-[#0B5C5B] space-y-2">
                    <div>• Empresa e cultura</div>
                    <div>• Valores PLBrasil</div>
                    <div>• Conteúdos das palestras</div>
                  </div>
                </div>
                
                <div className="flex-1 bg-gradient-to-r from-[#00A298]/25 to-[#0B5C5B]/25 rounded-lg p-4 border border-[#00A298]/40 text-center flex flex-col justify-center">
                  <p className="text-base md:text-lg text-[#1D3C44] font-bold">🏆 Vencedor entra no</p>
                  <p className="text-base md:text-lg text-[#00A298] font-black">Hall dos Sabe Tudo!</p>
                </div>
              </div>
            </div>

            {/* Bloco 3: Celebração - Centralizado */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 border-2 border-[#00A298]/40 shadow-2xl">
              {/* Cabeçalho centralizado */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Cake className="w-10 h-10 text-[#00A298] flex-shrink-0" />
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1D3C44]">
                  Celebração
                </h3>
              </div>
              
              {/* Conteúdo centralizado */}
              <div className="text-center">
                <div className="bg-[#00A298]/15 rounded-lg p-4 border border-[#00A298]/30 mb-4">
                  <div className="text-2xl mb-3">🎂</div>
                  <h4 className="text-base md:text-lg font-bold text-[#1D3C44] mb-2">Bolo e Parabéns</h4>
                  <p className="text-sm md:text-base text-[#0B5C5B] font-semibold">Para todos os aniversariantes!</p>
                </div>
                
                {/* Emojis pulando embaixo */}
                <div className="flex justify-center gap-3 text-2xl">
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