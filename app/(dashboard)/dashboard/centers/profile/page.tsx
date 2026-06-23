import { Metadata } from "next"
import { notFound } from "next/navigation"
import CenterProfileClient from "./component"
import { GetCenter } from "@/app/lib/fetchRequests"

interface Campaign {
    id: number
    name: string
    details: string
    main_img: string | null
    center_name: string
    center_logo: string | null
    category: string
    raised: number
}

interface CenterProfile {
    name: string
    registration_number: string
    email: string
    userEmail: string
    phone: string
    address: string
    website: string
    is_verified_status: "pending" | "verified" | "rejected"
    about: string
    logourl: string | null
    geo_location: string
    total_donators: number
    total_campaigns: number
    campaigns?: Campaign[]
    bank_details: any
}

type Props = {
    searchParams: Promise<{ id?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { id } = await searchParams
    const centerId = id ? Number(id) : null

    if (!centerId || isNaN(centerId)) {
        return {
            title: "Center Not Found | Chari-T",
            description: "The requested charity center could not be found.",
        }
    }

    try {
        const center: CenterProfile = await GetCenter("ONE", centerId)

        if (!center || !center.name) {
            return {
                title: "Center Not Found | Chari-T",
                description: "The requested charity center could not be found.",
            }
        }

        const description = center.about
            ? center.about.slice(0, 160).replace(/\s+/g, " ").trim()
            : `Support ${center.name} on Chari-T. View campaigns and make a difference.`

        return {
            title: `${center.name} | Chari-T`,
            description,
            keywords: [center.name, "charity", "donation", "fundraising", center.geo_location, "Chari-T"],
            openGraph: {
                title: `${center.name} | Chari-T`,
                description,
                type: "profile",
                images: center.logourl
                    ? [{ url: center.logourl, width: 400, height: 400, alt: `${center.name} logo` }]
                    : undefined,
            },
            twitter: {
                card: "summary_large_image",
                title: `${center.name} | Chari-T`,
                description,
                images: center.logourl ? [center.logourl] : undefined,
            },
            alternates: {
                canonical: `/center?id=${centerId}`,
            },
            robots: {
                index: true,
                follow: true,
            },
        }
    } catch {
        return {
            title: "Center | Chari-T",
            description: "View charity center profiles and campaigns on Chari-T.",
        }
    }
}

export default async function CenterProfilePage({ searchParams }: Props) {
    const { id } = await searchParams
    const centerId = id ? Number(id) : null

    if (!centerId || isNaN(centerId)) {
        notFound()
    }

    let center: CenterProfile | null = null
    let loadError = false

    try {
        const resp = await GetCenter("ONE", centerId)
        if (resp.error || !resp.name) {
            loadError = true
        } else {
            center = resp
        }
    } catch {
        loadError = true
    }

    return <CenterProfileClient centerId={centerId} initialCenter={center} initialError={loadError} />
}