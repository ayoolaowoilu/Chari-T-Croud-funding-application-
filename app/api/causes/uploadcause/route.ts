
import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, details, story, goal, currency, deadline, mainImage, images, user_email, _type, category, location, bank_details } = body;

    if (!name || !details || !goal || !deadline || !mainImage || !user_email) {
        return NextResponse.json(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400 }
        )
    }

    try {
        const [userid]: any = await db.query("SELECT id FROM users WHERE email = ?", [user_email])

        if (!_type) {

            await db.query(
                "INSERT INTO campaigns(name, details , story ,main_img ,imgs ,goal ,user_id , date_to_completion ,currency , category , location , bank_details ) VALUES(?,?,?,?,?,?,?,?,? , ? , ? , ?)",
                [name, details, story, JSON.stringify(mainImage), JSON.stringify(images), goal, userid[0].id, deadline, currency, category, location, JSON.stringify(bank_details)]
            )

            return NextResponse.json(
                JSON.stringify({ msg: "Successfully Uploaded your cause" }),
                { status: 200 }
            )


        } else {
            await db.query(
                "INSERT INTO campaigns(name, details , story ,main_img ,imgs ,goal ,user_id , date_to_completion ,currency,_type ) VALUES(?,?,?,?,?,?,?,?,?,?)",
                [name, details, story, JSON.stringify(mainImage), JSON.stringify(images), goal, userid[0].id, deadline, currency, _type]
            )

            return NextResponse.json(
                JSON.stringify({ msg: "Successfully Uploaded your cause" }),
                { status: 200 }
            )
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            JSON.stringify({ msg: "Internal Server Error" + error }),
            { status: 500 }
        )
    }




} 