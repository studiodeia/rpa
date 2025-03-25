export class WiseAccountDetail {
  id: string;
  currency: string;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    bankAddress: string;
  };
}

export class WiseTransfer {
  id: string;
  status: string;
  sourceAmount: number;
  sourceCurrency: string;
  targetAmount: number;
  targetCurrency: string;
  rate: number;
  fee: number;
  estimatedDelivery: Date;
  reference: string;
  paymentOptionId: string;
}

export class WiseWebhookPayload {
  event_type: string;
  data: {
    resource: {
      id: string;
      profile_id: string;
      type: string;
    };
    current_state: string;
    previous_state: string;
    occurred_at: string;
    amount: {
      value: number;
      currency: string;
    };
    transaction_id: string;
    reference: string;
  };
}

export class WisePaymentData {
  amount: number;
  currency: string;
  referenceCode: string;
  transactionId: string;
  paymentDate: Date;
  status: string;
  metadata: any;
} 