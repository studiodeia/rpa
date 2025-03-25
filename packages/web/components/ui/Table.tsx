import React from 'react';

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  roundedHeader?: boolean;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  onRowClick,
  isLoading = false,
  emptyMessage = 'Nenhum dado encontrado',
  className = '',
  striped = true,
  bordered = true,
  hoverable = true,
  compact = false,
  roundedHeader = true,
}: TableProps<T>) {
  // Classes para a tabela
  const tableClasses = `
    min-w-full divide-y divide-gray-200
    ${bordered ? 'border border-gray-200' : ''}
    ${className}
  `.trim();

  // Classes para as linhas da tabela
  const rowClasses = `
    ${striped ? 'even:bg-gray-50' : 'bg-white'}
    ${hoverable ? 'hover:bg-gray-100' : ''}
    ${onRowClick ? 'cursor-pointer' : ''}
    transition-colors
  `.trim();

  // Classes para as células de cabeçalho
  const headerCellClasses = `
    ${compact ? 'px-4 py-2' : 'px-6 py-3'}
    text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    ${roundedHeader ? 'first:rounded-tl-lg last:rounded-tr-lg' : ''}
  `.trim();

  // Classes para as células de dados
  const dataCellClasses = `
    ${compact ? 'px-4 py-2' : 'px-6 py-4'}
    whitespace-nowrap text-sm
  `.trim();

  // Renderização da célula
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor as keyof T];
  };

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <table className={tableClasses}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`${headerCellClasses} ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={String(item[keyField])}
                className={rowClasses}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`${dataCellClasses} ${column.className || ''}`}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 