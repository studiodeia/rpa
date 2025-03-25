import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  hideLabel?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      fullWidth = false,
      hideLabel = false,
      disabled = false,
      required = false,
      type = 'text',
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name || Math.random().toString(36).substring(2, 9);
    const hasError = !!error;

    // Classes base para todos os inputs
    const baseInputClasses = 'block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 transition-colors';

    // Classes que variam de acordo com estado (erro, desabilitado)
    const stateInputClasses = hasError
      ? 'border-error-main focus:border-error-main focus:ring-error-light'
      : disabled
        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

    // Classes para ícones
    const withStartIconClasses = startIcon ? 'pl-10' : '';
    const withEndIconClasses = endIcon ? 'pr-10' : '';

    // Class de largura
    const widthClass = fullWidth ? 'w-full' : '';

    // Montagem da classe final
    const inputClasses = `
      ${baseInputClasses}
      ${stateInputClasses}
      ${withStartIconClasses}
      ${withEndIconClasses}
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
            htmlFor={inputId}
            className={`block text-sm font-medium ${
              hasError ? 'text-error-main' : 'text-gray-700'
            } mb-1`}
          >
            {label}
            {required && <span className="text-error-main ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`text-gray-500 ${disabled ? 'opacity-50' : ''}`}>
                {startIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            className={inputClasses}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={`text-gray-500 ${disabled ? 'opacity-50' : ''}`}>
                {endIcon}
              </span>
            </div>
          )}
        </div>
        {(helperText || error) && (
          <div className="mt-1 text-sm">
            {hasError ? (
              <p id={`${inputId}-error`} className="text-error-main">
                {error}
              </p>
            ) : helperText ? (
              <p id={`${inputId}-helper`} className="text-gray-500">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 