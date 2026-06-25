import React, { useState } from 'react';
import { usePlaces } from '../../../hooks';
import axiosInstance from '@/utils/axios';

const FilterBar = () => {
  const { places, setPlaces, setLoading } = usePlaces();
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [allPlaces, setAllPlaces] = useState(null);

  const fetchAll = async () => {
    if (!allPlaces) {
      const { data } = await axiosInstance.get('/places');
      setAllPlaces(data.places);
      return data.places;
    }
    return allPlaces;
  };

  const handleFilter = async () => {
    setLoading(true);
    const data = await fetchAll();
    let filtered = [...data];
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }
    if (location) {
      filtered = filtered.filter((p) =>
        p.address.toLowerCase().includes(location.toLowerCase())
      );
    }
    setPlaces(filtered);
    setLoading(false);
  };

  const handleClear = async () => {
    setMaxPrice('');
    setLocation('');
    setLoading(true);
    const data = await fetchAll();
    setPlaces(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-white border border-border rounded-lg p-3">
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-400 w-40"
      />
      <input
        type="number"
        placeholder="Max price /night"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-400 w-36"
      />
      <button
        onClick={handleFilter}
        className="bg-neutral-900 text-white text-sm px-4 py-1.5 rounded-md hover:bg-neutral-800 transition"
      >
        Filter
      </button>
      <button
        onClick={handleClear}
        className="bg-white border border-border text-neutral-700 text-sm px-4 py-1.5 rounded-md hover:bg-neutral-50 transition"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterBar;
