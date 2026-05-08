"use client";

import { ChevronDown, CircleHelp, Fullscreen, Menu, Search, User } from "lucide-react";

import Button from "../ui/button";
import { useEffect, useState } from "react";
import LoadingCards from "./loadingCards";
import SideBar from "./sidebar";
import { redirect, usePathname } from "next/navigation";

import { useSession } from "next-auth/react"
import { Logo } from "./footer";


export default function NavBar() {
    const [wcu, setWcu] = useState(false);
    const [faq, setFaq] = useState(false);
    const [searchIndex, setSearchIndex] = useState("");
    const [baRshown, setBarshown] = useState(false);
    const [profileDropDown, setProfileDropDown] = useState(false)
    const pathname = usePathname()

    const { data: session, status } = useSession()
   useEffect(()=>{
      
   },[])
    useEffect(() => {
        if (status === "unauthenticated") {
             if(pathname === "/makedonations" || pathname === "/causes/get" || pathname === "/causes/cause" || pathname === "/"){  
           return
       }else{
             return redirect(`/auth/signin?redir=${pathname}`)
       }
           
        }
       
    }, [status])





    return (
        <>
            <nav className="px-6 py-1 shadow bg-white border-b border-gray-100 fixed top-0 w-full z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div className="hidden md:flex items-center gap-8 w-full">
                        <a href="/" className="text-2xl  text-gray-900 tracking-tight">
           <Logo nav />
                        </a>



                        <div
                            className="relative"
                            onMouseEnter={() => setWcu(true)}
                            onMouseLeave={() => setWcu(false)}
                        >
                            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2">
                                <span className="text-sm font-medium">Why Us</span>
                                <ChevronDown size={16} className={`transition-transform ${wcu ? 'rotate-180' : ''}`} />
                            </button>

                            {wcu && (
                                <div className="absolute top-full left-0 pt-2">
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-64 p-4">
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <User size={16} className="text-blue-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">Why Choose Us</span>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                            We deliver globally with transparency and measurable impact.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div
                            className="relative"
                            onMouseEnter={() => setFaq(true)}
                            onMouseLeave={() => setFaq(false)}
                        >
                            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2">
                                <span className="text-sm font-medium">FAQ</span>
                                <ChevronDown size={16} className={`transition-transform ${faq ? 'rotate-180' : ''}`} />
                            </button>

                            {faq && (
                                <div className="absolute top-full left-0 pt-2">
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-72 p-4">
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                <CircleHelp size={16} className="text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">Frequently Asked Questions</span>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                            Find answers to common questions about donations and our process.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                        >
                            <button onClick={()=>redirect("/startcauses")} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2">
                                <span className="text-sm font-medium">Start Cause</span>

                            </button>
                        </div>

                        
                        <div
                        >
                            <button onClick={()=>redirect("/causes/get")} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2">
                                <span className="text-sm font-medium">View causes</span>

                            </button>
                        </div> 

                       {status == "authenticated" && (
                            <div
                        >
                            <button onClick={()=>redirect("/dashboard/donor")} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2">
                                <span className="text-sm font-medium">DashBoard</span>

                            </button>
                        </div> 
                       )}




                        {/* <div className="relative w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                onChange={(e) => setSearchIndex(e.target.value)}
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Search causes..."
                            />
                        </div> */}


                    </div>






                    <div className="flex flex-row space-x-2 justify-between md:justify-end w-full md:w-64">

                        <a href="/" className="text-2xl flex space-x-2  text-gray-900 tracking-tight md:hidden">
                           <Logo nav />
                       
                        </a>



                        <div className="flex space-x-2">

                            {status == "authenticated" ? (
                                <div className="">
                                    <div
                                        onMouseEnter={() => setProfileDropDown(true)}
                                        onMouseLeave={() => setProfileDropDown(false)}
                                        className="flex justify-end items-center space-x-3  rounded-xl   cursor-pointer relative"
                                    >
                                        <div className="overflow-hidden rounded-full border-2 border-gray-200">
                                            <img
                                                src={session?.user.image || "/default-avatar.png"}
                                                width={40}
                                                height={40}
                                               alt="l"
                                                className="object-cover "
                                            />
                                        </div>

                                        <small className="text-black hidden md:block">{session.user.name}</small>

                                        



                                        {profileDropDown && (
                                            <div className="absolute right-0 top-14 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-3 px-4 z-50">
                                                <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
                                                    <img
                                                        src={session?.user.image || "/default-avatar.png"}
                                                        width={40}
                                                        height={40}
                                                        alt="l"
                                                        className="rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{session?.user.name}</p>
                                                        <p className="text-sm text-gray-500">{session?.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <button onClick={()=>redirect("/dashboard/donor?goto=profile")} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        Profile
                                                    </button>
                                                    <button onClick={()=>redirect("/dashboard/donor?goto=settings")}  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        Settings
                                                    </button>
                                                    <button

                                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}


                                    </div>




                                </div>) :
                                (<Button
                                    size="sm"
                                    variant="secondary"
                                    details="Sign in"
                                    className="bg-blue-600 hover:bg-blue-700  text-white"
                                    onClick={() => window.location.href = `/auth/signin?redir=${pathname}`}
                                />)
                            }
                            <div onClick={() => setBarshown(!baRshown)} className="md:hidden bg-gray-300 rounded p-2 text-gray-900 hover:opacity-50">
                                <Menu size={25} />
                            </div>



                        </div>


                    </div>




                </div>
            </nav>

            {/* Spacer for fixed nav */}
            <div className="h-10" />
            <SideBar onClose={() => setBarshown(!baRshown)} isAuthenticated={status === "authenticated" ? true : false} show={baRshown} />
           

        
        </>
    );
} 2