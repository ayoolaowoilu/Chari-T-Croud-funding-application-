import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const cursorParam = request.nextUrl.searchParams.get("cursor"); // last campaign id from previous page
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(Number(limitParam) || DEFAULT_LIMIT, MAX_LIMIT);

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const [userRows]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = userRows[0].id;

    let query = "SELECT * FROM campaigns WHERE user_id = ?";
    const params: any[] = [userId];

    if (cursorParam) {
      query += " AND id < ?";
      params.push(Number(cursorParam));
    }

    query += " ORDER BY id DESC LIMIT ?";
    // fetch one extra row so we know whether there's a next page without a second query
    params.push(limit + 1);

    const [rows]: any = await db.query(query, params);

    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = data.length > 0 ? data[data.length - 1].id : undefined;

    return NextResponse.json({ data, hasMore, nextCursor }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}