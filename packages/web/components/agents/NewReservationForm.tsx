import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DateRangePicker } from '../ui/DateRangePicker';
import { FormField } from '../ui/FormField';
import { Stepper } from '../ui/Stepper';
import { PriceSummary } from '../reservations/PriceSummary';

export const NewReservationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Estados do formulário
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [operationId, setOperationId] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Mock de operações disponíveis
  const availableOperations = [
    { id: '1', name: 'Pesca na Amazônia' },
    { id: '2', name: 'Pesca no Pantanal' },
    { id: '3', name: 'Pesca em Barra Grande' },
    { id: '4', name: 'Pesca no Rio Paraná' }
  ];
  
  // Passos do formulário
  const steps = [
    'Selecionar Operação',
    'Datas e Hóspedes',
    'Dados do Cliente',
    'Confirmação'
  ];
  
  // Simular envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando envio para API
    setTimeout(() => {
      setLoading(false);
      alert('Reserva criada com sucesso!');
      // Aqui redirecionaria para a página de detalhes da reserva
    }, 1500);
  };
  
  // Botões de navegação entre passos
  const NavigationButtons = () => (
    <div className="flex justify-between mt-6">
      {currentStep > 0 && (
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={loading}
        >
          Voltar
        </Button>
      )}
      
      {currentStep < steps.length - 1 ? (
        <Button
          variant="primary"
          onClick={() => setCurrentStep(currentStep + 1)}
          className="ml-auto"
        >
          Continuar
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={loading}
          className="ml-auto"
        >
          Finalizar Reserva
        </Button>
      )}
    </div>
  );
  
  return (
    <div>
      <Stepper 
        steps={steps} 
        currentStep={currentStep} 
        onChange={(step) => setCurrentStep(step)}
      />
      
      <Card>
        <form className="p-6">
          {/* Passo 1: Selecionar Operação */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Selecione a Operação</h2>
              
              <FormField
                label="Operação"
                htmlFor="operation_id"
              >
                <Select
                  id="operation_id"
                  value={operationId}
                  onChange={(e) => setOperationId(e.target.value)}
                >
                  <option value="">Selecione uma operação</option>
                  {availableOperations.map(op => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                  ))}
                </Select>
              </FormField>
              
              <NavigationButtons />
            </div>
          )}
          
          {/* Passo 2: Datas e Hóspedes */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Datas e Hóspedes</h2>
              
              <FormField
                label="Período da Reserva"
                htmlFor="dateRange"
              >
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  minDate={new Date()}
                />
              </FormField>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Adultos"
                  htmlFor="adults"
                >
                  <Input
                    id="adults"
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                  />
                </FormField>
                
                <FormField
                  label="Crianças"
                  htmlFor="children"
                >
                  <Input
                    id="children"
                    type="number"
                    min={0}
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                  />
                </FormField>
              </div>
              
              <NavigationButtons />
            </div>
          )}
          
          {/* Passo 3: Dados do Cliente */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>
              
              <FormField
                label="Nome Completo"
                htmlFor="clientName"
                required
              >
                <Input
                  id="clientName"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </FormField>
              
              <FormField
                label="E-mail"
                htmlFor="clientEmail"
                required
              >
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </FormField>
              
              <FormField
                label="Telefone"
                htmlFor="clientPhone"
                required
              >
                <Input
                  id="clientPhone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </FormField>
              
              <FormField
                label="Solicitações Especiais"
                htmlFor="specialRequests"
              >
                <textarea
                  id="specialRequests"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </FormField>
              
              <NavigationButtons />
            </div>
          )}
          
          {/* Passo 4: Confirmação */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Confirmar Reserva</h2>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-gray-900">Detalhes da Reserva</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Operação:</p>
                    <p className="text-sm font-medium">
                      {availableOperations.find(op => op.id === operationId)?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Período:</p>
                    <p className="text-sm font-medium">
                      {startDate && endDate 
                        ? `${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}` 
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hóspedes:</p>
                    <p className="text-sm font-medium">
                      {adults} adulto{adults !== 1 ? 's' : ''}
                      {children > 0 ? `, ${children} criança${children !== 1 ? 's' : ''}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cliente:</p>
                    <p className="text-sm font-medium">{clientName || '-'}</p>
                  </div>
                </div>
              </div>
              
              <PriceSummary
                subtotal={3000}
                tax={300}
                total={3300}
                commission={330}
                currency="BRL"
                showCommission={true}
              />
              
              <NavigationButtons />
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};