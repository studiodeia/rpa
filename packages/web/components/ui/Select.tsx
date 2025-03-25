import React, { SelectHTMLAttributes, ReactNode } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
  className?: string;
  children?: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  options = [],
  className = '',
  children,
  ...props
}) => {
  return (
    <select
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className}`}
      {...props}
    >
      {/* Se temos options, renderizamos elas */}
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      ) : (
        /* Se não temos options, usamos o children (que deve ser <option> elements) */
        children
      )}
    </select>
  );
};