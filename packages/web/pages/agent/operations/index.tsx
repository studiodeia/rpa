import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { formatCurrency } from '../../../utils/formatters';

// Mock de dados para operações
const mockOperations = [
  {
    id: '1',
    name: 'Pesca na Amazônia',
    location: 'Amazonas, Brasil',
    description: 'Pesca esportiva em águas amazônicas, com foco em tucunaré e peacock bass. Acomodação em lodge de luxo com toda infraestrutura.',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: {
      startingFrom: 3500,
      currency: 'BRL'
    },
    duration: {
      min: 4,
      max: 7
    },
    highlights: [
      'Lodge de luxo com ar-condicionado',
      'Guias experientes',
      'Barcos equipados',
      'Refeições gourmet incluídas'
    ],
    available: true,
    commission: 10
  },
  {
    id: '2',
    name: 'Pesca no Pantanal',
    location: 'Mato Grosso, Brasil',
    description: 'Experimente a pesca esportiva nas águas ricas do Pantanal, habitat de mais de 260 espécies de peixes incluindo o dourado e o pintado.',
    image: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: {
      startingFrom: 4200,
      currency: 'BRL'
    },
    duration: {
      min: 3,
      max: 6
    },
    highlights: [
      'Pousada flutuante exclusiva',
      'Observação da vida selvagem',
      'Equipamentos de pesca premium',
      'Transfers de hidroavião incluídos'
    ],
    available: true,
    commission: 10
  },
  {
    id: '3',
    name: 'Pesca Esportiva em Barra Grande',
    location: 'Bahia, Brasil',
    description: 'Pesca em alto mar na costa baiana, especializada em marlins e atuns. Experiência perfeita para pescadores que buscam grandes troféus.',
    image: 'https://images.unsplash.com/photo-1564689510742-4e9c7584181d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: {
      startingFrom: 5800,
      currency: 'BRL'
    },
    duration: {
      min: 5,
      max: 10
    },
    highlights: [
      'Embarcações offshore equipadas',
      'Equipe especializada em pesca oceânica',
      'Resort 5 estrelas à beira-mar',
      'Processamento e envio de troféus'
    ],
    available: true,
    commission: 12
  },
  {
    id: '4',
    name: 'Pesca no Rio Paraná',
    location: 'Entre Rios, Argentina',
    description: 'Pesca esportiva no delta do Rio Paraná, famoso pelos seus grandes dourados. Experiência autêntica com hospedagem em estância tradicional.',
    image: 'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: {
      startingFrom: 2800,
      currency: 'USD'
    },
    duration: {
      min: 3,
      max: 5
    },
    highlights: [
      'Estância argentina tradicional',
      'Culinária local com asado',
      'Guias bilíngues',
      'Equipamentos completos fornecidos'
    ],
    available: true,
    commission: 15
  },
  {
    id: '5',
    name: 'Pesca em Salto Grande',
    location: 'Entre Rios, Argentina',
    description: 'Pesca de dourados e surubins nas corredeiras de Salto Grande. Ideal para pescadores que buscam desafio e aventura.',
    image: 'https://images.unsplash.com/photo-1605358664631-81c852466d8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: {
      startingFrom: 3200,
      currency: 'USD'
    },
    duration: {
      min: 4,
      max: 8
    },
    highlights: [
      'Lodge premium à beira do rio',
      'Acesso exclusivo às melhores áreas',
      'Experiência gastronômica premium',
      'Transfer de Buenos Aires incluído'
    ],
    available: false,
    commission: 12
  }
];

export default function AgentOperations() {
  const [operations, setOperations] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('none');

  // Efeito para carregar as operações (simulado com setTimeout)
  useEffect(() => {
    // Simulando carregamento de dados da API
    const timer = setTimeout(() => {
      setOperations(mockOperations);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Efeito para aplicar filtros às operações
  useEffect(() => {
    let filtered = [...operations];

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        op => 
          op.name.toLowerCase().includes(term) ||
          op.location.toLowerCase().includes(term) ||
          op.description.toLowerCase().includes(term)
      );
    }

    // Filtrar por localização
    if (locationFilter !== 'all') {
      filtered = filtered.filter(op => op.location.includes(locationFilter));
    }

    // Filtrar por duração
    if (durationFilter !== 'all') {
      if (durationFilter === 'short') {
        filtered = filtered.filter(op => op.duration.min <= 4);
      } else if (durationFilter === 'medium') {
        filtered = filtered.filter(op => op.duration.min >= 4 && op.duration.max <= 7);
      } else if (durationFilter === 'long') {
        filtered = filtered.filter(op => op.duration.max > 7);
      }
    }

    // Ordenar por preço
    if (priceSort === 'asc') {
      filtered.sort((a, b) => {
        // Converter para a mesma moeda para comparação
        const aPrice = a.price.currency === 'USD' ? a.price.startingFrom * 5 : a.price.startingFrom;
        const bPrice = b.price.currency === 'USD' ? b.price.startingFrom * 5 : b.price.startingFrom;
        return aPrice - bPrice;
      });
    } else if (priceSort === 'desc') {
      filtered.sort((a, b) => {
        // Converter para a mesma moeda para comparação
        const aPrice = a.price.currency === 'USD' ? a.price.startingFrom * 5 : a.price.startingFrom;
        const bPrice = b.price.currency === 'USD' ? b.price.startingFrom * 5 : b.price.startingFrom;
        return bPrice - aPrice;
      });
    }

    setFilteredOperations(filtered);
  }, [operations, searchTerm, locationFilter, durationFilter, priceSort]);

  // Localizações únicas para o filtro
  const uniqueLocations = Array.from(new Set(operations.map(op => {
    const [city, country] = op.location.split(', ');
    return country;
  })));

  return (
    <>
      <Head>
        <title>Operações | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Operações">
        <div className="space-y-6">
          {/* Header com texto explicativo */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operações Disponíveis</h1>
            <p className="mt-1 text-sm text-gray-500">
              Explore todas as operações de pesca disponíveis para reservas. Utilize os filtros para encontrar a opção ideal para seu cliente.
            </p>
          </div>

          {/* Filtros */}
          <Card className="bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Busca
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Nome, localização ou palavra-chave"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <Select
                  id="location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">Todos os países</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duração
                </label>
                <Select
                  id="duration"
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                >
                  <option value="all">Todas as durações</option>
                  <option value="short">Curta (até 4 dias)</option>
                  <option value="medium">Média (4-7 dias)</option>
                  <option value="long">Longa (mais de 7 dias)</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por Preço
                </label>
                <Select
                  id="price"
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                  <option value="none">Sem ordenação</option>
                  <option value="asc">Menor preço</option>
                  <option value="desc">Maior preço</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Lista de Operações */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg space-y-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredOperations.length === 0 ? (
                <div className="text-center py-12">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma operação encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tente ajustar seus filtros para encontrar o que está procurando.
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearchTerm('');
                        setLocationFilter('all');
                        setDurationFilter('all');
                        setPriceSort('none');
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOperations.map(operation => (
                    <Card key={operation.id} className="overflow-hidden h-full flex flex-col">
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={operation.image}
                          alt={operation.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900">{operation.name}</h3>
                          {!operation.available && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Indisponível
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{operation.location}</p>
                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{operation.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-semibold text-gray-900">
                              {formatCurrency(operation.price.startingFrom, operation.price.currency)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">a partir de</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {operation.duration.min} a {operation.duration.max} dias
                          </p>
                          <p className="text-sm text-success-main mt-1">
                            Comissão: {operation.commission}%
                          </p>
                        </div>
                        
                        <div className="mt-auto">
                          <Link href={`/agent/operations/${operation.id}`}>
                            <Button
                              variant="primary"
                              className="w-full"
                              disabled={!operation.available}
                            >
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </AgentLayout>
    </>
  );
} 