import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { SimpleBarChart, SimplePieChart, SimpleMetrics, SimpleDashboardGrid } from './SimpleThreeJS'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#00A298" />
      <pointLight position={[10, -10, -5]} intensity={0.5} color="#1D3C44" />
      <pointLight position={[0, 15, -10]} intensity={0.4} color="#AECECB" />
      <pointLight position={[0, -15, -10]} intensity={0.3} color="#00A298" />
      <spotLight
        position={[0, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
    </>
  )
}

export function SimpleDashboard3D() {
  const [isAnimationStarted] = useState(true)

  return (
    <div 
      className="fixed inset-0 -z-10 opacity-75" 
      style={{ 
        overflow: 'visible',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <Canvas
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 0, 15], fov: 75 }}
        dpr={1}
        onCreated={({ gl, camera }) => {
          // Forçar o tamanho correto
          gl.setSize(window.innerWidth, window.innerHeight, false)
          gl.domElement.style.width = '100vw'
          gl.domElement.style.height = '100vh'
          gl.domElement.style.position = 'fixed'
          gl.domElement.style.top = '0'
          gl.domElement.style.left = '0'
          
          // Atualizar a câmera se for PerspectiveCamera
          if ('aspect' in camera) {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
          }
        }}
      >

        
        <Suspense fallback={null}>
          <Lights />
          
          {/* Cantos - Componentes maiores e menos quantidade */}
          <SimpleBarChart 
            position={[-18, 12, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={6}
            orbitSpeed={0.2}
            scale={2.5}
            delayMultiplier={0}
          />
          <SimplePieChart 
            position={[18, 12, -10]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={7}
            orbitSpeed={-0.15}
            scale={2.8}
            delayMultiplier={1}
          />
          <SimpleDashboardGrid 
            position={[-18, -12, -12]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.5}
            orbitSpeed={0.25}
            scale={2.2}
            delayMultiplier={2}
          />
          <SimpleMetrics 
            position={[18, -12, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={6.5}
            orbitSpeed={-0.18}
            scale={2.0}
            delayMultiplier={3}
          />
          
          {/* Laterais - Componentes distribuídos */}
          <SimplePieChart 
            position={[-25, 0, -15]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={8}
            orbitSpeed={0.12}
            scale={2.4}
            delayMultiplier={4}
          />
          <SimpleBarChart 
            position={[25, 0, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={7.5}
            orbitSpeed={-0.14}
            scale={2.6}
            delayMultiplier={5}
          />
          
          {/* Centro-fundo - Componentes de apoio */}
          <SimpleDashboardGrid 
            position={[0, 8, -20]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={9}
            orbitSpeed={0.08}
            scale={1.8}
            delayMultiplier={6}
          />
          <SimpleMetrics 
            position={[0, -8, -18]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={8.5}
            orbitSpeed={-0.1}
            scale={2.1}
            delayMultiplier={7}
          />
          
          {/* Componentes próximos para profundidade */}
          <SimpleBarChart 
            position={[12, 6, -4]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4}
            orbitSpeed={0.35}
            scale={3.0}
            delayMultiplier={8}
          />
          <SimplePieChart 
            position={[-12, -6, -3]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.5}
            orbitSpeed={-0.4}
            scale={3.2}
            delayMultiplier={9}
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