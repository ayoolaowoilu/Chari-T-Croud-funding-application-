"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

const slides = [
    {
        img: "/slider1/medium-shot-boys-hugging.jpg",
        title: "No Child Left Behind",
        desc: "Your donation provides food, education, and shelter to orphaned and vulnerable children."
    },
    {
        img: "/slider1/hands.jpg",
        title: "Give Hope, Change Lives",
        desc: "Your contribution goes directly to families in crisis—providing emergency relief and medical care."
    },
    {
        img: "/slider1/close-up-smiley-kids-posing-together.jpg",
        title: "Education for Every Child",
        desc: "We put books in hands, fund scholarships, and build schools in underserved communities."
    },
    {
        img: "/slider1/happy-family-having-nice-thanksgiving-dinner-together.jpg",
        title: "Families Belong Together",
        desc: "Your generosity helps us provide meals, housing assistance, and counseling to families in need."
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
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    } as any;

    const textVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay, ease: "easeOut" }
        }),
    } as any;

    return (
        <section className="relative w-full bg-white">
            {/* Mobile: Card Stack Layout */}
            <div className="block sm:hidden">
                <div className="relative h-70 overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={slides[current].img}
                                alt={slides[current].title}
                                fill
                                className="object-cover"
                                priority={current === 0}
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile arrows on image */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 z-20">
                        <button
                            onClick={() => paginate(-1)}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-900 shadow-lg"
                            aria-label="Previous"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 z-20">
                        <button
                            onClick={() => paginate(1)}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-900 shadow-lg"
                            aria-label="Next"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mobile text card — BELOW image, never overlapping */}
                <div className="px-5 pt-5 pb-6">
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
                                className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2"
                            >
                                Make a Difference
                            </motion.span>
                            <motion.h1
                                custom={0.08}
                                variants={textVariants}
                                className="text-xl font-bold text-gray-900 leading-tight mb-2"
                            >
                                {slides[current].title}
                            </motion.h1>
                            <motion.p
                                custom={0.16}
                                variants={textVariants}
                                className="text-sm text-gray-600 leading-relaxed mb-5"
                            >
                                {slides[current].desc}
                            </motion.p>
                            <motion.div
                                custom={0.24}
                                variants={textVariants}
                                className="flex gap-3"
                            >
                                <button
                                    onClick={() => window.location.href = "/causes/get"}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold text-sm"
                                >
                                    Donate Now
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-semibold text-sm">
                                    Learn More
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile dots */}
                    <div className="flex items-center justify-center gap-2 mt-5">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > current ? 1 : -1);
                                    setCurrent(idx);
                                }}
                                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                                style={{ width: idx === current ? 28 : 12 }}
                            >
                                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                                {idx === current && (
                                    <motion.div
                                        className="absolute inset-0 bg-gray-900 rounded-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 6, ease: "linear" }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop: Split Screen Layout */}
            <div className="hidden sm:block">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 min-h-130 lg:min-h-130">
                        {/* Left: Text */}
                        <div className="flex items-center px-8 lg:px-16 py-12 bg-white">
                            <div className="max-w-md">
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
                                            className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4"
                                        >
                                            Make a Difference
                                        </motion.span>
                                        <motion.h1
                                            custom={0.1}
                                            variants={textVariants}
                                            className="text-3xl lg:text-5xl font-bold text-gray-900 leading-[1.1] mb-4"
                                        >
                                            {slides[current].title}
                                        </motion.h1>
                                        <motion.p
                                            custom={0.2}
                                            variants={textVariants}
                                            className="text-base lg:text-lg text-gray-500 leading-relaxed mb-8"
                                        >
                                            {slides[current].desc}
                                        </motion.p>
                                        <motion.div
                                            custom={0.3}
                                            variants={textVariants}
                                            className="flex gap-4"
                                        >
                                            <button
                                                onClick={() => window.location.href = "/causes/get"}
                                                className="group flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                                            >
                                                Donate Now
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                            <button  onClick={() => window.location.href = "/how-it-works"} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-7 py-3.5 rounded-full font-semibold hover:border-gray-400 transition-colors">
                                                Learn More
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Desktop dots + counter */}
                                <div className="flex items-center gap-6 mt-10">
                                    <div className="flex items-center gap-2">
                                        {slides.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setDirection(idx > current ? 1 : -1);
                                                    setCurrent(idx);
                                                }}
                                                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                                                style={{ width: idx === current ? 32 : 14 }}
                                            >
                                                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                                                {idx === current && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-gray-900 rounded-full"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ duration: 6, ease: "linear" }}
                                                        style={{ transformOrigin: "left" }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400 font-medium tabular-nums">
                                        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="relative overflow-hidden bg-gray-100">
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={current}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={slides[current].img}
                                        alt={slides[current].title}
                                        fill
                                        className="object-cover"
                                        priority={current === 0}
                                        sizes="50vw"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Desktop arrows on image edge */}
                            <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                                <button
                                    onClick={() => paginate(-1)}
                                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-900 shadow-lg hover:bg-white transition-colors"
                                    aria-label="Previous"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-900 shadow-lg hover:bg-white transition-colors"
                                    aria-label="Next"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}