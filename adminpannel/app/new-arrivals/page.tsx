"use client"
import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { 
  FiPackage, 
  FiEdit2, 
  FiTrash2, 
  FiUpload, 
  FiX,
  FiImage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiArchive,
  FiType,
  FiSave,
  FiEye,
  FiEyeOff
} from "react-icons/fi"
import { FaSpinner, FaCrown } from "react-icons/fa"

const API = "http://localhost:5000/api/products"

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState({
    front: '',
    hover: '',
    gallery: [] as string[]
  })
  const [token] = useState(localStorage.getItem('token') || '')

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    offerPrice: "",
    stock: "",
    sizes: "",
    isTopCollection: false,
    isNewCollection: true
  })

  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [hoverImage, setHoverImage] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])

  // 📌 get products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}?isNewCollection=true`)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle image previews
  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFrontImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, front: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, hover: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setGalleryImages(files)
    
    const previews: string[] = []
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result as string)
        if (previews.length === files.length) {
          setImagePreviews(prev => ({ ...prev, gallery: previews }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Edit product
  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setForm({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      price: product.price?.toString() || "",
      offerPrice: product.offerPrice?.toString() || "",
      stock: product.stock?.toString() || "",
      sizes: product.sizes?.join(", ") || "",
      isTopCollection: product.isTopCollection || false,
      isNewCollection: product.isNewCollection || true
    })
    setImagePreviews({
      front: product.frontImage ? `http://localhost:5000/${product.frontImage}` : '',
      hover: product.hoverImage ? `http://localhost:5000/${product.hoverImage}` : '',
      gallery: product.galleryImages?.map((img: string) => `http://localhost:5000/${img}`) || []
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Clear form
  const clearForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      price: "",
      offerPrice: "",
      stock: "",
      sizes: "",
      isTopCollection: false,
      isNewCollection: true
    })
    setFrontImage(null)
    setHoverImage(null)
    setGalleryImages([])
    setImagePreviews({ front: '', hover: '', gallery: [] })
    setEditingProduct(null)
    setShowForm(false)
  }

  // 📌 add product
  const addProduct = async (e: any) => {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'sizes') {
        // Don't append sizes here, we'll handle it separately
        return
      }
      formData.append(key, val.toString())
    })
    
    // Handle sizes separately
    if (form.sizes) {
      formData.append('sizes', form.sizes)
    }

    if (frontImage) formData.append("frontImage", frontImage)
    if (hoverImage) formData.append("hoverImage", hoverImage)
    galleryImages.forEach(img => {
      formData.append("galleryImages", img)
    })

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) throw new Error('Failed to add product')

      fetchProducts()
      clearForm()
      alert("✅ Product added successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error adding product")
    } finally {
      setUploading(false)
    }
  }

  // 📌 update product
  const updateProduct = async (e: any) => {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'sizes') {
        // Don't append sizes here, we'll handle it separately
        return
      }
      formData.append(key, val.toString())
    })
    
    // Handle sizes separately
    if (form.sizes) {
      formData.append('sizes', form.sizes)
    }

    // Only append new images if they were selected
    if (frontImage) formData.append("frontImage", frontImage)
    if (hoverImage) formData.append("hoverImage", hoverImage)
    galleryImages.forEach(img => {
      formData.append("galleryImages", img)
    })

    try {
      const res = await fetch(`${API}/${editingProduct._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) throw new Error('Failed to update product')

      fetchProducts()
      clearForm()
      alert("✅ Product updated successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error updating product")
    } finally {
      setUploading(false)
    }
  }

  // 📌 delete
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to delete product')

      fetchProducts()
      alert("✅ Product deleted successfully!")
    } catch (error) {
      console.error(error)
      alert("❌ Error deleting product")
    }
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
                <FiPackage className="text-pink-500" />
                New Arrivals Collection
              </h1>
              <p className="text-gray-500 mt-1">Manage your latest products and collections</p>
            </div>
            <button
              onClick={() => {
                clearForm()
                setShowForm(!showForm)
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {showForm ? <FiX /> : <FiPackage />}
              {showForm ? 'Close Form' : 'Add New Product'}
            </button>
          </div>

          {/* ADD/EDIT FORM */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
            <form onSubmit={editingProduct ? updateProduct : addProduct} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                {editingProduct ? <FiEdit2 className="text-pink-500" /> : <FiPackage className="text-pink-500" />}
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiType className="text-pink-500" /> Title *
                  </label>
                  <input
                    placeholder="Product title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiTag className="text-pink-500" /> Category *
                  </label>
                  <input
                    placeholder="e.g., Sarees"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>

                {/* SubCategory */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiLayers className="text-pink-500" /> Sub Category
                  </label>
                  <input
                    placeholder="e.g., Silk Sarees"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.subCategory}
                    onChange={e => setForm({ ...form, subCategory: e.target.value })}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiDollarSign className="text-pink-500" /> Price *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>

                {/* Offer Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiTag className="text-pink-500" /> Offer Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.offerPrice}
                    onChange={e => setForm({ ...form, offerPrice: e.target.value })}
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiArchive className="text-pink-500" /> Stock *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiLayers className="text-pink-500" /> Sizes
                  </label>
                  <input
                    placeholder="S, M, L, XL (comma separated)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.sizes}
                    onChange={e => setForm({ ...form, sizes: e.target.value })}
                  />
                </div>

                {/* Collection Toggles */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Collections</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isTopCollection}
                        onChange={e => setForm({ ...form, isTopCollection: e.target.checked })}
                        className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FaCrown className="text-yellow-500" /> Top Collection
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isNewCollection}
                        onChange={e => setForm({ ...form, isNewCollection: e.target.checked })}
                        className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FiPackage className="text-green-500" /> New Collection
                      </span>
                    </label>
                  </div>
                </div>

                {/* Description - Full width */}
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiType className="text-pink-500" /> Description *
                  </label>
                  <textarea
                    placeholder="Product description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                {/* Image Uploads */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiImage className="text-pink-500" /> Front Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFrontImageChange}
                      className="hidden"
                      id="front-image"
                      {...(!editingProduct && { required: true })}
                    />
                    <label htmlFor="front-image" className="cursor-pointer">
                      {imagePreviews.front ? (
                        <img src={imagePreviews.front} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                      ) : (
                        <div className="py-4">
                          <FiUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                          <span className="text-sm text-gray-500">Click to upload</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiImage className="text-pink-500" /> Hover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHoverImageChange}
                      className="hidden"
                      id="hover-image"
                    />
                    <label htmlFor="hover-image" className="cursor-pointer">
                      {imagePreviews.hover ? (
                        <img src={imagePreviews.hover} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                      ) : (
                        <div className="py-4">
                          <FiUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                          <span className="text-sm text-gray-500">Click to upload</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiImage className="text-pink-500" /> Gallery Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                      id="gallery-images"
                    />
                    <label htmlFor="gallery-images" className="cursor-pointer">
                      {imagePreviews.gallery.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {imagePreviews.gallery.map((preview, idx) => (
                            <img key={idx} src={preview} alt="Preview" className="h-16 w-full object-cover rounded-lg" />
                          ))}
                        </div>
                      ) : (
                        <div className="py-4">
                          <FiUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                          <span className="text-sm text-gray-500">Click to upload multiple</span>
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
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {editingProduct ? <FiSave /> : <FiPackage />}
                      {editingProduct ? 'Update Product' : 'Add Product'}
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

          {/* PRODUCT LIST */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">All Products ({products.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => (
                  <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={`http://localhost:5000/${p.frontImage}`}
                        alt={p.title}
                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {p.offerPrice && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          SALE
                        </span>
                      )}
                      {p.isTopCollection && (
                        <span className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaCrown /> Top
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {p.offerPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-pink-600">₹{p.offerPrice}</span>
                              <span className="text-sm text-gray-400 line-through">₹{p.price}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">₹{p.price}</span>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          Stock: {p.stock}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>

                      {p.sizes && p.sizes.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {p.sizes.map((size: string) => (
                            <span key={size} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">
                              {size}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-20">
                  <FiPackage className="mx-auto text-gray-300 text-6xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
                  <p className="text-gray-500">Click "Add New Product" to create your first product</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}