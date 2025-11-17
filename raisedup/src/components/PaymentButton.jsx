import { Loader } from 'lucide-react';
import { useState } from 'react';
import { paymentAPI } from '../services/api';

const PaymentButton = ({ courseId, price, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create checkout session
      const response = await paymentAPI.createCheckout(courseId);
      
      if (response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err.message || 'Payment initialization failed');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading && <Loader className="animate-spin" size={20} />}
        <span>
          {loading ? 'Processing...' : `Pay $${price}`}
        </span>
      </button>
    </>
  );
};

export default PaymentButton;
