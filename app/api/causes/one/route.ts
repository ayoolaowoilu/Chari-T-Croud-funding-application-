import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";
import { addRedisData, getRedisData } from "@/app/lib/redis";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const type = Number(request.nextUrl.searchParams.get("type"));

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const cacheKey = `campaign:${id}:type${type}`;

  try {
    const cached = await getRedisData(cacheKey);
    console.log(cached)
    if (cached) {
      return NextResponse.json(cached , { status: 200 });
    }

    let sql: string;

    if (type === 1) {
      sql = `SELECT * FROM campaigns WHERE id = ?`;
    } else {
      sql = `SELECT id, name, currency, goal, raised, _type, center_name, center_id, user_id, category, bank_details FROM campaigns WHERE id = ?`;
    }

    const [data]: any = await db.query(sql, [id]);

    addRedisData(data, cacheKey, 600);

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server error" }, { status: 500 });
  }
}