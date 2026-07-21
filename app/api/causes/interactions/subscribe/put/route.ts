import db from "@/app/lib/DBschema";

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Subscribed } from "@/app/lib/types";

export async function POST(request: NextRequest) {
    const data:Subscribed = await request.json();

    try {
  
        const identityKey = data.identity_key || randomUUID();
        const [user]:any = await db.query("SELECT id FROM users WHERE email = ?",[data.email])
        const user_id = user[0].id

        await db.query(
            "INSERT INTO subscribed_campaign(name, email,  identity_key, img_url, user_id, campaign_id) VALUES( ?, ?, ?, ?, ?, ?)",
            [
                data.name || "Anonymous",
                data.email || null,
                identityKey,
                data.img_url || null,
                user_id,
                data.campaign_id
            ]
        );

        await db.query(
            "UPDATE campaigns SET subscribed_count = COALESCE(subscribed_count, 0) + 1 WHERE id = ?",
            [data.campaign_id]
        );

        return NextResponse.json(
            { message: "Comment Successful" },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server error" },
            { status: 500 }
        );
    }
}