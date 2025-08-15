import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Função para traduzir erros do Firebase
  const translateFirebaseError = (errorMessage: string): string => {
    const errorTranslations: Record<string, string> = {
      'auth/invalid-credential': 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.',
      'auth/user-not-found': 'Usuário não encontrado. Verifique o email informado.',
      'auth/wrong-password': 'Senha incorreta. Tente novamente.',
      'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
      'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
      'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente em alguns minutos.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
      'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
      'auth/email-already-in-use': 'Este email já está sendo usado por outra conta.',
      'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
      'auth/requires-recent-login': 'Por segurança, faça login novamente para continuar.',
    };

    // Procurar por códigos de erro específicos
    for (const [firebaseError, translation] of Object.entries(errorTranslations)) {
      if (errorMessage.includes(firebaseError)) {
        return translation;
      }
    }

    // Verificar padrões comuns
    if (errorMessage.toLowerCase().includes('network')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    
    if (errorMessage.toLowerCase().includes('timeout')) {
      return 'Tempo limite excedido. Tente novamente.';
    }

    // Mensagem genérica para erros não mapeados
    return 'Erro ao fazer login. Verifique suas credenciais e tente novamente.';
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      await signIn(data.email, data.password, rememberMe);
      // Redirecionar para home após login bem-sucedido
      navigate('/home');
    } catch (error: any) {
      const friendlyError = translateFirebaseError(error.message || 'Erro desconhecido');
      setError(friendlyError);
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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 border-2 focus:border-primary placeholder:text-muted-foreground/60 pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-2 border-input text-primary focus:ring-1 focus:ring-primary"
          />
          <label htmlFor="remember-me" className="text-sm text-foreground cursor-pointer">
            Lembrar de mim
          </label>
        </div>

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