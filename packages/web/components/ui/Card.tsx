import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'outlined' | 'flat';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverable = false, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-gray-200 shadow-sm',
      outlined: 'bg-white border border-gray-200',
      flat: 'bg-gray-50 border border-gray-100',
    };

    const hoverClasses = hoverable
      ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg overflow-hidden',
          variantClasses[variant],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card'; 