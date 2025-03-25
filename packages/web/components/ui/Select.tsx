import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  hideLabel?: boolean;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      label,
      options,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      hideLabel = false,
      disabled = false,
      required = false,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || name || Math.random().toString(36).substring(2, 9);
    const hasError = !!error;

    // Classes base para todos os selects
    const baseSelectClasses = 'block rounded-md shadow-sm focus:ring focus:ring-opacity-50 transition-colors';

    // Classes que variam de acordo com estado (erro, desabilitado)
    const stateSelectClasses = hasError
      ? 'border-error-main focus:border-error-main focus:ring-error-light'
      : disabled
        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

    // Classes de tamanho
    const sizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-3 text-base',
    };

    // Classe de largura
    const widthClass = fullWidth ? 'w-full' : '';

    // Montagem da classe final
    const selectClasses = `
      ${baseSelectClasses}
      ${stateSelectClasses}
      ${sizeClasses[size]}
      ${className}
    `.trim();

    const containerClasses = `
      ${widthClass}
      ${containerClassName}
    `.trim();

    return (
      <div className={containerClasses}>
        {label && !hideLabel && (
          <label
            htmlFor={selectId}
            className={`block text-sm font-medium ${
              hasError ? 'text-error-main' : 'text-gray-700'
            } mb-1`}
          >
            {label}
            {required && <span className="text-error-main ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={selectClasses}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(helperText || error) && (
          <div className="mt-1 text-sm">
            {hasError ? (
              <p id={`${selectId}-error`} className="text-error-main">
                {error}
              </p>
            ) : helperText ? (
              <p id={`${selectId}-helper`} className="text-gray-500">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select'; 