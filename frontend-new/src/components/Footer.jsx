import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-ink text-ivory px-6 md:px-12 pt-16 pb-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-10 pb-12 border-b border-ivory/10">
        <div>
          <p className="font-serif text-4xl mb-3">ArtEcomm</p>
          <p className="text-ivory/50 font-light max-w-xs">
            A small gallery on the internet. Original works, honest prices.
          </p>
        </div>
        <nav className="flex gap-12">
          <div className="space-y-3 flex flex-col">
            <span className="label-caps text-ivory/40">Visit</span>
            <Link to="/" className="font-light text-ivory/70 hover:text-ivory transition-colors">Home</Link>
            <Link to="/gallery" className="font-light text-ivory/70 hover:text-ivory transition-colors">Collection</Link>
            <Link to="/contact" className="font-light text-ivory/70 hover:text-ivory transition-colors">Enquiries</Link>
          </div>
          <div className="space-y-3 flex flex-col">
            <span className="label-caps text-ivory/40">Follow</span>
            <a href="#" className="font-light text-ivory/70 hover:text-ivory transition-colors">Instagram</a>
            <a href="#" className="font-light text-ivory/70 hover:text-ivory transition-colors">Twitter</a>
          </div>
        </nav>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 label-caps text-ivory/30">
        <span>© {new Date().getFullYear()} ArtEcomm. All rights reserved.</span>
        <span>Framed by hand · Shipped worldwide</span>
      </div>
    </div>
  </footer>
);

export default Footer;
