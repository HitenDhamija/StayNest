import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-sm mb-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Platform</h4>
            <a href="/" className="text-neutral-500 hover:text-neutral-950 transition-colors">Browse stays</a>
            <a href="/account/places" className="text-neutral-500 hover:text-neutral-950 transition-colors">Manage properties</a>
            <a href="/account/bookings" className="text-neutral-500 hover:text-neutral-950 transition-colors">My Bookings</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Hosting</h4>
            <a href="/account/places/new" className="text-neutral-500 hover:text-neutral-950 transition-colors">List your property</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Hosting guide</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Safety rules</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Resources</h4>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Help Center</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Community Forum</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Cancellation options</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-400">StayNest</h4>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">About Us</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Careers</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-950 transition-colors">Privacy Policy</a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 75 65"
              fill="currentColor"
              className="h-4 w-4 text-black"
            >
              <polygon points="37.5,0 75,65 0,65" />
            </svg>
            <span className="text-xs text-neutral-400 font-mono">STAYNEST © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400 font-sans">
            <a href="#" className="hover:text-neutral-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-950 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-950 transition-colors">Sitemap</a>
            <a href="#" className="hover:text-neutral-950 transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
