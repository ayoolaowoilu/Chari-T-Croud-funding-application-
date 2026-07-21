import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import db from './DBschema';

/**
 * Ensures the caller is an authenticated admin.
 * Prefer JWT email + DB role so admin cannot be spoofed from the client alone.
 */
export async function requireAdmin(
  request: NextRequest,
): Promise<{ ok: true; email: string; userId: number } | { ok: false; response: NextResponse }> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const email = token?.email as string | undefined;
    if (!email) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      };
    }

    const [rows] = await db.query('SELECT id, role FROM users WHERE email = ?', [email]);
    const list = rows as Array<{ id: number; role: string }>;

    if (!list?.length || list[0].role !== 'admin') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }

    return { ok: true, email, userId: Number(list[0].id) };
  } catch (_e) {
    console.error('requireAdmin', _e);
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
}
