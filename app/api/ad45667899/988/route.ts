import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
      const page = Number(request.nextUrl.searchParams.get("page")) || 0;

      try {
         const [row ]:any= await db.query("SELECT * FROM reports LIMIT 41 OFFSET ? ",[page * 40])
         const hasMore = row.length > 40

         return NextResponse.json({
            reports:row,
            hasMore: hasMore
         }
        , {status:200})
         
      } catch (error) {
        
      }
}