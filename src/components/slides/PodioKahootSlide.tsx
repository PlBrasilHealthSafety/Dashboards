import { Trophy, Star } from 'lucide-react'
import { useEffect } from 'react'

// Componentes SVG para medalhas de alta qualidade
const GoldMedal = () => (
  <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="40" r="20" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="2"/>
    <circle cx="32" cy="40" r="14" fill="url(#goldInner)" stroke="#DAA520" strokeWidth="1"/>
    <text x="32" y="45" textAnchor="middle" fill="#8B4513" fontSize="14" fontWeight="bold">1</text>
    <path d="M24 8L32 20L40 8" stroke="#FFD700" strokeWidth="4" fill="none"/>
    <path d="M20 4L32 20L44 4" stroke="#DAA520" strokeWidth="2" fill="none"/>
    <defs>
      <linearGradient id="goldGradient" x1="12" y1="20" x2="52" y2="60">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="50%" stopColor="#FFC800"/>
        <stop offset="100%" stopColor="#DAA520"/>
      </linearGradient>
      <linearGradient id="goldInner" x1="18" y1="26" x2="46" y2="54">
        <stop offset="0%" stopColor="#FFEC8B"/>
        <stop offset="100%" stopColor="#FFD700"/>
      </linearGradient>
    </defs>
  </svg>
)

const SilverMedal = () => (
  <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="40" r="20" fill="url(#silverGradient)" stroke="#708090" strokeWidth="2"/>
    <circle cx="32" cy="40" r="14" fill="url(#silverInner)" stroke="#A9A9A9" strokeWidth="1"/>
    <text x="32" y="45" textAnchor="middle" fill="#4A4A4A" fontSize="14" fontWeight="bold">2</text>
    <path d="M24 8L32 20L40 8" stroke="#C0C0C0" strokeWidth="4" fill="none"/>
    <path d="M20 4L32 20L44 4" stroke="#A9A9A9" strokeWidth="2" fill="none"/>
    <defs>
      <linearGradient id="silverGradient" x1="12" y1="20" x2="52" y2="60">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="50%" stopColor="#C0C0C0"/>
        <stop offset="100%" stopColor="#A9A9A9"/>
      </linearGradient>
      <linearGradient id="silverInner" x1="18" y1="26" x2="46" y2="54">
        <stop offset="0%" stopColor="#F5F5F5"/>
        <stop offset="100%" stopColor="#D3D3D3"/>
      </linearGradient>
    </defs>
  </svg>
)

const BronzeMedal = () => (
  <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="40" r="20" fill="url(#bronzeGradient)" stroke="#8B4513" strokeWidth="2"/>
    <circle cx="32" cy="40" r="14" fill="url(#bronzeInner)" stroke="#CD853F" strokeWidth="1"/>
    <text x="32" y="45" textAnchor="middle" fill="#5C3317" fontSize="14" fontWeight="bold">3</text>
    <path d="M24 8L32 20L40 8" stroke="#CD7F32" strokeWidth="4" fill="none"/>
    <path d="M20 4L32 20L44 4" stroke="#B8860B" strokeWidth="2" fill="none"/>
    <defs>
      <linearGradient id="bronzeGradient" x1="12" y1="20" x2="52" y2="60">
        <stop offset="0%" stopColor="#CD7F32"/>
        <stop offset="50%" stopColor="#B87333"/>
        <stop offset="100%" stopColor="#8B4513"/>
      </linearGradient>
      <linearGradient id="bronzeInner" x1="18" y1="26" x2="46" y2="54">
        <stop offset="0%" stopColor="#DEB887"/>
        <stop offset="100%" stopColor="#CD853F"/>
      </linearGradient>
    </defs>
  </svg>
)

export function PodioKahootSlide() {
  console.log('PodioKahootSlide renderizado - Timer deveria ser 180000ms (3 minutos)')
  console.log('Slide do Pódio Kahoot carregado - verificando se timer vai funcionar')
  
  // Log quando o componente é montado
  useEffect(() => {
    console.log('PodioKahootSlide montado - timer deveria iniciar')
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
            Pódio "Sabe Tudo PLHealth!"
          </h1>
          <div className="w-56 h-1.5 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Conteúdo Principal - Layout horizontal em duas colunas */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-2">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Card 1 - Finalistas (agora primeiro) */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-amber-400/30 shadow-2xl relative flex flex-col min-h-[540px]">
              {/* Ícone de estrela */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-amber-400 rounded-full p-2">
                  <Star className="w-5 h-5 text-[#1D3C44] fill-current" />
                </div>
              </div>

              <div className="text-center pt-4 flex flex-col items-center flex-1">
                {/* Subtítulo - Nossas Finalistas */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-amber-100">
                  Nossas Finalistas!
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto rounded-full mb-4"></div>

                {/* Foto das Finalistas - Altura grande */}
                <div className="mx-auto w-full max-w-md h-48 md:h-56 lg:h-72 rounded-xl border-3 border-amber-400/50 shadow-xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500 relative flex-1">
                  <img
                    src="/finalistas.jpg"
                    alt="Finalistas Kahoot PLHealth"
                    className="w-full h-full object-cover object-[center_30%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
                </div>

                {/* Texto de reconhecimento */}
                <div className="mt-4 bg-amber-400/20 rounded-xl p-3 border border-amber-400/30 w-full">
                  <div className="flex justify-center items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="text-base md:text-lg font-semibold">Parabéns a todas!</span>
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Pódio/Campeãs (agora segundo) */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-amber-400/30 shadow-2xl relative flex flex-col h-[540px]">
              {/* Ícone de coroa */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-amber-400 rounded-full p-2">
                  <Trophy className="w-5 h-5 text-[#1D3C44]" />
                </div>
              </div>

              <div className="text-center pt-4 flex flex-col items-center flex-1">
                {/* Subtítulo - Nossas Campeãs */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-amber-100">
                  Nossas Campeãs!
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto rounded-full mb-4"></div>

                {/* Foto das Campeãs - imagem maior com melhor qualidade */}
                <div className="mx-auto mb-3 w-full max-w-md h-40 md:h-48 lg:h-56 rounded-xl border-3 border-amber-400/50 shadow-xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500 relative">
                  <img
                    src="/campeoes.jpg"
                    alt="Pódio Kahoot PLHealth - Daniela, Letícia e Marcely"
                    className="w-full h-full object-cover object-[25%_center]"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>
                </div>

                {/* Lista do Pódio - centralizada verticalmente */}
                <div className="w-full space-y-2 my-auto">
                  {/* 1º Lugar - Ouro */}
                  <div className="grid grid-cols-[auto_80px_1fr] items-center gap-3 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 rounded-lg py-2.5 px-3 border border-amber-400/40">
                    <div className="flex justify-center w-10"><GoldMedal /></div>
                    <span className="text-base md:text-lg font-bold text-yellow-200">1º Lugar</span>
                    <span className="text-base md:text-lg font-semibold text-white">Daniela Silva</span>
                  </div>

                  {/* 2º Lugar - Prata */}
                  <div className="grid grid-cols-[auto_80px_1fr] items-center gap-3 bg-gradient-to-r from-gray-400/20 via-gray-300/30 to-gray-400/20 rounded-lg py-2.5 px-3 border border-gray-300/40">
                    <div className="flex justify-center w-10"><SilverMedal /></div>
                    <span className="text-base md:text-lg font-bold text-gray-200">2º Lugar</span>
                    <span className="text-base md:text-lg font-semibold text-white">Letícia Souza</span>
                  </div>

                  {/* 3º Lugar - Bronze */}
                  <div className="grid grid-cols-[auto_80px_1fr] items-center gap-3 bg-gradient-to-r from-orange-600/20 via-orange-500/30 to-orange-600/20 rounded-lg py-2.5 px-3 border border-orange-400/40">
                    <div className="flex justify-center w-10"><BronzeMedal /></div>
                    <span className="text-base md:text-lg font-bold text-orange-200">3º Lugar</span>
                    <span className="text-base md:text-lg font-semibold text-white">Marcely Soeiro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-5 flex-shrink-0">
          <p className="text-lg md:text-xl lg:text-2xl opacity-80 font-light">
            Ano que vem tem mais!
          </p>
        </div>
      </div>
    </div>
  )
}
