"use client";

import { motion } from 'framer-motion';
import { Workflow, Shield, Heart, Globe, Users, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: "100% Transparency",
        desc: "Every dollar is tracked. Receive detailed reports showing exactly how your donation creates impact."
    },
    {
        icon: Heart,
        title: "Direct to Beneficiaries",
        desc: "92% of donations reach those in need. Minimal overhead means maximum impact."
    },
    {
        icon: Globe,
        title: "Global Reach, Local Focus",
        desc: "Operating in 25+ countries with community-led solutions tailored to local needs."
    },

  
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};


export default function WhyChooseUs() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-gray-700 via-gray-900 to-black text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                
                {/* Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
         
                >
                    <motion.span 
                        className="text-blue-400 font-semibold text-sm uppercase tracking-wider inline-block"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                    >
                        Our Promise
                    </motion.span>
                    <motion.h2 
                        className="mt-3 text-3xl md:text-5xl font-bold"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.p 
                        className="mt-4 text-gray-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        We're reimagining charitable giving with technology, transparency, and trust at the core.
                    </motion.p>
                    <motion.div 
                        className="mt-6 w-20 h-1 bg-orange-500 mx-auto rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    />
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
                              
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                
                                <motion.div
                                    className="absolute inset-0 bg-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                                    initial={false}
                                />
                                
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <motion.div 
                                        className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-5 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300"
                               
                                        whileHover="hover"
                                    >
                                        <Icon className="w-7 h-7" />
                                    </motion.div>

                                    {/* Content */}
                                    <motion.h3 
                                        className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                    >
                                        {feature.title}
                                    </motion.h3>
                                    <motion.p 
                                        className="text-gray-400 leading-relaxed text-sm"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + (index * 0.1) }}
                                    >
                                        {feature.desc}
                                    </motion.p>
                                </div>

                                {/* Corner accent */}
                                <motion.div
                                    className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Trust badges */}
                <motion.div 
                    className="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-60"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 0.6, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <span className="text-sm font-medium">Trusted by:</span>
                    {['Forbes', 'UNICEF', 'Red Cross', 'UNDP'].map((org, i) => (
                        <motion.span 
                            key={org}
                            className="text-lg font-bold"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9 + (i * 0.1) }}
                            whileHover={{ opacity: 1, scale: 1.1 }}
                        >
                            {org}
                        </motion.span>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}