import React, { useState } from 'react';
import Head from 'next/head';
import { AgentLayout } from '../../../components/agents/AgentLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { UserRole } from '../../../types/users';

// Mock de dados do perfil do agente
const mockAgentProfile = {
  id: '123',
  fullName: 'João Silva',
  email: 'joao.silva@example.com',
  phone: '+55 11 98765-4321',
  role: UserRole.AGENT,
  company: 'Viagens Especiais Ltda.',
  companyId: '12345678/0001-90',
  address: {
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    postalCode: '01234-567'
  },
  bankDetails: {
    bankName: 'Banco XYZ',
    accountType: 'Corrente',
    accountNumber: '12345-6',
    agency: '0001',
    accountHolder: 'João Silva',
    documentNumber: '123.456.789-00'
  },
  profilePicture: 'https://randomuser.me/api/portraits/men/75.jpg',
  createdAt: new Date('2022-01-15')
};

export default function AgentProfile() {
  const [profile, setProfile] = useState(mockAgentProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para formulário de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Função para atualizar dados do perfil
  const handleProfileUpdate = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para atualizar endereço
  const handleAddressUpdate = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  // Função para atualizar dados bancários
  const handleBankDetailsUpdate = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  // Função para salvar alterações do perfil
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulando requisição à API
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingProfile(false);
    }, 1000);
  };

  // Função para salvar alterações dos dados bancários
  const handleSaveBankDetails = () => {
    setIsSaving(true);
    
    // Simulando requisição à API
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingBankDetails(false);
    }, 1000);
  };

  // Função para salvar nova senha
  const handleSavePassword = () => {
    // Validar se as senhas coincidem
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    // Validar complexidade da senha
    if (newPassword.length < 8) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setPasswordError(null);
    setIsSaving(true);
    
    // Simulando requisição à API
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Meu Perfil | River Plate Anglers</title>
      </Head>

      <AgentLayout title="Meu Perfil">
        <div className="space-y-6">
          
          {/* Informações Pessoais */}
          <Card>
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
                {!isEditingProfile ? (
                  <Button
                    variant="tertiary"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Editar
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button
                      variant="tertiary"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                    >
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="mb-6 md:mb-0 flex-shrink-0">
                  <div className="relative w-32 h-32">
                    <img
                      src={profile.profilePicture}
                      alt={profile.fullName}
                      className="rounded-full w-full h-full object-cover border border-gray-200"
                    />
                    {isEditingProfile && (
                      <div className="absolute bottom-0 right-0">
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Empresa
                    </label>
                    <Input
                      id="company"
                      type="text"
                      value={profile.company}
                      onChange={(e) => handleProfileUpdate('company', e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <Input
                      id="companyId"
                      type="text"
                      value={profile.companyId}
                      onChange={(e) => handleProfileUpdate('companyId', e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
              </div>
              
              {isEditingProfile && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Endereço</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Rua e número
                    </label>
                    <Input
                      id="street"
                      type="text"
                      value={profile.address.street}
                      onChange={(e) => handleAddressUpdate('street', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <Input
                      id="city"
                      type="text"
                      value={profile.address.city}
                      onChange={(e) => handleAddressUpdate('city', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <Input
                      id="state"
                      type="text"
                      value={profile.address.state}
                      onChange={(e) => handleAddressUpdate('state', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    <Input
                      id="country"
                      type="text"
                      value={profile.address.country}
                      onChange={(e) => handleAddressUpdate('country', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={profile.address.postalCode}
                      onChange={(e) => handleAddressUpdate('postalCode', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Dados Bancários */}
          <Card>
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Dados Bancários</h2>
                {!isEditingBankDetails ? (
                  <Button
                    variant="tertiary"
                    onClick={() => setIsEditingBankDetails(true)}
                  >
                    Editar
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button
                      variant="tertiary"
                      onClick={() => setIsEditingBankDetails(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveBankDetails}
                      isLoading={isSaving}
                    >
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Estes dados são utilizados para o pagamento das suas comissões.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Banco
                  </label>
                  <Input
                    id="bankName"
                    type="text"
                    value={profile.bankDetails.bankName}
                    onChange={(e) => handleBankDetailsUpdate('bankName', e.target.value)}
                    disabled={!isEditingBankDetails}
                  />
                </div>
                
                <div>
                  <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Conta
                  </label>
                  <Select
                    id="accountType"
                    value={profile.bankDetails.accountType}
                    onChange={(e) => handleBankDetailsUpdate('accountType', e.target.value)}
                    disabled={!isEditingBankDetails}
                  >
                    <option value="Corrente">Conta Corrente</option>
                    <option value="Poupança">Conta Poupança</option>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
                    Agência
                  </label>
                  <Input
                    id="agency"
                    type="text"
                    value={profile.bankDetails.agency}
                    onChange={(e) => handleBankDetailsUpdate('agency', e.target.value)}
                    disabled={!isEditingBankDetails}
                  />
                </div>
                
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Número da Conta
                  </label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={profile.bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsUpdate('accountNumber', e.target.value)}
                    disabled={!isEditingBankDetails}
                  />
                </div>
                
                <div>
                  <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-1">
                    Titular da Conta
                  </label>
                  <Input
                    id="accountHolder"
                    type="text"
                    value={profile.bankDetails.accountHolder}
                    onChange={(e) => handleBankDetailsUpdate('accountHolder', e.target.value)}
                    disabled={!isEditingBankDetails}
                  />
                </div>
                
                <div>
                  <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF/CNPJ do Titular
                  </label>
                  <Input
                    id="documentNumber"
                    type="text"
                    value={profile.bankDetails.documentNumber}
                    onChange={(e) => handleBankDetailsUpdate('documentNumber', e.target.value)}
                    disabled={!isEditingBankDetails}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Alterar Senha */}
          <Card>
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Segurança</h2>
                {!isEditingPassword ? (
                  <Button
                    variant="tertiary"
                    onClick={() => setIsEditingPassword(true)}
                  >
                    Alterar Senha
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button
                      variant="tertiary"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordError(null);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSavePassword}
                      isLoading={isSaving}
                    >
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {!isEditingPassword ? (
                <p className="text-sm text-gray-600">
                  Última alteração de senha: nunca alterada
                </p>
              ) : (
                <div className="max-w-md space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Sua senha deve ter pelo menos 8 caracteres
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </AgentLayout>
    </>
  );
} 