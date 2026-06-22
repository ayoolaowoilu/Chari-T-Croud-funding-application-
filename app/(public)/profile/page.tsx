import { FetchUserPublicProfileById, GetUserDetailsDyId } from "@/app/lib/fetchRequests";
import { buildOgMeta } from "@/app/lib/open_graph";
import { Metadata } from "next";
import { ProfileComponent } from "./profileComponent";

type Props = {
    searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { id } = await searchParams;

    if (!id) {
        return buildOgMeta({
            title: "Profile | Chari-T",
            description: "View user profile and support their causes on Chari-T.",
        });
    }

    const userData = await GetUserDetailsDyId(Number(id), false);

    return buildOgMeta({
        title: `${userData.name} | Chari-T Profile`,
        description: `Support ${userData.name}'s causes on Chari-T.`,
        imageUrl: userData.image,
    });
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
                full_name: userData.full_name,
                image: userData.image,
                email: userData.email,
                recieved:userData.recieved,
                donations:userData.donations
            }}
            campaigns={campaigns}
        />
    );
}