import React, { useState, Suspense } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

// Lazy load the 3D component to avoid WebGL errors
const SimpleDashboard3D = React.lazy(() => 
  import('./SimpleDashboard3D').then(module => ({ default: module.SimpleDashboard3D }))
);

// Function to check WebGL support
const isWebGLSupported = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Three.js Background Animations - only if WebGL is supported */}
      {isWebGLSupported() && (
        <Suspense fallback={<div />}>
          <SimpleDashboard3D />
        </Suspense>
      )}
      
      {/* Background Pattern (Overlay) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      
      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Form Container with Enhanced Backdrop */}
        <div className="backdrop-blur-md bg-card/90 border border-border/50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};