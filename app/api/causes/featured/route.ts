import db from "@/app/lib/DBschema";
import { NextResponse } from "next/server";
import { addRedisData, getRedisData } from "@/app/lib/redis";

export async function GET() {
  const cacheKey = "featured:random";

  try {

    const cached = await getRedisData(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200 });
    }

    const [data]: any = await db.query(
      `SELECT 
        main_img, details, donation_count, goal, raised, category, 
        name, id, center_name, center_id, location, 
        date_to_completion, safety_rating 
      FROM campaigns 
      WHERE date_to_completion > ?
        AND goal <> raised 
      ORDER BY RAND() 
      LIMIT 3`,
      [Date.now()]
    );


    addRedisData(data, cacheKey, 300);

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server error" }, { status: 500 });
  }
}