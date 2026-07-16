import db from "@/app/lib/DBschema";
import { NextRequest, NextResponse } from "next/server";

/**
 * Validates that a user owns a center and that the center is verified
 * before allowing center-linked campaign creation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, user_email, name } = body as {
      id?: number;
      user_email?: string | null;
      name?: string | null;
    };

    if (!id || !user_email) {
      return NextResponse.json(
        { error: "Missing center id or user email", ok: false },
        { status: 400 }
      );
    }

    const [users]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [user_email]
    );

    if (!users?.length) {
      return NextResponse.json(
        { error: "User not found", ok: false },
        { status: 404 }
      );
    }

    const [centers]: any = await db.query(
      "SELECT id, name, user_id, is_verified_status FROM centers WHERE id = ?",
      [id]
    );

    if (!centers?.length) {
      return NextResponse.json(
        { error: "Center not found", ok: false },
        { status: 404 }
      );
    }

    const center = centers[0];

    if (Number(center.user_id) !== Number(users[0].id)) {
      return NextResponse.json(
        { error: "You do not own this center", ok: false },
        { status: 403 }
      );
    }

    if (center.is_verified_status !== "verified") {
      return NextResponse.json(
        {
          error: "Center must be verified before creating campaigns",
          ok: false,
          status: center.is_verified_status,
        },
        { status: 403 }
      );
    }

    if (name && center.name && name !== center.name) {
      // soft check — still allow if IDs match
    }

    return NextResponse.json({
      ok: true,
      center: {
        id: center.id,
        name: center.name,
        is_verified_status: center.is_verified_status,
      },
    });
  } catch (error) {
    console.error("verify/center:", error);
    return NextResponse.json(
      { error: "Internal server error", ok: false },
      { status: 500 }
    );
  }
}
