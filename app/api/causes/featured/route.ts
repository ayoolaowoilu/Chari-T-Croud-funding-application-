import { queryWithRetry } from '@/app/lib/DBschema';
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [data] = await queryWithRetry<RowDataPacket[]>(
      `SELECT 
        main_img, details, donation_count, goal, raised, category, 
        name, id, center_name, center_id, location, 
        date_to_completion, safety_rating, currency
      FROM campaigns 
      WHERE CAST(date_to_completion AS UNSIGNED) > ?
        AND goal <> raised 
      ORDER BY RAND() 
      LIMIT 3`,
      [Date.now()],
    );

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    console.error('featured causes:', code || error);

    // Soft-fail for the landing page: empty list > hard 500 UI break
    if (code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'ECONNREFUSED') {
      return NextResponse.json(
        {
          error: 'Database temporarily unavailable',
          code,
          data: [],
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: 'Internal Server error' }, { status: 500 });
  }
}
