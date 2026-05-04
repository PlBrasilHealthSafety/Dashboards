import { useEffect } from 'react'

interface BuildVersionManifest {
  appVersion?: string
  buildId?: string
}

const VERSION_CHECK_INTERVAL_MS = 2 * 60000
const VERSION_CHECK_TIMEOUT_MS = 4000

const readRemoteVersionManifest = async (signal: AbortSignal) => {
  const response = await fetch(`/version.json?ts=${Date.now()}`, {
    cache: 'no-store',
    signal,
  })

  if (!response.ok) {
    throw new Error(`Falha ao consultar versao publicada: ${response.status}`)
  }

  return response.json() as Promise<BuildVersionManifest>
}

const reloadApplicationWithCacheBust = () => {
  const nextUrl = new URL(window.location.href)
  nextUrl.searchParams.set('_build', Date.now().toString())
  window.location.replace(nextUrl.toString())
}

export function useBuildVersionMonitor() {
  useEffect(() => {
    let isDisposed = false

    const checkForNewBuild = async () => {
      const abortController = new AbortController()
      const timeoutId = window.setTimeout(() => abortController.abort(), VERSION_CHECK_TIMEOUT_MS)

      try {
        const manifest = await readRemoteVersionManifest(abortController.signal)

        if (!isDisposed && manifest.buildId && manifest.buildId !== __APP_BUILD_ID__) {
          console.info('Nova versao detectada. Recarregando a aplicacao para atualizar a TV.')
          reloadApplicationWithCacheBust()
        }
      } catch (error) {
        if (!isDisposed) {
          console.warn('Nao foi possivel verificar atualizacoes da aplicacao.', error)
        }
      } finally {
        window.clearTimeout(timeoutId)
      }
    }

    void checkForNewBuild()

    const intervalId = window.setInterval(() => {
      void checkForNewBuild()
    }, VERSION_CHECK_INTERVAL_MS)

    return () => {
      isDisposed = true
      window.clearInterval(intervalId)
    }
  }, [])
}