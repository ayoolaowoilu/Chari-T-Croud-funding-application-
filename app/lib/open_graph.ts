
import { Metadata } from 'next';

type OgCampaign = {
  title: string;
  description?: string;
  imageUrl?: string;
  id?: number | string;
};

type OgOptions = {
  type?: 'website' | 'article' | 'profile';
  path?: string;
};

const SITE_URL = process.env.API_URL
const SITE_NAME = 'Chari-T';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

export function buildOgMeta(
  campaign: OgCampaign,
  options: OgOptions = {}
): Metadata {
  const { type = 'article', path } = options;

  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  const image = campaign.imageUrl || DEFAULT_IMAGE;
  const description = campaign.description?.slice(0, 160) || 'Support this cause on Chari-T.';

  return {
    title: campaign.title,
    description,
    openGraph: {
      title: campaign.title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: campaign.id
            ? `${SITE_URL}/api/og?id=${campaign.id}`
            : image,
          width: 1200,
          height: 630,
          alt: campaign.title,
        },
      ],
      type,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description,
      images: [
        campaign.id
          ? `${SITE_URL}/api/og?id=${campaign.id}`
          : image,
      ],
    },
  };
}

export function buildDefaultOgMeta(): Metadata {
  return buildOgMeta(
    {
      title: 'Chari-T — Support Causes That Matter',
      description: 'Discover and support causes that create real impact.',
      imageUrl: DEFAULT_IMAGE,
    },
    { type: 'website', path: '/' }
  );
}