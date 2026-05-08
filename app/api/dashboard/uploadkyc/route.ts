import db from "@/app/lib/DBschema";
import { kycPayload } from "@/app/lib/fetchRequests";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){
        const body:kycPayload = await request.json()

        try{
             const [row1]:any = await db.query("SELECT id FROM users WHERE email = ?" , [body.email])
             const userid = row1[0].id 

            await db.query(
  `INSERT INTO kyc (
    user_id, full_name, date_of_birth, phone,
    address_line, city, state,
    document_type, document_number, document_url, document_public_id,
    status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
  ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    date_of_birth = VALUES(date_of_birth),
    phone = VALUES(phone),
    address_line = VALUES(address_line),
    city = VALUES(city),
    state = VALUES(state),
    document_type = VALUES(document_type),
    document_number = VALUES(document_number),
    document_url = VALUES(document_url),
    document_public_id = VALUES(document_public_id),
    status = 'pending',
    created_at = NOW()`,
  [
   userid,body.formData.fullName,body.formData.dateOfBirth,body.formData.phone,body.formData.address,body.formData.city,body.formData.state,body.formData.documentType,body.formData.documentNumber,body.documentUrl,Math.floor(Math.random() * 7888888722)
  ]
);
await db.query("UPDATE users SET is_Verified = ? WHERE id = ?",[1,userid])

  return NextResponse.json(
       {message:"Successfully uploaded kyc"},
       {status:200}
  )
        }catch(error){
            console.log(error)
               return NextResponse.json(
       {error:"Error uploading KYC"},
       {status:500}
  )
        }
}