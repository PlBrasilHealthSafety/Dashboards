import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserRoute } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Verifica se o usuário está tentando acessar uma rota específica que não corresponde ao seu tipo
  const userRoute = getUserRoute(user.email);
  const currentPath = location.pathname;
  
  // Se o usuário está em uma rota específica (/direcao, /medicina, /comercial) que não é a sua, redireciona
  if (['/direcao', '/medicina', '/comercial'].includes(currentPath) && currentPath !== userRoute) {
    return <Navigate to={userRoute} replace />;
  }

  return <>{children}</>;
};