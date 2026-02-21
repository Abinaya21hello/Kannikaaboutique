import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories/all")
      setCategories(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{padding:"40px"}}>
      <h2>Shop By Category</h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:"20px"
      }}>
        {categories.map(cat => (
          <Link 
            to={`/category/${cat.slug}`} 
            key={cat._id}
            style={{textDecoration:"none", color:"black"}}
          >
            <div style={{border:"1px solid #eee", padding:"10px"}}>
              <img 
                src={`http://localhost:5000/${cat.image}`}
                alt={cat.name}
                style={{width:"100%", height:"250px", objectFit:"cover"}}
              />
              <h3 style={{textAlign:"center"}}>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories
