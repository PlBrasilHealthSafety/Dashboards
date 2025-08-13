import React from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Input } from '../ui/input';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  register,
  error,
  helpText,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register}
      />
      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
      {helpText && !error && (
        <p className="text-gray-500 text-xs">{helpText}</p>
      )}
    </div>
  );
};

interface TextareaFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  register: UseFormRegisterReturn;
  error?: FieldError;
  helpText?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  id,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  register,
  error,
  helpText,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
        {...register}
      />
      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
      {helpText && !error && (
        <p className="text-gray-500 text-xs">{helpText}</p>
      )}
    </div>
  );
};