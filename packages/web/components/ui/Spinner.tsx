import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'white' | 'gray';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  // Tamanhos
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Cores
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  const spinnerClasses = `
    inline-block animate-spin rounded-full border-2 border-current border-t-transparent
    ${sizeClasses[size]}
    ${colorClasses[color]}
    ${className}
  `.trim();

  return (
    <div className="flex items-center justify-center">
      <div className={spinnerClasses} role="status" aria-label="Carregando">
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  );
}; 