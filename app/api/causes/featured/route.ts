import db from "@/app/lib/DBschema";
import { NextResponse } from "next/server";


export async function GET(){
        
    try{
         const [data]:any =await db.query(
   `        SELECT 
  main_img, details, donation_count, goal, raised, category, 
  name, id, center_name, center_id, location, 
  date_to_completion, safety_rating 
FROM campaigns 
WHERE date_to_completion > ${Date.now()}
  AND goal <> raised 
ORDER BY RAND() 
LIMIT 3`
        )


        return NextResponse.json(
           data,
            {status:200}
        )
    }catch(error){
         console.log(error)
          return NextResponse.json(
     {error:"Internal Server error"},
            {status:500}
        )
    }
}