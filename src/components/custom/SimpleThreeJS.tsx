import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh, Group } from 'three'

export function SimpleBarChart({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)

  const data = [
    { value: 80, color: '#00A298' },
    { value: 65, color: '#1D3C44' },
    { value: 90, color: '#AECECB' },
    { value: 45, color: '#00A298' },
    { value: 75, color: '#1D3C44' },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {data.map((item, index) => (
        <mesh
          key={index}
          position={[(index - 2) * 0.8, item.value / 200, 0]}
        >
          <boxGeometry args={[0.5, item.value / 100, 0.5]} />
          <meshStandardMaterial 
            color={item.color} 
            transparent 
            opacity={0.6}
            emissive={item.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export function SimplePieChart({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)
  
  const segments = [
    { angle: 90, color: '#00A298' },
    { angle: 120, color: '#1D3C44' },
    { angle: 80, color: '#AECECB' },
    { angle: 70, color: '#00A298' },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.3
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
    }
  })

  let currentAngle = 0

  return (
    <group ref={groupRef} position={position}>
      {segments.map((segment, index) => {
        const startAngle = (currentAngle * Math.PI) / 180
        currentAngle += segment.angle
        
        return (
          <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 1.5, 16, 1, startAngle, (segment.angle * Math.PI) / 180]} />
            <meshStandardMaterial 
              color={segment.color}
              transparent
              opacity={0.7}
              emissive={segment.color}
              emissiveIntensity={0.15}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function SimpleMetrics({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#00A298"
          transparent
          opacity={0.8}
          emissive="#00A298"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#1D3C44"
          transparent
          opacity={0.8}
          emissive="#1D3C44"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#AECECB"
          transparent
          opacity={0.8}
          emissive="#AECECB"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}