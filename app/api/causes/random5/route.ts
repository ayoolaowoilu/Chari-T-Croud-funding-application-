import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "All";

  try {
    let sql: string;
    let params: any[] = [];

   
    if (category === "All" && !query) {
      sql = `
        SELECT main_img, details, donation_count, goal, raised, 
               category, name, id, center_name, center_id , location, date_to_completion,safety_rating
        FROM campaigns 
        WHERE date_to_completion > ?  AND goal <> raised 
        ORDER BY RAND() 
        LIMIT 15
      `;
      params = [Date.now()];
    }

    // Case 2: Category only
    else if (category !== "All" && !query) {
      sql = `
        SELECT main_img, details, donation_count, goal, raised, 
               category, name, id, center_name, center_id , location,date_to_completion,safety_rating
        FROM campaigns 
        WHERE date_to_completion > ? 
          AND category = ?  AND goal <> raised 
        ORDER BY RAND() 
        LIMIT 15
      `;
      params = [Date.now(), category];
    }

    // Case 3: Search query only (category = "All")
    else if (category === "All" && query) {
      sql = `
        SELECT main_img, details, donation_count, goal, raised, 
               category, name, id, center_name, center_id ,location,date_to_completion,safety_rating
        FROM campaigns 
        WHERE date_to_completion > ? 
          AND (
            name LIKE ? 
            OR details LIKE ? 
            OR center_name LIKE ? 
            OR category LIKE ?
          )  AND goal <> raised 
        ORDER BY RAND() 
        LIMIT 15
      `;
      params = [Date.now(), `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
    }

    // Case 4: Both category and search query
    else {
      sql = `
        SELECT main_img, details, donation_count, goal, raised, 
               category, name, id, center_name, center_id , location , date_to_completion,safety_rating
        FROM campaigns 
        WHERE date_to_completion > ? 
          AND category = ? 
          AND (
            name LIKE ? 
            OR details LIKE ? 
            OR center_name LIKE ?
          )   AND goal <> raised 
        ORDER BY RAND() 
        LIMIT 15
      `;
      params = [Date.now(), category, `%${query}%`, `%${query}%`, `%${query}%`];
    }

    const [data]: any = await db.query(sql, params);

    return NextResponse.json(
      { data, hasMore: false }, // or true if you plan pagination
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}