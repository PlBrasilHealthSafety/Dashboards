import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { Group, Vector3 } from 'three'

interface ComponentProps {
  position: [number, number, number]
  isAnimationStarted: boolean
  orbitRadius?: number
  orbitSpeed?: number
  scale?: number
  delayMultiplier?: number
}

// Função utilitária para calcular escala baseada na distância
const calculateDynamicScale = (currentX: number, currentY: number, currentZ: number, baseScale: number) => {
  const distanceFromCamera = Math.sqrt(
    currentX * currentX + 
    currentY * currentY + 
    (currentZ - 15) * (currentZ - 15)
  )
  
  const minDistance = 10
  const maxDistance = 25
  const normalizedDistance = Math.max(0, Math.min(1, (distanceFromCamera - minDistance) / (maxDistance - minDistance)))
  const scaleMultiplier = 1.5 - normalizedDistance * 0.8
  
  return baseScale * scaleMultiplier
}

export function SimpleBarChart({ 
  position, 
  isAnimationStarted, 
  orbitRadius = 3, 
  orbitSpeed = 0.3, 
  scale = 1,
  delayMultiplier = 0
}: ComponentProps) {
  const groupRef = useRef<Group>(null)
  const [opacity, setOpacity] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [dynamicScale, setDynamicScale] = useState(scale)
  const basePosition = useRef<Vector3>(new Vector3(...position))

  const data = [
    { value: 80, color: '#2E86AB' },  // Azul profundo - dados estáveis
    { value: 65, color: '#6A994E' },  // Verde - crescimento
    { value: 90, color: '#F18F01' },  // Laranja - destaque
    { value: 45, color: '#C73E1D' },  // Vermelho - atenção
    { value: 75, color: '#A23B72' },  // Magenta - diferenciação
  ]

  useEffect(() => {
    if (isAnimationStarted) {
      // Delay gradual baseado no delayMultiplier (200ms por unidade)
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 1500 + Math.random() * 800
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          
          setAnimationProgress(easeOutCubic)
          setOpacity(easeOutCubic * 1.0)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        
        animate()
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [isAnimationStarted, delayMultiplier])

  useFrame((state) => {
    if (groupRef.current && isAnimationStarted && animationProgress > 0.3) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital complexo
      const orbitX = Math.cos(time * orbitSpeed) * orbitRadius
      const orbitY = Math.sin(time * orbitSpeed * 0.7) * (orbitRadius * 0.6)
      const orbitZ = Math.sin(time * orbitSpeed * 0.5) * (orbitRadius * 0.3)
      
      // Calcular posição atual e escala dinâmica
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações suaves
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.3
      groupRef.current.rotation.y = time * 0.2
      groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.2
      
      // Posição final com movimento orbital
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {data.map((item, index) => (
        <mesh
          key={index}
          position={[(index - 2) * 0.8, item.value / 200, 0]}
        >
          <boxGeometry args={[0.5, item.value / 100, 0.5]} />
          <meshStandardMaterial 
            color={item.color} 
            transparent 
            opacity={opacity}
            emissive={item.color}
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export function SimplePieChart({ 
  position, 
  isAnimationStarted, 
  orbitRadius = 3, 
  orbitSpeed = 0.3, 
  scale = 1,
  delayMultiplier = 0
}: ComponentProps) {
  const groupRef = useRef<Group>(null)
  const [opacity, setOpacity] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [dynamicScale, setDynamicScale] = useState(scale)
  const basePosition = useRef<Vector3>(new Vector3(...position))
  
  const segments = [
    { angle: 90, color: '#2E86AB' },   // Azul profundo - principal
    { angle: 120, color: '#6A994E' },  // Verde - sucesso
    { angle: 80, color: '#F18F01' },   // Laranja - atenção
    { angle: 70, color: '#A23B72' },   // Magenta - categoria especial
  ]

  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 1800 + Math.random() * 1000
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          
          setAnimationProgress(easeOutCubic)
          setOpacity(easeOutCubic * 1.0)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        
        animate()
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [isAnimationStarted, delayMultiplier])

  useFrame((state) => {
    if (groupRef.current && isAnimationStarted && animationProgress > 0.3) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital em padrão diferente
      const orbitX = Math.sin(time * orbitSpeed * 1.2) * orbitRadius
      const orbitY = Math.cos(time * orbitSpeed * 0.8) * (orbitRadius * 0.7)
      const orbitZ = Math.cos(time * orbitSpeed * 0.6) * (orbitRadius * 0.4)
      
      // Calcular posição atual e escala dinâmica
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações contínuas
      groupRef.current.rotation.z = time * 0.3
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2
      groupRef.current.rotation.y = Math.cos(time * 0.4) * 0.3
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  let currentAngle = 0

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {segments.map((segment, index) => {
        const startAngle = (currentAngle * Math.PI) / 180
        currentAngle += segment.angle
        
        return (
          <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 1.5, 16, 1, startAngle, (segment.angle * Math.PI) / 180]} />
            <meshStandardMaterial 
              color={segment.color}
              transparent
              opacity={opacity}
              emissive={segment.color}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function SimpleMetrics({ 
  position, 
  isAnimationStarted, 
  orbitRadius = 3, 
  orbitSpeed = 0.3, 
  scale = 1,
  delayMultiplier = 0
}: ComponentProps) {
  const groupRef = useRef<Group>(null)
  const [opacity, setOpacity] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [dynamicScale, setDynamicScale] = useState(scale)
  const basePosition = useRef<Vector3>(new Vector3(...position))
  
  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 1600 + Math.random() * 1000
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          
          setAnimationProgress(easeOutCubic)
          setOpacity(easeOutCubic * 1.0)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        
        animate()
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [isAnimationStarted, delayMultiplier])

  useFrame((state) => {
    if (groupRef.current && isAnimationStarted && animationProgress > 0.3) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital em forma de 8
      const orbitX = Math.sin(time * orbitSpeed * 2) * orbitRadius * 0.8
      const orbitY = Math.sin(time * orbitSpeed) * (orbitRadius * 0.9)
      const orbitZ = Math.cos(time * orbitSpeed * 1.5) * (orbitRadius * 0.2)
      
      // Calcular posição atual e escala dinâmica
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações complexas
      groupRef.current.rotation.x = Math.sin(time * 0.6) * 0.4
      groupRef.current.rotation.y = time * 0.25
      groupRef.current.rotation.z = Math.cos(time * 0.8) * 0.3
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  const metrics = [
    { position: [0, 0, 0], color: '#2E86AB' },      // Azul - métrica principal
    { position: [1.5, 0, 0], color: '#6A994E' },    // Verde - métrica positiva
    { position: [-1.5, 0, 0], color: '#577590' },   // Azul acinzentado - métrica secundária
  ]

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {metrics.map((metric, index) => (
        <mesh key={index} position={metric.position as [number, number, number]}>
          <boxGeometry args={[0.8, 0.4, 0.1]} />
          <meshStandardMaterial 
            color={metric.color}
            transparent
            opacity={opacity}
            emissive={metric.color}
            emissiveIntensity={0.6}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

export function SimpleDashboardGrid({ 
  position, 
  isAnimationStarted, 
  orbitRadius = 3, 
  orbitSpeed = 0.3, 
  scale = 1,
  delayMultiplier = 0
}: ComponentProps) {
  const groupRef = useRef<Group>(null)
  const [opacity, setOpacity] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [dynamicScale, setDynamicScale] = useState(scale)
  const basePosition = useRef<Vector3>(new Vector3(...position))
  
  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 1700 + Math.random() * 900
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          
          setAnimationProgress(easeOutCubic)
          setOpacity(easeOutCubic * 1.0)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        
        animate()
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [isAnimationStarted, delayMultiplier])

  useFrame((state) => {
    if (groupRef.current && isAnimationStarted && animationProgress > 0.3) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital suave
      const orbitX = Math.cos(time * orbitSpeed * 1.1) * orbitRadius * 0.9
      const orbitY = Math.sin(time * orbitSpeed * 0.9) * (orbitRadius * 0.5)
      const orbitZ = Math.sin(time * orbitSpeed * 0.7) * (orbitRadius * 0.3)
      
      // Calcular posição atual e escala dinâmica
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações sutis
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
      groupRef.current.rotation.y = time * 0.15
      groupRef.current.rotation.z = Math.cos(time * 0.4) * 0.1
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  // Grid de dashboard 3x3
  const gridCells = []
  const colors = ['#2E86AB', '#6A994E', '#F18F01', '#C73E1D', '#A23B72']
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gridCells.push({
        position: [(i - 1) * 0.7, (j - 1) * 0.7, 0],
        color: colors[(i + j) % colors.length],
        height: 0.3 + Math.random() * 0.4
      })
    }
  }

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {gridCells.map((cell, index) => (
        <mesh key={index} position={cell.position as [number, number, number]}>
          <boxGeometry args={[0.5, 0.5, cell.height]} />
          <meshStandardMaterial 
            color={cell.color}
            transparent
            opacity={opacity}
            emissive={cell.color}
            emissiveIntensity={0.45}
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}