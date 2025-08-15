import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserRoute } from '@/lib/utils';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se o usuário já está autenticado, redireciona para a rota específica do usuário
  if (user) {
    const userRoute = getUserRoute(user.email);
    return <Navigate to={userRoute} replace />;
  }

  return <>{children}</>;
};
