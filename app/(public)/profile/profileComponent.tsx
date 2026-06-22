"use client"

import Card from "@/app/components/layout/card";
import Footer from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";

interface UserData {
    full_name: string;
    image: string;
    email: string;
     recieved:number,
     donations:number
}

interface Campaign {
    id: number;
    name: string;
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



const StatCard = ({
    label,
    value,
    suffix,
}: {
    label: string;
    value: number;
    suffix?: string;
}) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
        <div className="text-2xl font-bold text-gray-900 mb-1">
            {value.toLocaleString()}
            {suffix && (
                <span className="text-sm font-medium text-gray-500 ml-0.5">
                    {suffix}
                </span>
            )}
        </div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const totalGoal = campaigns.reduce((sum, c) => sum + c.goal, 0);
    const activeCampaigns = campaigns.filter(
        (c) => new Date(c.date_to_completion) > new Date()
    ).length;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getDaysLeft = (dateStr: string) => {
        const end = new Date(dateStr);
        const now = new Date();
        const diff = Math.ceil(
            (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diff > 0 ? diff : 0;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            {/* Profile Header */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {userData.image ? (
                                <img
                                    src={userData.image}
                                    alt={userData.full_name}
                                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {getInitials(userData.full_name)}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 border-3 border-white rounded-full flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {userData.full_name}
                            </h1>
                            <p className="text-gray-500 mb-4 flex items-center justify-center md:justify-start gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                {userData.email}
                            </p>

                            {campaigns.length > 0 && (
                                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                    
                                   
                                    <span className="text-sm text-gray-500">
                                        Member since{" "}
                                        {new Date(
                                            campaigns[0].created_at
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Contact Button */}
                        <div className="hidden md:block shrink-0">
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            label="Campaigns"
                            value={campaigns.length}
                        />
                        <StatCard
                            label="Active"
                            value={activeCampaigns}
                        />
                        <StatCard
                            label="Total Raised"
                            value={totalRaised}
                            suffix={campaigns[0]?.currency || ""}
                        />
                        <StatCard
                            label="Avg. Goal"
                            value={
                                campaigns.length > 0
                                    ? Math.round(totalGoal / campaigns.length)
                                    : 0
                            }
                            suffix={campaigns[0]?.currency || ""}
                        />
                    </div>
                </div>
            </section>

            {/* Campaigns Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Causes by this user
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {campaigns.length}{" "}
                            {campaigns.length === 1 ? "campaign" : "campaigns"}{" "}
                            created
                        </p>
                    </div>

                    {campaigns.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="hidden sm:inline">Sorted by:</span>
                            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                                <option>Newest First</option>
                                <option>Most Funded</option>
                                <option>Ending Soon</option>
                            </select>
                        </div>
                    )}
                </div>

                {campaigns.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                            />
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export { ProfileComponent };
