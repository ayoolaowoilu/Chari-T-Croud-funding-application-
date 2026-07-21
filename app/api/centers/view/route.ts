import db from '@/app/lib/DBschema';
import { NextRequest, NextResponse } from 'next/server';

const CENTERS_FIELDS = 'name, email, phone, address, website, logourl , id';
const CAMPAIGNS_FIELDS =
  'id, name, details, main_img, raised, center_name, center_id, date_to_completion, donation_count, category';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10));
    const type = searchParams.get('type') ?? 'centers';
    const searchQuery = searchParams.get('query')?.trim();

    const limit = 25;
    const offset = limit * page;
    const now = Date.now();

    let centersQuery: string | null = null;
    let campaignsQuery: string | null = null;
    let centersParams: (string | number)[] = [];
    let campaignsParams: (string | number)[] = [];

    const searchConditionCampaign = searchQuery
      ? `AND (name LIKE ? OR details LIKE ? OR center_name LIKE "%${searchQuery}%" )`
      : '';

    const searchConditionCenter = searchQuery ? `AND (name LIKE ? OR about LIKE ?)` : '';

    const searchValues = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`] : [];

    if (type === 'both') {
      // Centers: show verified ones, no date filter (centers don't expire)
      centersQuery = `SELECT ${CENTERS_FIELDS} FROM centers 
        WHERE is_verified_status = "verified"
        ${searchConditionCenter}
        ORDER BY id DESC 
        LIMIT ? OFFSET ?`;

      centersParams = [...searchValues, limit + 1, offset];

      campaignsQuery = `SELECT ${CAMPAIGNS_FIELDS} FROM campaigns 
        WHERE date_to_completion > ? 
        AND center_id IS NOT NULL 
        ${searchConditionCampaign}
        ORDER BY id DESC 
        LIMIT ? OFFSET ?`;

      campaignsParams = [now, ...searchValues, limit + 1, offset];
    } else if (type === 'campaigns') {
      campaignsQuery = `SELECT ${CAMPAIGNS_FIELDS} FROM campaigns 
        WHERE date_to_completion > ? 
        AND center_id IS NOT NULL 
        ${searchConditionCampaign}
        ORDER BY id DESC 
        LIMIT ? OFFSET ?`;

      campaignsParams = [now, ...searchValues, limit + 1, offset];
    } else {
      // Default: centers only — verified ones
      centersQuery = `SELECT ${CENTERS_FIELDS} FROM centers 
        WHERE is_verified_status = "verified"
        ${searchConditionCenter}
        ORDER BY id DESC 
        LIMIT ? OFFSET ?`;

      centersParams = [...searchValues, limit + 1, offset];
    }

    let centers: any[] = [];
    let campaigns: any[] = [];
    let hasMoreCenters = false;
    let hasMoreCampaigns = false;

    if (centersQuery) {
      const [rows]: any = await db.query(centersQuery, centersParams);
      hasMoreCenters = rows.length > limit;
      centers = rows.slice(0, limit);
    }

    if (campaignsQuery) {
      const [rows]: any = await db.query(campaignsQuery, campaignsParams);
      hasMoreCampaigns = rows.length > limit;
      campaigns = rows.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: { centers, campaigns },
      pagination: {
        page,
        limit,
        hasMore:
          type === 'both'
            ? hasMoreCenters || hasMoreCampaigns
            : centersQuery
              ? hasMoreCenters
              : hasMoreCampaigns,
        hasMoreCenters,
        hasMoreCampaigns,
      },
      meta: {
        type,
        searchQuery: searchQuery || null,
        timestamp: now,
      },
    });
  } catch (_error) {
    console.error('GET /api/centers-campaigns _error:', _error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data',
        message: _error instanceof Error ? _error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
