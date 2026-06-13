import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navItems = [
  { index: '01', label: 'Home', sub: 'The gallery floor', href: '/', meta: 'Permanent collection' },
  { index: '02', label: 'Collection', sub: 'All works, filtered', href: '/gallery', meta: 'Works on view' },
  { index: '03', label: 'The Artist', sub: 'Provenance & practice', href: '/#about', meta: 'Returned light' },
  { index: '04', label: 'Enquiries', sub: 'Commissions & visits', href: '/contact', meta: 'Private viewing' },
];

const footerLinks = ['Terms of Sale', 'Privacy Notice', 'FAQ', 'Contact us'];

const overlayVariants = {
  hidden: { y: '-100%', opacity: 0.4 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { y: '-100%', opacity: 0, transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } },
};

const itemVariants = {
  hidden: { y: 70, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.28 + i * 0.08, duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { y: -30, opacity: 0, transition: { duration: 0.2 } },
};

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(navItems[0]);
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
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-12 py-5 mix-blend-difference text-ivory">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          className="hidden md:flex items-center gap-2 rounded-full border border-current/70 px-5 py-3 label-caps"
        >
          <ChevronLeft size={15} strokeWidth={1.5} />
          Back to Home
        </Link>

        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-5 flex items-center border border-current/70 bg-current/5"
        >
          <span className="grid place-items-center h-12 w-16 border-r border-current/60 font-serif text-xl">
            AE
          </span>
          <span className="px-4 md:px-5 font-serif text-2xl md:text-3xl leading-none tracking-wide">
            ArtEcomm
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-5 md:gap-8">
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
            onClick={() => setOpen((value) => !value)}
            className="label-caps cursor-pointer flex items-center gap-3"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <span className="relative flex flex-col gap-1.5 w-8">
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

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-[90] overflow-x-hidden overflow-y-auto bg-ink/78 text-ivory backdrop-blur-md"
            data-motion-runtime={motion ? 'ready' : 'missing'}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(242,239,231,0.2),transparent_18%),radial-gradient(circle_at_80%_24%,rgba(154,59,38,0.22),transparent_24%),linear-gradient(180deg,rgba(23,21,15,0.1),rgba(23,21,15,0.74))]"
              aria-hidden="true"
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-[64vw] max-h-[760px] w-[64vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-[46vw] max-h-[560px] w-[46vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-clay/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex min-h-screen flex-col px-6 pb-8 pt-28 md:px-12 md:pb-8 md:pt-24">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="label-caps text-ivory/45">This gallery is also available</p>
                  <p className="mt-2 max-w-xs font-serif text-3xl leading-none text-ivory/80">
                    as a slow virtual viewing room.
                  </p>
                </div>

                <div className="flex items-center gap-2 label-caps text-ivory/50">
                  <button className="rounded-full border border-ivory/25 px-4 py-2 text-ivory">
                    English
                  </button>
                  <button className="rounded-full border border-ivory/10 px-4 py-2">Hindi</button>
                  <button className="rounded-full border border-ivory/10 px-4 py-2">French</button>
                </div>
              </div>

              <div className="my-auto grid items-end gap-8 py-8 md:grid-cols-[minmax(0,1fr)_320px] md:gap-12 md:py-6">
                <ul className="list-none space-y-2 md:space-y-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                      onMouseEnter={() => setActiveItem(item)}
                      onFocus={() => setActiveItem(item)}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href)}
                        className="group grid grid-cols-[3.2rem_minmax(0,1fr)] items-baseline gap-4 border-b border-ivory/12 pb-4 md:grid-cols-[4.5rem_minmax(0,1fr)_220px] md:gap-8 md:pb-3"
                      >
                        <span className="label-caps text-ivory/35">{item.index}</span>
                        <span className="font-serif text-5xl leading-[0.92] transition-all duration-500 group-hover:translate-x-3 group-hover:italic group-hover:text-parchment md:text-7xl">
                          {item.label}
                        </span>
                        <span className="hidden label-caps text-ivory/30 transition-colors duration-300 group-hover:text-ivory/75 md:inline">
                          {item.sub}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <motion.aside
                  key={activeItem.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="hidden rounded-[2rem] border border-ivory/12 bg-ivory/8 p-6 backdrop-blur-sm md:block"
                >
                  <p className="label-caps text-clay mb-8">{activeItem.index}</p>
                  <p className="font-serif text-4xl leading-none">{activeItem.meta}</p>
                  <p className="mt-4 font-light leading-relaxed text-ivory/55">
                    Move through the rooms like a museum path: open, pause, then continue
                    toward the next work.
                  </p>
                </motion.aside>
              </div>

              <motion.div
                className="grid gap-5 border-t border-ivory/10 pt-6 label-caps text-ivory/35 md:grid-cols-[1fr_auto_1fr] md:items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.75 } }}
                exit={{ opacity: 0 }}
              >
                <span>Copyright {new Date().getFullYear()} ArtEcomm</span>
                <div className="flex flex-wrap gap-x-7 gap-y-2 md:justify-center">
                  {footerLinks.map((link) => (
                    <a key={link} href="#" className="hover:text-ivory transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
                <span className="md:text-right">Original works - Shipped worldwide</span>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
