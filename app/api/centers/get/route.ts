import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    const email = request.nextUrl.searchParams.get("email")
    
    try {
        const [userID]:any = await db.query("SELECT id FROM users WHERE email = ?" , [email])

        const [centers]:any = await db.query("SELECT * FROM centers WHERE user_id = ?" , [userID[0].id])
        

        return NextResponse.json(
             centers,
             {status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }
}