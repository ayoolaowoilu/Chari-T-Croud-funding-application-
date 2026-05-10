import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const pageParam = request.nextUrl.searchParams.get("page");
  const type = request.nextUrl.searchParams.get("type");

  // Validation
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const page = parseInt(pageParam || "1", 10);
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  if (!type || (type !== "gotten" && type !== "given")) {
    return NextResponse.json({ error: "Type must be 'gotten' or 'given'" }, { status: 400 });
  }

  const limit = 10; 
  const offset = (page - 1) * limit;

  try {
    const [rows]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userID = rows[0].id;

    let data: any;
    let countResult: any;

    if (type === "gotten") {
      [data] = await db.query(
        "SELECT * FROM donations WHERE to_user_or_centerId = ? ORDER BY time_donated DESC LIMIT ? OFFSET ?",
        [userID, limit, offset]
      );
      [countResult] = await db.query(
        "SELECT COUNT(*) as total FROM donations WHERE to_user_or_centerId = ?",
        [userID]
      );
    } else {
      [data] = await db.query(
        "SELECT * FROM donations WHERE user_id_from = ? ORDER BY time_donated DESC LIMIT ? OFFSET ?",
        [userID, limit, offset]
      );
      [countResult] = await db.query(
        "SELECT COUNT(*) as total FROM donations WHERE user_id_from = ?",
        [userID]
      );
    }

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}