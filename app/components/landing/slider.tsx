"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        img: "/slider1/medium-shot-boys-hugging.jpg",
        title: "No Child Left Behind",
        desc: "Every child deserves a chance at a brighter future. Your donation provides food, education, and shelter to orphaned and vulnerable children."
    },
    {
        img: "/slider1/hands.jpg",
        title: "Give Hope, Change Lives",
        desc: "A single act of kindness can transform a life. Your contribution goes directly to families in crisis—providing emergency relief and medical care."
    },
    {
        img: "/slider1/close-up-smiley-kids-posing-together.jpg",
        title: "Education for Every Child",
        desc: "With your help, we put books in hands, fund scholarships, and build schools in underserved communities. Invest in education today."
    },
    {
        img: "/slider1/happy-family-having-nice-thanksgiving-dinner-together.jpg",
        title: "Families Belong Together",
        desc: "No family should go hungry or homeless. Your generosity helps us provide meals, housing assistance, and counseling."
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => {
            const next = prev + newDirection;
            if (next < 0) return slides.length - 1;
            if (next >= slides.length) return 0;
            return next;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => paginate(1), 6000);
        return () => clearInterval(timer);
    }, [paginate]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    const textVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay, ease: "easeOut" }
        }),
    };

    return (
        <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
            {/* Slides */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[current].img}
                        alt={slides[current].title}
                        fill
                        className="object-cover"
                        priority={current === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-8 flex items-center">
                <div className="max-w-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.span
                                custom={0}
                                variants={textVariants}
                                className="inline-block text-sm font-semibold text-white/80 uppercase tracking-widest mb-4"
                            >
                                Make a Difference
                            </motion.span>
                            
                            <motion.h1
                                custom={0.1}
                                variants={textVariants}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                            >
                                {slides[current].title}
                            </motion.h1>
                            
                            <motion.p
                                custom={0.2}
                                variants={textVariants}
                                className="text-lg text-white/80 leading-relaxed mb-8 max-w-md"
                            >
                                {slides[current].desc}
                            </motion.p>
                            
                            <motion.div
                                custom={0.3}
                                variants={textVariants}
                                className="flex flex-wrap gap-4"
                            >
                                <button onClick={()=>window.location.href = "/causes/get"} className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                    Donate Now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors">
                                    Learn More
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > current ? 1 : -1);
                            setCurrent(idx);
                        }}
                        className="group relative h-1 rounded-full overflow-hidden bg-white/20 transition-all"
                        style={{ width: idx === current ? 48 : 24 }}
                    >
                        {idx === current && (
                            <motion.div
                                className="absolute inset-0 bg-white"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 6, ease: "linear" }}
                                style={{ transformOrigin: "left" }}
                            />
                        )}
                        {idx !== current && (
                            <div className="absolute inset-0 bg-white/40 group-hover:bg-white/60 transition-colors" />
                        )}
                    </button>
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-white/60 text-sm font-medium">
                <span className="text-white text-lg font-bold">0{current + 1}</span>
                <span>/</span>
                <span>0{slides.length}</span>
            </div>
        </section>
    );
}