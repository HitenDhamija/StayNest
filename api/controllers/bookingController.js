const Booking = require('../models/Booking');

// Books a place
exports.createBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, noOfGuests, name, phone, price } =
      req.body;

    const existingBooking = await Booking.findOne({
      place,
      bookingStatus: 'active',
      $or: [
        { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } },
      ],
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Place is not available for selected dates' });
    }

    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numOfGuests: noOfGuests,
      name,
      phone,
      price,
      paymentStatus: 'pending',
    });

    res.status(200).json({
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific bookings
exports.getBookings = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to access this page!' });
    }

    const booking = await Booking.find({ user: userData.id }).populate('place')

    res
      .status(200).json({ booking, success: true })


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const update = {
      bookingStatus: 'cancelled',
      cancelledAt: new Date(),
    };

    if (booking.paymentStatus === 'paid') {
      update.paymentStatus = 'refunded';
    }

    const cancelled = await Booking.findByIdAndUpdate(id, update, { new: true }).populate('place');

    res.status(200).json({ booking: cancelled, message: 'Booking cancelled successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
