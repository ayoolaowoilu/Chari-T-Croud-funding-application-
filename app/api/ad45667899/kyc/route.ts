import db from "@/app/lib/DBschema";
import { requireAdmin } from "@/app/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
         const auth = await requireAdmin(request);
         if (!auth.ok) return auth.response;

         const userId = request.nextUrl.searchParams.get("userId")

         try {
              const [row]:any = await db.query("SELECT * FROM kyc WHERE user_id = ? " , [ Number(userId)  ])

              return NextResponse.json(
                {kyc:row[0]},
                {status:200}
              )
         } catch (error) {
            console.log(error)
            return NextResponse.json(
                {error:"Error getting data"},
                {status:500}
            )
         }
}