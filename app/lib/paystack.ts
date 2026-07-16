import { PaystackBank } from "./types";

export interface SubAccountPayload {
  business_name: string;
  settlement_bank: string;
  account_number: string;
  percentage_charge: number;
  description?: string;
  primary_contact_email?: string;
  primary_contact_name?: string;
  primary_contact_phone?: string;
  metadata?: Record<string, unknown>;
}

export interface SubAccountResponse extends SubAccountPayload {
  active: boolean;
  createdAt: string;
  subaccount_code: string;
}

export interface PaystackVerifyData {
  status: string;
  reference: string;
  amount: number; // kobo
  currency: string;
  paid_at?: string;
  customer?: { email?: string };
  gateway_response?: string;
}

const BASE_URL = process.env.PAYSTACK_APP_URL || "https://api.paystack.co";

/** Secret must never be NEXT_PUBLIC_ — support both for existing .env demos */
function getPaystackSecret(): string {
  const key =
    process.env.PAYSTACK_SECRET_KEY ||
    process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY ||
    "";
  if (!key) {
    throw new Error("Paystack secret key is not configured");
  }
  return key;
}

const getHeaders = () => ({
  Authorization: `Bearer ${getPaystackSecret()}`,
  "Content-Type": "application/json",
});

const getSubAccountCode = async (
  data: SubAccountPayload
): Promise<SubAccountResponse["subaccount_code"]> => {
  try {
    const resp = await fetch(`${BASE_URL}/subaccount`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const dat = await resp.json();
    if (!dat.status) {
      throw new Error(dat.message || "Error Creating SubAccount");
    }
    const dataa: SubAccountResponse = dat.data;
    return dataa.subaccount_code;
  } catch {
    throw new Error("Error Creating SubAccount");
  }
};

const VerifyBankDetails = async (
  accountNumber: string,
  bankCode: string
): Promise<{
  status: boolean;
  data: { account_name: string; account_number: string; bank_id?: number };
  message: string;
}> => {
  const resp = await fetch(
    `${BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    {
      headers: getHeaders(),
    }
  );
  return await resp.json();
};

const FetchBanks = async (): Promise<{
  status: boolean;
  data: PaystackBank[];
}> => {
  try {
    const resp = await fetch(`${BASE_URL}/bank`, {
      headers: getHeaders(),
    });
    return await resp.json();
  } catch (error) {
    console.error("Failed to fetch banks:", error);
    throw error;
  }
};

/**
 * Server-side verification of a Paystack charge.
 * Always call this before recording a donation.
 */
const verifyTransaction = async (
  reference: string
): Promise<PaystackVerifyData> => {
  if (!reference || typeof reference !== "string") {
    throw new Error("Missing payment reference");
  }

  const resp = await fetch(
    `${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  const body = await resp.json();

  if (!body?.status || !body?.data) {
    throw new Error(body?.message || "Unable to verify payment");
  }

  if (body.data.status !== "success") {
    throw new Error(
      `Payment not successful (${body.data.status || body.data.gateway_response})`
    );
  }

  return body.data as PaystackVerifyData;
};

export {
  FetchBanks,
  VerifyBankDetails,
  getSubAccountCode,
  verifyTransaction,
};
