import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axiosInstance.get('/wishlist');
        setWishlist(data.wishlist);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="pt-24 min-h-screen bg-[#fafafa]">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((place) => (
              <PlaceCard place={place} key={place._id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-border rounded-md">
            <p className="text-neutral-500">No places in your wishlist yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
