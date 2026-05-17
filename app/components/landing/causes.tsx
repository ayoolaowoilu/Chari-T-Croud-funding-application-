"use client";

import { motion } from 'framer-motion';
import Card from '../layout/card';
import LoadingCards from '../layout/loadingCards';
import { useEffect, useState } from 'react';
import { getFeatured } from '@/app/lib/fetchRequests';

// const causes = [
//     {
//         img: "/slider1/medium-shot-boys-hugging.jpg",
//         category: "Education",
//         title: "Schools for Every Child",
//         desc: "Build classrooms, provide supplies, and fund scholarships for children in underserved communities.",
//         raised: 45000,
//         goal: 60000,
//         donors: 234
//     },
//     {
//         img: "/slider1/close-up-smiley-kids-posing-together.jpg",
//         category: "Food Security",
//         title: "No Family Goes Hungry",
//         desc: "Deliver nutritious meals and establish sustainable food programs for families facing hunger.",
//         raised: 32000,
//         goal: 50000,
//         donors: 189
//     },
//     {
//         img: "/slider1/happy-family-having-nice-thanksgiving-dinner-together.jpg",
//         category: "Healthcare",
//         title: "Medical Care for All",
//         desc: "Provide essential medical treatment, vaccines, and health education to vulnerable populations.",
//         raised: 28000,
//         goal: 40000,
//         donors: 156
//     }
// ];



const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};


export default function FeaturedCauses() {
    const [causes,setcauses] = useState<any[]>([])
  
    useEffect(()=>{
        const fetchdata = async() =>{
           try {
                  const resp = await getFeatured();
                  setcauses(resp)
                  

           } catch (error) {
               console.log(error)
           }

        }
        fetchdata()
    },[])
  
    return (
        <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                
                {/* Section header */}
                <motion.div 
                    className="text-center mb-12 md:mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    
                >
                    <motion.span 
                        className="text-blue-500 font-semibold text-sm uppercase tracking-wider inline-block"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                            delay: 0.2
                        }}
                    >
                        Urgent Causes
                    </motion.span>
                    <motion.h2 
                        className="mt-2 text-3xl md:text-4xl font-bold text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Featured Campaigns
                    </motion.h2>
                    <motion.p 
                        className="mt-4 text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Your donation directly supports these active campaigns. Every contribution brings us closer to our goals.
                    </motion.p>
                </motion.div>

                {/* Causes grid */}
                {causes?.length > 0 ?  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {causes.map((cause, index) => {
                        
                        console.log(cause.main_img.url)
                        return (
                             <Card 
                             
                             key={index}
                             img={JSON.parse(cause.main_img).url} 
                             desc={cause.details}
                             donors={cause.donation_count || 0 }
                             goal={cause.goal}
                             raised={cause.raised}
                             title={cause.name}
                             category={cause.category}
                             currency={cause.currency}
                             id={cause.id}
                             location={cause.location}
                             daysLeft={cause.date_to_completion}
                                safety_level={cause.safety_rating}
                                center_id={cause.center_id || null}
                                center_name={cause.center_name || null}
                                  centerName={cause.center_name as string}
                             />
                        );
                    })}
                </motion.div> : <LoadingCards />}

                {/* View all link */}
                <motion.div 
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.button 
                        className="text-blue-500 font-semibold hover:text-blue-600 transition inline-flex items-center gap-2"
                        whileHover={{ 
                            x: 5,
                            transition: { type: "spring", stiffness: 400 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All Causes
                        <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                    </motion.button>
                </motion.div>

            </div>
        </section>
    );
}