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
          <video
            width="100%"
            height="100%"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              minHeight: '100vh',
              minWidth: '100vw'
            }}
          >
            <source src="/novo-contrato-video.mp4" type="video/mp4" />
            <source src="/novo-contrato-video.webm" type="video/webm" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
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

          {/* Conteúdo principal - Otimizado para TV 55" */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
            
            {/* Header principal - Compacto */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-1000">
              <div className="mb-4">
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                  BEM-VINDO
                </h1>
                <p className="text-xl text-white/90 font-light tracking-wide">
                  O mais novo cliente da PLBrasil
                </p>
              </div>
              <div className="w-32 h-0.5 bg-white/60 mx-auto rounded-full"></div>
            </div>

            {/* Card único centralizado - Compacto para TV */}
            <div className="w-full max-w-3xl mb-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                <div className="text-center space-y-6">
                  
                  {/* Razão Social */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-bold text-[#00A298] uppercase tracking-wider mb-2">
                      Razão Social
                    </h3>
                    <p className="text-3xl font-black text-[#1D3C44] leading-tight">
                      {contrato.razaoSocial}
                    </p>
                  </div>

                  {/* Nome Fantasia */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-bold text-[#00A298] uppercase tracking-wider mb-2">
                      Nome Fantasia
                    </h3>
                    <p className="text-2xl font-bold text-[#1D3C44] leading-tight">
                      {contrato.nomeFantasia}
                    </p>
                  </div>

                  {/* Data de Início do Contrato */}
                  <div>
                    <h3 className="text-lg font-bold text-[#00A298] uppercase tracking-wider mb-2">
                      Data de Início do Contrato
                    </h3>
                    <p className="text-xl font-bold text-black leading-tight">
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

            {/* Footer com indicador de progresso - Compacto */}
            <div className="text-center animate-in fade-in duration-1000 delay-1000">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse delay-200"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-400"></div>
                </div>
                <span className="text-white text-lg font-medium tracking-wide">
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