import db from "@/app/lib/DBschema";
import { NextRequest } from "next/server";


export async function GET(request:NextRequest) {
 const id = request.nextUrl.searchParams.get("id")
    if (!id) {
        return new Response(JSON.stringify({ error: 'ID parameter is required' }), { status: 400 });
    }

    try {
        const [res]:any =await db.query(`SELECT full_name,image FROM users WHERE id = ?`, [id]);
        return new Response(JSON.stringify(res[0]), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: 'Failed to fetch user details' }), { status: 500 });
    }
}