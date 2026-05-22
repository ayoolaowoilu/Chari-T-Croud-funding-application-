import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    const id = request.nextUrl.searchParams.get("id")

     try {
        const [center]:any = await db.query("SELECT * FROM centers WHERE id = ? " , [id])
         const [campaigns]:any = await db.query("SELECT main_img , name , details , id , category , raised FROM campaigns WHERE center_id = ? " , [center[0].id])
        return NextResponse.json(
             {...center[0],campaigns},
             {status:200}
        )
  
     } catch (error) {
        console.log(error)
            return NextResponse.json(
            {error:"Internal server Error"},
             {status:500}
        )
     } 
}