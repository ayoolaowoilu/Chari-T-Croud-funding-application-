import { NextRequest, NextResponse } from "next/server";





export async function POST(request:NextRequest){
    const body:any =  request.body
    const request_type = body.type;

    if (request_type == "POST"){
         return NextResponse.json(
              {blog:"blog_data"},
              {status
                :200
              }
         ) 
         
    }else if(request_type == "GET"){
         return NextResponse.json(
              {blog:"blog_data"},
              {status
                :200
              }
         )
    }

     return NextResponse.json(
              {blog:"blog_data"},
              {status
                :200
              }
         )

}