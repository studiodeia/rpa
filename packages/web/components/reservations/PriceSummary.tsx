import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PriceSummaryProps {
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  deposit?: number;
  balance?: number;
  commission?: number;
  currency: string;
  showCommission?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  subtotal,
  tax = 0,
  discount = 0,
  total,
  deposit = 0,
  balance = 0,
  commission = 0,
  currency,
  showCommission = false,
}) => {
  return (
    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo de Valores</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal:</span>
          <span className="text-gray-900">{formatCurrency(subtotal, currency)}</span>
        </div>
        
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Taxas:</span>
            <span className="text-gray-900">{formatCurrency(tax, currency)}</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Desconto:</span>
            <span className="text-green-600">-{formatCurrency(discount, currency)}</span>
          </div>
        )}
        
        <div className="my-2 border-t border-gray-200 pt-2">
          <div className="flex justify-between font-medium">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">{formatCurrency(total, currency)}</span>
          </div>
        </div>
        
        {deposit > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Depósito:</span>
              <span className="text-gray-900">{formatCurrency(deposit, currency)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Saldo:</span>
              <span className="text-gray-900">{formatCurrency(balance, currency)}</span>
            </div>
          </>
        )}
        
        {showCommission && commission > 0 && (
          <div className="mt-4 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">Sua comissão:</span>
              <span className="text-success-main font-medium">{formatCurrency(commission, currency)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};