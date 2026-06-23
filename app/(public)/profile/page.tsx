import { FetchUserPublicProfileById, GetUserDetailsDyId } from "@/app/lib/fetchRequests";
import { Metadata } from "next";
import { ProfileComponent } from "./profileComponent";

const SITE_URL = process.env.API_URL || "https://chari-t.com";

type Props = {
    searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { id } = await searchParams;

    if (!id) {
        return {
            title: "Profile | Chari-T",
            description: "View user profile and support their causes on Chari-T.",
        };
    }

    const userData = await GetUserDetailsDyId(Number(id), false);

    const ogImage = userData?.image || `${SITE_URL}/default-og.png`;

    return {
        title: `${userData?.full_name || "User"} | Chari-T Profile`,
        description: `Support ${userData?.full_name || "this user"}'s causes on Chari-T.`,
        metadataBase: new URL(SITE_URL),
        openGraph: {
            title: `${userData?.full_name || "User"} | Chari-T Profile`,
            description: `Support ${userData?.full_name || "this user"}'s causes on Chari-T.`,
            url: `/profile?id=${id}`,
            siteName: "Chari-T",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${userData?.full_name || "User"} | Chari-T Profile`,
                },
            ],
            type: "website",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: `${userData?.full_name || "User"} | Chari-T Profile`,
            description: `Support ${userData?.full_name || "this user"}'s causes on Chari-T.`,
            images: [ogImage],
        },
    };
}

export default async function Page({ searchParams }: Props) {
    const { id } = await searchParams;

    if (!id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        User Not Found
                    </h1>
                    <p className="text-gray-500">No user ID was provided.</p>
                </div>
            </div>
        );
    }

    const profileData = await FetchUserPublicProfileById(Number(id));

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        User Not Found
                    </h1>
                    <p className="text-gray-500">
                        The user you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    const userData = profileData.data || profileData;
    const campaigns = profileData.causes || [];

    return (
        <ProfileComponent
            userData={{
                full_name: userData?.full_name || "Anonymous",
                image: userData?.image || "",
                email: userData?.email || "",
                recieved: userData?.recieved || 0,
                donations: userData?.donations || 0,
                is_verified:userData.is_verified
            }}
            campaigns={campaigns}
        />
    );
}