"use client"
import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { 
  FiImage, 
  FiEdit2, 
  FiTrash2, 
  FiUpload, 
  FiX,
  FiCalendar,
  FiClock,
  FiEye,
  FiPlus
} from "react-icons/fi"
import { FaSpinner, FaPlay, FaPause } from "react-icons/fa"

const API = "http://localhost:5000/api/carousel"

export default function CarouselPage() {
  const [carousels, setCarousels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [token] = useState(localStorage.getItem('token') || '')
  const [previewMode, setPreviewMode] = useState(false)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)

  const [form, setForm] = useState({
    title: "",
    description: "",
    offerEnds: ""
  })

  const [image, setImage] = useState<File | null>(null)

  // 📌 get carousels
  const fetchCarousels = async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setCarousels(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarousels()
  }, [])

  // Auto-play preview
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (previewMode && carousels.length > 0) {
      interval = setInterval(() => {
        setCurrentPreviewIndex((prev) => 
          prev === carousels.length - 1 ? 0 : prev + 1
        )
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [previewMode, carousels.length])

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Edit carousel
  const handleEdit = (item: any) => {
    setEditingItem(item)
    setForm({
      title: item.title || "",
      description: item.description || "",
      offerEnds: item.offerEnds ? new Date(item.offerEnds).toISOString().slice(0, 16) : ""
    })
    setImagePreview(item.image ? `http://localhost:5000/${item.image}` : '')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Clear form
  const clearForm = () => {
    setForm({
      title: "",
      description: "",
      offerEnds: ""
    })
    setImage(null)
    setImagePreview('')
    setEditingItem(null)
    setShowForm(false)
  }

  // 📌 add carousel
  const addCarousel = async (e: any) => {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val)
    })

    if (image) formData.append("image", image)

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) throw new Error('Failed to add carousel')

      fetchCarousels()
      clearForm()
      alert("✅ Carousel slide added successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error adding carousel slide")
    } finally {
      setUploading(false)
    }
  }

  // 📌 update carousel
  const updateCarousel = async (e: any) => {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val)
    })

    if (image) formData.append("image", image)

    try {
      const res = await fetch(`${API}/${editingItem._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) throw new Error('Failed to update carousel')

      fetchCarousels()
      clearForm()
      alert("✅ Carousel slide updated successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error updating carousel slide")
    } finally {
      setUploading(false)
    }
  }

  // 📌 delete
  const deleteCarousel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this carousel slide?")) return

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to delete carousel')

      fetchCarousels()
      alert("✅ Carousel slide deleted successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error deleting carousel slide")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
                <FiImage className="text-pink-500" />
                Carousel Management
              </h1>
              <p className="text-gray-500 mt-1">Manage your homepage carousel slides</p>
            </div>
            <div className="flex gap-3">
              {carousels.length > 0 && (
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="bg-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-purple-600 transition-all"
                >
                  {previewMode ? <FaPause /> : <FaPlay />}
                  {previewMode ? 'Stop Preview' : 'Preview Carousel'}
                </button>
              )}
              <button
                onClick={() => {
                  clearForm()
                  setShowForm(!showForm)
                }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {showForm ? <FiX /> : <FiPlus />}
                {showForm ? 'Close Form' : 'Add New Slide'}
              </button>
            </div>
          </div>

          {/* Carousel Preview Modal */}
          {previewMode && carousels.length > 0 && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <div className="relative w-full max-w-6xl mx-4">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="absolute -top-12 right-0 text-white hover:text-pink-500 transition-colors"
                >
                  <FiX size={24} />
                </button>
                
                <div className="relative h-[500px] rounded-2xl overflow-hidden">
                  <img
                    src={`http://localhost:5000/${carousels[currentPreviewIndex].image}`}
                    alt={carousels[currentPreviewIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                    <h2 className="text-4xl font-bold mb-2">{carousels[currentPreviewIndex].title}</h2>
                    <p className="text-xl mb-4">{carousels[currentPreviewIndex].description}</p>
                    {carousels[currentPreviewIndex].offerEnds && (
                      <p className="text-pink-400">
                        Offer ends: {formatDate(carousels[currentPreviewIndex].offerEnds)}
                      </p>
                    )}
                  </div>

                  {/* Preview Navigation */}
                  <div className="absolute bottom-6 right-6 flex gap-2">
                    {carousels.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPreviewIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentPreviewIndex 
                            ? 'bg-pink-500 w-6' 
                            : 'bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview Controls */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button
                    onClick={() => setCurrentPreviewIndex(prev => 
                      prev === 0 ? carousels.length - 1 : prev - 1
                    )}
                    className="bg-white/20 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPreviewIndex(prev => 
                      prev === carousels.length - 1 ? 0 : prev + 1
                    )}
                    className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADD/EDIT FORM */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
            <form onSubmit={editingItem ? updateCarousel : addCarousel} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                {editingItem ? <FiEdit2 className="text-pink-500" /> : <FiImage className="text-pink-500" />}
                {editingItem ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Title *
                  </label>
                  <input
                    placeholder="e.g., Summer Sale 2025"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                {/* Offer Ends Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiCalendar className="text-pink-500" /> Offer Ends
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.offerEnds}
                    onChange={e => setForm({ ...form, offerEnds: e.target.value })}
                  />
                </div>

                {/* Description - Full width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Slide description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiImage className="text-pink-500" /> Slide Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="carousel-image"
                      {...(!editingItem && { required: true })}
                    />
                    <label htmlFor="carousel-image" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-48 mx-auto rounded-lg shadow-lg"
                          />
                          <p className="text-sm text-gray-500 mt-2">Click to change image</p>
                        </div>
                      ) : (
                        <div className="py-8">
                          <FiUpload className="mx-auto text-gray-400 text-3xl mb-3" />
                          <p className="text-gray-600 font-medium mb-1">Click to upload image</p>
                          <p className="text-sm text-gray-400">Recommended size: 1920x1080px</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {editingItem ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {editingItem ? <FiEdit2 /> : <FiImage />}
                      {editingItem ? 'Update Slide' : 'Add Slide'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-8 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* CAROUSEL LIST */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                All Slides ({carousels.length})
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {carousels.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-48 h-48 relative overflow-hidden">
                        <img
                          src={`http://localhost:5000/${item.image}`}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5">
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        
                        {item.offerEnds && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <FiClock className="text-pink-500" />
                            <span>Offer ends: {formatDate(item.offerEnds)}</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCurrentPreviewIndex(index)
                              setPreviewMode(true)
                            }}
                            className="flex-1 bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <FiEye /> Preview
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            onClick={() => deleteCarousel(item._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {carousels.length === 0 && (
                <div className="text-center py-20">
                  <FiImage className="mx-auto text-gray-300 text-6xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No carousel slides yet</h3>
                  <p className="text-gray-500">Click "Add New Slide" to create your first carousel slide</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}