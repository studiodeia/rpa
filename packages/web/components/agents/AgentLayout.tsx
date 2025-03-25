import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserRole } from '../../types/users';

interface AgentLayoutProps {
  children: React.ReactNode;
  title?: string;
  agentName?: string;
  agentRole?: UserRole;
}

export const AgentLayout: React.FC<AgentLayoutProps> = ({
  children,
  title = 'Portal do Agente',
  agentName = 'Agente',
  agentRole = UserRole.AGENT,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/agent', icon: 'home' },
    { name: 'Novas Reservas', href: '/agent/reservations/new', icon: 'calendar-plus' },
    { name: 'Minhas Reservas', href: '/agent/reservations', icon: 'calendar' },
    { name: 'Operações', href: '/agent/operations', icon: 'map' },
    { name: 'Pagamentos', href: '/agent/payments', icon: 'credit-card' },
    { name: 'Comissões', href: '/agent/commissions', icon: 'dollar-sign' },
    { name: 'Perfil', href: '/agent/profile', icon: 'user' },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'home':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'calendar-plus':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'map':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'credit-card':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'dollar-sign':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>{title} | River Plate Anglers</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Barra lateral móvel */}
        <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'}`}
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Conteúdo da barra lateral */}
          <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-700 transition ${sidebarOpen ? 'transform translate-x-0 ease-out duration-300' : 'transform -translate-x-full ease-in duration-200'}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Fechar barra lateral</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/logo-white.svg" alt="River Plate Anglers" />
              <span className="ml-2 text-xl font-bold text-white">Portal do Agente</span>
            </div>
            <nav className="mt-5 flex-shrink-0 h-full overflow-y-auto" aria-label="Navegação lateral">
              <div className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'bg-primary-800 text-white'
                        : 'text-primary-100 hover:bg-primary-600'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <span className="mr-4 h-6 w-6">
                      {renderIcon(item.icon)}
                    </span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Barra lateral estática para desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-primary-700 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-8 w-auto" src="/logo-white.svg" alt="River Plate Anglers" />
              <span className="ml-2 text-xl font-bold text-white">Portal do Agente</span>
            </div>
            <nav className="mt-5 flex-1 flex flex-col" aria-label="Navegação lateral">
              <div className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'bg-primary-800 text-white'
                        : 'text-primary-100 hover:bg-primary-600'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <span className="mr-3 h-6 w-6">
                      {renderIcon(item.icon)}
                    </span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div className="lg:pl-64 flex flex-col">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Abrir barra lateral</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex items-center">
                <h1 className="text-xl font-bold text-primary-900">{title}</h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Botão de notificações */}
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span className="sr-only">Ver notificações</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Menu do perfil */}
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700 mr-2 hidden md:block">
                      <span className="font-medium">{agentName}</span>
                      <p className="text-xs">{agentRole}</p>
                    </div>
                    <Link href="/agent/profile">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200">
                        <span className="font-medium text-sm">{agentName.substring(0, 2).toUpperCase()}</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}; 