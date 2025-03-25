import React, { useEffect, Fragment } from 'react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  hideBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = '',
  hideBackdrop = false,
}) => {
  // Fecha o modal ao pressionar Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isOpen && closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Adiciona classe para impedir rolagem do body quando o modal estiver aberto
      document.body.classList.add('overflow-hidden');
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      // Remove a classe quando o modal for fechado
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Tamanhos para o modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // Botão de fechar
  const closeButton = (
    <button
      type="button"
      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
      onClick={onClose}
      aria-label="Fechar"
    >
      <span className="sr-only">Fechar</span>
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

  return (
    <Fragment>
      {/* Backdrop */}
      {!hideBackdrop && (
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeOnBackdropClick ? onClose : undefined}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`
              relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all
              ${sizeClasses[size]}
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {title && (
                  <h3 className="text-lg font-medium text-gray-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <div className="ml-auto">
                    {closeButton}
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {children}
            </div>

            {/* Rodapé do Modal */}
            {footer && (
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-2 border-t border-gray-200">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
} 