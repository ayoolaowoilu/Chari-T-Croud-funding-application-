import db from "@/app/lib/DBschema";
import { Comments } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";




export async function  POST(request:NextRequest){
       const data:Comments = await request.json();

       try {
             await db.query("INSERT INTO comments(name,email,comment,identity_key,img_url,user_id) VALUES(?,?,?,?,?,?) " ,
                 [data.name , data.email , data.comment , data.identity_key , data.img_url , data.user_id ]
             )

             return NextResponse.json(
                  { message:"Comment Successful " ,
                    
                  },{status:200}
             )


       } catch (error) {
        console.log(error)
        return NextResponse.json(  
             {error:"Internal Server error"},
             {status:500}
        )
       }
}