import db from "@/app/lib/DBschema";
import { requireAdmin } from "@/app/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TABLES = ["users", "centers", "campaigns", "transactions"] as const;
type AllowedTable = (typeof ALLOWED_TABLES)[number];

const TABLE_COLUMNS: Record<AllowedTable, string> = {
  users: "full_name, email, is_verified, created_at, image, donations, recieved, method, id, role",
  centers: "name, registration_number, email, phone, address, website, is_verified_status, about, logourl, geo_location, verification_documents, id",
  campaigns: "id, name, details, story, main_img, goal, raised, _type, center_name, center_id, user_id, date_to_completion, created_at, currency, category, donation_count, safety_rating, reports",
  transactions: "id, owner_id, ammount, payer_id, paid_to, refrence",
};

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const page = Number(request.nextUrl.searchParams.get("page")) || 0;
  const rawTable = request.nextUrl.searchParams.get("table") || "users";
  const _type = request.nextUrl.searchParams.get("_type");


  if (!ALLOWED_TABLES.includes(rawTable as AllowedTable)) {
    return NextResponse.json(
      { error: "Invalid table" },
      { status: 400 }
    );
  }
  const table = rawTable as AllowedTable;

  try {
    let query: string;
    let params: any[] = [];

    // ─── Build query per table ──────────────────────────────────────
    if (table === "campaigns" && _type && _type !== "all") {
      const typeConditions: Record<string, string> = {
        funded: "goal <= raised",
        due: `date_to_completion > ${Date.now()}`,
        reported: "reports > 0",
      };

      const condition = typeConditions[_type];
      if (!condition) {
        return NextResponse.json(
          { error: "Invalid campaign filter" },
          { status: 400 }
        );
      }

      query = `SELECT ${TABLE_COLUMNS[table]} FROM campaigns WHERE ${condition} LIMIT ? OFFSET ?`;
      params = [41, page * 40];
    } else {
      query = `SELECT ${TABLE_COLUMNS[table]} FROM ${table} LIMIT ? OFFSET ?`;
      params = [41, page * 40];
    }

    const [rows]: any = await db.query(query, params);
    const hasMore = rows.length > 40;
    const reports = hasMore ? rows.slice(0, 40) : rows;

    return NextResponse.json(
      {
        rows: reports,
        hasMore: hasMore,
        page: page,
        totalReturned: reports.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}