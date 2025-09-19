import { Trophy, Star } from 'lucide-react'
import { useEffect } from 'react'

export function CampeoesKahootSlide() {
  console.log('CampeoesKahootSlide renderizado - Timer deveria ser 180000ms (3 minutos)')
  console.log('Slide dos Campeões Kahoot carregado - verificando se timer vai funcionar')
  
  // Log quando o componente é montado
  useEffect(() => {
    console.log('CampeoesKahootSlide montado - timer deveria iniciar')
    const timeout = setTimeout(() => {
      console.log('3 minutos se passaram - slide deveria avançar agora')
    }, 180000)
    
    return () => clearTimeout(timeout)
  }, [])
  
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-bl from-[#1D3C44] via-[#0B5C5B] to-[#00A298] text-white relative overflow-hidden">
      {/* Padrão de fundo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl animate-pulse">🏆</div>
        <div className="absolute top-20 right-20 text-7xl animate-pulse delay-1000">🥇</div>
        <div className="absolute bottom-20 left-20 text-8xl animate-pulse delay-500">⭐</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-pulse delay-700">🎯</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-30">🏅</div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-300/20 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-yellow-300/20 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-300/20 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-yellow-300/10 rounded-full animate-ping delay-300"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen p-4 md:p-8">
        {/* Título Principal */}
        <div className="text-center mb-12 flex-shrink-0">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <div className="text-4xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }}>🏆</div>
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 bg-clip-text text-transparent">
            Campeões "Sabe Tudo PLHealth!"
          </h1>
          <div className="w-56 h-1.5 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Conteúdo Principal - Layout com 3 colunas */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-2">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* Primeiro Bloco - Campeã Inaugural */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-amber-400/30 shadow-2xl relative flex flex-col">
              {/* Ícone de coroa */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-amber-400 rounded-full p-2">
                  <Trophy className="w-5 h-5 text-[#1D3C44]" />
                </div>
              </div>
              
              <div className="text-center pt-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Avatar da Daniela Silva */}
                  <div className="mx-auto mb-5 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-3 border-amber-400/50 shadow-xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500">
                    <img 
                      src="/daniela-silva.jpg"
                      alt="Daniela Silva - Campeã Kahoot PLHealth"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 text-amber-100">
                    Daniela Silva
                  </h2>
                  
                  <p className="text-sm md:text-base lg:text-lg opacity-90 font-light text-white/90 mb-5">
                    Edição Especial de Inauguração
                  </p>
                </div>
                
                {/* Pontuação ou estatística */}
                <div className="bg-amber-400/20 rounded-xl p-3 border border-amber-400/30">
                  <div className="flex justify-center items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm md:text-base lg:text-lg font-semibold">Primeira Campeã!</span>
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* Segundo Bloco - Campeã de Setembro */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-amber-400/30 shadow-2xl relative flex flex-col">
              {/* Ícone de coroa */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-amber-400 rounded-full p-2">
                  <Trophy className="w-5 h-5 text-[#1D3C44]" />
                </div>
              </div>
              
              <div className="text-center pt-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Avatar da Daniela Silva */}
                  <div className="mx-auto mb-5 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-3 border-amber-400/50 shadow-xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500">
                    <img 
                      src="/daniela-silva.jpg"
                      alt="Daniela Silva - Campeã Kahoot PLHealth"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 text-amber-100">
                    Daniela Silva
                  </h2>
                  
                  <p className="text-sm md:text-base lg:text-lg opacity-90 font-light text-white/90 mb-5">
                    Competição Kahoot
                  </p>
                </div>
                
                {/* Pontuação ou estatística */}
                <div className="bg-amber-400/20 rounded-xl p-3 border border-amber-400/30">
                  <div className="flex justify-center items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm md:text-base lg:text-lg font-semibold">Campeã Edição de Setembro</span>
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terceiro Bloco - Edição de Outubro */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col">
              {/* Efeito de mistério */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-2xl"></div>
              
              <div className="text-center pt-4 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  {/* Silhueta mistério */}
                  <div className="mx-auto mb-5 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-gray-400/30 to-gray-600/30 rounded-full flex items-center justify-center border-3 border-white/20 shadow-xl relative overflow-hidden">
                    {/* Efeito de silhueta */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-700/40 to-gray-900/60 rounded-full"></div>
                    <span className="text-3xl md:text-4xl lg:text-5xl opacity-60">👤</span>
                    
                    {/* Efeito de brilho animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
                  </div>
                  
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-5 text-white/80">
                    Quem será o próximo?
                  </h2>
                  
                  <p className="text-sm md:text-base lg:text-lg opacity-90 font-light text-white/80 mb-5">
                    Edição de Outubro – Pode ser você!
                  </p>
                </div>
                
                {/* Call to action */}
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-lg md:text-xl animate-pulse">⚡</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold text-white/90">Participe do próximo Kahoot!</span>
                    <span className="text-lg md:text-xl animate-pulse delay-500">⚡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-5 flex-shrink-0">
          <p className="text-lg md:text-xl lg:text-2xl opacity-80 font-light">
            Teste seus conhecimentos e seja o próximo campeão!
          </p>
        </div>
      </div>
    </div>
  )
}