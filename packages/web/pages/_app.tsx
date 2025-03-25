import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppLayout } from '../components/layout/AppLayout';
import '../styles/globals.css';

function MyApp({ Component, pageProps, router }: AppProps) {
  // Verificar se a página atual é de autenticação (login/cadastro)
  const isAuthPage = router.pathname.startsWith('/auth');

  return (
    <>
      <Head>
        <title>River Plate Anglers</title>
        <meta name="description" content="Plataforma para pescadores do Rio da Prata" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isAuthPage ? (
        // Renderizar páginas de autenticação sem o layout da aplicação
        <Component {...pageProps} />
      ) : (
        // Renderizar outras páginas com o layout da aplicação
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      )}
    </>
  );
}

export default MyApp; 