import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'

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
  const [phase, setPhase] = useState<'waiting' | 'video' | 'info'>('waiting')
  const [countdown, setCountdown] = useState(60) // 60 segundos = 1 minuto

  useEffect(() => {
    // Delay de 1 minuto antes do vídeo
    const waitingTimer = setTimeout(() => {
      setPhase('video')
    }, 60000) // 1 minuto

    // Countdown para mostrar o tempo restante
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(waitingTimer)
      clearInterval(countdownInterval)
    }
  }, [])

  useEffect(() => {
    if (phase === 'video') {
      // Após 7 segundos (duração do vídeo), mudar para a fase de informações
      const videoTimer = setTimeout(() => {
        setPhase('info')
      }, 7000)

      return () => clearTimeout(videoTimer)
    }
  }, [phase])

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
      {phase === 'waiting' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00A298] to-[#1D3C44] flex items-center justify-center shadow-2xl mx-auto mb-6">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Novo Contrato Detectado!
              </h1>
              <p className="text-xl text-gray-300">
                Preparando apresentação...
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-6xl font-bold text-[#00A298] mb-2">
                {countdown}
              </div>
              <p className="text-white text-lg">
                segundos restantes
              </p>
            </div>
            
            <div className="mt-8">
              <div className="w-32 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00A298] to-[#1D3C44] rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - countdown) / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="max-w-6xl w-full">
            {/* Header com animação */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-1000">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A298] to-[#1D3C44] flex items-center justify-center shadow-2xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
                  O mais novo cliente da PLBrasil
                </h1>
              </div>
              <div className="w-32 h-2 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto rounded-full"></div>
            </div>

            {/* Card principal com as informações - Centralizado */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl p-12 border border-gray-200 animate-in fade-in slide-in-from-bottom duration-1000 delay-300 text-center">
              {/* Razão Social */}
              <div className="mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#00A298]"></div>
                  <h2 className="text-2xl font-semibold text-gray-600 uppercase tracking-wider">
                    Razão Social
                  </h2>
                </div>
                <h3 className="text-5xl font-bold text-[#1D3C44] leading-tight">
                  {contrato.razaoSocial}
                </h3>
              </div>

              {/* Nome Fantasia */}
              <div className="mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#00A298]"></div>
                  <h2 className="text-2xl font-semibold text-gray-600 uppercase tracking-wider">
                    Nome Fantasia
                  </h2>
                </div>
                <p className="text-4xl font-semibold text-gray-700 leading-relaxed">
                  {contrato.nomeFantasia}
                </p>
              </div>

              {/* Data de Início do Contrato */}
              <div className="mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#00A298]"></div>
                  <h2 className="text-2xl font-semibold text-gray-600 uppercase tracking-wider">
                    Data de Início do Contrato
                  </h2>
                </div>
                <p className="text-3xl font-bold text-[#00A298] leading-relaxed">
                  {new Date(contrato.dataInicioContrato).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Indicador de progresso */}
            <div className="mt-8 text-center animate-in fade-in duration-1000 delay-700">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/20 rounded-full backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-[#00A298] animate-pulse"></div>
                <span className="text-white text-lg font-medium">
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