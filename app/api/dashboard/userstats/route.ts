import db from '@/app/lib/DBschema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 200 });
  }

  try {
    const [row1]: any = await db.query('SELECT * FROM users WHERE email = ? ', [email]);

    const userId = row1[0].id;

    const [row]: any = await db.query(
      'SELECT COUNT(*) as count FROM campaigns WHERE user_id = ? AND raised = goal AND raised > 0',
      [userId],
    );

    const [row2]: any = await db.query(
      `SELECT COUNT(*) as count FROM campaigns WHERE user_id = ?  AND date_to_completion > ${Date.now()}`,
      [userId],
    );

    const [row3]: any = await db.query(
      `SELECT COUNT(*) as count FROM campaigns WHERE user_id = ? AND date_to_completion < ${Date.now()}`,
      [userId],
    );
    const [row4]: any = await db.query(
      `SELECT COUNT(*) as count FROM campaigns WHERE user_id = ?`,
      [userId],
    );

    const perfectData = {
      userData: row1[0],
      fundedCampaigns: row[0].count,
      activeCampaigns: row2[0].count - row[0].count,
      dueCampaigns: row3[0].count,
      totalCampaigns: row4[0].count,
    };

    return NextResponse.json(perfectData, { status: 200 });
  } catch (_error) {
    console.log(_error);
    return NextResponse.json(
      { error: 'Internal server error', regxp: String(_error) },
      { status: 500 },
    );
  }
}
