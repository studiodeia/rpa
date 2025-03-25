import React from 'react';
import { Button } from './Button';
import { Select } from './Select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showItemsPerPage?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showItemsPerPage = false,
}) => {
  // Não exibir paginação se houver apenas uma página
  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  // Calcular páginas a serem exibidas
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5; // Número máximo de páginas a mostrar
    
    // Se tivermos menos de maxPagesToShow páginas no total, mostramos todas
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Sempre mostrar primeira página
    pageNumbers.push(1);
    
    // Calcular início e fim do bloco de páginas
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, startPage + 2);
    
    // Ajustar se estamos perto do fim
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - 2);
    }
    
    // Adicionar elipses antes do bloco, se necessário
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Adicionar o bloco de páginas
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Adicionar elipses após o bloco, se necessário
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Sempre mostrar última página
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  // Calcular intervalo de itens exibidos
  const calculateItemRange = () => {
    if (!totalItems || !pageSize) return '';
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    
    return `${start}-${end} de ${totalItems}`;
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
      {/* Seletor de itens por página */}
      {showItemsPerPage && pageSize && onPageSizeChange && (
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <span>Mostrar</span>
          <Select 
            value={pageSize.toString()} 
            onChange={handlePageSizeChange}
            className="w-16 h-8 text-sm"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size.toString()}>
                {size}
              </option>
            ))}
          </Select>
          <span>por página</span>
        </div>
      )}
      
      {/* Informação de intervalo de itens */}
      {totalItems !== undefined && pageSize !== undefined && (
        <div className="text-sm text-gray-500">
          {calculateItemRange()}
        </div>
      )}
      
      {/* Navegação de páginas */}
      <nav className="flex items-center justify-center sm:justify-end space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-2 py-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
        
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                ...
              </span>
            );
          }
          
          const pageNumber = page as number;
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 ${currentPage === pageNumber ? 'font-medium' : ''}`}
            >
              {pageNumber}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2 py-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Button>

  // Função para renderizar os botões de página
  const renderPageButtons = () => {
    const pageNumbers = getPageNumbers();

    return pageNumbers.map((pageNumber, index) => {
      // Renderizar ellipsis (...)
      if (pageNumber === '...') {
        return (
          <span
            key={`ellipsis-${index}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }

      // Renderizar botão de página
      const page = pageNumber as number;
      const isActive = page === currentPage;

      return (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={isActive}
          className={`
            relative inline-flex items-center px-4 py-2 text-sm font-medium 
            ${
              isActive
                ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          `}
          aria-current={isActive ? 'page' : undefined}
        >
          {page}
        </button>
      );
    });
  };

  // Se não houver páginas, não renderiza nada
  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between py-3 ${className}`}>
      {/* Informações sobre os itens */}
      {totalItems !== undefined && (
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          Mostrando{' '}
          <span className="font-medium">
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
          </span>{' '}
          a{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          de <span className="font-medium">{totalItems}</span> itens
        </div>
      )}

      <div className="flex items-center">
        {/* Seletor de itens por página */}
        {showItemsPerPage && onPageSizeChange && (
          <div className="flex items-center mr-4 text-sm text-gray-700">
            <span className="mr-2">Itens por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navegação de páginas */}
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Paginação">
          {/* Botão Anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Anterior</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Números de página */}
          {renderPageButtons()}

          {/* Botão Próximo */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Próximo</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}; 