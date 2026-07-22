import db from '@/app/lib/DBschema';

export async function POST(request: Request) {
  try {
    const { id, name, details, goal, category, date_to_completion } = await request.json();

    if (!id || !name || !details || !goal || !category || !date_to_completion) {
      return new Response(JSON.stringify({ error: 'fields are required' }), { status: 400 });
    } else {
      await db.query(
        `UPDATE campaigns SET name = ?, details = ?, goal = ?, category = ?, date_to_completion = ? WHERE id = ?`,
        [name, details, goal, category, date_to_completion, id],
      );
      return new Response(JSON.stringify({ message: 'Cause updated successfully' }), {
        status: 200,
      });
    }
  } catch (_error) {
    console.log(_error);
    return new Response(JSON.stringify({ error: 'Unable to update cause' }), { status: 500 });
  }
}
