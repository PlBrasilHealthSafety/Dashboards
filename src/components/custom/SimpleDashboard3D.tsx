import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { SimpleBarChart, SimplePieChart, SimpleMetrics } from './SimpleThreeJS'

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
      className="fixed inset-0 -z-10 opacity-25" 
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
          
          {/* Cantos superiores da tela - expandidos */}
          <SimpleBarChart 
            position={[-20, 14, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4}
            orbitSpeed={0.3}
            scale={1.2}
            delayMultiplier={0}
          />
          <SimplePieChart 
            position={[20, 14, -7]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5}
            orbitSpeed={-0.2}
            scale={1.3}
            delayMultiplier={0.5}
          />
          
          {/* Cantos inferiores da tela - expandidos */}
          <SimpleMetrics 
            position={[-20, -14, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.5}
            orbitSpeed={0.4}
            scale={1.1}
            delayMultiplier={1}
          />
          <SimpleBarChart 
            position={[20, -14, -5]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.5}
            orbitSpeed={-0.25}
            scale={1.0}
            delayMultiplier={1.5}
          />
          
          {/* Bordas laterais esquerda - expandidas */}
          <SimplePieChart 
            position={[-25, 0, -9]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.8}
            orbitSpeed={0.35}
            scale={1.1}
            delayMultiplier={2}
          />
          <SimpleMetrics 
            position={[-22, 7, -9]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.2}
            orbitSpeed={-0.15}
            scale={0.9}
            delayMultiplier={2.5}
          />
          <SimpleBarChart 
            position={[-23, -7, -4]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.2}
            orbitSpeed={0.45}
            scale={0.8}
            delayMultiplier={3}
          />
          
          {/* Bordas laterais direita - expandidas */}
          <SimpleBarChart 
            position={[25, 3, -10]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.8}
            orbitSpeed={-0.18}
            scale={1.2}
            delayMultiplier={3.5}
          />
          <SimplePieChart 
            position={[22, -4, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.2}
            orbitSpeed={-0.28}
            scale={1.05}
            delayMultiplier={4}
          />
          <SimpleMetrics 
            position={[23, 8, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.6}
            orbitSpeed={0.26}
            scale={1.0}
            delayMultiplier={4.5}
          />
          
          {/* Borda superior - expandida */}
          <SimplePieChart 
            position={[-10, 16, -11]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.5}
            orbitSpeed={0.22}
            scale={0.85}
            delayMultiplier={5}
          />
          <SimpleBarChart 
            position={[0, 17, -5]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={2.8}
            orbitSpeed={-0.42}
            scale={1.15}
            delayMultiplier={5.5}
          />
          <SimpleMetrics 
            position={[10, 16, -12]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.8}
            orbitSpeed={0.16}
            scale={0.75}
            delayMultiplier={6}
          />
          
          {/* Borda inferior - expandida */}
          <SimpleBarChart 
            position={[-7, -16, -6]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.9}
            orbitSpeed={-0.38}
            scale={0.9}
            delayMultiplier={6.5}
          />
          <SimplePieChart 
            position={[7, -16, -14]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.9}
            orbitSpeed={-0.21}
            scale={0.8}
            delayMultiplier={7}
          />
          <SimpleMetrics 
            position={[0, -17, -15]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.4}
            orbitSpeed={0.29}
            scale={0.75}
            delayMultiplier={7.5}
          />
          
          {/* Componentes de fundo distantes - reposicionados */}
          <SimpleBarChart 
            position={[15, 10, -15]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={6.2}
            orbitSpeed={-0.12}
            scale={0.7}
            delayMultiplier={8}
          />
          <SimplePieChart 
            position={[-15, -10, -16]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={6.5}
            orbitSpeed={0.14}
            scale={0.6}
            delayMultiplier={8.5}
          />
          <SimpleMetrics 
            position={[13, -9, -17]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.7}
            orbitSpeed={-0.17}
            scale={0.7}
            delayMultiplier={9}
          />
          
          {/* Componentes próximos espalhados - melhor distribuição */}
          <SimpleBarChart 
            position={[8, 4, -3]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.8}
            orbitSpeed={0.52}
            scale={1.3}
            delayMultiplier={9.5}
          />
          <SimplePieChart 
            position={[-8, -5, -2]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.5}
            orbitSpeed={-0.58}
            scale={1.4}
            delayMultiplier={10}
          />
          <SimpleMetrics 
            position={[4, 9, -4]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.0}
            orbitSpeed={0.48}
            scale={1.2}
            delayMultiplier={10.5}
          />
          
          {/* Componentes adicionais para cobertura completa */}
          <SimpleBarChart 
            position={[-13, 4, -13]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={5.1}
            orbitSpeed={0.19}
            scale={0.65}
            delayMultiplier={11}
          />
          <SimplePieChart 
            position={[12, -8, -7]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.7}
            orbitSpeed={0.32}
            scale={0.95}
            delayMultiplier={11.5}
          />
          
          {/* Componentes extras para cobertura uniforme */}
          <SimpleMetrics 
            position={[-18, 10, -10]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={4.3}
            orbitSpeed={-0.22}
            scale={0.8}
            delayMultiplier={12}
          />
          <SimpleBarChart 
            position={[18, -12, -8]} 
            isAnimationStarted={isAnimationStarted}
            orbitRadius={3.9}
            orbitSpeed={0.35}
            scale={0.85}
            delayMultiplier={12.5}
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