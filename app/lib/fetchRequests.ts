"use server"

import { getSubAccountCode } from "./paystack"
import { Campaign, CenterRegistrationPayload, KycFormData, UserData } from "./types"
import { addRedisData, getRedisData, deleteRedisData } from "./redis"

type causeData = Pick<Campaign, "name" | "details" | "category" | "bank_details"> & {
  deadline: number | undefined
  mainImage: any
  images?: any
  user_email: string | null | undefined
  _type?: string
  location: string
  center_id?: number
  center_name?: string
  story?: string
  goal?: number
  currency?: string
}

type verifyCenter = {
  name: string | null
  user_email: string | undefined | null
  id: number
}

type Report = {
  _type: string
  campaign_id: number
  message: string
  reporter_name: any
}

const API_URL = process.env.API_URL || "http://localhost:3000"


const TTL = {
  FEATURED: 300,        // 5 min — changes frequently
  CAUSE_DETAIL: 600,    // 10 min — moderate traffic
  RANDOM_CAUSES: 180,   // 3 min — discovery feeds refresh often
  CENTER_PROFILE: 300,  // 5 min — moderate changes
  CENTER_LIST: 120,     // 2 min — browse pages refresh often
  USER_STATS: 60,       // 1 min — personal data changes often
  USER_CAUSES: 120,     // 2 min — user's own content
  PUBLIC_PROFILE: 300,  // 5 min — public user data
}


async function withCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    const cached = await getRedisData(cacheKey)
    if (cached) {
      
      const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached
      console.log(`[CACHE HIT] ${cacheKey}`)
      return parsed as T
    }
  } catch (e) {
    console.log(`[CACHE MISS/ERROR] ${cacheKey}`, e)
  }

  const data = await fetchFn()
  
  if (data && typeof data === 'object' && !('error' in data)) {
    addRedisData(data, cacheKey, ttl)
  }
  
  return data
}


async function invalidateCauseCache(causeId: number){
  deleteRedisData(`cause:${causeId}`)
  deleteRedisData('featured')
  deleteRedisData('random5:*') 
}

async function invalidateUserCache(email: string) {
  deleteRedisData(`user:stats:${email}`)
  deleteRedisData(`user:causes:${email}`)
  deleteRedisData(`user:profile:${email}`)
}

async function  invalidateCenterCache(centerId: number) {
  deleteRedisData(`center:one:${centerId}`)
  deleteRedisData('centers:*')
}



const uploadCause = async (data: causeData) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/uploadcause`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const respDecoded = await resp.json()

    if (respDecoded.error) {
      throw new Error(respDecoded.error)
    }

    // Invalidate related caches
    deleteRedisData('featured')
    if (data.user_email) invalidateUserCache(data.user_email)

    return respDecoded
  } catch (error) {
    throw new Error("Internal Server Error" + error)
  }
}

const verifyCenterForCampaign = async (data: verifyCenter) => {
  try {
    const resp = await fetch(`${API_URL}/api/verify/center`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return await resp.json()
  } catch (error) {
    console.log(error)
    return { error: "NET" }
  }
}

const ReportCampaign = async (data: Report) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return await resp.json()
  } catch (error) {
    return { error: "Network Error" }
  }
}

const DeleteCause = async (id: number) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    
    const result = await resp.json()
    
    // Invalidate cause cache
    deleteRedisData(`cause:${id}`)
    deleteRedisData('featured')
    
    return result
  } catch (error) {
    return { error: "Unable to delete cause" }
  }
}

const UpdateCause = async (data: any) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/updatecause`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await resp.json()
    
    // Invalidate cause cache
    if (data.id) {
      deleteRedisData(`cause:${data.id}`)
      deleteRedisData('featured')
    }
    
    return result
  } catch (error) {
    return { error: "Unable to edit cause" }
  }
}

const UpdateBankDetails = async (data: UserData["bank_details"] & { email: string }) => {
  try {
    const subAccountCode = await getSubAccountCode({
      business_name: data.accountName as string,
      account_number: data.accountNumber as string,
      percentage_charge: 4,
      settlement_bank: data.bankCode as string,
    })
    
    console.log(subAccountCode)
    
    const resp = await fetch(`${API_URL}/api/dashboard/updatebank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subAccountCode: subAccountCode,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
        bankName: data.bankName,
        email: data.email,
      }),
    })

    const result = await resp.json()
    
    // Invalidate user profile cache
    invalidateUserCache(data.email)
    
    return result
  } catch (error) {
    return { error: "Unable to update bank details" }
  }
}

type kycPayload = {
  email: string
  formData: KycFormData
  documentUrl: string
}

const UploadKyc = async (data: kycPayload) => {
  try {
    const resp = await fetch(`${API_URL}/api/dashboard/uploadkyc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await resp.json()
    
    // Invalidate user cache
    invalidateUserCache(data.email)
    
    return result
  } catch (error) {
    console.log(error)
    return { error: "Error Uploading KYC try again" }
  }
}

export type uDonate = {
  campaign_id: number
  isAuthed: boolean
  email?: string
  isBlind: boolean
  name?: string
  owner_id: string
  amount: string
  transaction_id: string
  donor_name?: string
  message?: string
  center_id?: any
}

const updateDonate = async (data: uDonate) => {
  try {
    const resp = await fetch(`${API_URL}/api/causes/donate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await resp.json()
    
    // Invalidate related caches
    deleteRedisData(`cause:${data.campaign_id}`)
    if (data.center_id) invalidateCenterCache(data.center_id)
    if (data.email) invalidateUserCache(data.email)
    
    return result
  } catch (error) {
    console.log(error)
    return { error: "Error updating transactions" }
  }
}

const UploadCenter = async (data: CenterRegistrationPayload & { type: string; id: number }) => {
  try {
    const resp = await fetch(`${API_URL}/api/centers/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await resp.json()
   
    deleteRedisData('centers:*')
    
    return result
  } catch {
    return { error: "Internet connection check network connection" }
  }
}


const getFeatured = async () => {
  return withCache('featured', async () => {
    const resp = await fetch(`${API_URL}/api/causes/featured`)
    return await resp.json()
  }, TTL.FEATURED)
}

const fetchOneCauseById = async (id: number, type: number) => {
  return withCache(`cause:${id}:type:${type}`, async () => {
    const resp = await fetch(`${API_URL}/api/causes/one?id=${id}&type=${type}`)
    const rr = await resp.json()
    return rr[0]
  }, TTL.CAUSE_DETAIL)
}

const fetchRandom5Causes = async (query: string, category: string, page: number): Promise<any> => {
  return withCache(`random5:q:${query}:c:${category}:p:${page}`, async () => {
    const resp = await fetch(`${API_URL}/api/causes/random5?query=${query}&category=${category}&page=${page}`)
    return await resp.json()
  }, TTL.RANDOM_CAUSES)
}

const GetCenter = async (type: "ONE" | "OWNED", identifier: string | number) => {
  if (type === "OWNED") {
    // User-specific data — cache lightly
    return withCache(`center:owned:${identifier}`, async () => {
      const resp = await fetch(`${API_URL}/api/centers/get?email=${identifier}`)
      return await resp.json()
    }, TTL.USER_STATS)
  } else {
    // Public center profile — good caching candidate
    return withCache(`center:one:${identifier}`, async () => {
      const resp = await fetch(`${API_URL}/api/centers/one?id=${identifier}`)
      return await resp.json()
    }, TTL.CENTER_PROFILE)
  }
}

const GetCenterViews = async (type: "campaigns" | "centers" | "both", page: number, query?: string) => {
  const cacheKey = `centers:view:t:${type}:p:${page}${query ? `:q:${query}` : ''}`
  
  return withCache(cacheKey, async () => {
    const resp = await fetch(
      `${API_URL}/api/centers/view?page=${page}&type=${type}${query ? `&query=${query}` : ""}`
    )
    return await resp.json()
  }, TTL.CENTER_LIST)
}

const FetchALLUserData = async (email: string) => {
  return withCache(`user:stats:${email}`, async () => {
    const resp = await fetch(`${API_URL}/api/dashboard/userstats?email=${email}`)
    return await resp.json()
  }, TTL.USER_STATS)
}

const FetchUserCauses = async (email: string) => {
  return withCache(`user:causes:${email}`, async () => {
    const resp = await fetch(`${API_URL}/api/dashboard/yourcam?email=${email}`)
    return await resp.json()
  }, TTL.USER_CAUSES)
}

const FetchProfile = async (email: string) => {
  return withCache(`user:profile:${email}`, async () => {
    const resp = await fetch(`${API_URL}/api/dashboard/profile?email=${email}`)
    return await resp.json()
  }, TTL.USER_STATS)
}

const GetUserDetailsDyId = async (id: number, isCenter: boolean) => {
  return withCache(`user:details:${id}:center:${isCenter}`, async () => {
    const resp = await fetch(`${API_URL}/api/getuserdetailsbyid?id=${id}&is_center=${isCenter}`)
    return await resp.json()
  }, TTL.PUBLIC_PROFILE)
}

const FetchUserPublicProfileById = async (id: number) => {
  // This composes two calls — cache the final result
  return withCache(`public:profile:${id}`, async () => {
    const userDetails = await GetUserDetailsDyId(id, false)
    const userCauses = await FetchUserCauses(userDetails.email)

    return {
      data: userDetails,
      causes: userCauses,
    }
  }, TTL.PUBLIC_PROFILE)
}

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
  // Export invalidation helpers for use in other modules
  invalidateCauseCache,
  invalidateUserCache,
  invalidateCenterCache,
}