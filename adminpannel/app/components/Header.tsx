"use client"
import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { 
  Menu, 
  LogOut, 
  Bell, 
  User, 
  Settings, 
  Search,
  ChevronDown,
  LayoutGrid,
  Command,
  Activity,
  Globe
} from "lucide-react"

type Props = {
  onToggleSidebar?: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function Header({ onToggleSidebar }: Props) {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New user registered", time: "5 min ago", read: false, type: "user" },
    { id: 2, text: "System update available", time: "1 hour ago", read: false, type: "system" },
    { id: 3, text: "New order #12345", time: "2 hours ago", read: true, type: "order" },
    { id: 4, text: "Security alert", time: "3 hours ago", read: false, type: "alert" },
  ])

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const commandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShowCommandPalette(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const auth = useAuth()

  const handleLogout = async () => {
    try {
      await auth.logout()
    } catch (err) {
      // fallback: try server logout
      try {
        await fetch(`${API_URL}/api/admin/logout`, {
          method: "POST",
          credentials: "include",
        })
      } catch {}
      try {
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("adminUser")
        window.dispatchEvent(new Event("auth:changed"))
      } catch {}
    }
    router.push("/login")
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'user': return <User className="w-4 h-4 text-emerald-400" />
      case 'system': return <Activity className="w-4 h-4 text-blue-400" />
      case 'order': return <LayoutGrid className="w-4 h-4 text-amber-400" />
      case 'alert': return <Bell className="w-4 h-4 text-rose-400" />
      default: return <Bell className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white/60 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => onToggleSidebar?.()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden group"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-slate-700 group-hover:text-slate-900" />
            </button>

          {/* Search bar with command palette */}
          {/* <div className="hidden md:block max-w-md flex-1">
            <button
              onClick={() => setShowCommandPalette(true)}
              className={`w-full relative transition-all duration-200 ${
                searchFocused ? 'scale-105' : ''
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <div className="w-full pl-9 pr-12 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 text-left cursor-pointer hover:bg-gray-800 hover:border-gray-600 transition-colors">
                Search or type command...
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded text-gray-300 border border-gray-600">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded text-gray-300 border border-gray-600">K</kbd>
              </div>
            </button>
          </div> */}
        </div>

        {/* Command Palette Modal */}
        {showCommandPalette && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-white/40 backdrop-blur-sm">
            <div 
              ref={commandRef}
              className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
            >
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Command className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent border-0 text-slate-700 placeholder-slate-400 focus:outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium text-gray-400 px-3 py-2">Quick actions</div>
                {['Go to Dashboard', 'Create New User', 'View Reports', 'System Settings'].map((action, i) => (
                  <button
                    key={i}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-50 rounded-lg flex items-center gap-3"
                  >
                    <Activity className="w-4 h-4 text-slate-400" />
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right section - Professional Gray Theme */}
        <div className="flex items-center gap-1">
      
          {/* <button
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
            aria-label="Applications"
          >
            <LayoutGrid className="w-5 h-5 text-gray-300 group-hover:text-white" />
          </button> */}

          {/* Notifications */}
          {/* <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-300 group-hover:text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-200">Notifications</h3>
                    <span className="text-xs text-gray-400">{unreadCount} unread</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-700/50 last:border-0 ${
                        !notification.read ? 'bg-gray-700/30' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-200">{notification.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-700">
                  <button className="w-full px-3 py-1.5 text-sm text-center text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* User menu */}
          <div className="relative ml-2" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center ring-1 ring-gray-200 group-hover:shadow-sm transition-all">
                <User className="w-4 h-4 text-slate-700" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-slate-800">{auth.user?.name ?? 'Admin User'}</div>
                <div className="text-xs text-slate-500">{auth.user?.email ?? 'admin@example.com'}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center ring-1 ring-gray-100">
                      <User className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{auth.user?.name ?? 'Admin User'}</div>
                      <div className="text-xs text-slate-500">{auth.user?.role ?? 'Administrator'}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    Profile
                  </button>
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    Settings
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-slate-500" />
                    Language
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {/* <div className="md:hidden px-4 pb-3">
        <button
          onClick={() => setShowCommandPalette(true)}
          className="w-full relative"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <div className="w-full pl-9 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 text-left">
            Search...
          </div>
        </button>
      </div> */}

      {/* Status bar */}
      {/* <div className="hidden md:block px-4 py-1 bg-gray-900/50 border-t border-gray-700/30">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400">System online</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400">98% uptime</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400">Production</span>
          </div>
        </div>
      </div> */}
    </header>
  )
}