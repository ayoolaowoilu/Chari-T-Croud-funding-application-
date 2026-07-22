import db from '@/app/lib/DBschema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const identity_key = request.nextUrl.searchParams.get('identity_key');
  const campaign_id = request.nextUrl.searchParams.get('campaign_id');

  if (!identity_key || !campaign_id) {
    return NextResponse.json(
      { error: 'identity_key and campaign_id are required' },
      { status: 400 },
    );
  }

  try {
    const [rows]: any = await db.query(
      'SELECT * FROM subscribed_campaign WHERE identity_key = ? AND campaign_id = ? LIMIT 1',
      [identity_key, campaign_id],
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Not subscribed', subscribed: false }, { status: 404 });
    }

    return NextResponse.json({ subscribed: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
