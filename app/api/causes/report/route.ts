import db from "@/app/lib/DBschema";
import { Campaign } from "@/app/lib/types";
import { clientIp, rateLimit } from "@/app/lib/rateLimit";
import { deleteRedisData } from "@/app/lib/redis";
import { NextRequest, NextResponse } from "next/server";

const VALID_TYPES = new Set([
  "fraud",
  "misrepresentation",
  "exploitative",
  "spam",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type, campaign_id, message, reporter_name } = body as {
      _type?: string;
      campaign_id?: number;
      message?: string;
      reporter_name?: string;
    };

    if (!campaign_id || !_type) {
      return NextResponse.json(
        { error: "campaign_id and report type are required" },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.has(_type)) {
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 }
      );
    }

    const ip = clientIp(request);
    const rl = await rateLimit({
      key: `report:${ip}:${campaign_id}`,
      limit: 3,
      windowSeconds: 60 * 60, // 3 reports per campaign per IP per hour
    });
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: "Too many reports. Please try again later.",
          message: "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    const globalRl = await rateLimit({
      key: `report:ip:${ip}`,
      limit: 15,
      windowSeconds: 60 * 60,
    });
    if (!globalRl.allowed) {
      return NextResponse.json(
        { error: "Too many reports from this network." },
        { status: 429 }
      );
    }

    const [campaign]: any = await db.query(
      "SELECT raised, id, donation_count, donors, goal, center_id, safety_rating FROM campaigns WHERE id = ?",
      [campaign_id]
    );

    if (!campaign || campaign.length === 0) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    await db.query(
      "INSERT INTO reports (report_type, campaign_id, meaasge, reporter_name) VALUES (?, ?, ?, ?)",
      [
        _type,
        campaign_id,
        (message || "").slice(0, 2000),
        (reporter_name || "anonymous").slice(0, 255),
      ]
    );

    // Keep reports count in sync when column exists
    try {
      await db.query(
        "UPDATE campaigns SET reports = COALESCE(reports, 0) + 1, reported = 1 WHERE id = ?",
        [campaign_id]
      );
    } catch {
      /* optional column */
    }

    const [reportCounts]: any = await db.query(
      `SELECT 
        SUM(CASE WHEN report_type = 'fraud' THEN 1 ELSE 0 END) as fraud_count,
        SUM(CASE WHEN report_type = 'misrepresentation' THEN 1 ELSE 0 END) as misrepresentation_count,
        SUM(CASE WHEN report_type = 'exploitative' THEN 1 ELSE 0 END) as exploitative_count,
        SUM(CASE WHEN report_type = 'spam' THEN 1 ELSE 0 END) as spam_count,
        COUNT(*) as total_reports
      FROM reports 
      WHERE campaign_id = ?`,
      [campaign_id]
    );

    const counts = reportCounts[0];
    const currentRating = campaign[0].safety_rating as Campaign["safety_rating"];
    const total = Number(counts.total_reports);
    const fraud = Number(counts.fraud_count);
    const misrepresentation = Number(counts.misrepresentation_count);
    const exploitative = Number(counts.exploitative_count);

    let newRating: Campaign["safety_rating"] = currentRating;

    if (fraud >= 3 || (fraud >= 1 && misrepresentation >= 2)) {
      newRating = "unsafe";
    } else if (
      fraud >= 1 ||
      misrepresentation >= 3 ||
      (exploitative >= 2 && total >= 4)
    ) {
      newRating = "likely_risky";
    } else if (
      total >= 5 &&
      (currentRating === "likely_safe" || currentRating === "verified_safe")
    ) {
      newRating = "uncertain";
    } else if (total >= 3 && currentRating === "uncertain") {
      newRating = "likely_risky";
    } else if (
      total >= 1 &&
      (currentRating === "likely_safe" || currentRating === "verified_safe")
    ) {
      newRating = "uncertain";
    }

    if (newRating !== currentRating) {
      await db.query(
        "UPDATE campaigns SET safety_rating = ?, reported = ? WHERE id = ?",
        [newRating, true, campaign_id]
      );
    }

    deleteRedisData(`cause:${campaign_id}:type:1`);
    deleteRedisData(`cause:${campaign_id}:type:0`);
    deleteRedisData("featured");

    return NextResponse.json(
      {
        message: "Report successful",
        safety_rating: newRating,
        rating_changed: newRating !== currentRating,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to report" }, { status: 500 });
  }
}
