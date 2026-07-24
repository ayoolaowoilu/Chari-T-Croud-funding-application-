import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/DBschema';
import { rateLimit, clientIp } from '@/app/lib/rateLimit';

/**
 * POST /api/newsletter/subscribe
 * Body: { email: string }
 *
 * Inserts the email into the `newsletter_subscribers` table.
 * Idempotent — re-subscribing a known email just updates `subscribed_at`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Rate-limit: 5 subscribe attempts per IP per 10 minutes
    const ip = clientIp(request);
    const rl = await rateLimit({ key: `newsletter:${ip}`, limit: 5, windowSeconds: 600 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests — please try again later' },
        { status: 429 },
      );
    }

    // Ensure the table exists (safe for first run / demo)
    await db.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);

    await db.query(
      `INSERT INTO newsletter_subscribers (email, is_active)
       VALUES (?, TRUE)
       ON DUPLICATE KEY UPDATE is_active = TRUE, subscribed_at = CURRENT_TIMESTAMP`,
      [email],
    );

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });
  } catch (_error) {
    console.error('Newsletter subscribe error:', _error);
    return NextResponse.json({ error: 'Something went wrong — please try again' }, { status: 500 });
  }
}
