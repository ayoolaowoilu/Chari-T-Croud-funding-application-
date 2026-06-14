import Button from "../ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { redirect } from "next/navigation";
import { Clock, Users, MapPin, MoreVertical, Copy,  ExternalLink } from "lucide-react";
import {  useState } from "react";

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
    safety_level?: string | 'verified_safe' | 'likely_safe' | 'uncertain' | 'likely_risky' | 'unsafe';
    center_id: string | null;
    center_name: string | null;
}

const currencySymbols: Record<string, string> = {
    NG: "₦",
    EURO: "€",
    USD: "$"
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString();
};

const CardMenu = ({ id, title, onCopyLink, onGetFlier }: {
    id: number;
    title: string;
    onCopyLink: () => void;
    onGetFlier: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const handleCopy = () => {
        onCopyLink();
        setOpen(false);
    };


    const handleViewMore = () => {
        redirect(`/causes/cause?id=${id}`);
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className="p-2.5 rounded-xl border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center"
                aria-label="More options"
            >
                <MoreVertical className="w-4 h-4 text-blue-600" />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 bottom-full mb-2 z-50 w-44 bg-white rounded-xl border-2 border-blue-200 shadow-lg shadow-blue-100/50 overflow-hidden"
                        >
                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                <Copy className="w-4 h-4 text-blue-500" />
                                Copy link
                            </button>
                            {/* <button
                                onClick={handleFlier}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                <Image className="w-4 h-4 text-blue-500" />
                                View
                            </button> */}
                            <div className="border-t border-blue-100" />
                            <button
                                onClick={handleViewMore}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-blue-500" />
                                View more
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const CampaignCard: React.FC<Don> = ({
    img,
    title,
    donors,
    goal,
    raised,
    category,
    desc,
    currency,
    id,
    location,
    daysLeft,
    isUrgent,
    isVerified,
    safety_level
}) => {
    const progressPct = Math.min(100, Math.max(0, (raised / goal) * 100));
    const symbol = currencySymbols[currency] || "₦";
    const isFullyFunded = progressPct >= 100;
    const daysleftt = Math.floor((Number(daysLeft) - Date.now()) / (1000 * 60 * 60 * 24));
    const isNearDeadline = daysLeft !== undefined && daysleftt <= 7 && daysleftt > 0;

    const handleCopyLink = () => {
        const url = `${window.location.origin}/causes/cause?id=${id}`;
        navigator.clipboard.writeText(url);
    };

    const handleGetFlier = () => {
        window.open(`/api/flier?campaign=${id}`, '_blank');
    };

    return (
        <motion.div
            className="bg-white w-full h-125 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
        >
            {/* Image Section */}
            <div className="relative h-48 shrink-0 overflow-hidden">
                <img
                    src={img}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
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

            {/* Content Section */}
            <div className="flex flex-col grow p-5">
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 h-10.5">
                    {title}
                </h3>

                {/* Location + Safety */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 h-4">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                        {location && ` · ${location}`}
                    </span>
                    {safety_level && (
                        <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            safety_level === 'verified_safe' ? 'bg-green-500/90 text-white' :
                            safety_level === 'likely_safe' ? 'bg-green-300/80 text-gray-900' :
                            safety_level === 'uncertain' ? 'bg-yellow-300/80 text-gray-900' :
                            safety_level === 'likely_risky' ? 'bg-red-300/80 text-gray-900' :
                            'bg-red-500/90 text-white'
                        }`}>
                            {safety_level?.split("_")[1] !== undefined ? `${safety_level?.split("_")[0]} ${safety_level?.split("_")[1]}` : safety_level}
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 h-10">
                    {desc}
                </p>

                {/* Progress Section */}
                <div className="mt-auto">
                    <div className="flex items-end justify-between mb-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900">
                                {symbol}{formatNumber(raised)}
                            </span>
                            <span className="text-xs text-gray-500">raised</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">
                            {Math.round(progressPct)}%
                        </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <motion.div
                            className={`h-full rounded-full ${isFullyFunded ? 'bg-green-500' : isUrgent ? 'bg-red-500' : 'bg-gray-900'}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progressPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {donors} donors
                        </span>
                        <span>Goal {symbol}{formatNumber(goal)}</span>
                    </div>

                    {/* Button + 3-dots row */}
                    <div className="flex items-center gap-2">
                        <Button
                            details="View Details"
                            variant="outline"
                            size="md"
                            className="flex-1"
                            onClick={() => redirect(`/causes/cause?id=${id}`)}
                        />
                        <CardMenu
                            id={id}
                            title={title}
                            onCopyLink={handleCopyLink}
                            onGetFlier={handleGetFlier}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CenterCard: React.FC<Don> = ({
    img,
    title,
    category,
    desc,
    id,
    centerName,
    location,
    daysLeft,
    raised,
    donors
}) => {
    const daysleftt = Math.floor((Number(daysLeft) - Date.now()) / (1000 * 60 * 60 * 24));
    const isNearDeadline = daysLeft !== undefined && daysleftt <= 7 && daysleftt > 0;
    
    

    const handleCopyLink = () => {
        const url = `${window.location.origin}/causes/cause?id=${id}`;
        navigator.clipboard.writeText(url);
    };



    return (
        <motion.div
            className="bg-white w-full h-125 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
        >
          
            <div className="relative h-48 shrink-0 overflow-hidden">
                <img
                    src={img}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-gray-900 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {category}
                    </span>
                </div>

                {/* Center Type Badge */}
                <div className="absolute bottom-3 right-3">
                    <span className="bg-gray-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        Charity center
                    </span>
                </div>

                {/* Days Left Badge */}
                {daysLeft !== undefined && (
                    <div className="absolute bottom-9 right-3">
                        <span className={`
                            text-[11px] font-medium px-2.5 py-1 rounded-full text-white
                            ${isNearDeadline ? 'bg-red-500/90' : 'bg-black/40 backdrop-blur-sm'}
                        `}>
                            {daysleftt > 0 ? `${daysleftt}d left` : "Ended"}
                        </span>
                    </div>
                )}
            </div>


            <div className="flex flex-col grow p-5">
               
                <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 mb-2">
                    {title}
                </h3>

              
                <div title={centerName} className="flex items-center gap-1.5 mb-2">
                    <span title={centerName} className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {centerName}
                    </span>
                    <span 
                        className="inline-flex items-center transition-transform duration-300 hover:scale-110" 
                        title="Verified Charity"
                    >
                        <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                    </span>
                </div>

               
                {location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 h-4">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                )}

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4 grow">
                    {desc}
                </p>


                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                            ₦{formatNumber(Number(raised))}
                        </span>
                        <span className="text-xs text-gray-500">raised</span>
                    </div>
                    {donors !== undefined && (
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-gray-900">
                                {donors}
                            </span>
                            <span className="text-xs text-gray-500">
                                {donors === 1 ? 'donor' : 'donors'}
                            </span>
                        </div>
                    )}
                </div>

              
                <div className="mt-auto flex items-center gap-2">
                    <Button
                        details="View Details"
                        variant="outline"
                        size="md"
                        className="flex-1"
                        onClick={() => redirect(`/causes/cause?id=${id}`)}
                    />
                    <CardMenu
                        id={id}
                        title={title}
                        onCopyLink={handleCopyLink}
                        onGetFlier={()=>null}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const Card: React.FC<Don> = (props) => {
    const isCenter = props.center_id !== null && props.center_id !== undefined;

    if (isCenter) {
        return <CenterCard {...props} />;
    }

    return <CampaignCard {...props} />;
};

export default Card;