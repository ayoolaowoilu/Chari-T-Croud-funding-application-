
import { PaystackBank } from "./types";

export interface SubAccountPayload {
  business_name: string;           // Required - Name of the business or person
  settlement_bank: string;         // Required - Bank code (e.g., "058" for GTBank)
  account_number: string;          // Required - 10-digit Nigerian bank account number
  percentage_charge: number;       // Required - 4%
  description?: string;            
  primary_contact_email?: string;  
  primary_contact_name?: string;   
  primary_contact_phone?: string;  
  metadata?: Record<string, any>;  
}

export interface SubAccountResponse extends SubAccountPayload { 
  active: boolean;
  createdAt: string;
  subaccount_code: string; 
}

const BASE_URL = process.env.PAYSTACK_APP_URL || "https://api.paystack.co"
const paystack_key = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY


const getHeaders = () => {
            return  {
                        "Authorization": `Bearer ${paystack_key}`,
                         "Content-Type": "application/json",
                    } 
}



const getSubAccountCode = async(data:SubAccountPayload):Promise<SubAccountResponse["subaccount_code"]> => {
    try{
        const resp = await fetch(`${BASE_URL}/subaccount`,{
             method:"POST",
             headers:getHeaders(),
             body:JSON.stringify(data)

        }) 
        const dat = await resp.json()
        if(!dat.status){
                  throw new Error("Error Creating SubAccount")
        }
        const dataa:SubAccountResponse = dat.data
          console.log(dat)
        return dataa.subaccount_code
        
    }catch {
       throw new Error("Error Creating SubAccount")
    }
}





const VerifyBankDetails = async(accountNumber: string, bankCode: string): Promise<{status: boolean; data: any; message: string}> => {

   const resp =    await fetch(
                `${BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
                {
                 headers:getHeaders() 
                }
            )

            return await resp.json()
}

const FetchBanks = async(): Promise<{status: boolean; data: PaystackBank[]}> =>{
     try {
         const resp =  await fetch(`${BASE_URL}/bank`)
      const rr = await resp.json()

      return rr
     } catch (error) {
        console.error("Failed to fetch banks:", error)
        throw error
     }
}






export {FetchBanks , VerifyBankDetails , getSubAccountCode}