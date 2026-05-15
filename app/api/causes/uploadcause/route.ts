
import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, details, story, goal, currency, deadline, mainImage, images, user_email, _type, category, location, bank_details , center_id , center_name} = body;

  

    if (!name || !details || !deadline || !mainImage || !user_email) {
        return NextResponse.json(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400 }
        )
    }

    try {
        const [userid]: any = await db.query("SELECT id FROM users WHERE email = ?", [user_email])

        if (!_type) {

    const [res]:any = await db.query(
                "INSERT INTO campaigns(name, details , story ,main_img ,imgs ,goal ,user_id , date_to_completion ,currency , category , location , bank_details ) VALUES(?,?,?,?,?,?,?,?,? , ? , ? , ?)",
                [name, details, story, JSON.stringify(mainImage), JSON.stringify(images), goal, userid[0].id, deadline, currency, category, location, JSON.stringify(bank_details)]
            )

            return NextResponse.json(
                JSON.stringify({ msg: "Successfully Uploaded your cause" ,link:`${process.env.API_URL}/causes/get?id=${res.insertId}`}),
                { status: 200 }
            )


        } else {

           await db.query(
                "INSERT INTO campaigns(name, details , main_img  , user_id , date_to_completion ,center_id,center_name , bank_details , _type , goal , location ) VALUES(?,?,?,?,?,?,? , ? ,? , ? ,?)",
                [name , details , JSON.stringify(mainImage), userid[0].id , deadline , center_id , center_name , JSON.stringify(bank_details)  , _type , 901 , location]
            )

            await db.query("UPDATE centers SET total_campaigns = total_campaigns + 1  WHERE id = ?" , [center_id])

            return NextResponse.json(
                JSON.stringify({ msg: "Successfully Uploaded your cause" , link:`${process.env.API_URL}/dashboard/centers/profile?id=${center_id}`}),
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