"use client"

import LoginForm from "@/app/components/auth/loginForm";
import Button from "@/app/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion"
import { HandHeart, Heart, ArrowRight, Shield, Users } from "lucide-react";
import { Logo } from "@/app/components/layout/footer";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-150">
                
                {/* Left Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8">
                           <div className="mb-4">
                            <Logo nav />
                           </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Sign in to your account
                            </h1>
                            <p className="text-gray-500">
                                Join thousands making an impact every day
                            </p>
                        </div>

                        <LoginForm />

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 text-center">
                                Read our <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Use</a> & <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image & Info */}
                <div className="hidden md:block w-1/2 relative bg-gray-900">
                    <Image
                        src={"/slider1/happy-family-having-nice-thanksgiving-dinner-together.jpg"}
                        alt="Family celebrating together"
                        fill
                        className="object-cover"
                        priority
                    />
                    
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badge */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute top-6 left-6 right-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full w-fit shadow-lg"
                    >
                        <HandHeart className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Crowdfunding for Good</span>
                    </motion.div>

                    {/* Bottom Info Card */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">About Chari-T</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    We connect compassionate donors with verified causes worldwide. 
                                    Every contribution creates real change in communities that need it most.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span>12k+ Donors</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span>Verified Causes</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4 text-blue-600" />
                                <span>100% Transparent</span>
                            </div>
                        </div>

                        <Button 
                            className="w-full" 
                            size="sm" 
                            details={
                                <span className="flex items-center justify-center gap-2">
                                    Read more <ArrowRight className="w-4 h-4" />
                                </span>
                            } 
                            variant="secondary"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}