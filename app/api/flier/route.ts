import { NextRequest } from "next/server";
import { FlierImage } from "@/app/lib/FlierGenerator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const data = {
    _type: (searchParams.get("_type") as "center" | "normal") || "normal",
    goal: searchParams.get("goal") || undefined,
    raised: searchParams.get("raised") || "0",
    campaign_id: parseInt(searchParams.get("campaign_id") || "0", 10),
    campaign_name: searchParams.get("campaign_name") || "Support Our Cause",
    style: parseInt(searchParams.get("style") || "1", 10) as 1 | 2 | 3 | 4 | 5,
    center_logo_url: searchParams.get("center_logo_url") || undefined,
    campaign_logo_url: searchParams.get("campaign_logo_url") || "",
    qr_code_url: searchParams.get("qr_code_url") || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=chari-t.com",
    tagline: searchParams.get("tagline") || undefined,
    details: searchParams.get("details") || undefined,
    center_name: searchParams.get("center_name") || undefined,
    center_handle: searchParams.get("center_handle") || undefined,
  };

  return FlierImage({ data });
}