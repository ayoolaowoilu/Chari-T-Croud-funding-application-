"use client"

import Card from "@/app/components/layout/card";
import Footer from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";

interface UserData {
    full_name: string;
    image: string;
    email: string;
    recieved: number;
    donations: number;
    is_verified:number;
}

interface Campaign {
    id: number;
    name: string;
    location: string;
    details: string;
    main_img: { url: string };
    goal: number;
    raised: number;
    center_name: string | null;
    center_id: string | number;
    user_id: number;
    date_to_completion: string;
    created_at: string;
    currency: "NG" | "USD" | "EURO";
    category: "Education" | "Community" | "CroudFunding" | "Business" | "Health";
    donation_count: number;
    safety_rating:
        | "verified_safe"
        | "likely_safe"
        | "uncertain"
        | "likely_risky"
        | "unsafe";
}

interface ProfileProp {
    userData: UserData;
    campaigns: Campaign[];
}

const EmptyState = () => (
    <div className="text-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No campaigns yet
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
            This user hasn't created any campaigns. Check back later for updates.
        </p>
    </div>
);

const ProfileComponent: React.FC<ProfileProp> = ({ userData, campaigns }) => {
    const activeCampaigns = campaigns?.filter(
        (c) => Number(c.date_to_completion) > Date.now()
    ).length;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const joinDate = campaigns.length > 0
        ? new Date(campaigns[0].created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : null;

    const bannerSeed = userData.email
        ? userData.full_name.replace(/[^a-zA-Z0-9]/g, "")
        : "default";

    return (
        <div className="min-h-screen bg-white">
            <NavBar />

            {/* Banner with random photo */}
            <div className="w-full h-52 relative overflow-hidden">
                <img
                    src={`https://picsum.photos/seed/${bannerSeed}/1200/400`}
                    alt="Profile banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="max-w-3xl mx-auto px-4">
                {/* Profile Header Area */}
                <div className="relative px-4">
                    {/* Avatar - Overlapping banner */}
                    <div className="absolute -top-16 left-4">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                            {userData.image ? (
                                <img
                                    src={userData.image}
                                    alt={userData.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-3xl font-bold">
                                    {getInitials(userData.full_name)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex justify-end pt-3 pb-2">
                        <button className="inline-flex items-center gap-2 px-5 py-2 border border-gray-300 text-gray-900 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors">
                            Contact
                        </button>
                    </div> */}

                    {/* Name & Details */}
                    <div className="mt-10">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900">
                                {userData.full_name}
                            </h1>
                            {userData.is_verified !== 0 ? (  <span 
                        className="inline-flex items-center transition-transform duration-300 hover:scale-110" 
                        title="Verified Charity"
                    >
                        <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                    </span>) : null}
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">
                            {userData.email}
                        </p>

                        {/* Bio */}
                        <p className="text-gray-900 text-sm mt-3 leading-relaxed">
                            Supporting causes that matter. Every donation makes a difference.
                        </p>

                        {/* Meta Row */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            {joinDate && (
                                <span className="flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Joined {joinDate}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Nigeria
                            </span>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-5 mt-4 pb-4">
                            <span className="text-sm">
                                <span className="font-bold text-gray-900">{campaigns.length}</span>{" "}
                                <span className="text-gray-500">Campaigns</span>
                            </span>
                            <span className="text-sm">
                                <span className="font-bold text-gray-900">
                                    {activeCampaigns}
                                </span>{" "}
                                <span className="text-gray-500">Active</span>
                            </span>
                            <span className="text-sm">
                                <span className="font-bold text-gray-900">
                                    {userData.donations.toLocaleString()}
                                </span>{" "}
                                <span className="text-gray-500">Donated</span>
                            </span>
                            <span className="text-sm">
                                <span className="font-bold text-gray-900">
                                    {userData.recieved || 0}
                                </span>{" "}
                                <span className="text-gray-500">Received</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Campaigns Section */}
                <div className="border-t border-gray-100 pt-6 pb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            Campaigns
                        </h2>
                        <span className="text-sm text-gray-500">
                            {campaigns.length} {campaigns.length === 1 ? "cause" : "causes"}
                        </span>
                    </div>

                    {campaigns.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {campaigns.map((campaign) => (
                                <Card
                                    key={campaign.id}
                                    id={campaign.id}
                                    goal={campaign.goal}
                                    raised={campaign.raised || 0}
                                    title={campaign.name}
                                    donors={campaign.donation_count || 0}
                                    img={campaign.main_img.url}
                                    category={campaign.category}
                                    desc={campaign.details}
                                    currency={campaign.currency}
                                    center_id={campaign.center_id as string}
                                    centerName={campaign.center_name as string}
                                    center_name={campaign.center_name}
                                    safety_level={campaign.safety_rating}
                                    daysLeft={campaign.date_to_completion}
                                    location={campaign.location}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export { ProfileComponent };