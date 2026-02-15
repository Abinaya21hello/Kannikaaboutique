"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  BarChart3,
  FileText,
  Shield,
  HelpCircle
} from "lucide-react"

type Props = {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname() || "/"
  const [collapsed, setCollapsed] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard" || pathname === "/"
    return pathname.startsWith(path)
  }

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "blue" },
    { href: "/new-arrivals", label: "New Arrivals", icon: Sparkles, color: "purple" },
        { href: "/carousel", label: "Carousel", icon: FileText, color: "maroon" },

        { href: "/Subscribers", label: "Subscribers", icon: FileText, color: "pink" },

    { href: "/users", label: "Users", icon: Users, color: "green" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, color: "orange" },
    { href: "/reports", label: "Reports", icon: FileText, color: "red" },
  ]

  const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: Settings, color: "gray" },
    { href: "/security", label: "Security", icon: Shield, color: "indigo" },
    { href: "/help", label: "Help & Support", icon: HelpCircle, color: "teal" },
  ]

  const linkClass = (active: boolean, collapsed: boolean) => {
    return `relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
      active 
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25" 
        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
    } ${collapsed ? "justify-center" : ""}`
  }

  const iconClass = (active: boolean, color: string) => {
    const colorClasses = {
      blue: "text-blue-500",
      purple: "text-purple-500",
      green: "text-green-500",
      orange: "text-orange-500",
      red: "text-red-500",
      gray: "text-gray-500",
      indigo: "text-indigo-500",
      teal: "text-teal-500",
    }
    
    return `w-5 h-5 ${active ? "text-white" : colorClasses[color as keyof typeof colorClasses]}`
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside 
        className={`hidden md:block relative bg-white border-r border-gray-200/80 min-h-screen transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo area */}
        <div className={`h-16 flex items-center ${collapsed ? "justify-center" : "px-4"} border-b border-gray-200/80`}>
          {collapsed ? (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-800">Admin<span className="text-blue-500">Portal</span></span>
            </div>
          )}
        </div>

        {/* Search bar (expanded only) */}
        {/* {!collapsed && (
          <div className="px-3 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-gray-100/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        )} */}

        {/* Main navigation */}
        <nav className={`mt-10 ${collapsed ? "px-2" : "px-3"} space-y-1`}>
          {mainNavItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(active, collapsed)}
                onMouseEnter={() => collapsed && setShowTooltip(item.label)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Icon className={iconClass(active, item.color)} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                
                {/* Active indicator */}
                {active && !collapsed && (
                  <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
                )}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && showTooltip === item.label && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Secondary navigation */}
        <div className={`absolute bottom-0 left-0 right-0 ${collapsed ? "px-2" : "px-3"} py-4 border-t border-gray-200/80`}>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(active, collapsed)}
                  onMouseEnter={() => collapsed && setShowTooltip(item.label)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Icon className={iconClass(active, item.color)} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  
                  {collapsed && showTooltip === item.label && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}

            {/* Logout button */}
            <button
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 group ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={() => {/* handle logout */}}
              onMouseEnter={() => collapsed && setShowTooltip("Logout")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
              
              {collapsed && showTooltip === "Logout" && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </nav>
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        
        <aside className="relative w-72 h-full bg-white shadow-2xl">
          {/* Mobile header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-800">AdminPortal</span>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile search */}
          {/* <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div> */}

          {/* Mobile navigation */}
          <nav className="px-3 py-2 space-y-1">
            {[...mainNavItems, ...secondaryNavItems].map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    active 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-white" : `text-${item.color}-500`}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile footer */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={() => {/* handle logout */}}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}