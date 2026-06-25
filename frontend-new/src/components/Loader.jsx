import React from 'react';
import { motion } from 'framer-motion';

// New museum-style loading animation: a rotating ink arc inside a thin ring,
// with a quiet caption. Replaces the old plain italic "loading…" text.
const Loader = ({ label = 'Hanging the works', full = false }) => (
  <div
    className={`flex flex-col items-center justify-center gap-7 text-ink ${
      full ? 'min-h-[100dvh]' : 'py-28'
    }`}
  >
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 rounded-full border border-ink/15" />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-clay border-r-ink"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-3 rounded-full bg-ink"
        animate={{ scale: [1, 0.6, 1], opacity: [0.9, 0.4, 0.9] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
    <p className="label-caps text-stone overflow-hidden">
      <motion.span
        className="inline-block"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {label}…
      </motion.span>
    </p>
  </div>
);

export default Loader;
