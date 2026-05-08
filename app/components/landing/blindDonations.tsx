"use client";

import { motion } from 'framer-motion';
import { EyeOff, Shield, Heart, ArrowRight } from 'lucide-react';
import Button from '../ui/button';

const benefits = [
    {
        icon: EyeOff,
        title: "Complete Anonymity",
        desc: "Your identity remains hidden. No names, no recognition—just pure generosity."
    },
    {
        icon: Shield,
        title: "Maximum Security",
        desc: "Encrypted transactions with zero data retention. Your privacy is absolute."
    },
    {
        icon: Heart,
        title: "True Altruism",
        desc: "Give without expectation of reward or acknowledgment. Help for help's sake."
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

export default function BlindDonations() {
    return (
        <section className="py-20 md:py-28 bg-slate-900 text-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 md:px-8">
                
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm font-medium text-slate-300 mb-6">
                            <EyeOff size={16} />
                            Private Giving
                        </span>
                        
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                            Blind Donations
                            <span className="block text-slate-400 text-2xl md:text-3xl font-normal mt-2">
                                Give without being seen
                            </span>
                        </h2>
                        
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Sometimes the most profound acts of kindness are those done in silence. 
                            Our blind donation channel ensures 100% anonymity while delivering 
                            your support to those who need it most.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button 
                                details="Donate Anonymously" 
                                variant="primary"
                                size="lg"
                                className="bg-white text-slate-900 hover:bg-slate-100"
                            />
                            <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
                                Learn more
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Benefits */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                   
                                    className="flex gap-5 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-slate-600 transition-colors">
                                        <Icon size={24} className="text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Trust indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-3 pt-4 text-sm text-slate-500"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 bg-slate-700 rounded-full border-2 border-slate-800" />
                                ))}
                            </div>
                            <span>2,847 anonymous donors this month</span>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}