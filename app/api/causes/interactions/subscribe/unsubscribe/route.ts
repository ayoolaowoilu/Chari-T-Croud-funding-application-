import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identity_key } = body;

        if (!identity_key) {
            return NextResponse.json(
                { error: "identity_key is required" },
                { status: 400 }
            );
        }

        const [result]: any = await db.query(
            "DELETE FROM subscribed_campaign WHERE identity_key = ?",
            identity_key
        );

          await db.query(
            "UPDATE campaigns SET subscribed_count = COALESCE(subscribed_count, 0) - 1 WHERE id = ?",
            [body.campaign_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Subscription not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Unsubscribed successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}