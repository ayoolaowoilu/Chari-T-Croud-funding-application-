"use client"

import Footer from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";
import { DualRingSpinner } from "@/app/components/ui/loading";
import { GetCenterViews } from "@/app/lib/fetchRequests";
import { useEffect, useState } from "react"
interface Campaign {
  id: number;
  name: string;
  details: string;
  main_img: string;
  raised: number;
  center_name: string | null;
  center_id: string | number;
  date_to_completion: string; 
  created_at: string;
  category: "Education" | "Community" | "CroudFunding" | "Business" | "Health";
  donation_count:number,
}

interface Centers {
  name: string
  email: string
  userEmail:string
  phone: string
  address: string
  website: string
  logourl: string | null
}


export default function Page(){
   const [centers,setCenters] = useState<Centers>()
   const [centerCampaigns,setCenterCampaigns] = useState<Campaign>()
   const [loading,setLoading] = useState(false)
   const [error,setError] = useState(false)
   const [centersHasMore,setCentersHasMore] = useState(false)
   const [campaignsHasMore,setCampaignsHasMore] = useState(false)

   const fetchData = async(type:"campaigns" | "centers" | "both" , page:number , query?:string) =>{
        setLoading(true)
         try {
             const resp = await GetCenterViews(type,page,query);
             console.log(resp)
             if(resp.error){
                setError(true)
               
                return null;
             }

             setCenterCampaigns(resp.data.campaigns)
             setCenters(resp.data.centers)
             setCampaignsHasMore(resp.pagination.hasMoreCampaigns)
             setCentersHasMore(resp.pagination.hasMoreCenters)
         } catch (error) {
            console.log(error)
                 setError(true)
                
         }finally{
             setLoading(false)
         }
   }

   useEffect(()=>{
       fetchData("both",0)
   },[])

     return <>
        <NavBar />
           
           <DualRingSpinner /> 
           {/* loader */}
    
        <Footer />
    
    </>
}