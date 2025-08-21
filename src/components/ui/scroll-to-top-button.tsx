import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [bottomPosition, setBottomPosition] = useState(32)

  useEffect(() => {
    const handleScrollAndResize = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      const footer = document.querySelector('footer')
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        if (footerRect.top < windowHeight) {
          const footerDistance = windowHeight - footerRect.top
          setBottomPosition(footerDistance + 16)
        } else {
          setBottomPosition(32)
        }
      }
    }

    window.addEventListener('scroll', handleScrollAndResize)
    window.addEventListener('resize', handleScrollAndResize)
    handleScrollAndResize()

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize)
      window.removeEventListener('resize', handleScrollAndResize)
    }
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
      style={{ bottom: `${bottomPosition}px` }}
      className={`fixed right-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2 pointer-events-none'
      } bg-gradient-to-br from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90`}
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}