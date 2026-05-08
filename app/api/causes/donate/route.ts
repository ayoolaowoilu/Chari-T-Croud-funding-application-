import db from "@/app/lib/DBschema";
import { uDonate } from "@/app/lib/fetchRequests";
import { Campaign } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: uDonate = await request.json();

    
    if (!body.amount || Number(body.amount) <= 0) {
      return NextResponse.json(
        { message: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const [campaign]: any = await db.query(
      "SELECT raised, id, user_id, donation_count, donors, goal,center_id FROM campaigns WHERE id = ?",
      [body.campaign_id]
    );

    if (!campaign || campaign.length === 0) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    const raised = Number(campaign[0].raised) + Number(body.amount);
    const donationCount = Number(campaign[0].donation_count) + 1;

    const [owner_details]: any = await db.query(
      "SELECT id, recived FROM users WHERE id = ?",
      [campaign[0].user_id]
    );

    if (!owner_details || owner_details.length === 0) {
      return NextResponse.json(
        { message: "Campaign owner not found" },
        { status: 404 }
      );
    }

    const recived = Number(owner_details[0].recived) + Number(body.amount);


    const donated_rate = Math.floor((raised / campaign[0].goal) * 100);

    await db.query(
      "UPDATE users SET recived = ? WHERE id = ?",
      [recived, owner_details[0].id]
    );

    const buildDonors = (name: string) => {
      const newDonor = { name, amount: body.amount, message: body.message };
      if (!campaign[0].donors) {
        return [newDonor];
      }
      const existing = typeof campaign[0].donors === "string"
        ? JSON.parse(campaign[0].donors)
        : campaign[0].donors;
      return [...existing, newDonor];
    };


    const updateCampaign = async (donors: any[]) => {

      if (donated_rate > 50) {
        await db.query(
          "UPDATE campaigns SET raised = ?, donation_count = ?, donors = ?, safety_rating = ? WHERE id = ?",
          [raised, donationCount, JSON.stringify(donors), "verified_safe" as Campaign["safety_rating"], body.campaign_id]
        );
      } else if (donationCount > 5) {
        await db.query(
          "UPDATE campaigns SET raised = ?, donation_count = ?, donors = ?, safety_rating = ? WHERE id = ?",
          [raised, donationCount, JSON.stringify(donors), "likely_safe" as Campaign["safety_rating"], body.campaign_id]
        );
      } else {
        await db.query(
          "UPDATE campaigns SET raised = ?, donation_count = ?, donors = ? WHERE id = ?",
          [raised, donationCount, JSON.stringify(donors), body.campaign_id]
        );
      }
    };

   
    if (!body.isAuthed && body.isBlind) {
      const donors = buildDonors("Unknown");
      await updateCampaign(donors);

      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id) VALUES (?, ?, ?, ?)",
        [campaign[0].user_id, body.amount, "Unknown", body.transaction_id]
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount) VALUES (?, ?, ?)",
        [body.transaction_id, campaign[0].user_id, body.amount]
      );

      return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
    }

    // Case 2: Authed + Blind
    if (body.isAuthed && body.isBlind) {
      const [payer_details]: any = await db.query(
        "SELECT id, donations FROM users WHERE email = ?",
        [body.email]
      );

      if (!payer_details || payer_details.length === 0) {
        return NextResponse.json(
          { message: "Payer not found" },
          { status: 404 }
        );
      }

      const payer_donations = Number(payer_details[0].donations) + Number(body.amount);
      const donors = buildDonors("Unknown");
      await updateCampaign(donors);

      await db.query(
        "UPDATE users SET donations = ? WHERE id = ?",
        [payer_donations, payer_details[0].id]
      );
      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , user_id_from) VALUES (?, ?, ?, ? , ?)",
        [campaign[0].center_id || campaign[0].user_id, body.amount, payer_details[0].full_name, body.transaction_id , payer_details[0].id]
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount, payer_id) VALUES (?, ?, ?, ?)",
        [body.transaction_id, campaign[0].user_id, body.amount, payer_details[0].id]
      );



      return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
    }

    
    if (body.isAuthed && !body.isBlind) {
      const [payer_details]: any = await db.query(
        "SELECT id, donations, full_name FROM users WHERE email = ?",
        [body.email]
      );

      if (!payer_details || payer_details.length === 0) {
        return NextResponse.json(
          { message: "Payer not found" },
          { status: 404 }
        );
      }

      const payer_donations = Number(payer_details[0].donations) + Number(body.amount);
      const donors = buildDonors(payer_details[0].full_name);
      await updateCampaign(donors);

      await db.query(
        "UPDATE users SET donations = ? WHERE id = ?",
        [payer_donations, payer_details[0].id]
      );
      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , user_id_from) VALUES (?, ?, ?, ? , ?)",
        [campaign[0].center_id || campaign[0].user_id, body.amount, payer_details[0].full_name, body.transaction_id , payer_details[0].id]
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount, payer_id) VALUES (?, ?, ?, ?)",
        [body.transaction_id, campaign[0].user_id, body.amount, payer_details[0].id]
      );

      return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
    }


    if (!body.isAuthed && !body.isBlind) {
      const donors = buildDonors(body.donor_name as string);
      await updateCampaign(donors);

      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id) VALUES (?, ?, ?, ?)",
        [campaign[0].user_id, body.amount, body.donor_name, body.transaction_id]
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount) VALUES (?, ?, ?)",
        [body.transaction_id, campaign[0].user_id, body.amount]
      );

      return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid donation state" },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}