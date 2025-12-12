import { Calendar, Clock, MapPin, Users, Trophy, Cake, Heart } from 'lucide-react'
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
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 text-gray-800 relative overflow-hidden">
      {/* Elementos decorativos flutuantes - cores de dezembro vermelho e laranja */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500/50 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-5 h-5 bg-orange-500/50 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-400/50 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-orange-400/40 rounded-full animate-ping delay-300"></div>

      {/* Overlay sutil para dar profundidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen p-3 md:p-4">
        {/* Título Principal */}
        <div className="text-center mb-4 flex-shrink-0 mt-2">
          <div className="flex justify-center items-center gap-3 mb-3">
            <div className="text-4xl">📢</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              COMUNICADO!
            </h1>
            <div className="text-4xl">📢</div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-2">
            Sexta-feira, 19 de Dezembro!
          </h2>
          <div className="w-56 h-2 bg-gradient-to-r from-transparent via-red-500/60 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Data e Local - Destaque */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 md:p-5 border-2 border-red-500/60 shadow-2xl mb-6 mx-auto max-w-4xl">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-3">
              <Calendar className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800">
                  19 DE DEZEMBRO
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Clock className="w-5 h-5 text-red-600" />
                  <p className="text-xl md:text-2xl font-bold text-orange-600">
                    11h30 às 13h30
                  </p>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                Sede PLBrasil Health&Safety
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal - Grid de Programação */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-8xl mx-auto px-3 w-full">
          
            {/* Bloco 1: Papo Sério - Dezembro Vermelho & Laranja */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-5 border-2 border-red-500/40 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-8 h-8 text-red-600 flex-shrink-0" />
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">
                  Papo Sério
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-3 border border-red-500/30">
                  <h4 className="text-sm md:text-base font-bold text-red-700 mb-1">🔴 Dezembro Vermelho</h4>
                  <p className="text-xs md:text-sm text-gray-700">Combate ao HIV/AIDS</p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg p-3 border border-orange-500/30">
                  <h4 className="text-sm md:text-base font-bold text-orange-700 mb-1">🟠 Dezembro Laranja</h4>
                  <p className="text-xs md:text-sm text-gray-700">Prevenção ao Câncer de Pele</p>
                </div>
                
                <p className="text-xs text-gray-600 text-center italic">Saúde em primeiro lugar!</p>
              </div>
            </div>

            {/* Bloco 2: Palestra Especial - Tainara */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-5 border-2 border-orange-500/40 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-8 h-8 text-orange-600 flex-shrink-0" />
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">
                  Palestra Especial
                </h3>
              </div>
              
              <div className="bg-orange-500/15 rounded-lg p-4 border border-orange-500/30">
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold text-orange-700 mb-2">🤝 Tainara</p>
                  <h4 className="text-sm md:text-base font-bold text-gray-800 mb-2">"Como Ser um Time Sinérgico e Multidisciplinar?"</h4>
                  <p className="text-xs text-gray-600">Conectando Engenharia, Saúde, Comercial e Admin para 2026!</p>
                </div>
              </div>
            </div>

            {/* Bloco 3: Grande Final Sabe Tudo PLHealth */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-5 border-2 border-amber-500/40 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Trophy className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">
                  🏆 A GRANDE FINAL!
                </h3>
              </div>
              
              <div className="bg-amber-500/15 rounded-lg p-2 border border-amber-500/30 text-center mb-3">
                <p className="text-sm md:text-base font-bold text-amber-700">Sabe Tudo PLHealth</p>
                <p className="text-xs text-gray-600">A competição mais aguardada do ano!</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-amber-100/80 rounded-lg p-2 border-l-4 border-amber-500">
                  <p className="text-xs text-gray-700"><span className="font-bold text-amber-700">1. Rodada Geral:</span> Todos jogam juntos!</p>
                </div>
                
                <div className="bg-amber-100/80 rounded-lg p-2 border-l-4 border-orange-500">
                  <p className="text-xs text-gray-700"><span className="font-bold text-orange-700">2. Classificação:</span> Dupla ou Trio vencedor do dia garante vaga na final!</p>
                </div>
                
                <div className="bg-amber-100/80 rounded-lg p-2 border-l-4 border-red-500">
                  <p className="text-xs text-gray-700"><span className="font-bold text-red-700">3. Duelo dos Campeões:</span> Classificados + 4 vencedores anteriores disputam o título!</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-lg p-2 text-center mt-3">
                <p className="text-xs md:text-sm text-gray-800 font-bold">🏅 Quem será o Campeão Supremo 2025?</p>
              </div>
            </div>

            {/* Bloco 4: Celebração */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl p-5 border-2 border-red-500/40 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Cake className="w-8 h-8 text-red-600 flex-shrink-0" />
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">
                  Celebração
                </h3>
              </div>
              
              <div className="text-center">
                <div className="bg-red-500/15 rounded-lg p-4 border border-red-500/30 mb-3">
                  <div className="text-3xl mb-2">🎂</div>
                  <p className="text-sm md:text-base text-gray-700 font-semibold">Bolo e parabéns para os aniversariantes de Dezembro!</p>
                </div>
                
                <p className="text-xs text-gray-600 italic mb-2">Contamos com todos para celebrar as conquistas de 2025!</p>
                
                <div className="flex justify-center gap-3 text-xl">
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