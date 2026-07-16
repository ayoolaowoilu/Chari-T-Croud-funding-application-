"use client";
import {
  ChevronDown,
  CircleHelp,
  Menu,
  User,
  GraduationCap,
  Stethoscope,
  Globe,
  BriefcaseBusiness,
  HandHeart,
  Users,
  Megaphone,
  Info,
  ShieldCheck,
  FileText,
  Mail,
  Newspaper,
  TrendingUp,
  Landmark,
  ArrowRight,
  History,
  X,
} from "lucide-react";
import Button from "../ui/button";
import { useEffect, useState } from "react";
import SideBar from "./sidebar";
import { redirect, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "./footer";
import Link from "next/link";

export default function NavBar() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [getInvolvedOpen, setGetInvolvedOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [baRshown, setBarshown] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setAboutOpen(false);
    setGetInvolvedOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated") {
      const publicPaths = [
        "/makedonations",
        "/causes/get",
        "/causes/cause",
        "/",
        "/about",
        "/t&c",
        "/privacy-policy",
        "/dashboard/centers/profile",
        "/causes/flier",
        "/dashboard/centers/local-centers",
        "/blog",
        "/contact",
        "/faq",
        "/how-it-works",
        "/reports",
        "/profile"
      ];
      if (!publicPaths.includes(pathname)) {
        return redirect(`/auth/signin?redir=${window.location.href}`);
      }
    }
  }, [status, pathname]);

  const categories = [
    { name: "Health", icon: Stethoscope, color: "bg-rose-50 text-rose-600", href: "/causes/get?category=Health" },
    { name: "Education", icon: GraduationCap, color: "bg-blue-50 text-blue-600", href: "/causes/get?category=Education" },
    { name: "Community", icon: Globe, color: "bg-violet-50 text-violet-600", href: "/causes/get?category=Community" },
    { name: "Business", icon: BriefcaseBusiness, color: "bg-sky-50 text-sky-600", href: "/causes/get?category=Business" },
    { name: "Crowdfunding", icon: TrendingUp, color: "bg-orange-50 text-orange-600", href: "/causes/get?category=CroudFunding" },
  ];

  const aboutLinks = [
    { name: "Our Story", desc: "How Chari-T started and our mission", icon: Info, href: "/about" },
    { name: "How It Works", desc: "Simple steps to donate or start a cause", icon: ShieldCheck, href: "/how-it-works" },
    { name: "Safety Ratings", desc: "How we help you donate with confidence", icon: TrendingUp, href: "/how-it-works#ratings" },
    { name: "Blog & News", desc: "Latest updates and stories", icon: Newspaper, href: "/blog" },
  ];

  const getInvolvedLinks = [
    { name: "Start a Cause", desc: "Launch your own fundraising campaign", icon: Megaphone, href: "/startcauses" },
    { name: "Donate Now", desc: "Find causes that need your support", icon: HandHeart, href: "/causes/get" },
    { name: "Local Charities", desc: "Discover verified centers near you", icon: Users, href: "/dashboard/centers/local-centers" },
    { name: "Partner With Us", desc: "Corporate and organization partnerships", icon: Landmark, href: "/contact" },
  ];

  const openAbout = () => {
    setAboutOpen(true);
    setGetInvolvedOpen(false);
    setCategoriesOpen(false);
  };
  const openGetInvolved = () => {
    setAboutOpen(false);
    setGetInvolvedOpen(true);
    setCategoriesOpen(false);
  };
  const openCategories = () => {
    setAboutOpen(false);
    setGetInvolvedOpen(false);
    setCategoriesOpen(true);
  };

  return (
    <>
      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">

        {/* Desktop Nav - taller padding */}
        <div className="hidden md:block md:px-6 py-2">
          <div className="max-w-7xl mx-auto flex justify-between h-14">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-1">
              <Link href="/" className="mr-6">
                <Logo nav />
              </Link>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={openAbout}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                  About
                  <ChevronDown size={14} className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
                </button>
                {aboutOpen && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-80 overflow-hidden">
                      <div className="p-2">
                        {aboutLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                              <link.icon size={18} className="text-gray-500 group-hover:text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{link.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Get Involved Dropdown */}
              <div
                className="relative"
                onMouseEnter={openGetInvolved}
                onMouseLeave={() => setGetInvolvedOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                  Get Involved
                  <ChevronDown size={14} className={`transition-transform duration-200 ${getInvolvedOpen ? "rotate-180" : ""}`} />
                </button>
                {getInvolvedOpen && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-80 overflow-hidden">
                      <div className="p-2">
                        {getInvolvedLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-50 transition-colors shrink-0">
                              <link.icon size={18} className="text-gray-500 group-hover:text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{link.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View Causes Dropdown */}
              <div
                className="relative"
                onMouseEnter={openCategories}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                  View Causes
                  <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-md overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <CircleHelp size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 text-sm">Browse by Category</span>
                          <p className="text-xs text-gray-500 mt-0.5">Find causes that match your passion</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 p-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
                          >
                            <div className={`w-11 h-11 ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <cat.icon size={20} />
                            </div>
                            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 text-center">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="px-4 pb-4">
                        <Link
                          href="/causes/get"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          View All Causes
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/dashboard/centers/local-centers" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                Local Charities
              </Link>
              <Link href="/startcauses" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                Start Cause
              </Link>
              {status === "authenticated" && (
                <Link href="/dashboard/donor" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right: Donate + Profile */}
            <div className="flex items-center gap-3">
              <Link
                href="/causes/get"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md"
              >
                <HandHeart size={16} />
                Donate
              </Link>

              <div className="flex items-center gap-2">
                {status === "authenticated" ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setProfileDropDown(true)}
                    onMouseLeave={() => setProfileDropDown(false)}
                  >
                    <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden">
                        <img src={session?.user.image || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">{session.user.name?.split(" ")[0]}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {profileDropDown && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-2 z-50 overflow-hidden">
                        <div className="flex items-center gap-3 px-3 pb-3 mb-2 border-b border-gray-100">
                          <img src={session?.user.image || "/default-avatar.png"} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">{session?.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session?.user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <button onClick={() => redirect("/dashboard/donor?goto=profile")} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                            <User size={16} className="text-gray-400" /> Profile
                          </button>
                          <button onClick={() => redirect("/dashboard/donor?goto=explore")} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" /> Track Campaigns
                          </button>
                          <button onClick={() => redirect("/dashboard/donor?goto=history")} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                            <History size={16} className="text-gray-400" /> Donation history
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                            <ArrowRight size={16} className="rotate-90" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    details="Sign in"
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => (window.location.href = `/auth/signin?redir=${pathname}`)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav - thinner, cleaner */}
        <div className="md:hidden px-3 py-1.5">
          <div className="flex items-center justify-between h-11">
            {/* Mobile: Logo */}
            <Link href="/" className="flex items-center">
              <Logo nav />
            </Link>

            {/* Mobile: Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Donate Button (compact) */}
              <Link
                href="/causes/get"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <HandHeart size={14} />
                <span className="hidden xs:inline">Donate</span>
              </Link>

              {/* Mobile Profile / Sign In */}
              {status === "authenticated" ? (
                <button
                  onClick={() => setProfileDropDown(!profileDropDown)}
                  className="relative w-8 h-8 rounded-full border border-gray-200 overflow-hidden"
                >
                  <img src={session?.user.image || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                </button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  details="Sign in"
                  className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-2.5 py-1.5"
                  onClick={() => (window.location.href = `/auth/signin?redir=${pathname}`)}
                />
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setBarshown(!baRshown)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {baRshown ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Profile Dropdown Overlay */}
      {profileDropDown && status === "authenticated" && (
        <div className="md:hidden fixed top-12 right-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 px-2 z-50">
          <div className="flex items-center gap-2.5 px-2 pb-2 mb-1.5 border-b border-gray-100">
            <img src={session?.user.image || "/default-avatar.png"} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-xs truncate">{session?.user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{session?.user.email}</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <button onClick={() => { setProfileDropDown(false); redirect("/dashboard/donor?goto=profile"); }} className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <User size=
              {14} className="text-gray-400" /> Profile
            </button>
            <button onClick={() => { setProfileDropDown(false); redirect("/dashboard/donor?goto=explore"); }} className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <FileText size={14} className="text-gray-400" /> Track Campaigns
            </button>
            <button onClick={() => { setProfileDropDown(false); redirect("/dashboard/donor?goto=history"); }} className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              <History size={14} className="text-gray-400" /> Donation History
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button onClick={() => { setProfileDropDown(false); signOut({ callbackUrl: "/" }); }} className="w-full text-left px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
              <ArrowRight size={14} className="rotate-90" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-14 md:h-16" />

      <SideBar
        onClose={() => setBarshown(!baRshown)}
        isAuthenticated={status === "authenticated"}
        show={baRshown}
      />
    </>
  );
}