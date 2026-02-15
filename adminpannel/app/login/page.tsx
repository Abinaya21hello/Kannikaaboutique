"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, Shield, Activity, Server, Globe } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/me`, {
          credentials: "include",
        })
        if (res.ok) {
          router.replace("/dashboard")
          return
        }
      } catch (err) {
        // not authenticated
      } finally {
        setChecking(false)
      }
    }

    check()
  }, [router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")

      try {
        localStorage.setItem("isAdmin", "true")
      } catch {}

      try {
        if (data && data.data) {
          localStorage.setItem("adminUser", JSON.stringify(data.data))
        }
        window.dispatchEvent(new Event("auth:changed"))
      } catch {}

      router.replace("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">Admin<span className="text-purple-400">Portal</span></span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-purple-200/80">Sign in to access your admin dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-300/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-300/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-purple-200/60">
              Secure admin access only
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
          <div className="max-w-lg">
            {/* Main illustration */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-2xl p-4">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4">
                      <Server className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-white/20 rounded-2xl p-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <h2 className="text-4xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-xl text-white/80 mb-6">
              Complete control over your platform with advanced analytics, user management, and system monitoring.
            </p>

            {/* Feature list */}
            <div className="space-y-3">
              {[
                "Real-time analytics and reporting",
                "User management and permissions",
                "System health monitoring",
                "Content management system",
                "Security logs and audit trails"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}