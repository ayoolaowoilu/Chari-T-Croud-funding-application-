import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
  
    
    const email = request.nextUrl.searchParams.get("email")

    if(!email){
          return NextResponse.json(
               {error:"Internal server error"},
               {status:200}
          )
    }

      try{
         const [row1]:any = await db.query("SELECT * FROM users WHERE email = ? " ,[email])


           const userId = row1[0].id

           const [row]:any = await db.query(
            "SELECT main_img,details,donation_count,goal,raised,category,name,id,center_name,center_id , location , date_to_completion,safety_rating FROM campaigns WHERE user_id = ? ORDER BY RAND() LIMIT 3",
            [userId]
           )

          const perfectData = {
                userData: row1[0],
                causes:row
          }

          return NextResponse.json(
               perfectData,
               {status:200}
          )

          
           
      }catch (error){
          console.log(error)
            return NextResponse.json(
               {error:"Internal server error","regxp":error},
               {status:500}
          )
      }
}