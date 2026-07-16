import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

export default function Mission() {
    return (
        <section className="py-20 md:py-32 bg-white overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                
                {/* Section header */}
                <motion.div 
                    className="text-center mb-16 md:mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.span 
                        className="text-blue-600 font-semibold text-sm uppercase tracking-[0.2em] block"
                        variants={fadeInUp}
                    >
                        What Drives Us
                    </motion.span>
                    <motion.h2 
                        className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                        variants={fadeInUp}
                    >
                        Our Mission
                    </motion.h2>
                    <motion.div 
                        className="mt-6 w-12 h-1 bg-gray-900 mx-auto"
                        variants={fadeInUp}
                    />
                </motion.div>

                {/* Mission statement */}
                <motion.div 
                    className="text-center mb-16 md:mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.p 
                        className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-medium max-w-3xl mx-auto"
                        variants={fadeInUp}
                    >
                        We believe every person deserves access to food, education, and a safe place to call home. Our mission is to bridge the gap between compassion and action.
                    </motion.p>
                </motion.div>

                {/* Zero-fee promise */}
                <motion.div 
                    className="bg-gray-900 text-white p-10 md:p-14 mb-20 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="max-w-2xl mx-auto">
                        <motion.div 
                            className="w-12 h-12 bg-white/10 flex items-center justify-center mb-6 mx-auto"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                        <motion.h3 
                            className="text-2xl md:text-3xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            100% of Your Donation Goes to the Cause
                        </motion.h3>
                        <motion.p 
                            className="text-gray-300 leading-relaxed mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            We do not deduct any fees from donations. Every dollar you give reaches those who need it. Our operations are funded entirely by optional contributions from donors who choose to support our platform directly.
                        </motion.p>
                        <motion.span 
                            className="inline-block text-xs uppercase tracking-wider text-gray-400 border border-gray-700 px-4 py-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            Zero Platform Fees
                        </motion.span>
                    </div>
                </motion.div>

                {/* Story & transparency */}
                <motion.div 
                    className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div className="space-y-6" variants={fadeInUp}>
                        <h3 className="text-xl font-bold text-gray-900">Built on Trust</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Chari-T was founded on a simple conviction: charity should be transparent, efficient, and deeply human. We partner directly with local communities to ensure aid reaches those who need it most , quickly and without bureaucracy.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            From emergency food relief to long-term education programs, we measure success not by dollars raised, but by lives meaningfully changed.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-gray-50 p-8 md:p-10 border border-gray-100"
                        variants={fadeInUp}
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">How We're Funded</h3>
                        <div className="space-y-4">
                            <motion.div 
                                className="flex items-start gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-8 h-8 bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">Donations Go Directly to Charities</p>
                                    <p className="text-gray-500 text-sm mt-1">We never touch the donation amount. It passes straight through to the cause you choose.</p>
                                </div>
                            </motion.div>
                            <motion.div 
                                className="flex items-start gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="w-8 h-8 bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">Optional Tips Keep Us Running</p>
                                    <p className="text-gray-500 text-sm mt-1">If you value our service, you can add a voluntary tip at checkout. This is entirely your choice.</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Values grid */}
                <motion.div 
                    className="grid sm:grid-cols-3 gap-8 md:gap-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {[
                        {
                            icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                            title: "Compassion First",
                            desc: "We lead with empathy. Every program is designed with dignity, respecting the agency and voices of the communities we serve."
                        },
                        {
                            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                            title: "Radical Transparency",
                            desc: "No hidden fees. No vague promises. Real-time tracking and open reporting so you see the direct impact of every dollar donated."
                        },
                        {
                            icon: "M13 10V3L4 14h7v7l9-11h-7z",
                            title: "Sustainable Impact",
                            desc: "We don't just provide aid—we build capacity. Our programs create lasting infrastructure that empowers communities long after our direct involvement ends."
                        }
                    ].map((value, index) => (
                        <motion.div 
                            key={index}
                            className="text-center md:text-left"
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center mb-5 mx-auto md:mx-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Closing CTA */}
                <motion.div 
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <p className="text-gray-500 text-sm uppercase tracking-wider mb-4">Join the movement</p>
                    <motion.a 
                        href="/how-it-works" 
                        className="inline-flex items-center text-blue-600 font-semibold"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                    >
                        See how Chari-T works
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.a>
                </motion.div>

            </div>
        </section>
    );
}