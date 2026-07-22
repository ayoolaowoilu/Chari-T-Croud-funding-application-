/** Canonical campaign categories — values match MySQL ENUM on campaigns.category */
export const CAMPAIGN_CATEGORIES = [
  'Education',
  'Community',
  'CroudFunding',
  'Business',
  'Health',
] as const;

export type CampaignCategory = (typeof CAMPAIGN_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
  Education: 'Education',
  Community: 'Community',
  CroudFunding: 'Crowdfunding',
  Business: 'Business',
  Health: 'Health',
};

export function categoryLabel(value: string | null | undefined): string {
  if (!value) return 'General';
  if (value in CATEGORY_LABELS) {
    return CATEGORY_LABELS[value as CampaignCategory];
  }
  // tolerate legacy / mistyped values from older UI
  const normalized = value.toLowerCase().replace(/[\s_-]/g, '');
  if (normalized === 'crowdfunding' || normalized === 'croudfunding') {
    return 'Crowdfunding';
  }
  return value;
}

export function normalizeCategory(value: string | null | undefined): CampaignCategory {
  if (!value) return 'CroudFunding';
  const match = CAMPAIGN_CATEGORIES.find((c) => c.toLowerCase() === value.toLowerCase());
  if (match) return match;
  const normalized = value.toLowerCase().replace(/[\s_-]/g, '');
  if (normalized === 'crowdfunding' || normalized === 'croudfunding') {
    return 'CroudFunding';
  }
  return 'CroudFunding';
}
