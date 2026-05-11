"use server"

import { error } from "console";
import { getSubAccountCode} from "./paystack";
import { Campaign, CenterRegistrationPayload, KycFormData, UserData } from "./types"


type causeData = Pick<Campaign , "name" | "details" | "story" | "goal" | "currency" | "category" | "bank_details" > & {
         deadline:number | undefined;
         mainImage:any;
         images:any;
         user_email:string | null | undefined;
         _type?:string;
         location:string;
}

type verifyCenter = {
       name:string | null,
       user_email:string | undefined | null,
       id:number,
}

type Report = {
    _type:string,
    campaign_id:number,
    message:string,
    reporter_name:any

}


const API_URL = process.env.API_URL || "http://localhost:3000"

const uploadCause = async(data:causeData) =>{
       try {
            const resp = await fetch(`${API_URL}/api/causes/uploadcause`,{
                 method:"POST",
                 headers:{"Content-Type":"application/json"},
                 body:JSON.stringify(data)
            })

            const respDecoded = await resp.json()

            if(respDecoded.error){
                  throw new Error(respDecoded.error)
            }else{
            
                 return respDecoded;
            }
       } catch (error) {
           throw new Error("Internal Server Error" + error);
       }
}


const verifyCenterForCampaign = async(data:verifyCenter)=>{
           try{
               const resp = await fetch(`${API_URL}/api/verify/center`,{
                      method:"POST",
                      headers:{"Content-Type":"application/json"},
                      body:JSON.stringify(data)
               })

             const response = await resp.json();
               return response
                
           }catch(error){
               console.log(error)
                return {error:"NET"}
           }
}

const getFeatured  = async() =>{
       try{
           const resp =await fetch(`${API_URL}/api/causes/featured`)

           const rr = await resp.json()
            console.log(rr)

            return rr;
       }catch(error){
           
       }
}

const fetchOneCauseById = async(id:number,type:number) =>{
        try {
            const resp = await fetch(`${API_URL}/api/causes/one?id=${id}&type=${type}`)

            const rr = await resp.json()

            return rr[0]
        } catch (error) {
            console.log(error)
        
        }
}

const ReportCampaign = async(data:Report)=>{
       try{
          const resp = await fetch(`${API_URL}/api/causes/report`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
          })

          
      
          const rr =await resp.json()
          return rr;
       } catch(error){
           return {error:"Network Error"}
       }
}

const FetchALLUserData = async(email:string)=>{
       try{
              const resp = await fetch(`${API_URL}/api/dashboard/userstats?email=${email}`)

          return (await resp.json())
       }catch(error)
{
      return {error:"Unable to fetch data"}
}}


const FetchUserCauses = async(email:string) => {
         try{
                const resp = await fetch(`${API_URL}/api/dashboard/yourcam?email=${email}`)
                return await resp.json()
         }catch(error){
            return {error:"Unable to fetch data"}
         }
}

const fetchRandom5Causes = async (query:string,category:string):Promise<any>=>{
       console.log(query,category)
        try {
               const resp = await fetch(`${API_URL}/api/causes/random5?query=${query}&category=${category}`)
                     return await resp.json()
        } catch (error) {
              console.log(error)
        }   
}
const DeleteCause = async(id:number) =>{
       try{
              const resp = await fetch(`${API_URL}/api/causes/delete`,{
                     method:"POST",
                     headers:{"Content-Type":"application/json"},
                     body:JSON.stringify({id})
              })
              return await resp.json()
       }catch(error){
              return {error:"Unable to delete cause"}
       }}

       const UpdateCause = async(data:any) =>{
              
              try{
                     const resp = await fetch(`${API_URL}/api/causes/updatecause`,{
                            method:"POST",
                            headers:{"Content-Type":"application/json"},
                            body:JSON.stringify(data)
                     })
                 
                     return await resp.json()
              }catch(error){
                     return {error:"Unable to edit cause"}
              }}



              const FetchProfile = async(email:string) =>{
                     try{
                            const resp = await fetch(`${API_URL}/api/dashboard/profile?email=${email}`)
                            return await resp.json()
                     }catch(error){
                            return {error:"Unable to fetch profile"}
                     }
                    }

                    const UpdateBankDetails = async(data:UserData["bank_details"] & {email:string }) =>{
                           try{

                            const subAccountCode = await getSubAccountCode({
                                     business_name:data.accountName as string,
                                     account_number:data.accountNumber as string,
                                     percentage_charge:4,
                                     settlement_bank:data.bankCode as string
                            })
                            console.log(subAccountCode)
                                       const resp = await fetch(`${API_URL}/api/dashboard/updatebank`,{
                                                   method:"POST",    
                                                         headers:{"Content-Type":"application/json"}, 
                                                               body:JSON.stringify({ subAccountCode:subAccountCode,
                                                                      accountName:data.accountName,
                                                                      accountNumber:data.accountNumber,
                                                                      bankCode:data.bankCode,
                                                                      bankName:data.bankName,
                                                                      email:data.email
                                                               })
                                       })

                                       return await resp.json()
                           }catch(error){
                                       return {error:"Unable to update bank details"}
                           }
                     
                     }
   type kycPayload = {
        email:string;
        formData:KycFormData;
        documentUrl:string
   }


                     const UploadKyc = async(data:kycPayload) => {
                          try {
                                const resp = await fetch(`${API_URL}/api/dashboard/uploadkyc`,{
                                     method:"POST",
                                     headers:{"Content-Type":"application/json"},
                                     body:JSON.stringify(data)
                                })

                                return await resp.json()
                          } catch (error) {
                            console.log(error)
                            return {error:"Error Uploading KYC try again"}
                          }
                     }

                      const GetUserDetailsDyId = async (id:number) => {
  try{
       const resp = await fetch(`${API_URL}/api/getuserdetailsbyid?id=${id}`)
    
    const data = await resp.json()

    return data
    
  }catch(error){
       console.log(error)
     return {error:"Undefined"}
  }
  }

 export type uDonate = {
        campaign_id:number,
        isAuthed:boolean,
        email?:string,
        isBlind:boolean,
        name?:string,
        owner_id:string,
        amount:string,
        transaction_id:string,
        donor_name?:string,
        message?:string

                           
  }
  const updateDonate = async(data:uDonate) => {
         try{
             const resp = await fetch(`${API_URL}/api/causes/donate`,{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(data)
             })

             return await resp.json()
         }catch(error){
               console.log(error)
               return {error:"Error updating transactions"}
         }
  }

  const UploadCenter =async(data:CenterRegistrationPayload & {type:string})=>{
          try{
        const resp = await fetch(`${API_URL}/api/centers/add`,{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(data)
        })

        return await resp.json()
          }catch{
                return {error:"Internet connection check network connection"}
          }
  }


  const GetCenter = async(type:"ONE" | "OWNED" , email:string | number) =>{
         try{
             if(type == "OWNED"){
                 const resp = await fetch(`${API_URL}/api/centers/get?email=${email}`)

                 return (await resp.json())
                 
             }else{
                  const resp  = await fetch(`${API_URL}/api/centers/one?id=${email}`)

                  return (await resp.json())
             }
         }catch{
               return {error:"Error Getting data"}
         }
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
     DeleteCause,FetchProfile,
     fetchRandom5Causes,
     UpdateBankDetails,
     UploadKyc,
     GetUserDetailsDyId,
    type kycPayload,
    updateDonate,
    UploadCenter,
    GetCenter
}