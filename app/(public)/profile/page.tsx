import { FetchUserPublicProfileById, GetUserDetailsDyId } from "@/app/lib/fetchRequests";
import { buildOgMeta } from "@/app/lib/open_graph";
import { Metadata } from "next";
import { ProfileComponent } from "./profileComponent";


type Props = {
    params: Promise<{ id?: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    
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

export default async function Page({ params }: Props) {
    const { id } = await params;

    if (!id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        User Not Found
                    </h1>
                    <p className="text-gray-500">
                        No user ID was provided.
                    </p>
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

    return (
        <ProfileComponent
            userData={{
                full_name: profileData.data.name,
                image: profileData.data.image,
                email: profileData.data.email,
            }}
            campaigns={profileData.causes || []}
        />
    );
}