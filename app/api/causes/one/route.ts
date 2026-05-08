
import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){


 const id = request.nextUrl.searchParams.get("id")
 const type = Number(request.nextUrl.searchParams.get("type"))
 
    if(type == 1){
          try{
                  const [data]:any = await db.query(
            `SELECT * FROM campaigns WHERE id=?`,
            [id]
        )

              return NextResponse.json(
                   data,
                    {status:200}
                )

    }catch(error){
         console.log(error)
          return NextResponse.json(
     {error:"Internal Server error"},
            {status:500}
        )
    }
    }else{


         try{
                  const [data]:any = await db.query(
            `SELECT id,name,currency,goal,raised,_type,center_name,center_id,user_id,category,bank_details FROM campaigns WHERE id=?`,
            [id]
        )

              return NextResponse.json(
                   data,
                    {status:200}
                )

    }catch(error){
         console.log(error)
          return NextResponse.json(
     {error:"Internal Server error"},
            {status:500}
        )
    }
    }
      
   
}