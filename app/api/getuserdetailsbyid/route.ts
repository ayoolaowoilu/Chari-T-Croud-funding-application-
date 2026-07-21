import db from '@/app/lib/DBschema';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  const is_center = request.nextUrl.searchParams.get('is_center');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID parameter is required' }), { status: 400 });
  }

  try {
    if (is_center == 'false') {
      const [res]: any = await db.query(
        `SELECT full_name,image,email, recieved,donations,is_verified FROM users WHERE id = ?`,
        [id],
      );
      return new Response(JSON.stringify(res[0]), { status: 200 });
    } else {
      const [res]: any = await db.query(`SELECT name,logourl FROM centers WHERE id = ?`, [id]);
      return new Response(
        JSON.stringify({
          full_name: res[0].name,
          image: res[0].logourl,
        }),
        { status: 200 },
      );
    }
  } catch (_error) {
    console.log(_error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user details' }), { status: 500 });
  }
}
