import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DateRangePicker } from '../ui/DateRangePicker';
import { FormField } from '../ui/FormField';
import { Stepper } from '../ui/Stepper';
import { PriceSummary } from '../reservations/PriceSummary';

// Schema para validação do formulário
const reservationSchema = z.object({
  // Etapa 1: Informações da operação
  operation_id: z.string().min(1, 'Selecione uma operação'),
  package_id: z.string().min(1, 'Selecione um pacote'),
  
  // Etapa 2: Datas e quartos
  date_range: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  room_type_id: z.string().min(1, 'Selecione um tipo de quarto'),
  num_rooms: z.number().min(1, 'Selecione pelo menos um quarto'),
  
  // Etapa 3: Informações dos hóspedes
  adults: z.number().min(1, 'Deve ter pelo menos 1 adulto'),
  children: z.number().default(0),
  child_ages: z.array(z.number()).optional(),
  
  // Etapa 4: Informações do cliente
  client: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    document_type: z.enum(['cpf', 'passport']),
    document_number: z.string().min(1, 'Número do documento é obrigatório'),
    nationality: z.string().min(1, 'Nacionalidade é obrigatória'),
    address: z.object({
      street: z.string().min(1, 'Endereço é obrigatório'),
      city: z.string().min(1, 'Cidade é obrigatória'),
      state: z.string().min(1, 'Estado é obrigatório'),
      country: z.string().min(1, 'País é obrigatório'),
      postal_code: z.string().min(1, 'CEP é obrigatório'),
    }),
  }),
  
  // Etapa 5: Adicionais e observações
  extras: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    })
  ).default([]),
  special_requests: z.string().optional(),
  
  // Configurações de pagamento
  payment_method: z.enum(['credit_card', 'bank_transfer', 'cash', 'other']),
  deposit_amount: z.number().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

// Componente do formulário de nova reserva
export const NewReservationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock de operações para seleção
  const operations = [
    { id: '1', name: 'Pesca na Amazônia' },
    { id: '2', name: 'Pesca no Pantanal' },
    { id: '3', name: 'Pesca em Mato Grosso' },
  ];
  
  // Mock de pacotes para seleção
  const packages = [
    { id: '1', operation_id: '1', name: 'Pacote Standard - 4 dias', price: 2500 },
    { id: '2', operation_id: '1', name: 'Pacote Premium - 7 dias', price: 4500 },
    { id: '3', operation_id: '2', name: 'Pacote Completo - 5 dias', price: 3200 },
  ];
  
  // Mock de tipos de quartos
  const roomTypes = [
    { id: '1', operation_id: '1', name: 'Quarto Standard', price: 350 },
    { id: '2', operation_id: '1', name: 'Quarto Superior', price: 450 },
    { id: '3', operation_id: '1', name: 'Quarto Deluxe', price: 550 },
  ];
  
  // Mock de adicionais
  const extras = [
    { id: '1', operation_id: '1', name: 'Traslado Aeroporto', price: 150 },
    { id: '2', operation_id: '1', name: 'Guia Exclusivo', price: 300 },
    { id: '3', operation_id: '1', name: 'Equipamento de Pesca', price: 200 },
  ];
  
  const defaultValues: Partial<ReservationFormValues> = {
    operation_id: '',
    package_id: '',
    num_rooms: 1,
    adults: 2,
    children: 0,
    extras: [],
    payment_method: 'credit_card',
  };
  
  const methods = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues,
  });
  
  const { handleSubmit, watch, formState: { errors }, setValue, reset } = methods;
  
  // Atualiza a lista de pacotes quando a operação é alterada
  const selectedOperationId = watch('operation_id');
  const selectedPackageId = watch('package_id');
  const selectedRoomTypeId = watch('room_type_id');
  const selectedDateRange = watch('date_range');
  const numRooms = watch('num_rooms') || 1;
  const adults = watch('adults') || 1;
  const children = watch('children') || 0;
  const selectedExtras = watch('extras') || [];
  
  // Filtrar pacotes com base na operação selecionada
  const filteredPackages = packages.filter(pkg => pkg.operation_id === selectedOperationId);
  const filteredRoomTypes = roomTypes.filter(room => room.operation_id === selectedOperationId);
  const filteredExtras = extras.filter(extra => extra.operation_id === selectedOperationId);
  
  // Calcular o número de noites se as datas forem selecionadas
  const calculateNights = () => {
    if (!selectedDateRange?.startDate || !selectedDateRange?.endDate) return 0;
    const start = new Date(selectedDateRange.startDate);
    const end = new Date(selectedDateRange.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const nights = calculateNights();
  
  // Calcular o preço total da reserva
  const calculateTotalPrice = () => {
    let total = 0;
    
    // Adiciona o preço do pacote
    if (selectedPackageId) {
      const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);
      if (selectedPackage) {
        total += selectedPackage.price;
      }
    }
    
    // Adiciona o preço do quarto (preço por noite * número de noites * número de quartos)
    if (selectedRoomTypeId && nights > 0) {
      const selectedRoomType = roomTypes.find(room => room.id === selectedRoomTypeId);
      if (selectedRoomType) {
        total += selectedRoomType.price * nights * numRooms;
      }
    }
    
    // Adiciona o preço dos extras
    if (selectedExtras.length > 0) {
      selectedExtras.forEach(extra => {
        const extraItem = extras.find(e => e.id === extra.id);
        if (extraItem) {
          total += extraItem.price * extra.quantity;
        }
      });
    }
    
    return total;
  };
  
  const totalPrice = calculateTotalPrice();
  
  // Etapas do formulário
  const steps = [
    {
      title: 'Operação',
      description: 'Selecione a operação e pacote',
    },
    {
      title: 'Datas e Quartos',
      description: 'Selecione as datas e quartos',
    },
    {
      title: 'Hóspedes',
      description: 'Informações dos hóspedes',
    },
    {
      title: 'Cliente',
      description: 'Informações do cliente',
    },
    {
      title: 'Extras',
      description: 'Adicionais e observações',
    },
  ];
  
  // Função para ir para o próximo passo
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  // Função para ir para o passo anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Função para lidar com o envio do formulário
  const onSubmit = async (data: ReservationFormValues) => {
    setIsLoading(true);
    try {
      console.log('Dados do formulário:', data);
      
      // Aqui você faria a chamada API para criar a reserva
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redireciona para a página de detalhes da reserva (mock)
      router.push('/agent/reservations/success?id=123');
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar conteúdo com base na etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField
              label="Operação"
              name="operation_id"
              error={errors.operation_id?.message}
            >
              <Select
                value={selectedOperationId}
                onChange={(e) => {
                  setValue('operation_id', e.target.value);
                  setValue('package_id', '');
                  setValue('room_type_id', '');
                }}
                placeholder="Selecione uma operação"
              >
                {operations.map((operation) => (
                  <option key={operation.id} value={operation.id}>
                    {operation.name}
                  </option>
                ))}
              </Select>
            </FormField>
            
            <FormField
              label="Pacote"
              name="package_id"
              error={errors.package_id?.message}
            >
              <Select
                value={selectedPackageId}
                onChange={(e) => setValue('package_id', e.target.value)}
                placeholder="Selecione um pacote"
                disabled={!selectedOperationId}
              >
                {filteredPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - R$ {pkg.price.toFixed(2)}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              label="Datas da Reserva"
              name="date_range"
              error={errors.date_range?.message}
            >
              <DateRangePicker
                value={selectedDateRange}
                onChange={(range) => setValue('date_range', range)}
              />
            </FormField>
            
            <FormField
              label="Tipo de Quarto"
              name="room_type_id"
              error={errors.room_type_id?.message}
            >
              <Select
                value={selectedRoomTypeId}
                onChange={(e) => setValue('room_type_id', e.target.value)}
                placeholder="Selecione um tipo de quarto"
                disabled={!selectedOperationId}
              >
                {filteredRoomTypes.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - R$ {room.price.toFixed(2)}/noite
                  </option>
                ))}
              </Select>
            </FormField>
            
            <FormField
              label="Número de Quartos"
              name="num_rooms"
              error={errors.num_rooms?.message}
            >
              <Select
                value={numRooms.toString()}
                onChange={(e) => setValue('num_rooms', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} {num === 1 ? 'quarto' : 'quartos'}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <FormField
              label="Adultos"
              name="adults"
              error={errors.adults?.message}
            >
              <Select
                value={adults.toString()}
                onChange={(e) => setValue('adults', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} {num === 1 ? 'adulto' : 'adultos'}
                  </option>
                ))}
              </Select>
            </FormField>
            
            <FormField
              label="Crianças"
              name="children"
              error={errors.children?.message}
            >
              <Select
                value={children.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setValue('children', value);
                  
                  // Reiniciar as idades das crianças quando o número de crianças muda
                  if (value === 0) {
                    setValue('child_ages', []);
                  } else {
                    const currentAges = watch('child_ages') || [];
                    if (value > currentAges.length) {
                      // Adicionar mais idades
                      setValue('child_ages', [...currentAges, ...Array(value - currentAges.length).fill(0)]);
                    } else {
                      // Remover idades excedentes
                      setValue('child_ages', currentAges.slice(0, value));
                    }
                  }
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} {num === 1 ? 'criança' : 'crianças'}
                  </option>
                ))}
              </Select>
            </FormField>
            
            {children > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Idade das Crianças</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: children }).map((_, index) => (
                    <FormField
                      key={index}
                      label={`Criança ${index + 1}`}
                      name={`child_ages[${index}]`}
                      error={errors.child_ages?.[index]?.message}
                    >
                      <Select
                        value={(watch('child_ages')?.[index] || 0).toString()}
                        onChange={(e) => {
                          const currentAges = [...(watch('child_ages') || [])];
                          currentAges[index] = parseInt(e.target.value);
                          setValue('child_ages', currentAges);
                        }}
                      >
                        {Array.from({ length: 18 }).map((_, age) => (
                          <option key={age} value={age.toString()}>
                            {age} {age === 1 ? 'ano' : 'anos'}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome Completo"
                name="client.name"
                error={errors.client?.name?.message}
              >
                <Input
                  type="text"
                  value={watch('client.name') || ''}
                  onChange={(e) => setValue('client.name', e.target.value)}
                  placeholder="Nome completo do cliente"
                />
              </FormField>
              
              <FormField
                label="Email"
                name="client.email"
                error={errors.client?.email?.message}
              >
                <Input
                  type="email"
                  value={watch('client.email') || ''}
                  onChange={(e) => setValue('client.email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </FormField>
              
              <FormField
                label="Telefone"
                name="client.phone"
                error={errors.client?.phone?.message}
              >
                <Input
                  type="tel"
                  value={watch('client.phone') || ''}
                  onChange={(e) => setValue('client.phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </FormField>
              
              <FormField
                label="Nacionalidade"
                name="client.nationality"
                error={errors.client?.nationality?.message}
              >
                <Input
                  type="text"
                  value={watch('client.nationality') || ''}
                  onChange={(e) => setValue('client.nationality', e.target.value)}
                  placeholder="Nacionalidade"
                />
              </FormField>
              
              <FormField
                label="Tipo de Documento"
                name="client.document_type"
                error={errors.client?.document_type?.message}
              >
                <Select
                  value={watch('client.document_type') || 'cpf'}
                  onChange={(e) => setValue('client.document_type', e.target.value as 'cpf' | 'passport')}
                >
                  <option value="cpf">CPF</option>
                  <option value="passport">Passaporte</option>
                </Select>
              </FormField>
              
              <FormField
                label="Número do Documento"
                name="client.document_number"
                error={errors.client?.document_number?.message}
              >
                <Input
                  type="text"
                  value={watch('client.document_number') || ''}
                  onChange={(e) => setValue('client.document_number', e.target.value)}
                  placeholder={watch('client.document_type') === 'cpf' ? '000.000.000-00' : 'AA000000'}
                />
              </FormField>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Endereço"
                  name="client.address.street"
                  error={errors.client?.address?.street?.message}
                >
                  <Input
                    type="text"
                    value={watch('client.address.street') || ''}
                    onChange={(e) => setValue('client.address.street', e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </FormField>
                
                <FormField
                  label="Cidade"
                  name="client.address.city"
                  error={errors.client?.address?.city?.message}
                >
                  <Input
                    type="text"
                    value={watch('client.address.city') || ''}
                    onChange={(e) => setValue('client.address.city', e.target.value)}
                    placeholder="Cidade"
                  />
                </FormField>
                
                <FormField
                  label="Estado"
                  name="client.address.state"
                  error={errors.client?.address?.state?.message}
                >
                  <Input
                    type="text"
                    value={watch('client.address.state') || ''}
                    onChange={(e) => setValue('client.address.state', e.target.value)}
                    placeholder="Estado"
                  />
                </FormField>
                
                <FormField
                  label="País"
                  name="client.address.country"
                  error={errors.client?.address?.country?.message}
                >
                  <Input
                    type="text"
                    value={watch('client.address.country') || ''}
                    onChange={(e) => setValue('client.address.country', e.target.value)}
                    placeholder="País"
                  />
                </FormField>
                
                <FormField
                  label="CEP"
                  name="client.address.postal_code"
                  error={errors.client?.address?.postal_code?.message}
                >
                  <Input
                    type="text"
                    value={watch('client.address.postal_code') || ''}
                    onChange={(e) => setValue('client.address.postal_code', e.target.value)}
                    placeholder="00000-000"
                  />
                </FormField>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Serviços Adicionais</h3>
              <div className="space-y-4">
                {filteredExtras.map((extra) => {
                  const selectedExtra = selectedExtras.find(e => e.id === extra.id);
                  return (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{extra.name}</p>
                        <p className="text-sm text-gray-500">R$ {extra.price.toFixed(2)}</p>
                      </div>
                      <div className="w-24">
                        <Select
                          value={(selectedExtra?.quantity || 0).toString()}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value);
                            const currentExtras = [...selectedExtras];
                            
                            if (quantity === 0) {
                              // Remover o extra se a quantidade for zero
                              setValue(
                                'extras',
                                currentExtras.filter(e => e.id !== extra.id)
                              );
                            } else {
                              // Adicionar ou atualizar o extra
                              const extraIndex = currentExtras.findIndex(e => e.id === extra.id);
                              if (extraIndex >= 0) {
                                currentExtras[extraIndex].quantity = quantity;
                              } else {
                                currentExtras.push({ id: extra.id, quantity });
                              }
                              setValue('extras', currentExtras);
                            }
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num.toString()}>
                              {num}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <FormField
              label="Método de Pagamento"
              name="payment_method"
              error={errors.payment_method?.message}
            >
              <Select
                value={watch('payment_method') || 'credit_card'}
                onChange={(e) => setValue('payment_method', e.target.value as any)}
              >
                <option value="credit_card">Cartão de Crédito</option>
                <option value="bank_transfer">Transferência Bancária</option>
                <option value="cash">Dinheiro</option>
                <option value="other">Outro</option>
              </Select>
            </FormField>
            
            <FormField
              label="Valor do Depósito (R$)"
              name="deposit_amount"
              error={errors.deposit_amount?.message}
            >
              <Input
                type="number"
                value={watch('deposit_amount')?.toString() || ''}
                onChange={(e) => setValue('deposit_amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </FormField>
            
            <FormField
              label="Solicitações Especiais"
              name="special_requests"
              error={errors.special_requests?.message}
            >
              <textarea
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                rows={4}
                value={watch('special_requests') || ''}
                onChange={(e) => setValue('special_requests', e.target.value)}
                placeholder="Informe aqui quaisquer solicitações especiais, alergias, restrições alimentares ou outras informações relevantes."
              />
            </FormField>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Nova Reserva</h3>
              <p className="mt-1 text-sm text-gray-600">
                Preencha os dados para criar uma nova reserva para seu cliente.
              </p>
              
              <div className="mt-8">
                <Stepper
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={(step) => setCurrentStep(step)}
                />
              </div>
              
              {/* Resumo de preços */}
              <div className="mt-8">
                <PriceSummary
                  subtotal={totalPrice}
                  discount={0}
                  tax={0}
                  total={totalPrice}
                  currency="BRL"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Card>
              <div className="px-4 py-5 sm:p-6">{renderStepContent()}</div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isLoading}
                  >
                    Voltar
                  </Button>
                  
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Criar Reserva
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                    >
                      Próximo
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}; 