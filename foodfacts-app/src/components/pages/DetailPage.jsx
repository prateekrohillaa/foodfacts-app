import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function DetailPage({ saved, dispatch }) {
  const { barcode } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        )
        if (!cancelled) {
          setProduct(response.data.product)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response) {
            setError(`Server error: ${err.response.status}. Please try again.`)
          } else if (err.request) {
            setError('Network error. Check your connection and try again.')
          } else {
            setError('Something went wrong. Please try again.')
          }
          setProduct(null)
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      cancelled = true
    }
  }, [barcode])

  const isSaved = saved.some((p) => p.code === barcode)

  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch({ type: 'REMOVE', payload: { code: barcode } })
    } else {
      dispatch({ type: 'ADD', payload: product })
    }
  }

  if (loading) return <p>Loading product details...</p>
  if (error) return <p>{error}</p>
  if (!product) return <p>Product not found.</p>

  return (
    <div className="detail-page">
      <button onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        {/* product image, name, brand */}
      </div>

      <div className="nutrition-table">
        <h3>Nutrition per 100g</h3>
        {/* render a table or list of nutriment values */}
      </div>

      <button onClick={handleSaveToggle}>
        {isSaved ? '★ Remove from Saved' : '☆ Save to My List'}
      </button>
    </div>
  )
}

export default DetailPage
