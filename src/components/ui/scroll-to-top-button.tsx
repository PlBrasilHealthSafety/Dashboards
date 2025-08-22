import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Calcular distância do fim da página
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset
      const windowHeight = window.innerHeight
      const distanceFromBottom = scrollHeight - (scrollTop + windowHeight)
      
      // Mostrar botão apenas quando está nos últimos 400px da página
      setIsVisible(distanceFromBottom <= 400)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Verificar posição inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gradient-to-br from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      style={{ bottom: '150px' }}
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}