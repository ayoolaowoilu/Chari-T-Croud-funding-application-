import db from '@/app/lib/DBschema';
import { Campaign } from '@/app/lib/types';
import { deleteRedisData } from '@/app/lib/redis';
import { verifyTransaction } from '@/app/lib/paystack';

export type DonationInput = {
  campaign_id?: number | null;
  center_id?: number | string | null;
  isAuthed?: boolean;
  email?: string | null;
  isBlind?: boolean;
  donor_name?: string | null;
  message?: string | null;
  transaction_id: string;
  /** Optional tip in major currency unit (e.g. naira). Deducted from verified total for campaign credit. */
  platform_fee?: number;
};

export type DonationResult =
  | { ok: true; duplicate?: boolean; amount?: number; message: string }
  | { ok: false; status: number; message: string; error?: string };

function invalidateCampaignCache(campaignId?: number | string | null) {
  if (!campaignId) return;
  deleteRedisData(`campaign:${campaignId}:type1`);
  deleteRedisData(`campaign:${campaignId}:type2`);
  deleteRedisData(`cause:${campaignId}:type:1`);
  deleteRedisData(`cause:${campaignId}:type:0`);
  deleteRedisData(`cause:${campaignId}:type:2`);
  deleteRedisData('featured:random');
  deleteRedisData('featured');
}

async function updateDonationForCenters(centerId: number | string, donationAmount: number) {
  const [center]: any = await db.query('SELECT recieved FROM centers WHERE id = ?', [centerId]);
  if (!center?.length) {
    throw new Error('Center not found');
  }
  const newReceived = Number(center[0].recieved || 0) + donationAmount;
  try {
    await db.query(
      'UPDATE centers SET recieved = ?, total_donators = COALESCE(total_donators, 0) + 1 WHERE id = ?',
      [newReceived, centerId],
    );
  } catch {
    await db.query('UPDATE centers SET recieved = ? WHERE id = ?', [newReceived, centerId]);
  }
  deleteRedisData(`center:${centerId}`);
  deleteRedisData(`center:${centerId}:type2`);
}

/**
 * Verifies a Paystack charge and records the donation once.
 * Safe to call from the client callback route or a Paystack webhook.
 */
export async function recordVerifiedDonation(input: DonationInput): Promise<DonationResult> {
  if (!input.transaction_id) {
    return { ok: false, status: 400, message: 'Missing payment reference' };
  }

  const [existing]: any = await db.query('SELECT id FROM transactions WHERE refrence = ? LIMIT 1', [
    input.transaction_id,
  ]);
  if (existing?.length) {
    return {
      ok: true,
      duplicate: true,
      message: 'Donation already recorded',
    };
  }

  let verified;
  try {
    verified = await verifyTransaction(input.transaction_id);
  } catch (_err) {
    return {
      ok: false,
      status: 402,
      message: 'Payment verification failed',
      error: (_err as Error).message,
    };
  }

  const verifiedNaira = Math.round(Number(verified.amount) / 100);
  const tip = Math.max(0, Number(input.platform_fee) || 0);
  const donationAmount = Math.max(1, verifiedNaira - tip);
  const email = input.email || verified.customer?.email || undefined;
  const isBlind = Boolean(input.isBlind);
  const isAuthed = Boolean(input.isAuthed);

  // Metadata from Paystack custom fields when webhook has no body from us
  const meta = (verified as { metadata?: Record<string, unknown> }).metadata || {};

  const campaignId =
    input.campaign_id ?? (meta.campaign_id ? Number(meta.campaign_id) : null) ?? null;
  const centerIdInput = input.center_id ?? (meta.center_id != null ? String(meta.center_id) : null);

  // Direct center donation
  if (centerIdInput && !campaignId) {
    await updateDonationForCenters(centerIdInput, donationAmount);

    let payerId: number | null = null;
    if (isAuthed && email) {
      const [resp]: any = await db.query('SELECT id, donations FROM users WHERE email = ?', [
        email,
      ]);
      if (resp?.length) {
        payerId = resp[0].id;
        await db.query('UPDATE users SET donations = ? WHERE id = ?', [
          Number(resp[0].donations || 0) + donationAmount,
          payerId,
        ]);
      }
    }

    await db.query(
      'INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id, _to, user_id_from) VALUES (?, ?, ?, ?, ?, ?)',
      [
        centerIdInput,
        donationAmount,
        isBlind ? 'Unknown' : input.donor_name || 'unknown',
        input.transaction_id,
        'center',
        payerId,
      ],
    );
    await db.query(
      'INSERT INTO transactions (refrence, owner_id, ammount, paid_to, payer_id) VALUES (?, ?, ?, ?, ?)',
      [input.transaction_id, centerIdInput, donationAmount, 'center', payerId],
    );

    return {
      ok: true,
      amount: donationAmount,
      message: 'Donation successful',
    };
  }

  if (!campaignId) {
    return {
      ok: false,
      status: 400,
      message: 'Missing campaign_id',
      error: 'Missing campaign_id',
    };
  }

  const [campaign]: any = await db.query(
    'SELECT raised, id, user_id, donation_count, donors, goal, center_id, reported FROM campaigns WHERE id = ?',
    [campaignId],
  );

  if (!campaign?.length) {
    return {
      ok: false,
      status: 404,
      message: 'Campaign not found',
      error: 'Campaign not found',
    };
  }

  const cam = campaign[0];
  const raised = Number(cam.raised || 0) + donationAmount;
  const donationCount = Number(cam.donation_count || 0) + 1;
  const centerId = centerIdInput || cam.center_id || null;

  if (centerId) {
    await updateDonationForCenters(centerId, donationAmount);
  } else if (cam.user_id) {
    const [owner]: any = await db.query('SELECT id, recieved FROM users WHERE id = ?', [
      cam.user_id,
    ]);
    if (owner?.length) {
      await db.query('UPDATE users SET recieved = ? WHERE id = ?', [
        Number(owner[0].recieved || 0) + donationAmount,
        owner[0].id,
      ]);
    }
  }

  const buildDonors = (name: string) => {
    const newDonor = {
      name,
      amount: donationAmount,
      message: input.message,
    };
    if (!cam.donors) return [newDonor];
    const existing = typeof cam.donors === 'string' ? JSON.parse(cam.donors) : cam.donors;
    return Array.isArray(existing) ? [...existing, newDonor] : [newDonor];
  };

  const updateCampaign = async (donors: unknown[]) => {
    const goal = Number(cam.goal) || 1;
    const donatedRate = Math.floor((raised / goal) * 100);

    if (cam.reported) {
      await db.query(
        'UPDATE campaigns SET raised = ?, donation_count = ?, donors = ? WHERE id = ?',
        [raised, donationCount, JSON.stringify(donors), campaignId],
      );
      return;
    }

    if (donatedRate > 50 || donationCount > 5) {
      await db.query(
        'UPDATE campaigns SET raised = ?, donation_count = ?, donors = ?, safety_rating = ? WHERE id = ?',
        [
          raised,
          donationCount,
          JSON.stringify(donors),
          'likely_safe' as Campaign['safety_rating'],
          campaignId,
        ],
      );
    } else {
      await db.query(
        'UPDATE campaigns SET raised = ?, donation_count = ?, donors = ? WHERE id = ?',
        [raised, donationCount, JSON.stringify(donors), campaignId],
      );
    }
  };

  const paidTo = centerId ? 'center' : 'normal';
  const ownerId = centerId || cam.user_id;

  let payerId: number | null = null;
  let displayName = 'Guest';

  if (isBlind) {
    displayName = 'Unknown';
    if (isAuthed && email) {
      const [payer]: any = await db.query('SELECT id, donations FROM users WHERE email = ?', [
        email,
      ]);
      if (payer?.length) {
        payerId = payer[0].id;
        await db.query('UPDATE users SET donations = ? WHERE id = ?', [
          Number(payer[0].donations || 0) + donationAmount,
          payerId,
        ]);
      }
    }
  } else if (isAuthed && email) {
    const [payer]: any = await db.query(
      'SELECT id, donations, full_name FROM users WHERE email = ?',
      [email],
    );
    if (!payer?.length) {
      return {
        ok: false,
        status: 404,
        message: 'Payer not found',
        error: 'Payer not found',
      };
    }
    payerId = payer[0].id;
    displayName = payer[0].full_name || input.donor_name || 'Donor';
    await db.query('UPDATE users SET donations = ? WHERE id = ?', [
      Number(payer[0].donations || 0) + donationAmount,
      payerId,
    ]);
  } else {
    displayName = input.donor_name || 'Guest';
  }

  const donors = buildDonors(displayName);
  await updateCampaign(donors);

  await db.query(
    'INSERT INTO donations (to_user_or_centerId, ammount, name, transaction_id, user_id_from, _to) VALUES (?, ?, ?, ?, ?, ?)',
    [ownerId, donationAmount, displayName, input.transaction_id, payerId, paidTo],
  );
  await db.query(
    'INSERT INTO transactions (refrence, owner_id, ammount, payer_id, paid_to) VALUES (?, ?, ?, ?, ?)',
    [input.transaction_id, ownerId, donationAmount, payerId, paidTo],
  );

  invalidateCampaignCache(campaignId);

  return {
    ok: true,
    amount: donationAmount,
    message: 'Donation successful',
  };
}
