import db from "@/app/lib/DBschema";






export async function POST(request:Request){
    

        const data = await request.json()

        try{
              await db.query(`UPDATE users SET bank_details = ? WHERE email = ? `,[JSON.stringify(data), data.email])
              return new Response(JSON.stringify({message:"Bank details updated successfully"}),{status:200})
        }catch(error){
            console.log(error)
              return new Response(JSON.stringify({error:"Unable to update bank details"}),{status:500})
         }
}