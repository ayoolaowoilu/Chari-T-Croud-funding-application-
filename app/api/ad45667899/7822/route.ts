import db from "@/app/lib/DBschema";


export async function GET(){
     
    try{
     const [row] = await db.query("SELECT COUNT(*) as count FROM users ")
     const [row1] = await db.query("SELECT COUNT(*) as count FROM centers")
    }catch(error){
       
    }
}