declare module '@paystack/inline-js' {
  export interface PaystackSuccessResponse {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    trxref: string;
    message: string;
  }

  export interface PaystackPopupConfig {
    key: string;
    email: string;
    amount: number;
    reference?: string;
    subaccount?: string;
    split_code?: string;
    transaction_charge?: number;
    bearer?: 'account' | 'subaccount';
    metadata?: Record<string, unknown>;
    label?: string;
    channels?: Array<'card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer' | 'eft'>;
    onLoad?: (response: unknown) => void;
    onSuccess?: (response: PaystackSuccessResponse) => void;
    onCancel?: () => void;
    onError?: (error: unknown) => void;
  }

  export default class Popup {
    constructor(config: PaystackPopupConfig);
    open(): void;
  }
}