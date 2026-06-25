import { usePlaces } from '../../hooks';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';
import FilterBar from '@/components/ui/FilterBar';

const IndexPage = () => {
  const allPlaces = usePlaces();
  const { places, loading } = allPlaces;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="pt-16 min-h-screen bg-[#fafafa]">
      {/* Vercel-inspired Hero Section */}
      <div className="relative w-full overflow-hidden bg-white border-b border-border py-24 px-6 text-center">
        {/* Colorful Mesh Gradient Backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-300 via-blue-500 to-pink-500 opacity-20 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 border border-border px-3 py-1 rounded-full bg-neutral-50">
            introducing staynest 1.0
          </span>
          
          <h1 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-[-2.0px] leading-none text-neutral-900 font-sans">
            Find and book your premium stay.
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-neutral-500 font-sans max-w-lg leading-relaxed">
            Stark black-and-ink aesthetics, premium layouts, and instant bookings for developers who love beautiful interfaces.
          </p>
          
          <div className="mt-8 flex gap-4">
            <a
              href="#listings"
              className="bg-neutral-900 text-white font-medium text-sm py-2 px-6 rounded-full hover:bg-neutral-800 shadow-sm transition"
            >
              Browse Stays
            </a>
            <a
              href="/account/places/new"
              className="bg-white border border-border text-neutral-800 font-medium text-sm py-2 px-6 rounded-full hover:bg-neutral-50 shadow-vercel-sm transition"
            >
              Host a Place
            </a>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div id="listings" className="max-w-screen-xl mx-auto px-6 py-16 scroll-mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 mb-8 font-sans">Latest Premium Stays</h2>
        
        <FilterBar />
        
        {places.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {places.map((place) => (
              <PlaceCard place={place} key={place._id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 bg-white border border-border rounded-md shadow-vercel-sm text-center px-4 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-neutral-950">No stays found</h3>
            <p className="text-sm text-neutral-500 mt-2 max-w-md">
              Sorry, we couldn&#39;t find the place you&#39;re looking for. Connect to your database or host a place to get started.
            </p>
            <a 
              href="/" 
              className="mt-6 inline-flex items-center gap-2 bg-neutral-950 text-white text-sm font-medium py-2 px-6 rounded-full hover:bg-neutral-800 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Go back
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
