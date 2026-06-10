import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navItems = [
  { index: '01', label: 'Home', sub: 'The gallery floor', href: '/' },
  { index: '02', label: 'Collection', sub: 'All works, filtered', href: '/gallery' },
  { index: '03', label: 'The Artist', sub: 'Provenance & practice', href: '/#about' },
  { index: '04', label: 'Enquiries', sub: 'Commissions & visits', href: '/contact' },
];

const overlayVariants = {
  hidden: { y: '-100%' },
  visible: { y: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  exit: { y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};

const itemVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.35 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { y: -30, opacity: 0, transition: { duration: 0.2 } },
};

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { count, openDrawer } = useCart();

  const handleClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      if (href.startsWith('/#')) {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(href.replace('/#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        navigate(href);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }, 450);
  };

  return (
    <>
      {/* Fixed header bar */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5 mix-blend-difference text-ivory">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          className="font-serif text-2xl tracking-wide"
        >
          ArtEcomm
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <button
            onClick={openDrawer}
            className="relative flex items-center gap-2 cursor-pointer label-caps"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="hidden md:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 text-[0.6rem] font-bold w-4 h-4 rounded-full bg-clay text-ivory flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="label-caps cursor-pointer flex items-center gap-3"
            aria-label="Toggle menu"
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <span className="flex flex-col gap-1.5 w-7">
              <span
                className={`h-px bg-current transition-transform duration-300 ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`}
              />
              <span
                className={`h-px bg-current transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen museum index menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-[90] bg-ink text-ivory flex flex-col justify-center px-8 md:px-24"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute inset-6 border border-ivory/10 pointer-events-none" />

            <p className="label-caps text-ivory/40 mb-10">Index of Rooms</p>

            <ul className="list-none space-y-2 md:space-y-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className="group flex items-baseline gap-6 md:gap-12 border-b border-ivory/10 pb-3 md:pb-5"
                  >
                    <span className="font-sans text-xs text-ivory/40 tracking-[0.3em]">
                      {item.index}
                    </span>
                    <span className="font-serif text-5xl md:text-7xl leading-tight transition-all duration-500 group-hover:italic group-hover:pl-4 group-hover:text-clay">
                      {item.label}
                    </span>
                    <span className="hidden md:inline label-caps text-ivory/30 ml-auto transition-opacity duration-300 group-hover:text-ivory/70">
                      {item.sub}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="absolute bottom-12 left-8 md:left-24 right-8 md:right-24 flex justify-between label-caps text-ivory/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8 } }}
              exit={{ opacity: 0 }}
            >
              <span>© {new Date().getFullYear()} ArtEcomm</span>
              <span>Original works · Shipped worldwide</span>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
