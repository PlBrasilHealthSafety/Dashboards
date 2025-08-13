import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface SimpleFormFieldProps {
  label: string;
  error?: FieldError;
  children: ReactNode;
}

export const SimpleFormField: React.FC<SimpleFormFieldProps> = ({
  label,
  error,
  children
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
};
