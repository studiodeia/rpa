import React from 'react';
import Head from 'next/head';

export default function Home() {
  // Dados de exemplo para estatísticas
  const stats = [
    { name: 'Peixes Registrados', value: '248' },
    { name: 'Locais Explorados', value: '37' },
    { name: 'Espécies Capturadas', value: '12' },
    { name: 'Horas de Pesca', value: '126' },
  ];

  // Dados de exemplo para últimas capturas
  const recentCatches = [
    { 
      id: 1, 
      species: 'Dourado', 
      date: '12/10/2023', 
      location: 'Rio Paraná, Corrientes', 
      weight: '8.5 kg',
      length: '78 cm',
      imageUrl: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
    },
    { 
      id: 2, 
      species: 'Surubí', 
      date: '05/10/2023', 
      location: 'Rio Uruguai, Concordia', 
      weight: '15.2 kg',
      length: '112 cm',
      imageUrl: 'https://images.unsplash.com/photo-1545816250-0c2c90a5fbbe?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
    },
    { 
      id: 3, 
      species: 'Piapara', 
      date: '28/09/2023', 
      location: 'Rio Paraguai, Assunção', 
      weight: '4.1 kg',
      length: '55 cm',
      imageUrl: 'https://images.unsplash.com/photo-1616192866272-76b45a90a877?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
    },
  ];

  // Dados de exemplo para condições climáticas
  const weatherConditions = [
    { day: 'Hoje', condition: 'Ensolarado', temp: '28°C', precipitation: '0%', wind: '8 km/h' },
    { day: 'Amanhã', condition: 'Parcialmente Nublado', temp: '26°C', precipitation: '10%', wind: '12 km/h' },
    { day: 'Quarta', condition: 'Chuvoso', temp: '22°C', precipitation: '80%', wind: '15 km/h' },
    { day: 'Quinta', condition: 'Nublado', temp: '24°C', precipitation: '30%', wind: '10 km/h' },
    { day: 'Sexta', condition: 'Ensolarado', temp: '29°C', precipitation: '0%', wind: '6 km/h' },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | River Plate Anglers</title>
      </Head>

      <main className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Bem-vindo ao seu painel de controle de pesca
            </p>
          </div>

          {/* Estatísticas */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="ml-1 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Últimas capturas */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Últimas Capturas
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Seus registros mais recentes de pesca
                </p>
              </div>
              <div className="bg-white overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentCatches.map((fish) => (
                    <li key={fish.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center sm:space-x-4">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={fish.imageUrl}
                            alt={fish.species}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary-600">{fish.species}</p>
                          <div className="grid grid-cols-2 gap-x-2 mt-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Peso:</span> {fish.weight}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Comprimento:</span> {fish.length}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Local:</span> {fish.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Data:</span> {fish.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Ver todos os registros <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Previsão do tempo */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Previsão do Tempo
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Condições climáticas para os próximos dias
                </p>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dia
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condição
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Temp.
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precipitação
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weatherConditions.map((day) => (
                        <tr key={day.day} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {day.day}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {day.condition}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {day.temp}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {day.precipitation}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {day.wind}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Ver previsão completa <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mapa de pontos de pesca (mockup) */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Mapa de Pontos de Pesca
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Locais registrados e condições de pesca
              </p>
            </div>
            <div className="h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-gray-500 mb-2">Mapa de pontos de pesca será exibido aqui</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Explorar mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 