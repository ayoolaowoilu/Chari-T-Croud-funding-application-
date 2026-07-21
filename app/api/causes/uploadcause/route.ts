import db from '@/app/lib/DBschema';
import { normalizeCategory } from '@/app/lib/categories';
import { deleteRedisData } from '@/app/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      details,
      story,
      goal,
      currency,
      deadline,
      mainImage,
      images,
      user_email,
      _type,
      category,
      location,
      bank_details,
      center_id,
      center_name,
    } = body;

    if (!name || !details || !deadline || !mainImage || !user_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [userid]: any = await db.query('SELECT id FROM users WHERE email = ?', [user_email]);

    if (!userid?.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userid[0].id;
    const safeCategory = normalizeCategory(category);
    const apiBase = process.env.API_URL || process.env.NEXTAUTH_URL || '';

    if (!_type) {
      const [res]: any = await db.query(
        `INSERT INTO campaigns(
          name, details, story, main_img, imgs, goal, user_id,
          date_to_completion, currency, category, location, bank_details
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          name,
          details,
          story || '',
          JSON.stringify(mainImage),
          JSON.stringify(images || []),
          goal || 0,
          userId,
          deadline,
          currency || 'NG',
          safeCategory,
          location || '',
          JSON.stringify(bank_details || {}),
        ],
      );

      deleteRedisData('featured');
      deleteRedisData('featured:random');

      return NextResponse.json(
        {
          msg: 'Successfully Uploaded your cause',
          link: `${apiBase}/causes/cause?id=${res.insertId}`,
          id: res.insertId,
        },
        { status: 200 },
      );
    }

    // Center campaign
    const [res]: any = await db.query(
      `INSERT INTO campaigns(
        name, details, main_img, user_id, date_to_completion,
        center_id, center_name, bank_details, _type, goal, location, category, story, currency
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        name,
        details,
        JSON.stringify(mainImage),
        userId,
        deadline,
        center_id,
        center_name,
        JSON.stringify(bank_details || {}),
        _type,
        goal || 0,
        location || '',
        safeCategory,
        story || '',
        currency || 'NG',
      ],
    );

    // total_campaigns may be missing on older DBs — fail soft
    try {
      await db.query(
        'UPDATE centers SET total_campaigns = COALESCE(total_campaigns, 0) + 1 WHERE id = ?',
        [center_id],
      );
    } catch {
      /* column optional until migration */
    }

    deleteRedisData('featured');
    deleteRedisData(`center:${center_id}`);

    return NextResponse.json(
      {
        msg: 'Successfully Uploaded your cause',
        link: `${apiBase}/dashboard/centers/profile?id=${center_id}`,
        id: res.insertId,
      },
      { status: 200 },
    );
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      { error: 'Internal Server Error', msg: String(_error) },
      { status: 500 },
    );
  }
}
