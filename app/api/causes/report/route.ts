import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request:NextRequest){
    const { _type , campaign_id , message , reporter_name } = await request.json();
    console.log(_type,message)
    
    try{
        await db.query("INSERT INTO reports(report_type , campaign_id , message , reporter_name) VALUES(?,?,?,?)",[_type , campaign_id , message , reporter_name])

        return NextResponse.json(
        {message:"Report successful"},
        {status:200}
        )
    }catch(error) {
        console.log(error)
           return NextResponse.json(
            {error:"Failed to report"},
            {status:500}
           )     
    }
}