import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { loginSchema, type LoginFormData } from '../../lib/validations';

interface LoginFormProps {
  onToggleMode?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      await signIn(data.email, data.password);
      // Redirecionar para home após login bem-sucedido
      navigate('/home');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-8 bg-gradient-to-br from-white via-[#AECECB]/10 to-[#00A298]/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
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

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>

        {onToggleMode && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-primary hover:underline transition-colors"
            >
              Não tem uma conta? Cadastre-se
            </button>
          </div>
        )}
      </form>
    </div>
  );
};