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
  const wireframeGroupRef = useRef<Group>(null)
  const [opacity, setOpacity] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [dynamicScale, setDynamicScale] = useState(scale)
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const basePosition = useRef<Vector3>(new Vector3(...position))

  const data = [
    { value: 80, color: '#00A298', baseHeight: 0.8 },
    { value: 65, color: '#1D3C44', baseHeight: 0.65 },
    { value: 90, color: '#AECECB', baseHeight: 0.9 },
    { value: 45, color: '#00A298', baseHeight: 0.45 },
    { value: 75, color: '#1D3C44', baseHeight: 0.75 },
  ]

  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 2000 + Math.random() * 1000
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutElastic = progress === 1 ? 1 : -Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * (2 * Math.PI) / 3) + 1
          
          setAnimationProgress(easeOutElastic)
          setOpacity(Math.min(progress * 1.2, 1))
          
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
    if (groupRef.current && isAnimationStarted && animationProgress > 0.1) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital mais dramático
      const orbitX = Math.cos(time * orbitSpeed * 1.5) * orbitRadius * 1.2
      const orbitY = Math.sin(time * orbitSpeed * 0.8) * (orbitRadius * 0.8)
      const orbitZ = Math.sin(time * orbitSpeed * 1.2) * (orbitRadius * 0.5)
      
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações mais dramáticas
      groupRef.current.rotation.x = Math.sin(time * 0.6) * 0.4
      groupRef.current.rotation.y = time * 0.3
      groupRef.current.rotation.z = Math.cos(time * 0.5) * 0.3
      
      // Efeito de pulsação sincronizado
      const pulse = (Math.sin(time * 4) + 1) * 0.5
      setPulseIntensity(pulse * 0.8)
      
      groupRef.current.position.set(currentX, currentY, currentZ)
      
      // Animação do wireframe
      if (wireframeGroupRef.current) {
        wireframeGroupRef.current.rotation.x = -groupRef.current.rotation.x * 0.5
        wireframeGroupRef.current.rotation.y = groupRef.current.rotation.y * 1.2
        wireframeGroupRef.current.rotation.z = -groupRef.current.rotation.z * 0.8
      }
    }
  })

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {/* Camada principal com efeitos tecnológicos */}
      {data.map((item, index) => {
        const barHeight = (item.baseHeight + pulseIntensity * 0.2) * animationProgress
        const xPos = (index - 2) * 0.8
        
        return (
          <group key={`bar-${index}`} position={[xPos, barHeight / 2, 0]}>
            {/* Barra principal com material emissivo */}
            <mesh>
              <boxGeometry args={[0.5, barHeight, 0.5]} />
              <meshStandardMaterial 
                color={item.color}
                transparent 
                opacity={opacity * 0.9}
                emissive={item.color}
                emissiveIntensity={0.8 + pulseIntensity * 0.4}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
            
            {/* Camada de glow externa */}
            <mesh scale={[1.1, 1.05, 1.1]}>
              <boxGeometry args={[0.5, barHeight, 0.5]} />
              <meshStandardMaterial 
                color={item.color}
                transparent 
                opacity={opacity * 0.3}
                emissive={item.color}
                emissiveIntensity={1.2 + pulseIntensity * 0.6}
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
            
            {/* Wireframe tecnológico */}
            <mesh scale={[1.05, 1.02, 1.05]}>
              <boxGeometry args={[0.5, barHeight, 0.5]} />
              <meshBasicMaterial 
                color={item.color}
                wireframe={true}
                transparent 
                opacity={opacity * 0.6}
              />
            </mesh>
            
            {/* Partículas no topo */}
            <mesh position={[0, barHeight / 2 + 0.2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial 
                color={item.color}
                transparent 
                opacity={opacity * (0.8 + pulseIntensity * 0.4)}
                emissive={item.color}
                emissiveIntensity={1.5 + pulseIntensity * 0.8}
              />
            </mesh>
            
            {/* Linha de energia vertical */}
            <mesh position={[0, 0, 0.26]} scale={[0.02, 1, 0.02]}>
              <boxGeometry args={[1, barHeight, 1]} />
              <meshStandardMaterial 
                color={'#1D3C44'}
                transparent 
                opacity={opacity * 0.9}
                emissive={'#1D3C44'}
                emissiveIntensity={1.0 + pulseIntensity * 0.5}
              />
            </mesh>
          </group>
        )
      })}
      
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
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const basePosition = useRef<Vector3>(new Vector3(...position))
  
  const segments = [
    { angle: 90, color: '#00A298', value: 35 },
    { angle: 120, color: '#1D3C44', value: 28 },
    { angle: 80, color: '#AECECB', value: 22 },
    { angle: 70, color: '#00A298', value: 15 },
  ]

  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 2500 + Math.random() * 1200
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutBack = 1 + (2.7 * Math.pow(progress - 1, 3)) + (1.7 * Math.pow(progress - 1, 2))
          
          setAnimationProgress(easeOutBack)
          setOpacity(Math.min(progress * 1.3, 1))
          setRotationSpeed(progress * 0.4)
          
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
    if (groupRef.current && isAnimationStarted && animationProgress > 0.1) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital hipnótico
      const orbitX = Math.sin(time * orbitSpeed * 1.4) * orbitRadius * 1.3
      const orbitY = Math.cos(time * orbitSpeed * 0.9) * (orbitRadius * 0.9)
      const orbitZ = Math.sin(time * orbitSpeed * 0.7) * (orbitRadius * 0.6)
      
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações mais dinâmicas
      groupRef.current.rotation.z = time * (0.5 + rotationSpeed)
      groupRef.current.rotation.x = Math.sin(time * 0.7) * 0.25
      groupRef.current.rotation.y = Math.cos(time * 0.6) * 0.2
      
      // Pulsação sincronizada
      const pulse = (Math.sin(time * 3.5) + 1) * 0.5
      setPulseIntensity(pulse * 0.9)
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  let currentAngle = 0

  return (
    <group ref={groupRef} scale={dynamicScale}>
      
      {/* Segmentos principais com efeitos tecnológicos */}
      {segments.map((segment, index) => {
        const startAngle = (currentAngle * Math.PI) / 180
        currentAngle += segment.angle
        const midAngle = startAngle + (segment.angle * Math.PI) / 360
        const radius = 1.0 + pulseIntensity * 0.15
        
        return (
          <group key={`segment-${index}`}>
            {/* Segmento principal */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.4, radius, 24, 1, startAngle, (segment.angle * Math.PI) / 180]} />
              <meshStandardMaterial 
                color={segment.color}
                transparent
                opacity={opacity * 0.9}
                emissive={segment.color}
                emissiveIntensity={0.8 + pulseIntensity * 0.5}
                roughness={0.1}
                metalness={0.7}
                side={2}
              />
            </mesh>
            
            {/* Camada de glow */}
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.1, 1.1, 1]}>
              <ringGeometry args={[0.35, radius + 0.15, 16, 1, startAngle, (segment.angle * Math.PI) / 180]} />
              <meshStandardMaterial 
                color={segment.color}
                transparent
                opacity={opacity * 0.4}
                emissive={segment.color}
                emissiveIntensity={1.4 + pulseIntensity * 0.8}
                roughness={0.8}
                metalness={0.2}
                side={2}
              />
            </mesh>
            
            {/* Wireframe tecnológico */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.42, radius - 0.02, 16, 1, startAngle, (segment.angle * Math.PI) / 180]} />
              <meshBasicMaterial 
                color={segment.color}
                wireframe={true}
                transparent
                opacity={opacity * 0.7}
              />
            </mesh>
            
            {/* Indicador de valor no centro de cada segmento */}
            <mesh 
              position={[
                Math.cos(midAngle) * (radius - 0.2),
                0.05,
                Math.sin(midAngle) * (radius - 0.2)
              ]}
            >
              <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
              <meshStandardMaterial 
                color={'#1D3C44'}
                transparent
                opacity={opacity * 0.9}
                emissive={'#1D3C44'}
                emissiveIntensity={1.5 + pulseIntensity * 0.7}
              />
            </mesh>
            
            {/* Linha de energia radial */}
            <mesh 
              position={[
                Math.cos(midAngle) * (radius / 2),
                0,
                Math.sin(midAngle) * (radius / 2)
              ]}
              rotation={[0, midAngle, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.01, 0.01, radius - 0.4, 8]} />
              <meshStandardMaterial 
                color={'#1D3C44'}
                transparent
                opacity={opacity * 0.8}
                emissive={'#1D3C44'}
                emissiveIntensity={1.0 + pulseIntensity * 0.4}
              />
            </mesh>
          </group>
        )
      })}
      
      
      {/* Partículas orbitais */}
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * Math.PI * 2
        const orbitRadius = 1.9 + Math.sin(index) * 0.1
        return (
          <mesh 
            key={`particle-${index}`}
            position={[
              Math.cos(angle) * orbitRadius,
              Math.sin(angle * 2) * 0.1,
              Math.sin(angle) * orbitRadius
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial 
              color={'#AECECB'}
              transparent
              opacity={opacity * (0.7 + pulseIntensity * 0.3)}
              emissive={'#AECECB'}
              emissiveIntensity={1.8 + pulseIntensity}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function NeuralNetwork({ 
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
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const basePosition = useRef<Vector3>(new Vector3(...position))
  
  // Estrutura simplificada de rede neural
  const neuralLayers = [
    { 
      neurons: 4, 
      position: [-1.0, 0, 0], 
      color: '#00A298', 
      radius: 0.08
    },
    { 
      neurons: 6, 
      position: [-0.3, 0, 0], 
      color: '#1D3C44', 
      radius: 0.06
    },
    { 
      neurons: 4, 
      position: [0.4, 0, 0], 
      color: '#AECECB', 
      radius: 0.07
    },
    { 
      neurons: 3, 
      position: [1.1, 0, 0], 
      color: '#00A298', 
      radius: 0.09
    }
  ]

  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 1800 + Math.random() * 800
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          
          setAnimationProgress(easeOutCubic)
          setOpacity(Math.min(progress * 0.8, 0.8))
          
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
    if (groupRef.current && isAnimationStarted && animationProgress > 0.1) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital suave
      const orbitX = Math.sin(time * orbitSpeed) * orbitRadius * 0.7
      const orbitY = Math.sin(time * orbitSpeed * 0.6) * (orbitRadius * 0.5)
      const orbitZ = Math.cos(time * orbitSpeed * 0.8) * (orbitRadius * 0.3)
      
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotação suave
      groupRef.current.rotation.y = time * 0.1
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.05
      
      // Pulso sutil
      const pulse = (Math.sin(time * 2) + 1) * 0.5
      setPulseIntensity(pulse * 0.3)
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  // Função para calcular posições dos neurônios
  const getNeuronPositions = (layer: typeof neuralLayers[0]) => {
    const positions: [number, number, number][] = []
    const spacing = layer.neurons > 1 ? 1.0 / (layer.neurons - 1) : 0
    const startY = layer.neurons > 1 ? -0.5 : 0
    
    for (let i = 0; i < layer.neurons; i++) {
      positions.push([
        layer.position[0],
        startY + (i * spacing),
        layer.position[2]
      ])
    }
    return positions
  }

  // Criar conexões simples entre camadas
  const getConnections = () => {
    const connections: {
      from: [number, number, number]
      to: [number, number, number]
      opacity: number
    }[] = []
    
    for (let layerIndex = 0; layerIndex < neuralLayers.length - 1; layerIndex++) {
      const currentLayer = neuralLayers[layerIndex]
      const nextLayer = neuralLayers[layerIndex + 1]
      
      const currentPositions = getNeuronPositions(currentLayer)
      const nextPositions = getNeuronPositions(nextLayer)
      
      currentPositions.forEach((fromPos) => {
        nextPositions.forEach((toPos) => {
          // Conectar todos os neurônios com opacidade variável
          connections.push({
            from: fromPos,
            to: toPos,
            opacity: 0.2 + Math.random() * 0.4
          })
        })
      })
    }
    return connections
  }

  const connections = getConnections()

  return (
    <group ref={groupRef} scale={dynamicScale}>
      
      {/* Conexões neurais simples */}
      {connections.map((connection, index) => {
        const [fromX, fromY, fromZ] = connection.from
        const [toX, toY, toZ] = connection.to
        
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2
        const midZ = (fromZ + toZ) / 2
        
        const length = Math.sqrt(
          Math.pow(toX - fromX, 2) + 
          Math.pow(toY - fromY, 2) + 
          Math.pow(toZ - fromZ, 2)
        )
        
        const rotationY = Math.atan2(toX - fromX, toY - fromY)
        const rotationZ = Math.atan2(
          Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2)),
          toZ - fromZ
        )
        
        return (
          <mesh 
            key={`connection-${index}`}
            position={[midX, midY, midZ]}
            rotation={[0, rotationY, rotationZ]}
          >
            <cylinderGeometry args={[0.004, 0.004, length, 4]} />
            <meshStandardMaterial 
              color={'#1D3C44'}
              transparent
              opacity={opacity * connection.opacity}
              emissive={'#1D3C44'}
              emissiveIntensity={0.3 + pulseIntensity * 0.2}
              roughness={0.5}
              metalness={0.3}
            />
          </mesh>
        )
      })}
      
      {/* Neurônios simples */}
      {neuralLayers.map((layer, layerIndex) => {
        const neuronPositions = getNeuronPositions(layer)
        
        return neuronPositions.map((pos, neuronIndex) => {
          const [x, y, z] = pos
          
          return (
            <group key={`neuron-${layerIndex}-${neuronIndex}`} position={[x, y, z]}>
              {/* Neurônio principal */}
              <mesh>
                <sphereGeometry args={[layer.radius, 12, 12]} />
                <meshStandardMaterial 
                  color={layer.color}
                  transparent
                  opacity={opacity * 0.8}
                  emissive={layer.color}
                  emissiveIntensity={0.4 + pulseIntensity * 0.2}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
              
              {/* Anel sutil ao redor */}
              <mesh scale={[1.3, 1.3, 1.3]}>
                <sphereGeometry args={[layer.radius, 8, 8]} />
                <meshBasicMaterial 
                  color={layer.color}
                  wireframe={true}
                  transparent
                  opacity={opacity * 0.3}
                />
              </mesh>
            </group>
          )
        })
      })}
      

    </group>
  )
}

export function HolographicDashboard({ 
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
  const [scanEffect, setScanEffect] = useState(0)
  const [dataUpdate, setDataUpdate] = useState(0)
  const basePosition = useRef<Vector3>(new Vector3(...position))
  
  // Painéis holográficos flutuantes
  const panels = [
    { position: [0, 0.8, 0], rotation: [0, 0, 0], size: [1.2, 0.8], color: '#00A298', type: 'main' },
    { position: [-0.8, 0, 0.3], rotation: [0, 0.3, 0], size: [0.8, 0.6], color: '#1D3C44', type: 'side' },
    { position: [0.8, 0, 0.3], rotation: [0, -0.3, 0], size: [0.8, 0.6], color: '#AECECB', type: 'side' },
    { position: [0, -0.8, 0.1], rotation: [0.2, 0, 0], size: [1.0, 0.5], color: '#00A298', type: 'bottom' },
  ]

  useEffect(() => {
    if (isAnimationStarted) {
      const delay = delayMultiplier * 200
      
      const timer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 2000 + Math.random() * 1000
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Animação de materialização holográfica
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          
          setAnimationProgress(easeOutQuart)
          setOpacity(Math.min(progress * 1.1, 1))
          
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
    if (groupRef.current && isAnimationStarted && animationProgress > 0.1) {
      const time = state.clock.elapsedTime
      
      // Movimento orbital de dashboard
      const orbitX = Math.sin(time * orbitSpeed * 1.3) * orbitRadius * 1.1
      const orbitY = Math.cos(time * orbitSpeed * 0.9) * (orbitRadius * 0.8)
      const orbitZ = Math.sin(time * orbitSpeed * 1.1) * (orbitRadius * 0.4)
      
      const currentX = basePosition.current.x + orbitX * animationProgress
      const currentY = basePosition.current.y + orbitY * animationProgress
      const currentZ = basePosition.current.z + orbitZ * animationProgress
      
      setDynamicScale(calculateDynamicScale(currentX, currentY, currentZ, scale))
      
      // Rotações suaves
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2
      groupRef.current.rotation.y = time * 0.2
      groupRef.current.rotation.z = Math.cos(time * 0.4) * 0.15
      
      // Efeito de scan/varredura
      const scan = (Math.sin(time * 3) + 1) * 0.5
      setScanEffect(scan * 1.0)
      
      // Atualização de dados
      const dataFreq = (Math.sin(time * 5) + 1) * 0.5
      setDataUpdate(dataFreq * 0.9)
      
      groupRef.current.position.set(currentX, currentY, currentZ)
    }
  })

  return (
    <group ref={groupRef} scale={dynamicScale}>
      {/* Painéis holográficos */}
      {panels.map((panel, index) => {
        const [x, y, z] = panel.position
        const [width, height] = panel.size
        const [rotX, rotY, rotZ] = panel.rotation
        
        return (
          <group key={`panel-${index}`} position={[x, y, z]} rotation={[rotX, rotY, rotZ]}>
            {/* Tela principal */}
            <mesh>
              <planeGeometry args={[width, height]} />
              <meshStandardMaterial 
                color={panel.color}
                transparent
                opacity={opacity * 0.2}
                emissive={panel.color}
                emissiveIntensity={0.8 + scanEffect * 0.4}
                roughness={0.1}
                metalness={0.9}
                side={2}
              />
            </mesh>
            
            {/* Borda brilhante */}
            <mesh scale={[1.05, 1.05, 1]}>
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial 
                color={panel.color}
                wireframe={true}
                transparent
                opacity={opacity * 0.8}
              />
            </mesh>
            
            {/* Linha de scan */}
            <mesh position={[0, -height/2 + (height * scanEffect), 0.01]}>
              <planeGeometry args={[width, 0.02]} />
              <meshStandardMaterial 
                color={'#1D3C44'}
                transparent
                opacity={opacity * 0.9}
                emissive={'#1D3C44'}
                emissiveIntensity={2.0}
              />
            </mesh>
            
            {/* Dados flutuantes na tela */}
            {[0, 1, 2, 3].map((dataIndex) => {
              const dataX = (dataIndex - 1.5) * (width / 4)
              const dataY = Math.sin(Date.now() * 0.003 + dataIndex) * (height / 3)
              
              return (
                <mesh 
                  key={`data-${dataIndex}`}
                  position={[dataX, dataY, 0.02]}
                >
                  <boxGeometry args={[0.05, 0.05, 0.01]} />
                  <meshStandardMaterial 
                    color={'#1D3C44'}
                    transparent
                    opacity={opacity * (0.6 + dataUpdate * 0.4)}
                    emissive={'#1D3C44'}
                    emissiveIntensity={1.5 + dataUpdate * 0.8}
                  />
                </mesh>
              )
            })}
            
            {/* Gráfico mini na tela */}
            {panel.type === 'main' && (
              <group position={[0, -0.2, 0.02]}>
                {[0, 1, 2, 3, 4].map((pointIndex) => {
                  const pointX = (pointIndex - 2) * 0.15
                  const pointY = Math.sin(Date.now() * 0.004 + pointIndex) * 0.1
                  
                  return (
                    <mesh 
                      key={`graph-point-${pointIndex}`}
                      position={[pointX, pointY, 0]}
                    >
                      <sphereGeometry args={[0.01, 8, 8]} />
                      <meshStandardMaterial 
                        color={'#00A298'}
                        transparent
                        opacity={opacity * 0.8}
                        emissive={'#00A298'}
                        emissiveIntensity={1.8 + dataUpdate * 0.6}
                      />
                    </mesh>
                  )
                })}
              </group>
            )}
          </group>
        )
      })}
      
      {/* Conexões entre painéis */}
      {panels.slice(0, -1).map((panel, index) => {
        const nextPanel = panels[index + 1]
        const [fromX, fromY, fromZ] = panel.position
        const [toX, toY, toZ] = nextPanel.position
        
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2
        const midZ = (fromZ + toZ) / 2
        
        const length = Math.sqrt(
          Math.pow(toX - fromX, 2) + 
          Math.pow(toY - fromY, 2) + 
          Math.pow(toZ - fromZ, 2)
        )
        
        const rotationY = Math.atan2(toX - fromX, toY - fromY)
        
        return (
          <mesh 
            key={`connection-${index}`}
            position={[midX, midY, midZ]}
            rotation={[0, rotationY, 0]}
          >
            <cylinderGeometry args={[0.005, 0.005, length, 6]} />
            <meshStandardMaterial 
              color={'#1D3C44'}
              transparent
              opacity={opacity * 0.6}
              emissive={'#1D3C44'}
              emissiveIntensity={1.0 + scanEffect * 0.5}
            />
          </mesh>
        )
      })}
      
      {/* Partículas de dados orbitais */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
        const angle = (index / 8) * Math.PI * 2
        const radius = 1.6 + Math.sin(index) * 0.2
        const height = Math.cos(Date.now() * 0.002 + index) * 0.3
        
        return (
          <mesh 
            key={`orbital-data-${index}`}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <icosahedronGeometry args={[0.02]} />
            <meshStandardMaterial 
              color={'#AECECB'}
              transparent
              opacity={opacity * (0.7 + scanEffect * 0.3)}
              emissive={'#AECECB'}
              emissiveIntensity={1.6 + scanEffect * 0.8}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        )
      })}
      
      {/* Holoprojetor base */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.1, 12]} />
        <meshStandardMaterial 
          color={'#1D3C44'}
          transparent
          opacity={opacity * 0.8}
          emissive={'#1D3C44'}
          emissiveIntensity={1.0 + scanEffect * 0.4}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Raios holográficos */}
      {panels.map((panel, index) => {
        const [x, y, z] = panel.position
        return (
          <mesh 
            key={`ray-${index}`}
            position={[x/2, (y-1.2)/2, z/2]}
            rotation={[0, 0, Math.atan2(x, y+1.2)]}
          >
            <cylinderGeometry args={[0.002, 0.008, Math.sqrt(x*x + (y+1.2)*(y+1.2) + z*z), 6]} />
            <meshStandardMaterial 
              color={'#00A298'}
              transparent
              opacity={opacity * 0.4}
              emissive={'#00A298'}
              emissiveIntensity={1.2 + scanEffect * 0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}