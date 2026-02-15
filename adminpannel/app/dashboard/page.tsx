"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/me`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Unauthorized")
        setLoading(false)
      } catch (err) {
        localStorage.removeItem("isAdmin")
        router.push("/login")
      }
    }
    verify()
  }, [router])

  if (loading) return <div className="min-h-screen">Checking session...</div>

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <p>Welcome to the admin dashboard. Add your controls here.</p>
        </main>
      </div>
    </div>
  )
}
