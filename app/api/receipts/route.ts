import { Receipts } from "@/app/lib/receipts";
import { NextRequest } from "next/server";



export async function GET(request:NextRequest){
      
       const amount = request.nextUrl.searchParams.get("amount")
       const platform_fee = request.nextUrl.searchParams.get("platform_fee")
       const transaction_id = request.nextUrl.searchParams.get("transaction_id")
       const time = request.nextUrl.searchParams.get("time")
       const email = request.nextUrl.searchParams.get("email")


       return Receipts({
        amount:Number(amount) , 
        platform_fee:Number(platform_fee),
        transaction_id:transaction_id as string,
        time:time as string,
        email:email as string
       })
}