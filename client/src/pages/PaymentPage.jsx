import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [redirect, setRedirect] = useState('');
  const [demoMode, setDemoMode] = useState(true);
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const [nights, setNights] = useState(1);

  useEffect(() => {
    const init = async () => {
      try {
        const [configRes, bookingsRes] = await Promise.all([
          axiosInstance.get('/payment/config'),
          axiosInstance.get('/bookings'),
        ]);
        setDemoMode(configRes.data.demoMode);
        setRazorpayKeyId(configRes.data.keyId);
        const found = bookingsRes.data.booking.find((b) => b._id === bookingId);
        setBooking(found);
        if (found) {
          const diff = Math.ceil((new Date(found.checkOut) - new Date(found.checkIn)) / (1000 * 60 * 60 * 24));
          setNights(diff > 0 ? diff : 1);
        }
      } catch (err) {
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [bookingId]);

  const loadRazorpaySDK = () =>
    new Promise((resolve) => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const processPayment = async (paymentData) => {
    setProcessing(true);
    try {
      const orderRes = await axiosInstance.post('/payment/create-order', {
        amount: booking.price,
        bookingId: booking._id,
      });

      if (demoMode) {
        await axiosInstance.post('/payment/verify', {
          razorpay_order_id: orderRes.data.order.id,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: 'demo_signature',
          bookingId: booking._id,
        });
        setPaid(true);
        toast.success('Payment successful!');
        setTimeout(() => setRedirect('/account/bookings'), 2500);
        setProcessing(false);
        return;
      }

      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        toast.error('Payment SDK failed to load. Check your connection.');
        setProcessing(false);
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: 'StayNest',
        description: `Booking for ${booking.place?.title}`,
        order_id: orderRes.data.order.id,
        handler: async (response) => {
          try {
            await axiosInstance.post('/payment/verify', {
              ...response,
              bookingId: booking._id,
            });
            setPaid(true);
            toast.success('Payment successful!');
            setTimeout(() => setRedirect('/account/bookings'), 2500);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
          setProcessing(false);
        },
        prefill: {
          name: booking.name,
          contact: booking.phone,
        },
        theme: { color: '#171717' },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (redirect) return <Navigate to={redirect} />;
  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-neutral-500">Loading booking details...</p>
        </div>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="pt-24 min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Booking not found.</p>
          <Link to="/account/bookings" className="mt-3 inline-block text-sm underline text-neutral-900">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const cleaningFee = Math.round(booking.price * 0.05);
  const serviceFee = Math.round(booking.price * 0.08);
  const total = booking.price + cleaningFee + serviceFee;

  return (
    <div className="pt-24 min-h-screen bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-xl p-6">
              <h1 className="text-xl font-semibold mb-1">Confirm & Pay</h1>
              <p className="text-sm text-neutral-500 mb-6">
                {demoMode ? 'Demo mode — no real payment is processed' : 'Secure payment powered by Razorpay'}
              </p>

              <div className="border border-border rounded-lg p-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                    {booking.place?.photos?.[0] ? (
                      <img src={booking.place.photos[0]} alt={booking.place.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No image</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Entire home</p>
                    <h3 className="font-semibold truncate">{booking.place?.title}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{booking.place?.address}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold mb-3">Trip details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-3">
                    <p className="text-xs text-neutral-500">Check-in</p>
                    <p className="text-sm font-medium">{new Date(booking.checkIn).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="border border-border rounded-lg p-3">
                    <p className="text-xs text-neutral-500">Check-out</p>
                    <p className="text-sm font-medium">{new Date(booking.checkOut).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-3 mt-3">
                  <p className="text-xs text-neutral-500">Guests</p>
                  <p className="text-sm font-medium">{booking.numOfGuests} {booking.numOfGuests === 1 ? 'guest' : 'guests'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold mb-3">Pay with</h2>
                <div className="border border-border rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{demoMode ? 'Demo Card' : 'Credit or Debit Card'}</p>
                    <p className="text-xs text-neutral-500">{demoMode ? '4111 1111 1111 1111' : 'Razorpay securely processes payments'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-4">
                <h2 className="font-semibold mb-3">Cancellation policy</h2>
                <p className="text-sm text-neutral-500">
                  Free cancellation before check-in. A full refund is available if cancelled within 48 hours of booking.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-border rounded-xl p-6 sticky top-24">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                  {booking.place?.photos?.[0] && (
                    <img src={booking.place.photos[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">{booking.place?.title}</h3>
                  <p className="text-xs text-neutral-500">{booking.place?.address}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">&#9733;</span>
                    <span className="text-xs font-medium">4.{Math.floor(Math.random() * 9) + 1}</span>
                    <span className="text-xs text-neutral-400">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500 underline">
                    &#8377;{booking.place?.price?.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="font-medium">&#8377;{(booking.place?.price * nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 underline">Cleaning fee</span>
                  <span className="font-medium">&#8377;{cleaningFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 underline">StayNest service fee</span>
                  <span className="font-medium">&#8377;{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4 flex justify-between">
                <span className="font-semibold">Total (INR)</span>
                <span className="font-semibold">&#8377;{total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => processPayment()}
                disabled={processing}
                className="w-full mt-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-3 rounded-lg font-medium text-sm hover:from-neutral-800 hover:to-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay &#8377;${total.toLocaleString()}`
                )}
              </button>

              <p className="text-[11px] text-neutral-400 text-center mt-3 leading-relaxed">
                {demoMode
                  ? 'Demo mode — your card will not be charged'
                  : 'By confirming, you agree to StayNest\'s payment terms and cancellation policy'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
