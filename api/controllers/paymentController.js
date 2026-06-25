const crypto = require('crypto');
const Booking = require('../models/Booking');

const isDemoMode = () => {
  if (process.env.PAYMENT_DEMO_MODE === 'true') return true;
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const isRealKey = keyId.startsWith('rzp_test_') && keyId.length > 20 && keySecret.length > 15;
  return !isRealKey;
};

exports.getPaymentConfig = async (req, res) => {
  const demo = isDemoMode();
  res.status(200).json({
    demoMode: demo,
    keyId: demo ? null : process.env.RAZORPAY_KEY_ID,
  });
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (isDemoMode()) {
      const mockOrderId = `order_demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return res.status(200).json({
        order: {
          id: mockOrderId,
          amount: amount * 100,
          currency: 'INR',
          receipt: `receipt_${bookingId}`,
        },
      });
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (isDemoMode()) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
      return res.status(200).json({ success: true, message: 'Payment verified successfully (demo mode)' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Payment verification error' });
  }
};
