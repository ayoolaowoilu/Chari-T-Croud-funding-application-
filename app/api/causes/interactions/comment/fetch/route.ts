import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export  async function GET(request:NextRequest){
     
    const campaign_id = request.nextUrl.searchParams.get("id")

    try { 
        const [row]:any = await db.query("SELECT * FROM comments WHERE campaign_id = ? " , campaign_id)

        if (row.length == 0){
               return NextResponse.json(
             [],
             {status:200}
        )
        }

        return NextResponse.json(
             row,
             {status:200}
        )

        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: " Server Error "},
            {status:500}
        )
    }
}