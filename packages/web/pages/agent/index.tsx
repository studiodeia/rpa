import React, { useState } from 'react';
import Head from 'next/head';
import { AgentLayout } from '../../components/agents/AgentLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ReservationStatus } from '../../types/reservations';

// Mock de dados para o dashboard
const recentReservations = [
  {
    id: '1',
    reference_code: 'RES-12345',
    client_name: 'João Silva',
    check_in: new Date('2023-07-15'),
    check_out: new Date('2023-07-20'),
    status: ReservationStatus.CONFIRMED,
    amount: { total: 3500 },
    currency: 'BRL'
  },
  {
    id: '2',
    reference_code: 'RES-12346',
    client_name: 'Maria Oliveira',
    check_in: new Date('2023-08-10'),
    check_out: new Date('2023-08-15'),
    status: ReservationStatus.PENDING,
    amount: { total: 4200 },
    currency: 'BRL'
  },
  {
    id: '3',
    reference_code: 'RES-12347',
    client_name: 'Carlos Santos',
    check_in: new Date('2023-09-05'),
    check_out: new Date('2023-09-12'),
    status: ReservationStatus.PENDING,
    amount: { total: 5800 },
    currency: 'BRL'
  }
];

// Mock de dados para estatísticas do dashboard
const dashboardStats = {
  pendingReservations: 5,
  confirmedReservations: 8,
  totalCommission: 7850,
  pendingPayments: 3
};

export default function AgentDashboard() {
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

  return (
    <>
      <Head>
        <title>Dashboard do Agente | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Dashboard">
        <div className="space-y-6">
          {/* Estatísticas do Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reservas Pendentes</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.pendingReservations}</h3>
                  </div>
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/agent/reservations?status=pending" 
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Ver todas
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reservas Confirmadas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.confirmedReservations}</h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/agent/reservations?status=confirmed" 
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Ver todas
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Comissões Totais</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(dashboardStats.totalCommission, 'BRL')}</h3>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/agent/commissions" 
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pagamentos Pendentes</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.pendingPayments}</h3>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/agent/payments" 
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Ver pagamentos
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Reservas Recentes */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Reservas Recentes</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentReservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.reference_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.client_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(reservation.check_in)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(reservation.check_out)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(reservation.amount.total, reservation.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(reservation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link
                            href={`/agent/reservations/${reservation.id}`}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <Link
                  href="/agent/reservations"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Ver todas as reservas
                </Link>
              </div>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white hover:bg-gray-50 transition-colors">
                <Link href="/agent/reservations/new" className="block p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nova Reserva</h3>
                    <p className="text-sm text-gray-500">Criar uma nova reserva para seus clientes</p>
                  </div>
                </Link>
              </Card>

              <Card className="bg-white hover:bg-gray-50 transition-colors">
                <Link href="/agent/operations" className="block p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-green-50 text-green-600 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Operações</h3>
                    <p className="text-sm text-gray-500">Visualizar todas as operações disponíveis</p>
                  </div>
                </Link>
              </Card>

              <Card className="bg-white hover:bg-gray-50 transition-colors">
                <Link href="/agent/payments" className="block p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Pagamentos</h3>
                    <p className="text-sm text-gray-500">Gerenciar pagamentos e recebimentos</p>
                  </div>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </AgentLayout>
    </>
  );
} 