import { NextRequest, NextResponse } from 'next/server';
import { recordVerifiedDonation } from '@/app/lib/recordDonation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await recordVerifiedDonation({
      campaign_id: body.campaign_id ? Number(body.campaign_id) : null,
      center_id: body.center_id ?? null,
      isAuthed: Boolean(body.isAuthed),
      email: body.email,
      isBlind: Boolean(body.isBlind),
      donor_name: body.donor_name || body.name,
      message: body.message,
      transaction_id: body.transaction_id,
      platform_fee: Number(body.platform_fee) || 0,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          message: result.message,
          error: result.error || result.message,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        duplicate: result.duplicate || false,
        amount: result.amount,
      },
      { status: 200 },
    );
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: (_error as Error).message,
      },
      { status: 500 },
    );
  }
}
