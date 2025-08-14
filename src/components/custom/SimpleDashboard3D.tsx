import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { SimpleBarChart, SimplePieChart, SimpleMetrics } from './SimpleThreeJS'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.9}
        color="#ffffff"
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00A298" />
      <pointLight position={[10, -10, -5]} intensity={0.4} color="#1D3C44" />
      <pointLight position={[0, 15, -10]} intensity={0.3} color="#AECECB" />
      <pointLight position={[0, -15, -10]} intensity={0.2} color="#00A298" />
    </>
  )
}

export function SimpleDashboard3D() {
  const [isAnimationStarted] = useState(true)

  // Removido o delay - componentes começam a aparecer imediatamente

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-20">
      <Canvas
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={55} />
        
        <Suspense fallback={null}>
          <Lights />
          
          {/* Cantos superiores da tela */}
          <SimpleBarChart 
            position={[-15, 10, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4}
            orbitSpeed={0.3}
            scale={1.2}
            delayMultiplier={0}
          />
          <SimplePieChart 
            position={[15, 10, -7]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5}
            orbitSpeed={-0.2}
            scale={1.3}
            delayMultiplier={0.5}
          />
          
          {/* Cantos inferiores da tela */}
          <SimpleMetrics 
            position={[-15, -10, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.5}
            orbitSpeed={0.4}
            scale={1.1}
            delayMultiplier={1}
          />
          <SimpleBarChart 
            position={[15, -10, -5]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.5}
            orbitSpeed={-0.25}
            scale={1.0}
            delayMultiplier={1.5}
          />
          
          {/* Bordas laterais esquerda */}
          <SimplePieChart 
            position={[-18, 0, -9]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.8}
            orbitSpeed={0.35}
            scale={1.1}
            delayMultiplier={2}
          />
          <SimpleMetrics 
            position={[-16, 5, -9]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.2}
            orbitSpeed={-0.15}
            scale={0.9}
            delayMultiplier={2.5}
          />
          <SimpleBarChart 
            position={[-17, -5, -4]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.2}
            orbitSpeed={0.45}
            scale={0.8}
            delayMultiplier={3}
          />
          
          {/* Bordas laterais direita */}
          <SimpleBarChart 
            position={[18, 2, -10]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.8}
            orbitSpeed={-0.18}
            scale={1.2}
            delayMultiplier={3.5}
          />
          <SimplePieChart 
            position={[16, -3, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.2}
            orbitSpeed={-0.28}
            scale={1.05}
            delayMultiplier={4}
          />
          <SimpleMetrics 
            position={[17, 6, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.6}
            orbitSpeed={0.26}
            scale={1.0}
            delayMultiplier={4.5}
          />
          
          {/* Borda superior */}
          <SimplePieChart 
            position={[-8, 12, -11]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.5}
            orbitSpeed={0.22}
            scale={0.85}
            delayMultiplier={5}
          />
          <SimpleBarChart 
            position={[0, 13, -5]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={2.8}
            orbitSpeed={-0.42}
            scale={1.15}
            delayMultiplier={5.5}
          />
          <SimpleMetrics 
            position={[8, 12, -12]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.8}
            orbitSpeed={0.16}
            scale={0.75}
            delayMultiplier={6}
          />
          
          {/* Borda inferior */}
          <SimpleBarChart 
            position={[-5, -12, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.9}
            orbitSpeed={-0.38}
            scale={0.9}
            delayMultiplier={6.5}
          />
          <SimplePieChart 
            position={[5, -12, -14]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.9}
            orbitSpeed={-0.21}
            scale={0.8}
            delayMultiplier={7}
          />
          <SimpleMetrics 
            position={[0, -13, -15]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.4}
            orbitSpeed={0.29}
            scale={0.75}
            delayMultiplier={7.5}
          />
          
          {/* Componentes de fundo distantes */}
          <SimpleBarChart 
            position={[12, 8, -15]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={6.2}
            orbitSpeed={-0.12}
            scale={0.7}
            delayMultiplier={8}
          />
          <SimplePieChart 
            position={[-12, -8, -16]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={6.5}
            orbitSpeed={0.14}
            scale={0.6}
            delayMultiplier={8.5}
          />
          <SimpleMetrics 
            position={[10, -7, -17]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.7}
            orbitSpeed={-0.17}
            scale={0.7}
            delayMultiplier={9}
          />
          
          {/* Componentes próximos espalhados */}
          <SimpleBarChart 
            position={[6, 3, -3]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={2.8}
            orbitSpeed={0.52}
            scale={1.3}
            delayMultiplier={9.5}
          />
          <SimplePieChart 
            position={[-6, -4, -2]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={2.5}
            orbitSpeed={-0.58}
            scale={1.4}
            delayMultiplier={10}
          />
          <SimpleMetrics 
            position={[3, 7, -4]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.0}
            orbitSpeed={0.48}
            scale={1.2}
            delayMultiplier={10.5}
          />
          
          {/* Componentes adicionais para preenchimento */}
          <SimpleBarChart 
            position={[-10, 3, -13]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.1}
            orbitSpeed={0.19}
            scale={0.65}
            delayMultiplier={11}
          />
          <SimplePieChart 
            position={[9, -6, -7]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.7}
            orbitSpeed={0.32}
            scale={0.95}
            delayMultiplier={11.5}
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
      
      {/* Overlay com gradiente melhorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-background/15 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/10 pointer-events-none"></div>
    </div>
  )
}