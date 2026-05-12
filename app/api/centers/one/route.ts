import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    const id = request.nextUrl.searchParams.get("id")

     try {
        const [center]:any = await db.query("SELECT * FROM centers WHERE id = ? " , [id])

        return NextResponse.json(
             center[0],
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