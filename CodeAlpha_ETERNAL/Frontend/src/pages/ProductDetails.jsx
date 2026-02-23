import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getWatchById } from '../utils/api'
import { watches as mockWatches } from '../utils/mockData'
import { showToast } from '../utils/toast'
import ImageCarousel from '../components/ImageCarousel'
import { FiShoppingCart, FiStar, FiChevronLeft } from 'react-icons/fi'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const data = await getWatchById(id)
      if (data) {
        setProduct(data)
        return
      }
      
      // API returned nothing; try mock fallback
      const fallback = mockWatches.find(w => String(w.id) === String(id))
      if (fallback) {
        setProduct(fallback)
        return
      }

      showToast('Product not found', 'error')
      navigate('/')
    } catch (error) {
      console.error('Error loading product:', error)

      // API failed; try mock fallback
      const fallback = mockWatches.find(w => String(w.id) === String(id))
      if (fallback) {
        setProduct(fallback)
      } else {
        showToast('Error loading product', 'error')
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity)
      showToast(`${product.name} added to cart!`, 'success')
    } else {
      showToast('Product is out of stock', 'error')
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1)
    }
  }

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Mock reviews
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely stunning watch! The quality is exceptional and it looks even better in person.'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 4,
      date: '2024-01-20',
      comment: 'Great watch, very comfortable to wear. The only minor issue is the strap adjustment.'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rating: 5,
      date: '2024-02-01',
      comment: 'Perfect timepiece! Exceeded my expectations. Highly recommend!'
    }
  ]

  return (
    <div className="product-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiChevronLeft /> Back
      </button>

      <div className="product-details-container">
        {/* Product Images */}
        <div className="product-images">
          <ImageCarousel images={product.images || [product.image]} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviews} reviews)</span>
          </div>

          <div className="product-price-section">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                <span className="discount-badge">-{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-stock">
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    setQuantity(Math.max(1, Math.min(val, product.stock)))
                  }}
                  min="1"
                  max={product.stock}
                />
                <button onClick={increaseQuantity} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FiShoppingCart />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Product Features */}
          <div className="product-features">
            <h3>Features</h3>
            <ul>
              <li>Premium materials and craftsmanship</li>
              <li>Water-resistant design</li>
              <li>2-year warranty included</li>
              <li>Free shipping worldwide</li>
              <li>30-day return policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="big-rating">{product.rating}</span>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'filled' : ''}
                />
              ))}
            </div>
            <p>{product.reviews} reviews</p>
          </div>
        </div>
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < review.rating ? 'filled' : ''}
                      />
                    ))}
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
