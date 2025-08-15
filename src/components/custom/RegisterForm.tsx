import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { registerSchema, type RegisterFormData } from '../../lib/validations';
import { getUserRoute } from '@/lib/utils';

interface RegisterFormProps {
  onToggleMode?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      const user = await signUp(data.email, data.password);
      // Redirecionar para a rota específica do usuário após cadastro bem-sucedido
      const userRoute = getUserRoute(user.email);
      navigate(userRoute);
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <img 
            src="/Logo-PlBrasilHealth.png" 
            alt="PLBrasil Health&Safety" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            className="h-11 border-2 focus:border-primary placeholder:text-muted-foreground/60"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="h-11 border-2 focus:border-primary placeholder:text-muted-foreground/60"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11 border-2 focus:border-primary placeholder:text-muted-foreground/60"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirmar Senha
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-11 border-2 focus:border-primary placeholder:text-muted-foreground/60"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </div>

        {onToggleMode && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-primary hover:underline transition-colors"
            >
              Já tem uma conta? Faça login
            </button>
          </div>
        )}
      </form>
    </div>
  );
};