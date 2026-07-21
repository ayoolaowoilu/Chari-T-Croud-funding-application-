import db from "@/app/lib/DBschema";
import { Comments } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
    const data: Comments = await request.json();

    try {
        // Generate identity_key if not provided
        const identityKey = data.identity_key || randomUUID();
        const [user]:any = await db.query("SELECT id FROM users WHERE email = ?",[data.email])
        const user_id = user[0].id

        await db.query(
            "INSERT INTO comments(name, email, comment, identity_key, img_url, user_id, campaign_id) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [
                data.name || "Anonymous",
                data.email || null,
                data.comment,
                identityKey,
                data.img_url || null,
                user_id,
                data.campaign_id
            ]
        );

        // Increment comments_count (handle NULL with COALESCE)
        await db.query(
            "UPDATE campaigns SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = ?",
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