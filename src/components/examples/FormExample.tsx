import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FormField, TextareaField } from '../custom/FormField';

// Example schema for a user feedback form
const feedbackSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  rating: z
    .string()
    .min(1, 'Avaliação é obrigatória'),
  feedback: z
    .string()
    .min(1, 'Feedback é obrigatório')
    .min(10, 'Feedback deve ter pelo menos 10 caracteres')
    .max(500, 'Feedback deve ter no máximo 500 caracteres'),
  subscribe: z.boolean().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const AdvancedFormExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Feedback data:', data);
      setMessage('Obrigado pelo seu feedback! Sua opinião é muito importante para nós.');
      reset();
    } catch (error: any) {
      setMessage(error.message || 'Erro ao enviar feedback. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Exemplo de Formulário</CardTitle>
        <CardDescription>
          Demonstração do React Hook Form com Zod e componentes reutilizáveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Nome"
            id="name"
            placeholder="Seu nome completo"
            required
            register={register('name')}
            error={errors.name}
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            register={register('email')}
            error={errors.email}
            helpText="Usaremos seu email apenas para responder ao feedback"
          />

          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">
              Avaliação <span className="text-red-500">*</span>
            </label>
            <select
              id="rating"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('rating')}
            >
              <option value="">Selecione uma avaliação</option>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muito Bom</option>
              <option value="3">⭐⭐⭐ Bom</option>
              <option value="2">⭐⭐ Regular</option>
              <option value="1">⭐ Ruim</option>
            </select>
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating.message}</p>
            )}
          </div>

          <TextareaField
            label="Feedback"
            id="feedback"
            placeholder="Conte-nos sobre sua experiência..."
            required
            rows={4}
            register={register('feedback')}
            error={errors.feedback}
            helpText="Mínimo de 10 caracteres, máximo de 500"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="subscribe"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('subscribe')}
            />
            <label htmlFor="subscribe" className="text-sm">
              Quero receber atualizações por email
            </label>
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-md ${
              message.includes('Obrigado') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};