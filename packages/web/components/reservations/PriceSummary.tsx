import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PriceSummaryProps {
  subtotal: number;
  discount?: number;
  tax?: number;
  fees?: number;
  total: number;
  currency: string;
  deposit?: number;
  balance?: number;
  commission?: number;
  showCommission?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  subtotal,
  discount = 0,
  tax = 0,
  fees = 0,
  total,
  currency,
  deposit,
  balance,
  commission,
  showCommission = false,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Resumo de Preços</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Subtotal</span>
          <span className="text-sm text-gray-900">{formatCurrency(subtotal, currency)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Desconto</span>
            <span className="text-sm text-green-600">-{formatCurrency(discount, currency)}</span>
          </div>
        )}
        
        {tax > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Impostos</span>
            <span className="text-sm text-gray-900">{formatCurrency(tax, currency)}</span>
          </div>
        )}
        
        {fees > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Taxas</span>
            <span className="text-sm text-gray-900">{formatCurrency(fees, currency)}</span>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200 mt-2 flex justify-between">
          <span className="font-medium text-gray-900">Total</span>
          <span className="font-medium text-gray-900">{formatCurrency(total, currency)}</span>
        </div>
        
        {(deposit !== undefined || balance !== undefined) && (
          <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
            {deposit !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Depósito / Sinal</span>
                <span className="text-sm text-gray-900">{formatCurrency(deposit, currency)}</span>
              </div>
            )}
            
            {balance !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Saldo a pagar</span>
                <span className="text-sm text-gray-900">{formatCurrency(balance, currency)}</span>
              </div>
            )}
          </div>
        )}
        
        {showCommission && commission !== undefined && (
          <div className="pt-2 border-t border-gray-200 mt-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Comissão do Agente</span>
              <span className="text-sm text-gray-900">{formatCurrency(commission, currency)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 