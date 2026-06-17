"use client";

import { motion } from 'framer-motion';
import { Shield, Heart, Globe, HandCoins, BadgeCheck, ArrowRight } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: "100% Transparency",
        desc: "Every dollar is tracked in real-time. Receive detailed impact reports showing exactly how your donation changes lives."
    },
    {
        icon: HandCoins,
        title: "Zero Platform Fees",
        desc: "We never deduct from your donation. 100% goes directly to the cause. Our operations run on voluntary tips only."
    },
    {
        icon: Globe,
        title: "Global Reach, Local Focus",
        desc: "Operating in 25+ countries with community-led solutions tailored to local needs and cultural contexts."
    },
    {
        icon: Heart,
        title: "Direct to Beneficiaries",
        desc: "Funds pass straight through to verified charities and local partners. No middlemen, no hidden cuts."
    },
    {
        icon: BadgeCheck,
        title: "Verified Partners",
        desc: "Every organization on our platform undergoes rigorous vetting. You donate with complete confidence."
    },
    {
        icon: ArrowRight,
        title: "Seamless Experience",
        desc: "Donate in seconds with an intuitive platform designed to remove friction between intent and impact."
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    }
} as any;

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
} as any;

export default function WhyChooseUs() {
    return (
        <section className="py-20 md:py-28 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-8">
                
                {/* Header */}
                <motion.div 
                    className="text-center mb-16 md:mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.span 
                        className="text-blue-600 font-semibold text-sm uppercase tracking-[0.2em] block"
                        variants={itemVariants}
                    >
                        Our Promise
                    </motion.span>
                    <motion.h2 
                        className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                        variants={itemVariants}
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.p 
                        className="mt-5 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
                        variants={itemVariants}
                    >
                        We're reimagining charitable giving with transparency, trust, and zero compromise at the core.
                    </motion.p>
                    <motion.div 
                        className="mt-6 w-12 h-1 bg-gray-900 mx-auto"
                        variants={itemVariants}
                    />
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                className="group relative p-8 bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors duration-300"
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>

                                {/* Hover accent line */}
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Trust badges */}
                <motion.div 
                    className="mt-20 pt-12 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <p className="text-center text-xs uppercase tracking-wider text-gray-400 mb-8 font-medium">
                        Recognized By
                    </p>
                    <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center">
                        {['Forbes', 'UNICEF', 'Red Cross', 'UNDP', 'World Bank'].map((org, i) => (
                            <motion.span 
                                key={org}
                                className="text-lg md:text-xl font-bold text-gray-300 hover:text-gray-600 transition-colors duration-300 cursor-default"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + (i * 0.08), duration: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {org}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}