import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import heroImg from '../assets/hero.png';

const lineReveal = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen bg-ivory text-ink flex flex-col justify-end overflow-hidden pt-28 pb-0">
      {/* Catalog meta, top of the room */}
      <motion.div
        className="absolute top-28 left-6 md:left-12 right-6 md:right-12 flex justify-between label-caps text-stone"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <span>Room 01 — Permanent Collection</span>
        <span className="hidden md:inline">Est. MMXXVI</span>
      </motion.div>

      <div className="px-6 md:px-12 relative z-10">
        <h1 className="font-serif leading-[0.95] text-[15vw] md:text-[11vw]">
          <span className="block overflow-hidden">
            <motion.span className="block" custom={0} variants={lineReveal} initial="hidden" animate="visible">
              Art for
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block italic text-clay" custom={1} variants={lineReveal} initial="hidden" animate="visible">
              mortal
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block" custom={2} variants={lineReveal} initial="hidden" animate="visible">
              walls.
            </motion.span>
          </span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-10 mb-16">
          <motion.p
            className="max-w-md text-stone font-light text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Original monochrome works, limited editions and digital pieces —
            curated like a museum, priced like a mortal. No velvet ropes here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="flex items-center gap-8"
          >
            <Link
              to="/gallery"
              className="bg-ink text-ivory px-10 py-4 label-caps hover:bg-clay transition-colors duration-300"
            >
              Enter the Gallery
            </Link>
            <span className="hidden md:flex items-center gap-2 label-caps text-stone">
              <ArrowDown size={14} className="animate-bounce-slow" /> Scroll
            </span>
          </motion.div>
        </div>
      </div>

      {/* Hero artwork strip pinned to bottom */}
      <motion.div
        className="relative h-[34vh] md:h-[42vh] w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        <img src={heroImg} alt="Featured artwork" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
      </motion.div>

      {/* Marquee, midlife.engineering-style typographic strip */}
      <div className="bg-ink text-ivory py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee will-change-transform">
          {[0, 1].map((copy) => (
            <span key={copy} aria-hidden={copy === 1} className="label-caps text-ivory/70">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-6">
                  Original works <span className="text-clay mx-6">✦</span> Limited editions
                  <span className="text-clay mx-6">✦</span> Shipped worldwide
                  <span className="text-clay mx-6">✦</span> Framed by hand
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
