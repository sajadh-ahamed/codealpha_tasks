import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { showToast } from '../utils/toast';
import { FiCheckCircle } from 'react-icons/fi';
import './Success.css';

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
    showToast('Payment successful! Thank you for your purchase.', 'success');
    // Run only once when component mounts to avoid repeated toasts
  }, []);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-content">
          <FiCheckCircle className="success-icon" />
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <p>You will receive an email confirmation shortly.</p>

          <div className="success-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;