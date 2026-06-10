import { useState, useEffect, useRef, useCallback } from 'react'

type BrowserTimeoutHandle = number

interface ContratoNotificationOverlayProps {
  contrato: {
    razaoSocial: string
    nomeFantasia: string
    dataInicioContrato: string
    userId: string
  }
  onComplete: () => void
}

const INFO_PHASE_DURATION_MS = 2 * 60 * 1000
const MAX_VIDEO_PHASE_MS = 45 * 1000
const MAX_TOTAL_OVERLAY_MS = MAX_VIDEO_PHASE_MS + INFO_PHASE_DURATION_MS + 15 * 1000

export function ContratoNotificationOverlay({ contrato, onComplete }: ContratoNotificationOverlayProps) {
  const [phase, setPhase] = useState<'video' | 'info'>('video')
  const [videoMuted, setVideoMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const safetyTimerRef = useRef<BrowserTimeoutHandle | null>(null)
  const videoPhaseTimerRef = useRef<BrowserTimeoutHandle | null>(null)
  const onCompleteRef = useRef(onComplete)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const clearTimer = (timerRef: { current: BrowserTimeoutHandle | null }) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const finishOverlay = useCallback((reason: string) => {
    if (hasCompletedRef.current) {
      return
    }

    hasCompletedRef.current = true
    clearTimer(safetyTimerRef)
    clearTimer(videoPhaseTimerRef)
    console.log(`ContratoNotificationOverlay: encerrando overlay (${reason})`)
    onCompleteRef.current()
  }, [])

  const goToInfoPhase = useCallback((reason: string) => {
    clearTimer(videoPhaseTimerRef)
    console.log(`ContratoNotificationOverlay: indo para fase de informações (${reason})`)
    setPhase('info')
  }, [])

  const setupSafetyTimer = useCallback((videoDuration?: number) => {
    clearTimer(safetyTimerRef)

    const safetyTime = videoDuration
      ? Math.min((videoDuration + 5) * 1000, MAX_VIDEO_PHASE_MS)
      : MAX_VIDEO_PHASE_MS

    safetyTimerRef.current = window.setTimeout(() => {
      goToInfoPhase(`timer de segurança após ${safetyTime / 1000}s`)
    }, safetyTime)
  }, [goToInfoPhase])

  useEffect(() => {
    setupSafetyTimer()

    videoPhaseTimerRef.current = window.setTimeout(() => {
      goToInfoPhase('limite máximo da fase de vídeo')
    }, MAX_VIDEO_PHASE_MS)

    const absoluteExitTimer = window.setTimeout(() => {
      finishOverlay('limite absoluto do overlay')
    }, MAX_TOTAL_OVERLAY_MS)

    return () => {
      clearTimer(safetyTimerRef)
      clearTimer(videoPhaseTimerRef)
      window.clearTimeout(absoluteExitTimer)
    }
  }, [finishOverlay, goToInfoPhase, setupSafetyTimer])

  useEffect(() => {
    if (phase !== 'video') {
      return
    }

    const video = videoRef.current
    if (!video) {
      return
    }

    video.volume = 1.0
    video.muted = false

    const handleCanPlay = async () => {
      try {
        video.muted = false
        video.volume = 1.0
        await video.play()
      } catch {
        video.muted = true
        setVideoMuted(true)
        try {
          await video.play()
        } catch (mutedError) {
          console.error('Erro ao reproduzir vídeo:', mutedError)
          goToInfoPhase('falha ao reproduzir vídeo')
        }
      }
    }

    const handleEnded = () => {
      goToInfoPhase('vídeo terminou naturalmente')
    }

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.25) {
        goToInfoPhase('vídeo próximo do fim')
      }
    }

    const handleLoadedMetadata = () => {
      setupSafetyTimer(video.duration)
    }

    const handleVideoError = () => {
      goToInfoPhase('erro ao carregar vídeo')
    }

    const handleStalled = () => {
      goToInfoPhase('vídeo travou no carregamento')
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleVideoError)
    video.addEventListener('stalled', handleStalled)

    if (video.readyState >= 3) {
      void handleCanPlay()
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleVideoError)
      video.removeEventListener('stalled', handleStalled)
    }
  }, [goToInfoPhase, phase, setupSafetyTimer])

  const handleVideoClick = () => {
    if (videoRef.current && videoMuted) {
      videoRef.current.muted = false
      setVideoMuted(false)
    }
  }

  useEffect(() => {
    if (phase === 'info') {
      clearTimer(safetyTimerRef)

      const infoTimer = window.setTimeout(() => {
        finishOverlay('fase de informações concluída')
      }, INFO_PHASE_DURATION_MS)

      return () => window.clearTimeout(infoTimer)
    }
  }, [finishOverlay, phase])

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {phase === 'video' && (
        <div className="w-full h-full flex items-center justify-center relative">
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            autoPlay
            playsInline
            controls={false}
            preload="auto"
            onClick={handleVideoClick}
            className="w-full h-full object-cover cursor-pointer"
            style={{
              minHeight: '100vh',
              minWidth: '100vw'
            }}
          >
            <source src="/novo-contrato-video.mp4" type="video/mp4" />
            <source src="/novo-contrato-video.webm" type="video/webm" />
            Seu navegador não suporta o elemento de vídeo.
          </video>

          {videoMuted && (
            <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur-sm rounded-full p-4 animate-pulse">
              <div className="flex items-center gap-2 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span className="text-sm font-medium">Toque para ativar som</span>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'info' && (
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00A298] via-[#0B5C5B] to-[#1D3C44]">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/20 animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/15 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>
          </div>

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
            <div className="text-center mb-20 animate-in fade-in slide-in-from-top duration-1000">
              <div className="mb-6">
                <h1 className="text-7xl font-black text-white mb-4 tracking-tight">
                  BEM-VINDO
                </h1>
                <p className="text-2xl text-white/90 font-light tracking-wide">
                  O mais novo cliente da PLBrasil
                </p>
              </div>
              <div className="w-40 h-1 bg-white/60 mx-auto rounded-full"></div>
            </div>

            <div className="w-full max-w-5xl mb-20">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-[#00A298]/20 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                <div className="text-center space-y-10">
                  <div className="border-b border-[#00A298]/30 pb-6">
                    <h3 className="text-2xl font-bold text-[#00A298] uppercase tracking-wider mb-4">
                      Razão Social
                    </h3>
                    <p className="text-4xl font-black text-[#1D3C44] leading-tight">
                      {contrato.razaoSocial}
                    </p>
                  </div>

                  <div className="border-b border-[#00A298]/30 pb-6">
                    <h3 className="text-2xl font-bold text-[#00A298] uppercase tracking-wider mb-4">
                      Nome Fantasia
                    </h3>
                    <p className="text-3xl font-bold text-[#1D3C44] leading-tight">
                      {contrato.nomeFantasia}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#00A298] uppercase tracking-wider mb-4">
                      Data de Início do Contrato
                    </h3>
                    <p className="text-2xl font-bold text-[#1D3C44] leading-tight">
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

            <div className="text-center animate-in fade-in duration-1000 delay-1000">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <div className="flex space-x-2">
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
