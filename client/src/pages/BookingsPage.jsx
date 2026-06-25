import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'react-toastify';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axiosInstance.get('/bookings');
      setBookings(data.booking);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      const { data } = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? data.booking : b))
      );
      toast.success('Booking cancelled successfully');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
    setCancellingId(null);
    setConfirmCancel(null);
  };

  if (loading) return <Spinner />;

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkOut) >= new Date() && b.bookingStatus !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.checkOut) < new Date() && b.bookingStatus !== 'cancelled'
  );
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'cancelled');

  return (
    <div className="pt-24 min-h-screen bg-[#fafafa]">
      <div className="max-w-screen-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-8">Your Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-border rounded-md">
            <p className="text-neutral-500">No bookings yet.</p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
            >
              Browse stays
            </Link>
          </div>
        ) : (
          <>
            {upcomingBookings.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-medium mb-4 text-neutral-700">
                  Upcoming
                </h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={() => setConfirmCancel(booking._id)}
                      isCancelling={cancellingId === booking._id}
                    />
                  ))}
                </div>
              </div>
            )}
            {pastBookings.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-medium mb-4 text-neutral-700">
                  Past
                </h2>
                <div className="space-y-4 opacity-75">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
            {cancelledBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-4 text-neutral-500">
                  Cancelled
                </h2>
                <div className="space-y-4 opacity-50">
                  {cancelledBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Cancel Booking?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              This action cannot be undone. A refund will be initiated to your
              original payment method within 5-7 business days.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCancel(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-neutral-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(confirmCancel)}
                disabled={cancellingId === confirmCancel}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancellingId === confirmCancel ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingCard = ({ booking, onCancel, isCancelling }) => {
  const { place, checkIn, checkOut, price, numOfGuests, paymentStatus, bookingStatus } = booking;
  const isPaid = paymentStatus === 'paid' || paymentStatus === 'refunded';
  const isCancelled = bookingStatus === 'cancelled';

  return (
    <div className={`bg-white border border-border rounded-lg p-4 flex gap-4 items-center shadow-sm ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-neutral-100">
        {place?.photos?.[0] ? (
          <img
            src={place.photos[0]}
            alt={place.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
            No image
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-sm truncate">{place?.title}</h3>
        <p className="text-xs text-neutral-500 mt-1">
          {new Date(checkIn).toLocaleDateString('en-IN')} -{' '}
          {new Date(checkOut).toLocaleDateString('en-IN')}
        </p>
        <p className="text-xs text-neutral-500">
          {numOfGuests} {numOfGuests === 1 ? 'guest' : 'guests'}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-sm">
          &#8377;{price?.toLocaleString()}
        </p>
        {isCancelled ? (
          <p className="text-xs mt-1 font-medium text-red-500">Cancelled</p>
        ) : paymentStatus === 'refunded' ? (
          <p className="text-xs mt-1 font-medium text-blue-600">Refunded</p>
        ) : isPaid ? (
          <p className="text-xs mt-1 font-medium text-green-600">Paid</p>
        ) : (
          <p className="text-xs mt-1 font-medium text-orange-500">
            Payment pending
          </p>
        )}
        {isPaid && !isCancelled && (
          <button
            onClick={onCancel}
            className="mt-2 inline-block text-xs bg-white border border-red-300 text-red-600 px-3 py-1 rounded-full hover:bg-red-50 transition"
          >
            Cancel
          </button>
        )}
        {!isPaid && !isCancelled && (
          <Link
            to={`/payment/${booking._id}`}
            className="mt-2 inline-block text-xs bg-neutral-900 text-white px-3 py-1 rounded-full hover:bg-neutral-800 transition"
          >
            Pay now
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
