import { useState, useEffect } from 'react'

interface ContratoNotificationOverlayProps {
  contrato: {
    razaoSocial: string
    nomeFantasia: string
    dataInicioContrato: string
    userId: string
  }
  onComplete: () => void
}

export function ContratoNotificationOverlay({ contrato, onComplete }: ContratoNotificationOverlayProps) {
  const [phase, setPhase] = useState<'video' | 'info'>('video')

  useEffect(() => {
    // Após 7 segundos (duração do vídeo), mudar para a fase de informações
    const videoTimer = setTimeout(() => {
      setPhase('info')
    }, 7000)

    return () => clearTimeout(videoTimer)
  }, [])



  useEffect(() => {
    if (phase === 'info') {
      // Após 2 minutos mostrando as informações, completar
      const infoTimer = setTimeout(() => {
        onComplete()
      }, 2 * 60 * 1000) // 2 minutos

      return () => clearTimeout(infoTimer)
    }
  }, [phase, onComplete])

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {phase === 'video' && (
        <div className="w-full h-full flex items-center justify-center">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/aLY51m8HAPY?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=0"
            title="Novo Contrato Criado"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
            style={{
              minHeight: '100vh',
              minWidth: '100vw'
            }}
          />
        </div>
      )}

      {phase === 'info' && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Background com padrão geométrico animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00A298] via-[#0B5C5B] to-[#1D3C44]">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/20 animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/15 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-16">
            
            {/* Header principal */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-1000">
              <div className="mb-8">
                <h1 className="text-8xl font-black text-white mb-4 tracking-tight">
                  BEM-VINDO
                </h1>
                <p className="text-3xl text-white/90 font-light tracking-wide">
                  O mais novo cliente da PLBrasil
                </p>
              </div>
              <div className="w-48 h-1 bg-white/60 mx-auto rounded-full"></div>
            </div>

            {/* Card único centralizado com informações empilhadas */}
            <div className="w-full max-w-4xl mb-16">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                <div className="text-center space-y-12">
                  
                  {/* Razão Social */}
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-2xl font-bold text-[#00A298] uppercase tracking-wider mb-4">
                      Razão Social
                    </h3>
                    <p className="text-5xl font-black text-[#1D3C44] leading-tight">
                      {contrato.razaoSocial}
                    </p>
                  </div>

                  {/* Nome Fantasia */}
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-2xl font-bold text-[#00A298] uppercase tracking-wider mb-4">
                      Nome Fantasia
                    </h3>
                    <p className="text-4xl font-bold text-[#1D3C44] leading-tight">
                      {contrato.nomeFantasia}
                    </p>
                  </div>

                  {/* Data de Início do Contrato */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#00A298] uppercase tracking-wider mb-4">
                      Data de Início do Contrato
                    </h3>
                    <p className="text-3xl font-bold text-[#00A298] leading-tight">
                      {new Date(contrato.dataInicioContrato).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com indicador de progresso */}
            <div className="text-center animate-in fade-in duration-1000 delay-1000">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-white/70 animate-pulse delay-200"></div>
                  <div className="w-3 h-3 rounded-full bg-white/50 animate-pulse delay-400"></div>
                </div>
                <span className="text-white text-xl font-medium tracking-wide">
                  Retornando aos slides em breve...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}