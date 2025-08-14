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
      
      // Rotações limitadas para evitar bug visual
      groupRef.current.rotation.z = time * 0.3
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.15  // Limitado
      groupRef.current.rotation.y = Math.cos(time * 0.4) * 0.1   // Muito limitado
      
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
              side={2}
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

export function SimpleLineChart({ 
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
      
      // Movimento orbital fluido
      const orbitX = Math.cos(time * orbitSpeed * 1.2) * orbitRadius * 0.8
      const orbitY = Math.sin(time * orbitSpeed * 0.8) * (orbitRadius * 0.6)
      const orbitZ = Math.sin(time * orbitSpeed * 0.6) * (orbitRadius * 0.4)
      
      // Calcular posição atual e escala dinâmica
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações sutis
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.2
      groupRef.current.rotation.y = time * 0.2
      groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.15
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  // Dados do line chart
  const dataPoints = [
    { x: -2.5, y: 0.3, color: '#2E86AB' },
    { x: -1.5, y: 0.8, color: '#6A994E' },
    { x: -0.5, y: 0.5, color: '#F18F01' },
    { x: 0.5, y: 1.2, color: '#C73E1D' },
    { x: 1.5, y: 0.9, color: '#A23B72' },
    { x: 2.5, y: 1.4, color: '#577590' },
  ]

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {/* Pontos do gráfico */}
      {dataPoints.map((point, index) => (
        <mesh key={`point-${index}`} position={[point.x, point.y, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color={point.color}
            transparent
            opacity={opacity}
            emissive={point.color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      ))}
      
      {/* Linhas conectando os pontos */}
      {dataPoints.slice(0, -1).map((point, index) => {
        const nextPoint = dataPoints[index + 1]
        const midX = (point.x + nextPoint.x) / 2
        const midY = (point.y + nextPoint.y) / 2
        const length = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + 
          Math.pow(nextPoint.y - point.y, 2)
        )
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)
        
        return (
          <mesh 
            key={`line-${index}`} 
            position={[midX, midY, 0]}
            rotation={[0, 0, angle]}
          >
            <cylinderGeometry args={[0.04, 0.04, length, 8]} />
            <meshStandardMaterial 
              color={point.color}
              transparent
              opacity={opacity * 0.8}
              emissive={point.color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}