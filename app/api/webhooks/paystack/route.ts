import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { recordVerifiedDonation } from "@/app/lib/recordDonation";

/**
 * Paystack charge.success webhook.
 * Configure in Paystack dashboard → Settings → Webhooks:
 *   https://<your-domain>/api/webhooks/paystack
 *
 * Optional env: PAYSTACK_SECRET_KEY (preferred) or NEXT_PUBLIC_PAYSTACK_SECRET_KEY
 */
function getSecret(): string {
  return (
    process.env.PAYSTACK_SECRET_KEY ||
    process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY ||
    ""
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";

    const secret = getSecret();
    if (!secret) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        amount?: number;
        customer?: { email?: string };
        metadata?: {
          campaign_id?: string | number;
          center_id?: string | number;
          isBlind?: boolean | string;
          platform_fee?: number | string;
          donor_name?: string;
          custom_fields?: Array<{
            variable_name?: string;
            value?: string;
          }>;
        };
      };
    };

    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const data = event.data;
    if (!data?.reference) {
      return NextResponse.json({ error: "No reference" }, { status: 400 });
    }

    const meta = data.metadata || {};
    const fields = meta.custom_fields || [];
    const field = (name: string) =>
      fields.find((f) => f.variable_name === name)?.value;

    const campaign_id = Number(
      meta.campaign_id || field("campaign_id") || 0
    ) || null;
    const center_id = meta.center_id || field("center_id") || null;
    const platform_fee = Number(meta.platform_fee || field("platform_fee") || 0);
    const isBlind =
      meta.isBlind === true ||
      meta.isBlind === "true" ||
      field("is_blind") === "true";

    const result = await recordVerifiedDonation({
      transaction_id: data.reference,
      campaign_id,
      center_id,
      email: data.customer?.email,
      isAuthed: Boolean(data.customer?.email),
      isBlind,
      platform_fee,
      donor_name: meta.donor_name || field("donor_name") || "Guest",
    });

    if (!result.ok && result.status !== 402) {
      // Still 200 to Paystack for permanent failures we already know about
      // so they stop retrying incorrectly — except verification issues
      console.error("Webhook record failed:", result);
    }

    return NextResponse.json({
      received: true,
      ok: result.ok,
      message: result.message,
      duplicate: result.ok ? result.duplicate : false,
    });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
