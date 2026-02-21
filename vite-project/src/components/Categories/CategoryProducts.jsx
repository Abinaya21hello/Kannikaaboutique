import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

function CategoryProducts() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [slug])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/category/${slug}`
      )
      setProducts(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{padding:"40px"}}>
      <h2>{slug.toUpperCase()} COLLECTION</h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:"20px"
      }}>
        {products.map(item => (
          <div key={item._id} style={{border:"1px solid #eee", padding:"10px"}}>
            
            <img 
              src={`http://localhost:5000/${item.frontImage}`}
              alt={item.title}
              style={{width:"100%", height:"250px", objectFit:"cover"}}
            />

            <h3>{item.title}</h3>
            <p>{item.category?.name}</p>

            {item.offerPrice ? (
              <>
                <span style={{color:"red"}}>₹{item.offerPrice}</span>
                <span style={{textDecoration:"line-through", marginLeft:"10px"}}>
                  ₹{item.price}
                </span>
              </>
            ) : (
              <span>₹{item.price}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryProducts
