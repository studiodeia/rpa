import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { PriceSummary } from '../../../components/reservations/PriceSummary';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Reservation, ReservationStatus } from '../../../types/reservations';

// Mock de dados para uma reserva específica
const mockReservation: Reservation = {
  id: '1',
  reference_code: 'RES-12345',
  client_name: 'João Silva',
  client_email: 'joao.silva@example.com',
  client_phone: '+55 11 98765-4321',
  check_in: new Date('2023-07-15'),
  check_out: new Date('2023-07-20'),
  status: ReservationStatus.CONFIRMED,
  payment_status: 'paid',
  nights: 5,
  adults: 2,
  children: 0,
  amount: {
    subtotal: 3000,
    taxes: 300,
    discounts: 0,
    total: 3300,
    deposit: 1000,
    balance: 2300,
    agent_commission: 330
  },
  currency: 'BRL',
  created_at: new Date('2023-06-10'),
  operation: {
    id: '101',
    name: 'Pesca na Amazônia',
    location: 'Amazonas, Brasil'
  },
  room_type: 'Suite Luxo',
  special_requests: 'Cliente prefere quartos próximos, se possível.',
  payment_method: 'Transferência Bancária',
  payment_date: new Date('2023-06-15')
};

export default function ReservationDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar a reserva (simulado com setTimeout)
  useEffect(() => {
    if (id) {
      // Simulando carregamento de dados da API
      const timer = setTimeout(() => {
        setReservation(mockReservation);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [id]);

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

  if (isLoading) {
    return (
      <AgentLayout title="Detalhes da Reserva">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AgentLayout>
    );
  }

  if (!reservation) {
    return (
      <AgentLayout title="Detalhes da Reserva">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserva não encontrada</h2>
          <p className="text-gray-500 mb-6">A reserva que você está procurando não existe ou foi removida.</p>
          <Button
            variant="primary"
            onClick={() => router.push('/agent/reservations')}
          >
            Voltar para Reservas
          </Button>
        </div>
      </AgentLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Reserva {reservation.reference_code} | River Plate Anglers</title>
      </Head>

      <AgentLayout title={`Reserva ${reservation.reference_code}`}>
        <div className="space-y-6">
          {/* Cabeçalho com ações */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{reservation.reference_code}</h1>
                {renderStatusBadge(reservation.status)}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Criada em {formatDate(reservation.created_at)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => router.back()}
              >
                Voltar
              </Button>
              
              {reservation.status === ReservationStatus.PENDING && (
                <Link href={`/agent/reservations/${reservation.id}/edit`}>
                  <Button variant="secondary">
                    Editar
                  </Button>
                </Link>
              )}
              
              {reservation.payment_status !== 'paid' && (
                <Link href={`/agent/reservations/${reservation.id}/payment`}>
                  <Button variant="primary">
                    Realizar Pagamento
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Conteúdo da Reserva */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Detalhes da Reserva */}
            <Card className="md:col-span-2">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Reserva</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informações da Operação</h3>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <dt className="text-gray-500">Operação:</dt>
                      <dd className="text-gray-900 font-medium">{reservation.operation?.name}</dd>
                      
                      <dt className="text-gray-500">Local:</dt>
                      <dd className="text-gray-900">{reservation.operation?.location}</dd>
                      
                      <dt className="text-gray-500">Acomodação:</dt>
                      <dd className="text-gray-900">{reservation.room_type}</dd>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Datas e Hóspedes</h3>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <dt className="text-gray-500">Check-in:</dt>
                      <dd className="text-gray-900 font-medium">{formatDate(reservation.check_in)}</dd>
                      
                      <dt className="text-gray-500">Check-out:</dt>
                      <dd className="text-gray-900 font-medium">{formatDate(reservation.check_out)}</dd>
                      
                      <dt className="text-gray-500">Noites:</dt>
                      <dd className="text-gray-900">{reservation.nights}</dd>
                      
                      <dt className="text-gray-500">Hóspedes:</dt>
                      <dd className="text-gray-900">
                        {reservation.adults} adulto{reservation.adults !== 1 ? 's' : ''}
                        {reservation.children > 0 ? `, ${reservation.children} criança${reservation.children !== 1 ? 's' : ''}` : ''}
                      </dd>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informações do Cliente</h3>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <dt className="text-gray-500">Nome:</dt>
                      <dd className="text-gray-900 font-medium">{reservation.client_name}</dd>
                      
                      <dt className="text-gray-500">Email:</dt>
                      <dd className="text-gray-900">{reservation.client_email}</dd>
                      
                      <dt className="text-gray-500">Telefone:</dt>
                      <dd className="text-gray-900">{reservation.client_phone}</dd>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informações de Pagamento</h3>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <dt className="text-gray-500">Status:</dt>
                      <dd className="text-gray-900">{renderPaymentStatusBadge(reservation.payment_status)}</dd>
                      
                      <dt className="text-gray-500">Método:</dt>
                      <dd className="text-gray-900">{reservation.payment_method}</dd>
                      
                      {reservation.payment_date && (
                        <>
                          <dt className="text-gray-500">Data:</dt>
                          <dd className="text-gray-900">{formatDate(reservation.payment_date)}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
                
                {reservation.special_requests && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Solicitações Especiais</h3>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {reservation.special_requests}
                    </p>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Resumo Financeiro */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo Financeiro</h2>
                
                <PriceSummary
                  subtotal={reservation.amount.subtotal}
                  discount={reservation.amount.discounts}
                  tax={reservation.amount.taxes}
                  total={reservation.amount.total}
                  currency={reservation.currency}
                  deposit={reservation.amount.deposit}
                  balance={reservation.amount.balance}
                  commission={reservation.amount.agent_commission}
                  showCommission={true}
                />
                
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">Ações de Pagamento</h3>
                  
                  {reservation.payment_status !== 'paid' && (
                    <Link 
                      href={`/agent/reservations/${reservation.id}/payment`}
                      className="w-full"
                    >
                      <Button
                        variant="primary"
                        className="w-full"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Realizar Pagamento
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    variant="tertiary"
                    className="w-full"
                    onClick={() => router.push(`/agent/reservations/${reservation.id}/invoice`)}
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Baixar Fatura
                  </Button>
                  
                  <Button
                    variant="tertiary"
                    className="w-full"
                    onClick={() => router.push(`/agent/reservations/${reservation.id}/voucher`)}
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      <path fillRule="evenodd" d="M8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Baixar Voucher
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Histórico da Reserva */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico da Reserva</h2>
              
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Reserva confirmada</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(new Date('2023-06-12'))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Pagamento recebido <span className="font-medium text-gray-900">{formatCurrency(3300, 'BRL')}</span></p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(new Date('2023-06-15'))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.038A2.968 2.968 0 0115 8.5A2.968 2.968 0 0117.038 10H18a1 1 0 001-1v-1a1 1 0 00-1-1h-1.613A3.979 3.979 0 0013 5.5l-1-1H3z" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Voucher enviado para o cliente</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(new Date('2023-06-16'))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </AgentLayout>
    </>
  );
} 