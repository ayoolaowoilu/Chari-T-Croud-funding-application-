'use server';

import { getSubAccountCode } from './paystack';
import { Campaign, CenterRegistrationPayload, KycFormData, UserData } from './types';
import { addRedisData, getRedisData, deleteRedisData } from './redis';

type causeData = Pick<Campaign, 'name' | 'details' | 'category' | 'bank_details'> & {
  deadline: number | undefined;
  mainImage: any;
  images?: any;
  user_email: string | null | undefined;
  _type?: string;
  location: string;
  center_id?: number;
  center_name?: string;
  story?: string;
  goal?: number;
  currency?: string;
};

type verifyCenter = {
  name: string | null;
  user_email: string | undefined | null;
  id: number;
};

type Report = {
  _type: string;
  campaign_id: number;
  message: string;
  reporter_name: any;
};

const API_URL = process.env.API_URL || 'http://localhost:3000';

const TTL = {
  FEATURED: 300,
  CAUSE_DETAIL: 600,
  RANDOM_CAUSES: 210,
  CENTER_PROFILE: 300,
  CENTER_LIST: 120,
  USER_STATS: 60,
  USER_CAUSES: 120,
  PUBLIC_PROFILE: 300,
};

async function withCache<T>(cacheKey: string, fetchFn: () => Promise<T>, ttl: number): Promise<T> {
  try {
    const cached = await getRedisData(cacheKey);
    if (cached) {
      const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
      console.log(`[CACHE HIT] ${cacheKey}`);
      return parsed as T;
    }
  } catch (_e) {
    console.log(`[CACHE MISS/ERROR] ${cacheKey}`, _e);
  }

  const data = await fetchFn();

  if (data && typeof data === 'object' && !('error' in data)) {
    addRedisData(data, cacheKey, ttl);
  }

  return data;
}

const uploadCause = async (data: causeData) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/uploadcause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const respDecoded = await resp.json();

    if (respDecoded.error) {
      throw new Error(respDecoded.error);
    } else {
      return respDecoded;
    }
  } catch (_error) {
    throw new Error('Internal Server Error' + _error);
  }
};

const verifyCenterForCampaign = async (data: verifyCenter) => {
  try {
    const resp = await fetch(`${API_URL}/api/verify/center`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const response = await resp.json();
    return response;
  } catch (_error) {
    console.log(_error);
    return { error: 'NET' };
  }
};

const getFeatured = async () => {
  return withCache(
    'featured',
    async () => {
      try {
        const resp = await fetch(`${API_URL}/api/causes/featured`, {
          // Avoid hanging the homepage forever on a cold remote DB
          signal: AbortSignal.timeout(15_000),
        });

        const rr = await resp.json();
        // Soft-fail paths return { data: [] }
        if (Array.isArray(rr)) return rr;
        if (rr && Array.isArray(rr.data)) return rr.data;
        if (rr?.error) return [];
        return rr;
      } catch (_error) {
        console.log(_error);
        return [];
      }
    },
    TTL.FEATURED,
  );
};

const fetchOneCauseById = async (id: number, type: number) => {
  return withCache(
    `cause:${id}:type:${type}`,
    async () => {
      try {
        const resp = await fetch(`${API_URL}/api/causes/one?id=${id}&type=${type}`);

        const rr = await resp.json();

        return rr[0];
      } catch (_error) {
        console.log(_error);
        return { error: 'Unable to fetch data' };
      }
    },
    TTL.CAUSE_DETAIL,
  );
};

const ReportCampaign = async (data: Report) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const rr = await resp.json();
    return rr;
  } catch (_error) {
    return { error: 'Network Error' };
  }
};

const FetchALLUserData = async (email: string) => {
  return withCache(
    `user:stats:${email}`,
    async () => {
      try {
        const resp = await fetch(`${API_URL}/api/dashboard/userstats?email=${email}`);

        return await resp.json();
      } catch (_error) {
        return { error: 'Unable to fetch data' };
      }
    },
    TTL.USER_STATS,
  );
};

const FetchUserCauses = async (email: string) => {
  return withCache(
    `user:causes:${email}`,
    async () => {
      try {
        const resp = await fetch(`${API_URL}/api/dashboard/yourcam?email=${email}`);
        return await resp.json();
      } catch (_error) {
        return { error: 'Unable to fetch data' };
      }
    },
    TTL.USER_CAUSES,
  );
};

const fetchRandom5Causes = async (query: string, category: string, page: number): Promise<any> => {
  return withCache(
    `random5:q:${query}:c:${category}:p:${page}`,
    async () => {
      try {
        const resp = await fetch(
          `${API_URL}/api/causes/random5?query=${query}&category=${category}&page=${page}`,
        );
        return await resp.json();
      } catch (_error) {
        console.log(_error);
        return { error: 'Unable to fetch data' };
      }
    },
    TTL.RANDOM_CAUSES,
  );
};
const DeleteCause = async (id: number) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return await resp.json();
  } catch (_error) {
    return { error: 'Unable to delete cause' };
  }
};

const UpdateCause = async (data: any) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/updatecause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return await resp.json();
  } catch (_error) {
    return { error: 'Unable to edit cause' };
  }
};

const FetchProfile = async (email: string) => {
  try {
    const resp = await fetch(`${API_URL}/api/dashboard/profile?email=${email}`);

    return await resp.json();
  } catch (_error) {
    console.log(_error);
    return { error: 'Unable to fetch profile' };
  }
};

const UpdateBankDetails = async (data: UserData['bank_details'] & { email: string }) => {
  try {
    const subAccountCode = await getSubAccountCode({
      business_name: data.accountName as string,
      account_number: data.accountNumber as string,
      percentage_charge: 4,
      settlement_bank: data.bankCode as string,
    });
    console.log(subAccountCode);
    const resp = await fetch(`${API_URL}/api/dashboard/updatebank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subAccountCode: subAccountCode,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
        bankName: data.bankName,
        email: data.email,
      }),
    });

    return await resp.json();
  } catch (_error) {
    return { error: 'Unable to update bank details' };
  }
};

type kycPayload = {
  email: string;
  formData: KycFormData;
  documentUrl: string;
};

const UploadKyc = async (data: kycPayload) => {
  try {
    const resp = await fetch(`${API_URL}/api/dashboard/uploadkyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return await resp.json();
  } catch (_error) {
    console.log(_error);
    return { error: 'Error Uploading KYC try again' };
  }
};

const GetUserDetailsDyId = async (id: number, isCenter: boolean) => {
  return withCache(
    `user:details:${id}:center:${isCenter}`,
    async () => {
      try {
        const resp = await fetch(
          `${API_URL}/api/getuserdetailsbyid?id=${id}&is_center=${isCenter}`,
        );

        const data = await resp.json();

        return data;
      } catch (_error) {
        console.log(_error);
        return { error: 'Undefined' };
      }
    },
    TTL.PUBLIC_PROFILE,
  );
};

export type uDonate = {
  campaign_id?: number;
  isAuthed: boolean;
  email?: string;
  isBlind: boolean;
  name?: string;
  owner_id?: string | number;
  amount: string | number;
  transaction_id: string;
  donor_name?: string;
  message?: string;
  center_id?: number | string | null;
  platform_fee?: number;
  total_amount?: number;
};
const updateDonate = async (data: uDonate) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await resp.json();
    if (data.campaign_id) {
      deleteRedisData(`cause:${data.campaign_id}:type:${1}`);
      deleteRedisData(`cause:${data.campaign_id}:type:${2}`);
      deleteRedisData(`cause:${data.campaign_id}:type:0`);
    }
    if (!resp.ok) {
      return { error: json.error || json.message || 'Error updating transactions', ...json };
    }
    return json;
  } catch (_error) {
    console.log(_error);
    return { error: 'Error updating transactions' };
  }
};

const UploadCenter = async (data: CenterRegistrationPayload & { type: string; id: number }) => {
  try {
    const resp = await fetch(`${API_URL}/api/centers/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return await resp.json();
  } catch {
    return { error: 'Internet connection check network connection' };
  }
};

const GetCenter = async (type: 'ONE' | 'OWNED', email: string | number) => {
  try {
    if (type == 'OWNED') {
      return withCache(
        `center:owned:${email}`,
        async () => {
          const resp = await fetch(`${API_URL}/api/centers/get?email=${email}`);

          return await resp.json();
        },
        TTL.USER_STATS,
      );
    } else {
      return withCache(
        `center:one:${email}`,
        async () => {
          const resp = await fetch(`${API_URL}/api/centers/one?id=${email}`);

          return await resp.json();
        },
        TTL.CENTER_PROFILE,
      );
    }
  } catch {
    return { error: 'Error Getting data' };
  }
};

const GetCenterViews = async (
  type: 'campaigns' | 'centers' | 'both',
  page: number,
  query?: string,
) => {
  const cacheKey = `centers:view:t:${type}:p:${page}${query ? `:q:${query}` : ''}`;
  return withCache(
    cacheKey,
    async () => {
      try {
        const resp = await fetch(
          `${API_URL}/api/centers/view?page=${page}&type=${type}${query ? `&query=${query}` : ''}`,
        );
        const data = resp.json();
        return data;
      } catch (_error) {
        console.log(_error);
        return { error: 'Error Getting data' };
      }
    },
    TTL.CENTER_LIST,
  );
};

const FetchUserPublicProfileById = async (id: number) => {
  return withCache(
    `public:profile:${id}`,
    async () => {
      const userDetails = await GetUserDetailsDyId(id, false);
      const userCauses = await FetchUserCauses(userDetails.email);

      return {
        data: userDetails,
        causes: userCauses,
      };
    },
    TTL.PUBLIC_PROFILE,
  );
};

export {
  type Report,
  type verifyCenter,
  type causeData,
  uploadCause,
  verifyCenterForCampaign,
  getFeatured,
  fetchOneCauseById,
  ReportCampaign,
  FetchALLUserData,
  FetchUserCauses,
  UpdateCause,
  DeleteCause,
  FetchProfile,
  fetchRandom5Causes,
  UpdateBankDetails,
  UploadKyc,
  GetUserDetailsDyId,
  type kycPayload,
  updateDonate,
  UploadCenter,
  GetCenter,
  GetCenterViews,
  FetchUserPublicProfileById,
};
