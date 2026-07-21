import db from '@/app/lib/DBschema';
import { requireAdmin } from '@/app/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [row]: any = await db.query('SELECT COUNT(*) as count FROM users');

    const [row1]: any = await db.query('SELECT COUNT(*) as count FROM centers');

    const [row2]: any = await db.query('SELECT COUNT(*) as count FROM campaigns');

    const [row3]: any = await db.query(
      'SELECT COUNT(*) as count FROM campaigns WHERE goal <= raised',
    );

    const [row4]: any = await db.query(
      'SELECT COUNT(*) as count FROM campaigns WHERE date_to_completion > ? ',
      [Date.now()],
    );

    const [row5]: any = await db.query('SELECT COUNT(*) as count FROM transactions');

    const [row6]: any = await db.query('SELECT COUNT(*) as count FROM campaigns WHERE reports > 0');

    return NextResponse.json(
      {
        totalUsers: row[0].count,
        totalCenters: row1[0].count,
        all_time_campaigns: row2[0].count,
        funded_campaigns: row3[0].count,
        due_campaigns: row4[0].count,
        all_time_transactions: row5[0].count,
        reported_campaigns: row6[0].count,
      },
      { status: 200 },
    );
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        error: 'Error fetching data',
      },
      { status: 500 },
    );
  }
}
