import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./Categories.css"

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = "http://localhost:5000"

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/api/categories/all`)
      setCategories(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="categories-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-highlight">SHOP</span> BY CATEGORY
        </h1>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.slug}`} 
              key={category._id}
              className="category-card"
            >
              <div className="card-image">
                <img 
                  src={`${API_BASE_URL}/${category.image}`}
                  alt={category.name}
                />
              </div>
              <h3 className="category-name">{category.name.toUpperCase()}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories