import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { Select } from '../../../components/ui/Select';
import { formatCurrency, formatDate } from '../../../utils/formatters';

// Mock de dados para comissões
const mockCommissions = [
  {
    id: '1',
    reservation_id: '1',
    reservation_code: 'RES-12345',
    client_name: 'João Silva',
    operation_name: 'Pesca na Amazônia',
    commission_amount: 330,
    reservation_amount: 3300,
    currency: 'BRL',
    status: 'paid',
    payment_date: new Date('2023-06-15'),
    payment_reference: 'PAY-12345'
  },
  {
    id: '2',
    reservation_id: '2',
    reservation_code: 'RES-12346',
    client_name: 'Maria Oliveira',
    operation_name: 'Pesca no Pantanal',
    commission_amount: 385,
    reservation_amount: 3850,
    currency: 'BRL',
    status: 'pending',
    payment_date: null,
    payment_reference: null
  },
  {
    id: '3',
    reservation_id: '3',
    reservation_code: 'RES-12347',
    client_name: 'Carlos Santos',
    operation_name: 'Pesca em Mato Grosso',
    commission_amount: 576,
    reservation_amount: 5760,
    currency: 'BRL',
    status: 'pending',
    payment_date: null,
    payment_reference: null
  },
  {
    id: '4',
    reservation_id: '4',
    reservation_code: 'RES-12348',
    client_name: 'Ana Pereira',
    operation_name: 'Pesca na Amazônia',
    commission_amount: 352,
    reservation_amount: 3520,
    currency: 'BRL',
    status: 'paid',
    payment_date: new Date('2023-05-20'),
    payment_reference: 'PAY-12346'
  },
  {
    id: '5',
    reservation_id: '6',
    reservation_code: 'RES-12350',
    client_name: 'Pedro Alves',
    operation_name: 'Pesca no Pantanal',
    commission_amount: 420,
    reservation_amount: 4200,
    currency: 'BRL',
    status: 'processing',
    payment_date: null,
    payment_reference: 'PAY-12347'
  }
];

// Mock de resumo de comissões
const mockCommissionSummary = {
  total: 2063.00,
  paid: 682.00,
  pending: 961.00,
  processing: 420.00,
  next_payment_date: new Date('2023-09-15')
};

export default function AgentCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // Efeito para carregar as comissões (simulado com setTimeout)
  useEffect(() => {
    // Simulando carregamento de dados da API
    const timer = setTimeout(() => {
      setCommissions(mockCommissions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Efeito para aplicar filtros às comissões
  useEffect(() => {
    let filtered = [...commissions];

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(commission => commission.status === statusFilter);
    }

    // Filtrar por período
    if (periodFilter !== 'all') {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      if (periodFilter === 'this_month') {
        filtered = filtered.filter(commission => {
          if (!commission.payment_date) return false;
          const paymentDate = new Date(commission.payment_date);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        });
      } else if (periodFilter === 'last_month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        filtered = filtered.filter(commission => {
          if (!commission.payment_date) return false;
          const paymentDate = new Date(commission.payment_date);
          return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear;
        });
      } else if (periodFilter === 'this_year') {
        filtered = filtered.filter(commission => {
          if (!commission.payment_date) return false;
          const paymentDate = new Date(commission.payment_date);
          return paymentDate.getFullYear() === currentYear;
        });
      }
    }

    setFilteredCommissions(filtered);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  }, [commissions, statusFilter, periodFilter]);

  // Obter as comissões para a página atual
  const getCurrentPageCommissions = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCommissions.slice(startIndex, startIndex + pageSize);
  };

  // Função para lidar com mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Função para lidar com mudança de tamanho de página
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Resetar para a primeira página
  };

  // Função para renderizar o badge de status
  const renderStatusBadge = (status) => {
    const statusConfig = {
      'paid': {
        variant: 'success',
        label: 'Paga',
      },
      'pending': {
        variant: 'warning',
        label: 'Pendente',
      },
      'processing': {
        variant: 'info',
        label: 'Em Processamento',
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} rounded>{config.label}</Badge>;
  };

  return (
    <>
      <Head>
        <title>Comissões | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Comissões">
        <div className="space-y-6">
          {/* Resumo de Comissões */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Comissões Totais</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(mockCommissionSummary.total, 'BRL')}</h3>
                  </div>
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Comissões Pagas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(mockCommissionSummary.paid, 'BRL')}</h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Comissões Pendentes</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(mockCommissionSummary.pending, 'BRL')}</h3>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Próximo Pagamento</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatDate(mockCommissionSummary.next_payment_date)}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros de Comissões */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Comissões por Reserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  <option value="paid">Pagas</option>
                  <option value="pending">Pendentes</option>
                  <option value="processing">Em Processamento</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <Select
                  id="period"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  <option value="all">Todos os períodos</option>
                  <option value="this_month">Este mês</option>
                  <option value="last_month">Mês passado</option>
                  <option value="this_year">Este ano</option>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStatusFilter('all');
                    setPeriodFilter('all');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Tabela de Comissões */}
          <Card>
            {isLoading ? (
              <div className="animate-pulse p-4">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reserva
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Operação
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Reserva
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comissão
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Pagamento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPageCommissions().map((commission) => (
                        <tr key={commission.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {commission.reservation_code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {commission.client_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {commission.operation_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(commission.reservation_amount, commission.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(commission.commission_amount, commission.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(commission.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {commission.payment_date ? formatDate(commission.payment_date) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredCommissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma comissão encontrada com os filtros selecionados.</p>
                  </div>
                ) : (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <Pagination
                      totalItems={filteredCommissions.length}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Informações sobre pagamentos */}
          <Card className="bg-white">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informações sobre Pagamentos de Comissões</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-900">Política de Pagamentos:</span> As comissões são pagas mensalmente, no dia 15 de cada mês, para todas as reservas com status "Concluída" no mês anterior.
                </p>
                <p>
                  <span className="font-medium text-gray-900">Método de Pagamento:</span> As comissões são pagas via transferência bancária para a conta registrada em seu perfil.
                </p>
                <p>
                  <span className="font-medium text-gray-900">Estrutura de Comissão:</span> Você recebe 10% do valor total da reserva para todas as operações.
                </p>
                <p>
                  <span className="font-medium text-gray-900">Dúvidas?</span> Entre em contato com nossa equipe financeira pelo e-mail <a href="mailto:finance@riverplateanglers.com" className="text-primary-600 hover:text-primary-500">finance@riverplateanglers.com</a>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </AgentLayout>
    </>
  );
} 