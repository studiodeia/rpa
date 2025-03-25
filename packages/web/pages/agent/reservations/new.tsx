import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { NewReservationForm } from '../../../components/agents/NewReservationForm';
import { Button } from '../../../components/ui/Button';

export default function NewReservation() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Nova Reserva | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Nova Reserva">
        <div className="space-y-6">
          {/* Cabeçalho com ações */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nova Reserva</h1>
              <p className="mt-1 text-sm text-gray-500">
                Crie uma nova reserva para seu cliente
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="mr-3"
              >
                Cancelar
              </Button>
            </div>
          </div>

          {/* Formulário de nova reserva */}
          <NewReservationForm />
        </div>
      </AgentLayout>
    </>
  );
} 