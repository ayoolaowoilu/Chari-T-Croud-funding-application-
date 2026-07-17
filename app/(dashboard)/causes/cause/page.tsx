
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchOneCauseById } from '@/app/lib/fetchRequests';
import { buildOgMeta } from '@/app/lib/open_graph';
import  CampaignClient from './clientComponent';

type Props = {
  searchParams: Promise<{ id?: string }>;
};



export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams;
  
  if (!id) {
    return { title: 'Campaign | Chari-T' };
  }

  const campaign = await fetchOneCauseById(Number(id), 1);
  
  if (!campaign) {
    return { title: 'Not Found | Chari-T' };
  }

  return buildOgMeta({
    title: campaign.name,
    description: campaign.details,
    imageUrl:  `${process.env.API_URL}/api/og/campaign?id=${campaign.id}`,
    id: campaign.id,
  });
}

export default async function CampaignPage({ searchParams }: Props) {
  const { id } = await searchParams;
  
  if (!id) notFound();

  const campaign = await fetchOneCauseById(Number(id), 1);
  
  if (!campaign) notFound();

  return <CampaignClient campaign={campaign} />;
}