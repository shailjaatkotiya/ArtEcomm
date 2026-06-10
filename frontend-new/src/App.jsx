import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import SplashScreen from './components/SplashScreen';
import HamburgerMenu from './components/HamburgerMenu';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductSection from './components/ProductSection';
import ContactSection from './components/ContactSection';
import ProductsPage from './pages/ProductsPage';
import ProductItemPage from './pages/ProductItemPage';
import ContactPage from './pages/ContactPage';
import './index.css';

// three.js room split into its own chunk
const ArtRingBackground = lazy(() => import('./components/ArtRingBackground'));

// Immersive painting-ring backdrop on every page except the
// collection listing, where the grid needs a quiet wall.
function BackgroundLayer() {
  const location = useLocation();
  if (location.pathname === '/gallery') return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true">
      <Suspense fallback={null}>
        <ArtRingBackground pathname={location.pathname} />
      </Suspense>
    </div>
  );
}

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location]);

  return (
    <main className="relative w-full overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <ProductSection />
      <ContactSection />
    </main>
  );
}

function App() {
  // Show splash once per browser session, museum-style
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem('artecomm_splash_seen') === '1'
  );

  const handleSplashDone = () => {
    sessionStorage.setItem('artecomm_splash_seen', '1');
    setSplashDone(true);
  };

  return (
    <Router>
      <CartProvider>
        <AnimatePresence>
          {!splashDone && <SplashScreen onDone={handleSplashDone} />}
        </AnimatePresence>

        <div className="relative font-sans text-ink bg-transparent max-w-[100vw] overflow-x-hidden min-h-screen">
          <BackgroundLayer />
          <HamburgerMenu />
          <CartDrawer />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<ProductsPage />} />
            <Route path="/products" element={<Navigate to="/gallery" replace />} />
            <Route path="/products/:id" element={<ProductItemPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>

          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
