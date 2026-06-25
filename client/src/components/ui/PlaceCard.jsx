import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price } = place;
  return (
    <Link to={`/place/${placeId}`} className="flex flex-col w-full">
      <div className="card flex flex-col justify-between relative">
        <WishlistButton placeId={placeId} />
        <div className="w-full h-3/5 overflow-hidden rounded-sm bg-neutral-100 border border-border">
          {photos?.[0] ? (
            <img
              src={photos[0]}
              className="h-full w-full object-cover hover:scale-105 transition duration-300"
              alt={title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50 text-neutral-400 font-mono text-xs">
              No Preview
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow mt-3 justify-between">
          <div>
            <h2 className="truncate font-sans text-sm font-semibold text-neutral-900 leading-tight">{address}</h2>
            <h3 className="truncate font-sans text-xs text-neutral-500 mt-1 leading-normal">{title}</h3>
          </div>
          <div className="border-t border-border pt-3 mt-3 flex items-baseline justify-between">
            <span className="font-mono text-xs text-neutral-400">price</span>
            <div className="text-right">
              <span className="font-sans text-sm font-semibold text-neutral-950">&#8377;{price}</span>
              <span className="font-sans text-xs text-neutral-500 font-normal ml-1">/ night</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
