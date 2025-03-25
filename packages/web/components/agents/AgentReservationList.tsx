import React, { useState } from 'react';
import Link from 'next/link';
import { Pagination } from '../ui/Pagination';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Reservation, ReservationStatus } from '../../types/reservations';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AgentReservationListProps {
  reservations: Reservation[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export const AgentReservationList: React.FC<AgentReservationListProps> = ({
  reservations,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedReservation(expandedReservation === id ? null : id);
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: ReservationStatus) => {
    const statusConfig = {
      [ReservationStatus.PENDING]: {
        variant: 'warning' as const,
        label: 'Pendente',
      },
      [ReservationStatus.CONFIRMED]: {
        variant: 'success' as const,
        label: 'Confirmada',
      },
      [ReservationStatus.CANCELED]: {
        variant: 'error' as const,
        label: 'Cancelada',
      },
      [ReservationStatus.COMPLETED]: {
        variant: 'info' as const,
        label: 'Concluída',
      },
      [ReservationStatus.NO_SHOW]: {
        variant: 'error' as const,
        label: 'No-Show',
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} rounded>{config.label}</Badge>;
  };

  // Função para renderizar o badge de status de pagamento
  const renderPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'unpaid': {
        variant: 'error' as const,
        label: 'Não pago',
      },
      'partially_paid': {
        variant: 'warning' as const,
        label: 'Parcialmente pago',
      },
      'paid': {
        variant: 'success' as const,
        label: 'Pago',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant} rounded>{config.label}</Badge>;
  };

  // Calcular o total de páginas
  const totalPages = Math.ceil(totalItems / pageSize);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma reserva encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Não há reservas para mostrar com os filtros atuais.
          </p>
          <div className="mt-6">
            <Link
              href="/agent/reservations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Nova Reserva
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reservations.map((reservation) => (
        <Card
          key={reservation.id}
          className="overflow-hidden"
          hoverable
        >
          <div 
            className="cursor-pointer"
            onClick={() => toggleExpand(reservation.id)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-4 py-3">
              <div className="sm:col-span-2">
                <div className="font-medium text-gray-900">
                  {reservation.reference_code}
                </div>
                <div className="text-xs text-gray-500">ID da Reserva</div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="font-medium text-gray-900">
                  {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                </div>
                <div className="text-xs text-gray-500">{reservation.nights} noites</div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="font-medium text-gray-900 truncate">
                  Operação XYZ - Localidade
                </div>
                <div className="text-xs text-gray-500">
                  {reservation.adults} adultos {reservation.children > 0 ? `+ ${reservation.children} crianças` : ''}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="font-medium text-gray-900">
                  {formatCurrency(reservation.amount.total, reservation.currency)}
                </div>
                <div className="flex space-x-1 mt-1">
                  {renderPaymentStatusBadge(reservation.payment_status)}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {renderStatusBadge(reservation.status)}
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      expandedReservation === reservation.id ? 'rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {expandedReservation === reservation.id && (
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Detalhes da Reserva</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">Status:</dt>
                    <dd className="text-gray-900 font-medium">{renderStatusBadge(reservation.status)}</dd>
                    
                    <dt className="text-gray-500">Pagamento:</dt>
                    <dd className="text-gray-900 font-medium">{renderPaymentStatusBadge(reservation.payment_status)}</dd>
                    
                    <dt className="text-gray-500">Criada em:</dt>
                    <dd className="text-gray-900">{formatDate(reservation.created_at)}</dd>
                  </dl>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Detalhes Financeiros</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">Subtotal:</dt>
                    <dd className="text-gray-900 font-medium">{formatCurrency(reservation.amount.subtotal, reservation.currency)}</dd>
                    
                    {reservation.amount.discounts !== undefined && (
                      <>
                        <dt className="text-gray-500">Descontos:</dt>
                        <dd className="text-gray-900 font-medium">-{formatCurrency(reservation.amount.discounts, reservation.currency)}</dd>
                      </>
                    )}
                    
                    {reservation.amount.taxes !== undefined && (
                      <>
                        <dt className="text-gray-500">Taxas:</dt>
                        <dd className="text-gray-900 font-medium">{formatCurrency(reservation.amount.taxes, reservation.currency)}</dd>
                      </>
                    )}
                    
                    <dt className="text-gray-500">Total:</dt>
                    <dd className="text-gray-900 font-medium">{formatCurrency(reservation.amount.total, reservation.currency)}</dd>
                    
                    {reservation.amount.agent_commission !== undefined && (
                      <>
                        <dt className="text-gray-500">Comissão:</dt>
                        <dd className="text-gray-900 font-medium">{formatCurrency(reservation.amount.agent_commission, reservation.currency)}</dd>
                      </>
                    )}
                  </dl>
                </div>
                
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Ações</h4>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Link
                      href={`/agent/reservations/${reservation.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Ver Detalhes
                    </Link>
                    
                    {reservation.status === ReservationStatus.PENDING && (
                      <Link
                        href={`/agent/reservations/${reservation.id}/edit`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Editar
                      </Link>
                    )}
                  </div>
                  
                  {reservation.payment_status === 'unpaid' || reservation.payment_status === 'partially_paid' ? (
                    <Link
                      href={`/agent/reservations/${reservation.id}/payment`}
                      className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success-main hover:bg-success-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-main"
                    >
                      Realizar Pagamento
                    </Link>
                  ) : null}
                  
                  {reservation.status === ReservationStatus.PENDING && (
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-error-main hover:bg-error-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-main"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 25, 50]}
          showItemsPerPage
        />
      </div>
    </div>
  );
}; 