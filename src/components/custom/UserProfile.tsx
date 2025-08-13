import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
        <CardDescription>
          Informações da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-sm">{user.email}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">UID</label>
          <p className="text-sm font-mono text-xs break-all">{user.uid}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Conta criada em</label>
          <p className="text-sm">
            {user.metadata.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR')
              : 'N/A'
            }
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Último login</label>
          <p className="text-sm">
            {user.metadata.lastSignInTime 
              ? new Date(user.metadata.lastSignInTime).toLocaleDateString('pt-BR')
              : 'N/A'
            }
          </p>
        </div>

        <Button onClick={handleSignOut} variant="outline" className="w-full">
          Sair
        </Button>
      </CardContent>
    </Card>
  );
};