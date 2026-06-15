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

       const updateDonationForCenters =async() =>{
           const [center]:any =await db.query("SELECT recieved , total_donators FROM centers WHERE id = ?",[body.center_id])
      const newrecieved = Number(center[0].recieved) + Number(body.amount)
      const oldDonators = Number(center[0].total_donators) || 0 
      if(!center){
             return NextResponse.json(
        { error: "Center not found" },
        { status: 404 }
      ); 
      }
if(body.center_id){
      await db.query("UPDATE centers SET recieved = ? , total_donators = ? WHERE id = ?",[newrecieved , oldDonators + 1 , body.center_id])
}



    }
    

const updateTransacts1st = async() =>{
  const [resp]:any = await db.query("SELECT id , donations FROM users WHERE email = ?",[body.email])

     const id = body.isAuthed ? ( resp[0].id || null) : null;
    

      const payer_donations = Number(resp[0].donations) + Number(body.amount);

          await db.query(
        "UPDATE users SET donations = ? WHERE id = ?",
        [payer_donations, resp[0].id]
      );

     await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , _to , user_id_from ) VALUES (?, ?, ?, ? , ? , ?)",
         [body.center_id , body.amount , body.donor_name || "unknown" , body.transaction_id , "center" , id]
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount , paid_to , payer_id) VALUES (?, ?, ? , ? , ?)",
        [body.transaction_id  , body.center_id , body.amount , "center" , id]
      );

    

}
      if(body.center_id && !body.campaign_id){
         updateDonationForCenters()
         updateTransacts1st()

         return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
      }
       const [campaign]: any = await db.query(
      "SELECT raised, id, user_id, donation_count, donors, goal,center_id,reported FROM campaigns WHERE id = ?",
      [body.campaign_id]
    );

    if (!campaign && !body.center_id) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }
    const raised = Number(campaign[0].raised) + Number(body.amount);
    const donationCount = Number(campaign[0].donation_count) + 1;

 

   const [owner_details]: any = await db.query(
      body.center_id ?   "SELECT id, recieved FROM centers WHERE id = ?" :   "SELECT id, recieved FROM users WHERE id = ?",
      [campaign[0].user_id || campaign.center_id]
    );

    if (!owner_details || owner_details.length === 0) {
      return NextResponse.json(
        { message: "Campaign owner or center not found" },
        { status: 404 }
      );
    }

    const recieved = Number(owner_details[0].recieved) + Number(body.amount);
    const donated_rate = Math.floor((raised / campaign[0].goal) * 100);




if(!body.center_id){
    
    await db.query(
      "UPDATE users SET recieved = ? WHERE id = ?",
      [recieved, owner_details[0].id]
    );
}else{
  updateDonationForCenters()
}

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
      if(campaign[0].reported){
          return  await db.query(
          "UPDATE campaigns SET raised = ?, donation_count = ?, donors = ?  WHERE id = ?",
          [raised, donationCount, JSON.stringify(donors), body.campaign_id]
        );
      }

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
  
  let donationProps;
  let transactionProps;

  if(body.center_id){
     donationProps =   [body.center_id, body.amount, "Unknown", body.transaction_id , "center"]
     transactionProps =  [body.transaction_id, body.center_id, body.amount , "center"]
  }else{
     donationProps =   [campaign[0].user_id, body.amount, "Unknown", body.transaction_id , "normal"]
     transactionProps =  [body.transaction_id, campaign[0].user_id, body.amount , "normal"]
  }

  
      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , _to) VALUES (?, ?, ?, ? , ?)",
         donationProps
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount , paid_to) VALUES (?, ?, ? , ?)",
       transactionProps
      );

      return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
    }

  
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
 
  let donationProps;
  let transactionProps;

  if(body.center_id){
     donationProps =   [body.center_id, body.amount, payer_details[0].full_name, body.transaction_id , payer_details[0].id , "center"]
     transactionProps =    [body.transaction_id,body.center_id, body.amount, payer_details[0].id , "center"]
  }else{
     donationProps =   [campaign[0].user_id, body.amount, payer_details[0].full_name, body.transaction_id , payer_details[0].id , "normal"]
     transactionProps =   [body.transaction_id, campaign[0].user_id, body.amount, payer_details[0].id , "normal"]
  }

      await db.query(
        "UPDATE users SET donations = ? WHERE id = ?",
        [payer_donations, payer_details[0].id]
      );
      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , user_id_from , _to) VALUES (?, ?, ?, ? , ? , ?)",
         donationProps
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount, payer_id , paid_to) VALUES (?, ?, ?, ? , ?)",
       transactionProps
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
 

  let donationProps;
  let transactionProps;

  if(body.center_id){
     donationProps =   [body.center_id, body.amount, payer_details[0].full_name, body.transaction_id , payer_details[0].id , "center"]
     transactionProps =    [body.transaction_id,body.center_id, body.amount, payer_details[0].id , "center"]
  }else{
     donationProps =   [campaign[0].user_id, body.amount, payer_details[0].full_name, body.transaction_id , payer_details[0].id , "normal"]
     transactionProps =   [body.transaction_id, campaign[0].user_id, body.amount, payer_details[0].id , "normal"]
  }

      await db.query(
        "UPDATE users SET donations = ? WHERE id = ?",
        [payer_donations, payer_details[0].id]
      );
      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , user_id_from , _to) VALUES (?, ?, ?, ? , ?,?)",
        donationProps
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount, payer_id , paid_to) VALUES (?, ?, ?, ? , ?)",
       transactionProps
      );

      return NextResponse.json(
        { message: "Donation successful" },
        { status: 200 }
      );
    }


    if (!body.isAuthed && !body.isBlind) {
  
        const donors = buildDonors(body.donor_name as string);
      await updateCampaign(donors);
 

  let donationProps;
  let transactionProps;

  if(body.center_id){
     donationProps =      [body.center_id, body.amount, body.donor_name, body.transaction_id , "center"]
     transactionProps =      [body.transaction_id, body.center_id, body.amount , "center"]
  }else{
     donationProps =     [campaign[0].user_id, body.amount, body.donor_name, body.transaction_id , "normal"]
     transactionProps =    [body.transaction_id, campaign[0].user_id, body.amount , "normal"]
  }
      await db.query(
        "INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id , _to) VALUES (?, ?, ?, ? , ?)",
       donationProps
      );
      await db.query(
        "INSERT INTO transactions (refrence, owner_id, ammount  , paid_to) VALUES (?, ?, ? , ?)",
  transactionProps  
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