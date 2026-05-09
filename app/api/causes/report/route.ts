import db from "@/app/lib/DBschema";
import { Campaign } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { _type, campaign_id, message, reporter_name } = await request.json();

  try {
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
      "INSERT INTO reports (report_type, campaign_id, message, reporter_name) VALUES (?, ?, ?, ?)",
      [_type, campaign_id, message, reporter_name]
    );


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
    const currentRating = campaign[0].safety_rating;
    const total = Number(counts.total_reports);
    const fraud = Number(counts.fraud_count);
    const misrepresentation = Number(counts.misrepresentation_count);
    const exploitative = Number(counts.exploitative_count);

    let newRating:Campaign["safety_rating"] = currentRating;

    if (fraud >= 3 || (fraud >= 1 && misrepresentation >= 2)) {
      newRating = "unsafe";
    } else if (fraud >= 1 || misrepresentation >= 3 || (exploitative >= 2 && total >= 4)) {
      newRating = "likely_risky";
    } else if (total >= 5 && (currentRating === "likely_safe" || currentRating === "verified_safe")) {
      newRating = "uncertain";
    } else if (total >= 3 && currentRating === "uncertain") {
      newRating = "likely_risky";
    } else if (total >= 1 && (currentRating === "likely_safe" || currentRating === "verified_safe")) {
     
      newRating = "uncertain";
    }

 
    if (newRating !== currentRating) {
      console.log("updating..")
      await db.query(
        "UPDATE campaigns SET safety_rating = ? , reported = ? WHERE id = ?",
        [newRating,true, campaign_id]
      );
    }

    return NextResponse.json(
      {
        message: "Report successful",
        safety_rating: newRating,
        rating_changed: newRating !== currentRating
      },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to report" },
      { status: 500 }
    );
  }
}