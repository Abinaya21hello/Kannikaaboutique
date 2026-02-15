"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type AdminUser = {
  _id: string
  name: string
  email: string
  role?: string
} | null

type AuthContextType = {
  user: AdminUser
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/me`, {
        credentials: "include",
      })
      if (!res.ok) {
        setUser(null)
        return
      }
      const body = await res.json()
      if (body && body.success && body.data) {
        setUser(body.data)
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    }
  }

  useEffect(() => {
    let mounted = true

    // Try hydrate from localStorage first for instant UI update
    try {
      const raw = localStorage.getItem("adminUser")
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser(parsed)
      }
    } catch (err) {
      // ignore
    }

    ;(async () => {
      if (!mounted) return
      setLoading(true)
      await refresh()
      if (mounted) setLoading(false)
    })()

    const onAuthChanged = () => refresh()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "adminUser") refresh()
    }

    window.addEventListener("auth:changed", onAuthChanged)
    window.addEventListener("storage", onStorage)

    return () => {
      mounted = false
      window.removeEventListener("auth:changed", onAuthChanged)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      // ignore
    }
    setUser(null)
    try {
      localStorage.removeItem("isAdmin")
      localStorage.removeItem("adminUser")
      window.dispatchEvent(new Event("auth:changed"))
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
