import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { FiCheckCircle } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    showToast('Please login to checkout', 'error');
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 29.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      clearCart();
      // Navigate to success page; success page shows the toast once
      navigate('/success');
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Checkout failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your purchase securely</p>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} className="checkout-item-image" />
                  <div className="checkout-item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
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
            </div>
          </div>

          {/* Payment Section */}
          <div className="checkout-payment">
            <h2>Complete Order</h2>
            <div className="payment-info">
              <div className="payment-icon">
                <FiCheckCircle />
              </div>
              <p>Your order will be processed securely.</p>
              <p>All major payment methods are accepted.</p>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>

            <button
              className="back-to-cart-btn"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;