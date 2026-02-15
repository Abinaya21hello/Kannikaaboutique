"use client"
import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { 
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiEdit2,
  FiSave,
  FiX,
  FiDownload,
  FiRefreshCw,
  FiUsers,
  FiMessageCircle,
  FiSearch,
  FiFilter,
  FiCalendar
} from "react-icons/fi"
import { FaWhatsapp, FaSpinner, FaCopy, FaCheckCircle, FaTrash } from "react-icons/fa"

const API = "http://localhost:5000/api/contact"

export default function ContactPage() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<any[]>([])
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscribersLoading, setSubscribersLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [copySuccess, setCopySuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  })
  const [token] = useState(localStorage.getItem('token') || '')

  // Form state for contact info
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    workingHours: "",
    facebook: "",
    instagram: "",
    twitter: "",
    pinterest: "",
    youtube: ""
  })

  // 📌 Fetch contact info
  const fetchContactInfo = async () => {
    try {
      const res = await fetch(`${API}/info`)
      const data = await res.json()
      setContactInfo(data)
      if (data) {
        setForm({
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          workingHours: data.workingHours || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          pinterest: data.pinterest || "",
          youtube: data.youtube || ""
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 📌 Fetch subscribers (Admin only)
  const fetchSubscribers = async () => {
    setSubscribersLoading(true)
    try {
      const res = await fetch(`${API}/subscribers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.status === 401) {
        alert("Unauthorized. Please login as admin.")
        return
      }
      
      if (res.ok) {
        const data = await res.json()
        console.log("Subscribers fetched:", data)
        setSubscribers(data)
        setFilteredSubscribers(data)
        calculateStats(data)
      }
    } catch (err) {
      console.error("Error fetching subscribers:", err)
      alert("Error fetching subscribers")
    } finally {
      setSubscribersLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = (data: any[]) => {
    const now = new Date()
    const today = new Date(now.setHours(0, 0, 0, 0))
    const weekAgo = new Date(now.setDate(now.getDate() - 7))
    const monthAgo = new Date(now.setMonth(now.getMonth() - 1))

    setStats({
      total: data.length,
      today: data.filter(s => new Date(s.createdAt) >= today).length,
      thisWeek: data.filter(s => new Date(s.createdAt) >= weekAgo).length,
      thisMonth: data.filter(s => new Date(s.createdAt) >= monthAgo).length
    })
  }

  useEffect(() => {
    Promise.all([fetchContactInfo(), fetchSubscribers()])
      .then(() => setLoading(false))
  }, [])

  // Filter subscribers based on search and date
  useEffect(() => {
    let filtered = [...subscribers]
    
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.phone.includes(searchTerm) || 
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter(sub => 
        new Date(sub.createdAt).toDateString() === filterDate.toDateString()
      )
    }
    
    setFilteredSubscribers(filtered)
  }, [searchTerm, dateFilter, subscribers])

  // 📌 Update contact info
  const updateContactInfo = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API}/info`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Failed to update')

      const data = await res.json()
      setContactInfo(data)
      setEditing(false)
      alert("✅ Contact information updated successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error updating contact information")
    } finally {
      setLoading(false)
    }
  }

  // 📌 Delete subscriber (if you have delete endpoint)
  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return
    
    try {
      const res = await fetch(`${API}/subscriber/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        setSubscribers(subscribers.filter(s => s._id !== id))
        alert("✅ Subscriber deleted successfully!")
      }
    } catch (error) {
      console.error(error)
      alert("❌ Error deleting subscriber")
    }
  }

  // 📌 Export subscribers to CSV
  const exportToCSV = () => {
    const headers = ['Phone Number', 'Name', 'Subscribed Date', 'Subscribed Time']
    const csvData = filteredSubscribers.map(sub => [
      sub.phone,
      sub.name || 'N/A',
      new Date(sub.createdAt).toLocaleDateString(),
      new Date(sub.createdAt).toLocaleTimeString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `whatsapp-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // 📌 Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(type)
    setTimeout(() => setCopySuccess(''), 2000)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 🔥 SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* 🔥 HEADER */}
        <Header />

        {/* CONTENT */}
        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaWhatsapp className="text-green-500" />
                WhatsApp Subscribers
              </h1>
              <p className="text-gray-500 mt-1">Manage your WhatsApp subscription list</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchSubscribers}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all"
              >
                <FiRefreshCw className={subscribersLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="bg-green-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-green-600 transition-all"
                disabled={filteredSubscribers.length === 0}
              >
                <FiDownload />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiUsers size={28} />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
              <p className="text-pink-100">Total Subscribers</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiCalendar size={28} />
                <span className="text-3xl font-bold">{stats.today}</span>
              </div>
              <p className="text-blue-100">Today</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiClock size={28} />
                <span className="text-3xl font-bold">{stats.thisWeek}</span>
              </div>
              <p className="text-green-100">This Week</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiMessageCircle size={28} />
                <span className="text-3xl font-bold">{stats.thisMonth}</span>
              </div>
              <p className="text-orange-100">This Month</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiPhone className="text-pink-500" />
                  Contact Information
                </h2>

                {contactInfo ? (
                  <div className="space-y-4">
                    {contactInfo.whatsapp && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FaWhatsapp className="text-green-500 text-xl" />
                          <div>
                            <p className="text-xs text-gray-500">WhatsApp</p>
                            <p className="font-medium text-gray-800">{contactInfo.whatsapp}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(contactInfo.whatsapp, 'whatsapp')}
                          className="text-gray-400 hover:text-green-500"
                        >
                          {copySuccess === 'whatsapp' ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                        </button>
                      </div>
                    )}

                    {contactInfo.phone && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FiPhone className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium text-gray-800">{contactInfo.phone}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          {copySuccess === 'phone' ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                        </button>
                      </div>
                    )}

                    {contactInfo.email && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FiMail className="text-purple-500" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-800">{contactInfo.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(contactInfo.email, 'email')}
                          className="text-gray-400 hover:text-purple-500"
                        >
                          {copySuccess === 'email' ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No contact info</p>
                )}
              </div>
            </div>

            {/* Right Column - Subscribers List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by phone number..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <input
                    type="date"
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>

                {/* Subscribers List */}
                {subscribersLoading ? (
                  <div className="flex justify-center py-12">
                    <FaSpinner className="animate-spin text-pink-500 text-3xl" />
                  </div>
                ) : filteredSubscribers.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 text-sm font-medium text-gray-500 px-4 py-2">
                      <div className="col-span-1">#</div>
                      <div className="col-span-4">Phone Number</div>
                      <div className="col-span-4">Subscribed Date</div>
                      <div className="col-span-3">Actions</div>
                    </div>
                    
                    {filteredSubscribers.map((sub, index) => (
                      <div key={sub._id} className="grid grid-cols-12 items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="col-span-1 font-medium text-gray-500">{index + 1}</div>
                        <div className="col-span-4 flex items-center gap-2">
                          <FaWhatsapp className="text-green-500" />
                          <span className="font-medium text-gray-800">{sub.phone}</span>
                        </div>
                        <div className="col-span-4 text-gray-600">
                          {formatDate(sub.createdAt)}
                        </div>
                        <div className="col-span-3 flex gap-2">
                          <button
                            onClick={() => copyToClipboard(sub.phone, sub._id)}
                            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                            title="Copy number"
                          >
                            {copySuccess === sub._id ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                          </button>
                          <a
                            href={`https://wa.me/${sub.phone.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <FaWhatsapp />
                          </a>
                        </div>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                      Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaWhatsapp className="mx-auto text-gray-300 text-5xl mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No subscribers yet</h3>
                    <p className="text-gray-500">WhatsApp subscribers will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}