import db from "@/app/lib/DBschema";

import { NextRequest, NextResponse } from "next/server";


function getTimeSeed() {
  const now = Date.now();
  const windowMs = 90 * 60 * 1000; 
  const windowIndex = Math.floor(now / windowMs);
  return `chari-t-${windowIndex}`; 
}



export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "All";
  const page = Number(searchParams.get("page")) || 0;

  const seed = getTimeSeed();
 

  try {
    


    let sql: string;
    let params: any[] = [];

    if (category === "All" && !query) {
      sql = `
        SELECT main_img, details, donation_count, goal, raised,
               category, name, id, center_name, center_id, location,
               date_to_completion, safety_rating
        FROM campaigns
        WHERE CAST(date_to_completion AS UNSIGNED) > ?
          AND goal <> raised
        ORDER BY MD5(CONCAT(id, ?))
        LIMIT 21 OFFSET ?
      `;
      params = [Date.now(), seed, page * 20];
    }

    else if (category !== "All" && !query) {
      sql = `
        SELECT main_img, details, donation_count, goal, raised,
               category, name, id, center_name, center_id, location,
               date_to_completion, safety_rating
        FROM campaigns
        WHERE CAST(date_to_completion AS UNSIGNED) > ?
          AND category = ?
          AND goal <> raised
        ORDER BY MD5(CONCAT(id, ?))
        LIMIT 21 OFFSET ?
      `;
      params = [Date.now(), category, seed, page * 20];
    }

    else if (category === "All" && query) {
      sql = `
        SELECT main_img, details, donation_count, goal, raised,
               category, name, id, center_name, center_id, location,
               date_to_completion, safety_rating
        FROM campaigns
        WHERE CAST(date_to_completion AS UNSIGNED) > ?
          AND (
            name LIKE ?
            OR details LIKE ?
            OR center_name LIKE ?
            OR category LIKE ?
          )
          AND goal <> raised
        ORDER BY MD5(CONCAT(id, ?))
        LIMIT 21 OFFSET ?
      `;
      params = [Date.now(), `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, seed, page * 20];
    }

    else {
      sql = `
        SELECT main_img, details, donation_count, goal, raised,
               category, name, id, center_name, center_id, location,
               date_to_completion, safety_rating
        FROM campaigns
        WHERE CAST(date_to_completion AS UNSIGNED) > ?
          AND category = ?
          AND (
            name LIKE ?
            OR details LIKE ?
            OR center_name LIKE ?
          )
          AND goal <> raised
        ORDER BY MD5(CONCAT(id, ?))
        LIMIT 21 OFFSET ?
      `;
      params = [Date.now(), category, `%${query}%`, `%${query}%`, `%${query}%`, seed, page * 20];
    }

    const [results]: any = await db.query(sql, params);

    const hasMore = results.length > 20;
    const data = results.slice(0, 20);
    const response = { data, hasMore };

   

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server error" }, { status: 500 });
  }
}