import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
      const page = Number(request.nextUrl.searchParams.get("page")) || 0;
      const table = request.nextUrl.searchParams.get("table") || "users"

   

      try {
         
         const [row ]:any= await db.query("SELECT * FROM ? LIMIT 41 OFFSET ? ",[table,page * 40 ])
         const hasMore = row.length > 40

         return NextResponse.json({
            reports:row,
            hasMore: hasMore
         }
        , {status:200})
         
      } catch (error) {
         console.log(error)
          return NextResponse.json({
            error:"There was an error failed to fetch",
        
          },{status:500})
      }
}