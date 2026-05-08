import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";






export async function GET(request:NextRequest) {
     const email = request.nextUrl.searchParams.get("email")
     
     try{
           const [row1]:any = await db.query("SELECT id FROM users WHERE email = ? " ,[email])
           const userId = row1[0].id

           const [row]:any = await db.query(
                "SELECT id,name,currency,goal,raised,center_name,center_id,category,details,main_img,date_to_completion,donation_count FROM campaigns WHERE user_id = ? ORDER BY id DESC  LIMIT 30",
            [userId]
           )

           return NextResponse.json(
              row,
              {status:200}
           )
     }catch(error){
        console.log(error)
          return NextResponse.json(
              {error:"Internal server error"},
               {status:500}
          )
     }
}