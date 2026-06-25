const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  place: {
    type: mongoose.Schema.ObjectId,
    ref: "Place",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  numOfGuests: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  bookingStatus: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
  },
  cancelledAt: {
    type: Date,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
