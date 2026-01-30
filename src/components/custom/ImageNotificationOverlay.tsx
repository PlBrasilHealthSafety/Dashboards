import { useImageNotification } from '@/contexts/ImageNotificationContext'

export function ImageNotificationOverlay() {
  const { isImageVisible } = useImageNotification()

  if (!isImageVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <img 
        src="/uploads/dadada-1.png" 
        alt="Imagem Comercial"
        className="w-full h-full object-contain"
      />
    </div>
  )
}
