import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const letters = 'ARTECOMM'.split('');

const SplashScreen = ({ onDone }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Elapsed-time based so background-tab timer throttling can't stall it
    const start = performance.now();
    const duration = 2200;
    const timer = setInterval(() => {
      const pct = Math.min(100, Math.round(((performance.now() - start) / duration) * 100));
      setCount(pct);
      if (pct >= 100) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count === 100) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [count, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-ink text-ivory flex flex-col items-center justify-center"
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Frame lines, museum vitrine feel */}
      <motion.div
        className="absolute inset-6 border border-ivory/15 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      <p className="label-caps text-ivory/40 mb-6">Galerie · Est. MMXXVI</p>

      <h1 className="font-serif text-[14vw] md:text-[9vw] leading-none tracking-[0.08em] flex overflow-hidden">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {l}
          </motion.span>
        ))}
      </h1>

      <p className="font-serif italic text-ivory/50 text-lg md:text-xl mt-4">
        original works for mortal walls
      </p>

      {/* Progress */}
      <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
        <div className="h-px bg-ivory/20 flex-1 mr-8 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-ivory"
            style={{ width: `${count}%` }}
          />
        </div>
        <span className="font-serif text-4xl md:text-5xl tabular-nums leading-none">
          {count}
        </span>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
