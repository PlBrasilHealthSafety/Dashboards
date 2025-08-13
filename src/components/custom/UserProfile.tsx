import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { profileSchema, type ProfileFormData } from '../../lib/validations';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.displayName || '',
        email: user.email || '',
        bio: '',
        phone: '',
      });
    }
  }, [user, reset]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setMessage('');

    try {
      // Here you would typically update the user profile in Firebase
      // For now, we'll just simulate a successful update
      console.log('Profile data to update:', data);
      setMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error: any) {
      setMessage(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    if (user) {
      reset({
        name: user.displayName || '',
        email: user.email || '',
        bio: '',
        phone: '',
      });
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
          {isEditing ? 'Edite suas informações' : 'Informações da sua conta'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                O email não pode ser alterado
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone (opcional)
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio (opcional)
              </label>
              <textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                {...register('bio')}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            {message && (
              <div className={`text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </div>
            )}

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-sm">{user.displayName || 'Não informado'}</p>
            </div>

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

            {message && (
              <div className={`text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1">
                Editar Perfil
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="flex-1">
                Sair
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};