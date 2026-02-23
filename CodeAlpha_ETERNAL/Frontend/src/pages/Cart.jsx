import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { showToast } from '../utils/toast'
import './Cart.css'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      showToast('Item removed from cart', 'success')
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error')
      return
    }
    navigate('/checkout')
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 0 ? 29.99 : 0
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <FiShoppingBag className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      handleQuantityChange(item.id, val)
                    }}
                    min="1"
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="cart-item-total">
                  <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => {
                    removeFromCart(item.id)
                    showToast('Item removed from cart', 'success')
                  }}
                  aria-label="Remove item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
