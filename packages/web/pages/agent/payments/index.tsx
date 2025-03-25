import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { Select } from '../../../components/ui/Select';
import { formatCurrency, formatDate } from '../../../utils/formatters';

// Mock de dados para pagamentos
const mockPayments = [
  {
    id: '1',
    reservation_id: '1',
    reservation_code: 'RES-12345',
    client_name: 'João Silva',
    amount: 3300,
    currency: 'BRL',
    method: 'Transferência Bancária',
    status: 'completed',
    date: new Date('2023-06-15'),
    notes: 'Pagamento total recebido'
  },
  {
    id: '2',
    reservation_id: '2',
    reservation_code: 'RES-12346',
    client_name: 'Maria Oliveira',
    amount: 1500,
    currency: 'BRL',
    method: 'PIX',
    status: 'completed',
    date: new Date('2023-07-10'),
    notes: 'Pagamento parcial (sinal)'
  },
  {
    id: '3',
    reservation_id: '3',
    reservation_code: 'RES-12347',
    client_name: 'Carlos Santos',
    amount: 2000,
    currency: 'BRL',
    method: 'Cartão de Crédito',
    status: 'pending',
    date: new Date('2023-08-05'),
    notes: 'Aguardando confirmação do gateway'
  },
  {
    id: '4',
    reservation_id: '4',
    reservation_code: 'RES-12348',
    client_name: 'Ana Pereira',
    amount: 3520,
    currency: 'BRL',
    method: 'Transferência Bancária',
    status: 'completed',
    date: new Date('2023-05-20'),
    notes: 'Pagamento total recebido'
  },
  {
    id: '5',
    reservation_id: '2',
    reservation_code: 'RES-12346',
    client_name: 'Maria Oliveira',
    amount: 2350,
    currency: 'BRL',
    method: 'PIX',
    status: 'failed',
    date: new Date('2023-07-15'),
    notes: 'Tentativa de pagamento do saldo recusada'
  }
];

// Mock de comissões
const mockCommissions = {
  total: 1247.50,
  pending: 576.00,
  paid: 671.50,
  next_payment: new Date('2023-09-15')
};

export default function AgentPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Efeito para carregar os pagamentos (simulado com setTimeout)
  useEffect(() => {
    // Simulando carregamento de dados da API
    const timer = setTimeout(() => {
      setPayments(mockPayments);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Efeito para aplicar filtros aos pagamentos
  useEffect(() => {
    let filtered = [...payments];

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Filtrar por método
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  }, [payments, statusFilter, methodFilter]);

  // Obter os pagamentos para a página atual
  const getCurrentPagePayments = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPayments.slice(startIndex, startIndex + pageSize);
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
      'completed': {
        variant: 'success',
        label: 'Concluído',
      },
      'pending': {
        variant: 'warning',
        label: 'Pendente',
      },
      'failed': {
        variant: 'error',
        label: 'Falhou',
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} rounded>{config.label}</Badge>;
  };

  return (
    <>
      <Head>
        <title>Pagamentos | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Pagamentos">
        <div className="space-y-6">
          {/* Resumo de Comissões */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Comissões Totais</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(mockCommissions.total, 'BRL')}</h3>
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
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(mockCommissions.paid, 'BRL')}</h3>
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
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(mockCommissions.pending, 'BRL')}</h3>
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
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatDate(mockCommissions.next_payment)}</h3>
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

          {/* Filtros de Pagamentos */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pagamentos de Reservas</h2>
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
                  <option value="completed">Concluído</option>
                  <option value="pending">Pendente</option>
                  <option value="failed">Falhou</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pagamento
                </label>
                <Select
                  id="method"
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <option value="all">Todos os métodos</option>
                  <option value="Transferência Bancária">Transferência Bancária</option>
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Wise">Wise</option>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStatusFilter('all');
                    setMethodFilter('all');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Tabela de Pagamentos */}
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
                          Valor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Método
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
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
                      {getCurrentPagePayments().map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.reservation_code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.client_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(payment.amount, payment.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              variant="tertiary"
                              onClick={() => router.push(`/agent/reservations/${payment.reservation_id}`)}
                              size="sm"
                            >
                              Ver Reserva
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum pagamento encontrado com os filtros selecionados.</p>
                  </div>
                ) : (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <Pagination
                      totalItems={filteredPayments.length}
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
        </div>
      </AgentLayout>
    </>
  );
} 