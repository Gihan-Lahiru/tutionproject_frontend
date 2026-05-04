import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export default function PayNowButton({ amount, month, year, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const loadPayHereScript = () => {
    return new Promise((resolve, reject) => {
      // PayHere uses the same JS library for both live + sandbox.
      // Sandbox mode is controlled by `paymentData.sandbox = true`.
      const desiredSrc = 'https://www.payhere.lk/lib/payhere.js'

      const existing = document.getElementById('payhere-js')

      // If already loaded and matches desired src, reuse.
      if (existing && existing.getAttribute('src') === desiredSrc && window.payhere) {
        resolve()
        return
      }

      // If an old script exists (possibly wrong env), remove it.
      if (existing) {
        existing.remove()
      }

      // Clear previous global to avoid mixing environments.
      if (window.payhere) {
        try {
          delete window.payhere
        } catch (e) {
          window.payhere = undefined
        }
      }

      const script = document.createElement('script');
      script.id = 'payhere-js'
      script.src = desiredSrc;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Get payment data from backend
      const { data } = await api.post('/payments/payhere/initiate', {
        amount,
        month,
        year,
      });

      if (!data.success) {
        throw new Error('Failed to initiate payment');
      }

      // Step 2: Load PayHere script
      await loadPayHereScript();

      // Step 3: Setup PayHere event handlers
      window.payhere.onCompleted = function (orderId) {
        console.log('Payment completed. Order ID:', orderId);
        // PayHere client callback can fire before the webhook updates our DB.
        // Poll the backend briefly so history/notifications reflect the completed status.
        (async () => {
          const delay = (ms) => new Promise((r) => setTimeout(r, ms));
          let lastStatus = null;

          for (let attempt = 0; attempt < 12; attempt++) {
            try {
              const res = await api.get(`/payments/payhere/status/${encodeURIComponent(orderId)}`);
              lastStatus = res?.data?.payment?.status || null;
              if (lastStatus && lastStatus !== 'pending') break;
            } catch (e) {
              // ignore and retry
            }
            await delay(1500);
          }

          if (lastStatus === 'completed') {
            if (onSuccess) onSuccess({ orderId, status: 'completed' });
          } else if (lastStatus === 'pending' || lastStatus === null) {
            // Most common in local dev: PayHere can't reach our localhost notify_url,
            // so DB stays pending. Use the sandbox/local fallback confirm endpoint.
            try {
              const confirmRes = await api.post('/payments/payhere/confirm', { orderId });
              const confirmedStatus = confirmRes?.data?.payment?.status || null;
              if (String(confirmedStatus || '').toLowerCase() === 'completed') {
                if (onSuccess) onSuccess({ orderId, status: 'completed' });
              } else {
                if (onSuccess) onSuccess({ orderId, status: 'processing' });
              }
            } catch (e) {
              if (onSuccess) onSuccess({ orderId, status: 'processing' });
            }
          } else {
            toast.error('Payment verification failed. Please check your payment history.');
          }
          setLoading(false);
        })();
      };

      window.payhere.onDismissed = function () {
        console.log('Payment dismissed by user');
        toast.info('Payment was cancelled.');
        setLoading(false);
      };

      window.payhere.onError = function (error) {
        console.error('PayHere error:', error);
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      };

      // Step 4: Start payment with data from backend
      window.payhere.startPayment(data.paymentData);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        'Pay Now'
      )}
    </button>
  );
}
