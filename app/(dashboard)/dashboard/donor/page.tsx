"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import Dash from "@/app/components/dashboad/dashDon"
import Profile from "@/app/components/dashboad/profile"
import Explore from "@/app/components/dashboad/yourCam"
import NavBar from "@/app/components/layout/NavBar"
import { 
  LayoutDashboard, 
  Compass, 
  History, 
  User, 
  Settings,
  LogOut,
  ChevronRight,
  HouseHeart,
  Menu,
  X
} from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation"
import DonationsPage from "@/app/components/dashboad/donations"
import CharityProp from "@/app/components/dashboad/charity"

type TabId = "dashboard" | "explore" | "history" | "profile" | "charity"

interface NavItem {
  id: TabId
  label: string
  icon: React.ReactNode
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "explore", label: "Track Campaigns", icon: <Compass className="w-5 h-5" /> },
  { id: "history", label: "Donation History", icon: <History className="w-5 h-5" /> },
  { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { id: "charity", label: "Charity Centers", icon: <HouseHeart className="w-5 h-5" /> },
]

function TabContent({ activeTab }: { activeTab: TabId }) {
  switch (activeTab) {
    case "dashboard": return <Dash />
    case "explore": return <Explore />
    case "history": return  <DonationsPage />
    case "profile": return <Profile />
    case "charity": return <CharityProp />
    default: return null
  }
}


function MobileMenuButton({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed left-4 z-60 md:hidden
        flex items-center justify-center
        w-12 h-12 rounded-2xl
        transition-all duration-500 ease-out
        ${isOpen 
          ? "bg-white shadow-lg scale-95 rotate-90" 
          : "bg-white/90 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.4),0_0_40px_rgba(59,130,246,0.2),0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(59,130,246,0.3),0_6px_20px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95"
        }
      `}
      style={{
        top: "5.5rem",
      }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative">
        {/* Pulse ring animation when closed */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-blue-400/30 animate-ping" />
            <span className="absolute -inset-1 rounded-2xl bg-blue-400/20 animate-pulse" />
          </>
        )}
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700 relative z-10" strokeWidth={2.5} />
        ) : (
          <Menu className="w-5 h-5 text-blue-600 relative z-10" strokeWidth={2.5} />
        )}
      </div>
    </button>
  )
}


function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggle,
  session,
  isMobileOpen,
  onMobileClose,
}: {
  activeTab: TabId
  onTabChange: (id: TabId) => void
  collapsed: boolean
  onToggle: () => void
  session: ReturnType<typeof useSession>["data"]
  isMobileOpen: boolean
  onMobileClose: () => void
}) {
  // Close mobile menu on route/tab change
  
  const handleTabChange = useCallback((id: TabId) => {
    onTabChange(id)
      onMobileClose()
 redirect(`/dashboard/donor?goto=${id}`)
  
  }, [onTabChange, onMobileClose])

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out z-30 flex-col
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
          {!collapsed && <span className="font-semibold text-gray-900">Menu</span>}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors ml-auto"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto p-3 space-y-1 ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${activeTab === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className={activeTab === item.id ? "text-blue-600" : "text-gray-400"}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 p-3 border-t border-gray-100">
          {!collapsed ? (
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shrink-0 overflow-hidden">
                    {session?.user?.image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={session.user.image}
                        alt={session.user.name ?? "User"}
                      />
                    ) : (
                      <span>{session?.user?.name?.charAt(0).toUpperCase() ?? "U"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session?.user?.name ?? "Guest"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session?.user?.email ?? "No email"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                {session?.user?.image ? (
                  <img
                    className="w-full h-full object-cover"
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                  />
                ) : (
                  <span className="text-xs">{session?.user?.name?.charAt(0).toUpperCase() ?? "U"}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-72 bg-white z-50 md:hidden
          transition-transform duration-300 ease-out shadow-2xl
          flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
          <span className="font-bold text-lg text-gray-900">Menu</span>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold
                transition-all duration-200
                ${activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className={activeTab === item.id ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  activeTab === item.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Mobile Bottom */}
        <div className="shrink-0 p-4 border-t border-gray-100 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 px-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shrink-0 overflow-hidden shadow-md">
                {session?.user?.image ? (
                  <img className="w-full h-full object-cover" src={session.user.image} alt={session.user.name ?? "User"} />
                ) : (
                  <span>{session?.user?.name?.charAt(0).toUpperCase() ?? "U"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name ?? "Guest"}</p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email ?? "No email"}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}


function DashboardPage() {
  const searchParams = useSearchParams()
  const goto = searchParams.get("goto") as TabId | null
  const [activeTab, setActiveTab] = useState<TabId>(goto ?? "dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const { data: session } = useSession()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobileOpen])

  const handleTabChange = useCallback((id: TabId) => {
    setActiveTab(id)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      {/* Mobile Menu Button - Left side, glowing */}
      <MobileMenuButton 
        isOpen={isMobileOpen} 
        onClick={() => setIsMobileOpen(!isMobileOpen)} 
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          session={session}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <main
          className={`
            flex-1 transition-all duration-300 p-6 md:p-8 w-full
            ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"}
          `}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <TabContent activeTab={activeTab} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardPage />
    </Suspense>
  )
}