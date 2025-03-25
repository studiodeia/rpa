import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { AgentReservationList } from '../../../components/agents/AgentReservationList';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Reservation, ReservationStatus } from '../../../types/reservations';

// Mock de dados para reservas
const mockReservations: Reservation[] = [
  {
    id: '1',
    reference_code: 'RES-12345',
    client_name: 'João Silva',
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
      agent_commission: 330
    },
    currency: 'BRL',
    created_at: new Date('2023-06-10')
  },
  {
    id: '2',
    reference_code: 'RES-12346',
    client_name: 'Maria Oliveira',
    check_in: new Date('2023-08-10'),
    check_out: new Date('2023-08-15'),
    status: ReservationStatus.PENDING,
    payment_status: 'partially_paid',
    nights: 5,
    adults: 2,
    children: 1,
    amount: {
      subtotal: 3500,
      taxes: 350,
      discounts: 0,
      total: 3850,
      agent_commission: 385
    },
    currency: 'BRL',
    created_at: new Date('2023-07-05')
  },
  {
    id: '3',
    reference_code: 'RES-12347',
    client_name: 'Carlos Santos',
    check_in: new Date('2023-09-05'),
    check_out: new Date('2023-09-12'),
    status: ReservationStatus.PENDING,
    payment_status: 'unpaid',
    nights: 7,
    adults: 4,
    children: 2,
    amount: {
      subtotal: 5600,
      taxes: 560,
      discounts: 400,
      total: 5760,
      agent_commission: 576
    },
    currency: 'BRL',
    created_at: new Date('2023-08-01')
  },
  {
    id: '4',
    reference_code: 'RES-12348',
    client_name: 'Ana Pereira',
    check_in: new Date('2023-06-20'),
    check_out: new Date('2023-06-25'),
    status: ReservationStatus.COMPLETED,
    payment_status: 'paid',
    nights: 5,
    adults: 2,
    children: 0,
    amount: {
      subtotal: 3200,
      taxes: 320,
      discounts: 0,
      total: 3520,
      agent_commission: 352
    },
    currency: 'BRL',
    created_at: new Date('2023-05-15')
  },
  {
    id: '5',
    reference_code: 'RES-12349',
    client_name: 'Roberto Lima',
    check_in: new Date('2023-08-15'),
    check_out: new Date('2023-08-20'),
    status: ReservationStatus.CANCELED,
    payment_status: 'unpaid',
    nights: 5,
    adults: 3,
    children: 1,
    amount: {
      subtotal: 4000,
      taxes: 400,
      discounts: 0,
      total: 4400,
      agent_commission: 440
    },
    currency: 'BRL',
    created_at: new Date('2023-07-10')
  }
];

export default function AgentReservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('upcoming');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Efeito para carregar as reservas (simulado com setTimeout)
  useEffect(() => {
    // Simulando carregamento de dados da API
    const timer = setTimeout(() => {
      setReservations(mockReservations);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Efeito para aplicar filtros às reservas
  useEffect(() => {
    let filtered = [...reservations];

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.status === statusFilter);
    }

    // Filtrar por data
    const today = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(res => new Date(res.check_in) >= today);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(res => new Date(res.check_in) < today);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        res => 
          res.reference_code.toLowerCase().includes(term) ||
          res.client_name.toLowerCase().includes(term)
      );
    }

    setFilteredReservations(filtered);
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  }, [reservations, statusFilter, dateFilter, searchTerm]);

  // Obter as reservas para a página atual
  const getCurrentPageReservations = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReservations.slice(startIndex, startIndex + pageSize);
  };

  // Função para lidar com mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Função para lidar com mudança de tamanho de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Resetar para a primeira página
  };

  return (
    <>
      <Head>
        <title>Minhas Reservas | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Minhas Reservas">
        <div className="space-y-6">
          {/* Cabeçalho com ações */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Minhas Reservas</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todas as suas reservas de pesca em um só lugar
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                variant="primary"
                onClick={() => router.push('/agent/reservations/new')}
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nova Reserva
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Busca
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Código ou nome do cliente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
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
                  <option value={ReservationStatus.PENDING}>Pendente</option>
                  <option value={ReservationStatus.CONFIRMED}>Confirmada</option>
                  <option value={ReservationStatus.COMPLETED}>Concluída</option>
                  <option value={ReservationStatus.CANCELED}>Cancelada</option>
                  <option value={ReservationStatus.NO_SHOW}>No-Show</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <Select
                  id="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">Todas as datas</option>
                  <option value="upcoming">Próximas</option>
                  <option value="past">Passadas</option>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStatusFilter('all');
                    setDateFilter('all');
                    setSearchTerm('');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de Reservas */}
          <AgentReservationList
            reservations={getCurrentPageReservations()}
            totalItems={filteredReservations.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
          />
        </div>
      </AgentLayout>
    </>
  );
} 