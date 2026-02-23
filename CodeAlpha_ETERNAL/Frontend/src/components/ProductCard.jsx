import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { showToast } from '../utils/toast'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    showToast(`${product.name} added to cart!`, 'success')
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-wrapper">
        {!imageLoaded && <div className="image-skeleton" />}
        <img
          src={encodeURI(product.image)}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.error('Image failed to load:', product.image)
            console.error('Encoded URI:', encodeURI(product.image))
            e.target.src = '/assets/logo/logo.png' // Fallback image
          }}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {discount > 0 && (
          <span className="discount-badge">-{discount}%</span>
        )}
        {product.featured && (
          <span className="featured-badge">Featured</span>
        )}
        <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
          <button
            className="quick-add-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <FiShoppingCart />
            Add to Cart
          </button>
          <button className="wishlist-btn" aria-label="Add to wishlist">
            <FiHeart />
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">({product.reviews})</span>
        </div>
        <div className="product-price">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
