import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Pagination } from '../../../components/ui/Pagination';

// Tipo para representar um registro de pesca
interface FishingLog {
  id: number;
  date: string;
  location: string;
  species: string;
  weight: string;
  length: string;
  technique: string;
  weather: string;
  notes?: string;
  imageUrl?: string;
}

export default function FishingLogs() {
  // Estado para controle de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dados de exemplo para registros de pesca
  const fishingLogs: FishingLog[] = [
    {
      id: 1,
      date: '12/10/2023',
      location: 'Rio Paraná, Corrientes',
      species: 'Dourado',
      weight: '8.5 kg',
      length: '78 cm',
      technique: 'Fly Fishing',
      weather: 'Ensolarado, 28°C',
      notes: 'Capturado ao amanhecer com mosca artificial padrão Deceiver amarela.',
      imageUrl: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1',
    },
    {
      id: 2,
      date: '05/10/2023',
      location: 'Rio Uruguai, Concordia',
      species: 'Surubí',
      weight: '15.2 kg',
      length: '112 cm',
      technique: 'Corrico',
      weather: 'Nublado, 22°C',
      notes: 'Capturado utilizando isca artificial tipo Jerk, em área profunda do rio.',
      imageUrl: 'https://images.unsplash.com/photo-1545816250-0c2c90a5fbbe',
    },
    {
      id: 3,
      date: '28/09/2023',
      location: 'Rio Paraguai, Assunção',
      species: 'Piapara',
      weight: '4.1 kg',
      length: '55 cm',
      technique: 'Natural',
      weather: 'Parcialmente nublado, 25°C',
      notes: 'Iscado com minhoca, capturado próximo à margem com vegetação.',
      imageUrl: 'https://images.unsplash.com/photo-1616192866272-76b45a90a877',
    },
    {
      id: 4,
      date: '15/09/2023',
      location: 'Delta do Paraná, Tigre',
      species: 'Pati',
      weight: '5.8 kg',
      length: '62 cm',
      technique: 'Fundo',
      weather: 'Ensolarado, 26°C',
      notes: 'Capturado em área com correnteza moderada utilizando isca natural.',
      imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659',
    },
    {
      id: 5,
      date: '02/09/2023',
      location: 'Rio da Prata, Buenos Aires',
      species: 'Corvina',
      weight: '3.2 kg',
      length: '48 cm',
      technique: 'Spinning',
      weather: 'Ventos fortes, 18°C',
      notes: 'Utilizando isca artificial tipo jig head com shad.',
      imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9',
    },
    {
      id: 6,
      date: '22/08/2023',
      location: 'Rio Uruguai, Salto',
      species: 'Piava',
      weight: '2.1 kg',
      length: '42 cm',
      technique: 'Natural',
      weather: 'Chuvoso, 17°C',
      notes: 'Capturado com massa de pão, próximo à barragem.',
      imageUrl: 'https://images.unsplash.com/photo-1513039715-ba4c21dab903',
    },
    {
      id: 7,
      date: '10/08/2023',
      location: 'Rio Paraná, Rosário',
      species: 'Dourado',
      weight: '7.4 kg',
      length: '71 cm',
      technique: 'Artificial',
      weather: 'Ensolarado, 24°C',
      notes: 'Isca tipo colher, área com correnteza forte.',
      imageUrl: 'https://images.unsplash.com/photo-1587058680684-e0a315822658',
    },
    {
      id: 8,
      date: '28/07/2023',
      location: 'Rio Paraná, Ituzaingó',
      species: 'Piraputanga',
      weight: '3.6 kg',
      length: '52 cm',
      technique: 'Fly Fishing',
      weather: 'Nublado, 20°C',
      notes: 'Mosca seca, padrão Adams.',
      imageUrl: 'https://images.unsplash.com/photo-1621409751977-635708bd991e',
    },
  ];

  // Lógica para paginação
  const totalItems = fishingLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentItems = fishingLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Função para alterar a página atual
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Função para alterar o tamanho da página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Voltar para a primeira página ao mudar o tamanho
  };

  return (
    <>
      <Head>
        <title>Registros de Pesca | River Plate Anglers</title>
      </Head>

      <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registros de Pesca</h1>
            <p className="mt-2 text-sm text-gray-700">
              Acompanhe suas capturas e experiências de pesca no Rio da Prata
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link 
              href="/fishing/logs/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Adicionar Registro
            </Link>
          </div>
        </div>

        {/* Filtros e busca (básicos para exemplo) */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/4">
              <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                Espécie
              </label>
              <select
                id="species"
                name="species"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="">Todas as espécies</option>
                <option value="dourado">Dourado</option>
                <option value="surubi">Surubí</option>
                <option value="piava">Piava</option>
                <option value="pati">Pati</option>
                <option value="corvina">Corvina</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <select
                id="location"
                name="location"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="">Todos os locais</option>
                <option value="parana">Rio Paraná</option>
                <option value="uruguai">Rio Uruguai</option>
                <option value="paraguai">Rio Paraguai</option>
                <option value="prata">Rio da Prata</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4">
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                id="date-range"
                name="date-range"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="">Todo período</option>
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 3 meses</option>
                <option value="180">Últimos 6 meses</option>
                <option value="365">Último ano</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4 sm:self-end">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de registros */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Espécie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Local
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comprimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Técnica
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.species}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.technique}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/fishing/logs/${log.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                        Ver
                      </Link>
                      <Link href={`/fishing/logs/${log.id}/edit`} className="text-primary-600 hover:text-primary-900 mr-3">
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este registro?')) {
                            // Função para excluir o registro
                            console.log(`Excluir registro ${log.id}`);
                          }
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[5, 10, 25, 50]}
              showItemsPerPage
            />
          </div>
        </div>
      </div>
    </>
  );
} 