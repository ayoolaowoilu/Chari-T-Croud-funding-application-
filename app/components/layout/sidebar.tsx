import {
  BookDashedIcon,
  CircleQuestionMark,
  HandHeart,
  House,
  PersonStandingIcon,
  Info,
  TrendingUp,
  Newspaper,
  ShieldCheck,
  Megaphone,
  Users,
  Landmark,
  ArrowRight,
  X,
  ChevronRight,
  LogIn,
  UserPlus,
  HouseHeart,
  UserCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/button";
import Link from "next/link";

interface SideBarProps {
  show: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ show, onClose, isAuthenticated }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setAboutOpen(false);
      setInvolvedOpen(false);
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  const mainLinks = [
    { name: "View Causes", icon: HandHeart, href: "/causes/get", color: "bg-emerald-50 text-emerald-600" },
    { name: "Start Cause", icon: BookDashedIcon, href: "/startcauses", color: "bg-blue-50 text-blue-600" },
  ];

  const aboutLinks = [
    { name: "Our Story", icon: Info, href: "/about" },
    { name: "How It Works", icon: ShieldCheck, href: "/how-it-works" },
    { name: "Impact Report", icon: TrendingUp, href: "/impact" },
    { name: "Blog & News", icon: Newspaper, href: "/blog" },
  ];

  const involvedLinks = [
    { name: "Start a Cause", icon: Megaphone, href: "/startcauses" },
    { name: "Donate Now", icon: HandHeart, href: "/causes/get" },
    { name: "Volunteer", icon: Users, href: "/volunteer" },
    { name: "Partner With Us", icon: Landmark, href: "/partners" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-screen w-[320px] bg-white shadow-2xl flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Actions */}
        <div className="p-4 space-y-2">
          {isAuthenticated && (
            <Link
              href="/dashboard/donor"
              onClick={onClose}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              <House size={20} />
              <span className="font-medium">Dashboard</span>
              <ChevronRight size={16} className="ml-auto opacity-60" />
            </Link>
          )}

          {mainLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors group"
            >
              <div className={`w-9 h-9 ${link.color} rounded-lg flex items-center justify-center`}>
                <link.icon size={18} />
              </div>
              <span className="font-medium">{link.name}</span>
              <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600" />
            </Link>
          ))}
        </div>

        {/* About Section */}
        <div className="px-4">
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="flex items-center justify-between w-full p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            About
            <ChevronRight size={16} className={`transition-transform ${aboutOpen ? "rotate-90" : ""}`} />
          </button>

          {aboutOpen && (
            <div className="space-y-1 pb-2">
              {aboutLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <link.icon size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Get Involved Section */}
        <div className="px-4">
          <button
            onClick={() => setInvolvedOpen(!involvedOpen)}
            className="flex items-center justify-between w-full p-3 text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Get Involved
            <ChevronRight size={16} className={`transition-transform ${involvedOpen ? "rotate-90" : ""}`} />
          </button>

          {involvedOpen && (
            <div className="space-y-1 pb-2">
              {involvedLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <link.icon size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
       <div className="px-4 pb-4">
          <div className="border-t border-gray-100 pt-4 space-y-1">
            <Link
              href="/dashboard/centers/local-centers"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <HouseHeart size={18} className="text-gray-400" />
              <span className="text-sm font-medium">Local Charites</span>
            </Link>
          </div>
        </div>

          <div className="px-4 pb-4">
          <div className="border-t border-gray-100 pt-4 space-y-1">
            <Link
              href="/dashboard/donor?goto=profile"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <UserCircle2 size={18} className="text-gray-400" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="px-4 pb-4">
          <div className="border-t border-gray-100 pt-4 space-y-1">
            <Link
              href="/faq"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <CircleQuestionMark size={18} className="text-gray-400" />
              <span className="text-sm font-medium">FAQ's</span>
            </Link>
          </div>
        </div>

        

       
        {!isAuthenticated && (
          <div className="mt-auto p-4 border-t border-gray-100 space-y-2">
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full p-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              <LogIn size={18} />
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full p-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <UserPlus size={18} />
              Sign Up
            </Link>
          </div>
        )}

       
        <div className="p-4 text-center">
          <p className="text-xs text-gray-400">Chari-T — Making giving simple</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;