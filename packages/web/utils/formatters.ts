/**
 * Formata um valor monetário para exibição.
 * @param value - O valor a ser formatado
 * @param currency - O código da moeda (ex: 'BRL', 'USD')
 * @returns String formatada com o símbolo da moeda
 */
export function formatCurrency(value: number, currency = 'BRL'): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(value);
}

/**
 * Formata uma data ISO para exibição no formato brasileiro.
 * @param dateString - A data no formato ISO string
 * @param includeTime - Se deve incluir o horário
 * @returns String formatada no padrão dd/mm/yyyy (ou dd/mm/yyyy HH:MM)
 */
export function formatDate(dateString: string, includeTime = false): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
  
  return formatter.format(date);
}

/**
 * Formata uma data ISO para exibição no formato longo.
 * @param dateString - A data no formato ISO string
 * @returns String formatada no padrão "dia de mês de ano"
 */
export function formatLongDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  return formatter.format(date);
}

/**
 * Formata um número de telefone para exibição.
 * @param phone - Número de telefone (somente dígitos)
 * @returns String formatada (ex: "(11) 98765-4321")
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    // Telefone fixo: (00) 0000-0000
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (digits.length === 11) {
    // Celular: (00) 00000-0000
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Retorna o original se não conseguir formatar
  return phone;
}

/**
 * Formata um CPF para exibição.
 * @param cpf - Número de CPF (somente dígitos)
 * @returns String formatada (ex: "123.456.789-00")
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const digits = cpf.replace(/\D/g, '');
  
  if (digits.length !== 11) {
    return cpf;
  }
  
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CEP para exibição.
 * @param cep - Número de CEP (somente dígitos)
 * @returns String formatada (ex: "12345-678")
 */
export function formatCEP(cep: string): string {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  const digits = cep.replace(/\D/g, '');
  
  if (digits.length !== 8) {
    return cep;
  }
  
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
} 