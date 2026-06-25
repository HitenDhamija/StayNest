const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  createBookings,
  getBookings,
  cancelBooking,
} = require('../controllers/bookingController');

// Protected routes (user must be logged in)
router.route('/').get(isLoggedIn, getBookings).post(isLoggedIn, createBookings);
router.put('/:id/cancel', isLoggedIn, cancelBooking);

module.exports = router;
