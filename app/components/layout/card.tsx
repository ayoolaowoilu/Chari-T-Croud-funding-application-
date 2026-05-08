import Button from "../ui/button";
import { motion } from 'framer-motion';
import { redirect } from "next/navigation";
import { Clock, Users, MapPin, Target, TrendingUp } from "lucide-react";

interface Don {
    img: string;
    title: string;
    donors: number;
    goal: number;
    raised: number;
    category: string;
    desc: string;
    currency: "NG" | "EURO" | "USD";
    id: number;
    centerName?: string;
    location?: string;
    daysLeft?: number | string;
    isUrgent?: boolean;
    isVerified?: boolean;
    organizer?: string;
    safety_level?:string |  'verified_safe' |
    'likely_safe' |
    'uncertain' |
    'likely_risky' |
    'unsafe';
}

const currencySymbols: Record<string, string> = {
    NG: "₦",
    EURO: "€",
    USD: "$"
};

const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString();
};

const Card: React.FC<Don> = ({
    img,
    title,
    donors,
    goal,
    raised,
    category,
    desc,
    currency,
    id,
    centerName,
    location,
    daysLeft,
    isUrgent,
    isVerified,
    organizer,
    safety_level
}) => {
    const progressPct = Math.min(100, Math.max(0, (raised / goal) * 100));
    const symbol = currencySymbols[currency] || "₦";
    const isFullyFunded = progressPct >= 100;
    const daysleftt =  Math.floor((Number(daysLeft) - Date.now()) / (1000 * 60 * 60 * 24));
    const isNearDeadline = daysLeft !== undefined && daysleftt <= 7 && daysleftt > 0;

    return (
        <motion.div
            className="bg-white w-full h-125 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
        >
            {/* Image Section - Fixed height */}
            <div className="relative h-48 shrink-0 overflow-hidden">
                <img
                    src={img}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-white/95 text-gray-900 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {category}
                    </span>
                    {isUrgent && (
                        <span className="bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Urgent
                        </span>
                    )}
                    {isFullyFunded && (
                        <span className="bg-green-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            Funded
                        </span>
                    )}
                </div>

                {/* Days Left */}
                {daysLeft !== undefined && (
                    <div className="absolute bottom-3 right-3">
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full text-white ${isNearDeadline ? 'bg-red-500/90' : 'bg-black/40 backdrop-blur-sm'}`}>
                            {daysleftt > 0 ? `${daysleftt}d left` : "Ended"}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section - Flex grow with fixed internal layout */}
            <div className="flex flex-col grow p-5">
                {/* Title - Fixed 2 lines */}
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 h-10.5">
                    {title}
                </h3>

                {/* Location - Fixed 1 line */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 h-4">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                    
                        {location && ` · ${location}`}
                    </span>
                    {safety_level && (
                        <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium ${safety_level === 'verified_safe' ? 'bg-green-500/90 text-white' :
                            safety_level === 'likely_safe' ? 'bg-green-300/80 text-gray-900' :
                            safety_level === 'uncertain' ? 'bg-yellow-300/80 text-gray-900' :
                            safety_level === 'likely_risky' ? 'bg-red-300/80 text-gray-900' :
                            'bg-red-500/90 text-white'}`}>
                            {safety_level?.split("_")[1] !== undefined ? `${safety_level?.split("_")[0]} ${safety_level?.split("_")[1]}` : safety_level}
                        </span>
                    )}
                </div>

                {/* Description - Fixed 2 lines */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 h-10">
                    {desc}
                </p>

                {/* Progress Section */}
                <div className="mt-auto">
                    {/* Amount Row */}
                    <div className="flex items-end justify-between mb-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900">
                                {symbol}{formatNumber(raised)}
                            </span>
                            <span className="text-xs text-gray-500">
                                raised
                            </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">
                            {Math.round(progressPct)}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <motion.div
                            className={`h-full rounded-full ${isFullyFunded ? 'bg-green-500' : isUrgent ? 'bg-red-500' : 'bg-gray-900'}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progressPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>

                    {/* Bottom Stats Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {donors} donors
                        </span>
                        <span>
                            Goal {symbol}{formatNumber(goal)}
                        </span>
                    </div>

                    {/* CTA Button - Always at bottom */}
                    <Button
                        details={isFullyFunded ? "View Details" : "View Details"}
                        variant={isFullyFunded ? "outline" : "outline"}
                        size="md"
                        className="w-full"
                        onClick={() => redirect(`/causes/cause?id=${id}`)}
                    />

                </div>
            </div>
        </motion.div>
    );
};

export default Card;