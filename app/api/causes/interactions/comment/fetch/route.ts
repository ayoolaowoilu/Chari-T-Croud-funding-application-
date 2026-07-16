import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const campaign_id = request.nextUrl.searchParams.get("id");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "0");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    try {
    
        const [countResult]: any = await db.query(
            "SELECT COUNT(*) as total FROM comments WHERE campaign_id = ?",
            campaign_id
        );
        const total_count = countResult[0]?.total || 0;

        const offset = page * limit;
        const [rows]: any = await db.query(
            "SELECT * FROM comments WHERE campaign_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [campaign_id, limit, offset]
        );

        await db.query("UPDATE TABLE campaigns SET comments_count = comments_count + 1 WHERE id = ?",[campaign_id])

        return NextResponse.json(
            {
                comments: rows || [],
                total_count: total_count,
                page: page,
                limit: limit,
                has_more: offset + rows.length < total_count
            },
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