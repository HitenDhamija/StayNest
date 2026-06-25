import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks';
import axiosInstance from '@/utils/axios';

const WishlistButton = ({ placeId, initialWishlisted = false }) => {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      const { data } = await axiosInstance.post('/wishlist/toggle', { placeId });
      setWishlisted(data.wishlist.includes(placeId));
      toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={wishlisted ? '#ef4444' : 'none'}
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke={wishlisted ? '#ef4444' : '#666'}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};

export default WishlistButton;
