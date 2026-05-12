




import { NextRequest, NextResponse } from 'next/server'
import db from '@/app/lib/DBschema'
import { CenterRegistrationPayload } from '@/app/lib/types'

interface props extends CenterRegistrationPayload  {
     type:string , id:number
}

export async function POST(request: NextRequest) {

  try {
    const body:props = await request.json()

    const requiredFields = [
      'name', 'registration_number', 'email', 'phone',
      'address', 'website', 'about', 'geo_location', 'bank_details','email'
    ]

    for (const field of requiredFields) {
      if (!body[field as keyof CenterRegistrationPayload]) {
        console.log(field,"required")
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 200 }
        )
      }
    }

  

   
    const bank = body.bank_details
    const requiredBankFields = [
      'account_name', 'account_number', 'bank_name',
      'bank_code',  'subAccountCode'
    ]

    for (const field of requiredBankFields) {
      if (!bank[field as keyof typeof bank]) {
         console.log(field,"required")
        return NextResponse.json(
          { error: `bank_details.${field} is required` },
          { status: 200 }
        )
      }
    }


    if (!body.verification_documents || body.verification_documents.length === 0) {
         console.log("docs","required")
      return NextResponse.json(
        { error: 'At least one verification document is required' },
        { status: 200 }
      )
    }

   
    if (!body.logourl) {
         console.log("logo","required")
      return NextResponse.json(
        { error: 'Logo is required' },
        { status: 200 }
      )
    }



 if(body.type == "EDIT"){
       
   await  db.query(
     "UPDATE centers SET name = ? , registration_number = ? , email = ? , phone = ? , address = ? , website = ? , about = ? , logourl = ? , geo_location = ?, bank_details = ? , verification_documents = ? WHERE id = ?"
     ,[
        body.name,
        body.registration_number,
        body.email,
        body.phone,
        body.address,
        body.website,
        body.about,
        body.logourl,
        body.geo_location,
        JSON.stringify(body.bank_details),
        JSON.stringify(body.verification_documents),
        body.id

     ]
   )

    
    return NextResponse.json(
      {
        success: true,
        message: 'Center registered successfully',
        data: {
          name: body.name,
          registration_number: body.registration_number,
          is_verified_status: body.is_verified_status
        }
      },
      { status: 201 }
    )
 }else{
    const [row]:any = await db.query("SELECT id FROM users WHERE email = ?",[body.userEmail])

    

    const userID = row[0].id
   const [centerResult]: any = await db.query(
      `INSERT INTO centers (
        name, registration_number, email, phone, address,
        website, is_verified_status, about, logourl,
        geo_location, bank_details , verification_documents , user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)`,
      [
        body.name,
        body.registration_number,
        body.email,
        body.phone,
        body.address,
        body.website,
        body.is_verified_status,
        body.about,
        body.logourl,
        body.geo_location,
        JSON.stringify(body.bank_details),JSON.stringify(body.verification_documents),userID
      ]
    )

   

    const centerId = centerResult.insertId

    
    return NextResponse.json(
      {
        success: true,
        message: 'Center registered successfully',
        data: {
          id: centerId,
          name: body.name,
          registration_number: body.registration_number,
          is_verified_status: body.is_verified_status
        }
      },
      { status: 201 }
    )
   
 }
 
    
   
  


  } catch (error: any) {
  
   

    console.error('Center registration error:', error)

   
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Registration number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )

  } 
}