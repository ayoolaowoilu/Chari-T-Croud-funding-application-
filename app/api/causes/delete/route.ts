import db from "@/app/lib/DBschema"


export async function POST(request: Request) {
    try {
        const { id } = await request.json()

            await db.query(`DELETE FROM campaigns WHERE id = ?`, [id])
            return new Response(JSON.stringify({message:"Cause deleted successfully"}), { status: 200 })
    }catch (error) {
        console.log(error)
        return new Response(JSON.stringify({error:"Unable to delete cause"}), { status: 500 })
    }}
