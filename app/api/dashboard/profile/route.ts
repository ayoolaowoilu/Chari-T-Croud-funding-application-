import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
  
    const email = request.nextUrl.searchParams.get("email")

    try {
          const [row1]:any = await db.query("SELECT * FROM users WHERE email = ? " ,[email])
          if(row1[0].is_verified === 0){
              return NextResponse.json(
                   {userData:row1[0] , kyc:false},
                   {status:200}
              )
          }

              return NextResponse.json(
                     {userData:row1[0] , kyc:true  },
                     {status:200}
              )
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}