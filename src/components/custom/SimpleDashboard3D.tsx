import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { SimpleBarChart, SimplePieChart, SimpleMetrics } from './SimpleThreeJS'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00A298" />
    </>
  )
}

export function SimpleDashboard3D() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
      <Canvas
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
        
        <Suspense fallback={null}>
          <Lights />
          
          <SimpleBarChart position={[-4, -1, -5]} />
          <SimplePieChart position={[4, 2, -6]} />
          <SimpleMetrics position={[-2, 3, -7]} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.3}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/10 to-background/20 pointer-events-none"></div>
    </div>
  )
}