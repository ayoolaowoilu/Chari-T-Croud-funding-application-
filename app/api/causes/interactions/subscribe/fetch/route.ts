import db from '@/app/lib/DBschema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const campaign_id = request.nextUrl.searchParams.get('id');
  const page = parseInt(request.nextUrl.searchParams.get('page') || '0');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

  if (!campaign_id) {
    return NextResponse.json({ error: 'campaign id is required' }, { status: 400 });
  }

  try {
    const [countResult]: any = await db.query(
      'SELECT COUNT(*) as total FROM subscribed_campaign WHERE campaign_id = ?',
      campaign_id,
    );
    const total_count = countResult[0]?.total || 0;

    const offset = page * limit;
    const [rows]: any = await db.query(
      'SELECT * FROM subscribed_campaign WHERE campaign_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [campaign_id, limit, offset],
    );

    const subscribed = rows || [];

    return NextResponse.json(
      {
        subscribed,
        total_count,
        page,
        limit,
        has_more: offset + subscribed.length < total_count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
