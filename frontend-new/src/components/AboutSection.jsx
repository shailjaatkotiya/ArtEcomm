import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AboutSmokeScene from './AboutSmokeScene';

import img1 from '../assets/art_collage_1_1774879159983.png';
import img2 from '../assets/art_collage_2_1774879265869.png';
import img3 from '../assets/art_collage_3_1774879434174.png';

const images = [img1, img2, img3];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const transforms = [
    {
      x: useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [-300, 0, 0, -300]),
      y: useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [-150, 0, 0, -150]),
      rotate: useTransform(scrollYProgress, [0, 0.5, 1], [-16, -2, -16]),
    },
    {
      x: useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [300, 0, 0, 300]),
      y: useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0, 0, 0, 0]),
      rotate: useTransform(scrollYProgress, [0, 0.5, 1], [12, 3, 12]),
    },
    {
      x: useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0, 0, 0, 0]),
      y: useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [220, 0, 0, 220]),
      rotate: useTransform(scrollYProgress, [0, 0.5, 1], [8, -3, 8]),
    },
  ];

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.7, 1, 1, 0.7]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-motion-runtime={motion ? 'ready' : 'missing'}
      className="relative bg-parchment text-ink min-h-screen flex items-center justify-center py-28 md:py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true">
        <AboutSmokeScene />
      </div>
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(242,239,231,0.2),transparent_34%),linear-gradient(180deg,rgba(23,21,15,0.08),rgba(242,239,231,0.52)_36%,rgba(233,228,216,0.84))]"
        aria-hidden="true"
      />

      <motion.div
        className="absolute top-24 left-6 md:left-12 right-6 md:right-12 z-10 flex items-center justify-between label-caps text-stone/80"
        style={{ opacity }}
      >
        <span>Room 02 - Returned Light</span>
        <span className="hidden md:inline">Scroll to reveal the practice</span>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.02fr_0.98fr] gap-12 md:gap-24 max-w-7xl w-full items-center">
        <motion.div
          className="relative flex justify-center items-center w-full min-h-[520px]"
          style={{ opacity, scale }}
        >
          <div
            className="absolute left-1/2 top-1/2 w-[82%] max-w-[460px] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10 bg-ivory/20 blur-[1px]"
            aria-hidden="true"
          />
          {images.map((src, i) => (
            <motion.div
              key={i}
              className={`absolute border-[10px] border-ivory shadow-2xl overflow-hidden bg-ivory will-change-transform
                ${i === 0 ? 'w-60 h-76 z-20 top-10 left-0 md:left-8' : ''}
                ${i === 1 ? 'w-52 h-68 z-10 right-0 md:-right-2 top-[24%]' : ''}
                ${i === 2 ? 'w-68 h-60 z-30 bottom-10 left-10 md:left-20' : ''}
              `}
              style={{ x: transforms[i].x, y: transforms[i].y, rotate: transforms[i].rotate }}
            >
              <img src={src} alt={`Studio work ${i + 1}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="max-w-xl bg-ivory/20 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-0"
          style={{ opacity, scale }}
        >
          <p className="label-caps text-clay mb-4">Info and Characteristics +</p>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8">
            Provenance &<br />
            <span className="italic">practice.</span>
          </h2>

          <p className="text-lg leading-relaxed mb-6 font-light text-ink-soft">
            Born from the intersection of traditional artistry and digital innovation,
            the work explores the boundary between light and shadow, form and void.
            Each piece is a meditation on contrast - a dialogue between the tangible
            and the ethereal.
          </p>
          <p className="text-lg leading-relaxed mb-10 font-light text-ink-soft">
            Over a decade of mixed-media sculpture and digital installations,
            exhibited in galleries across Tokyo, Berlin and New York. The monochrome
            palette is not a limitation but a liberation - stripping away distraction
            to reveal pure essence.
          </p>

          <blockquote className="font-serif italic text-2xl border-l-2 border-clay pl-6 text-ink">
            "In the absence of color, form speaks louder."
          </blockquote>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 mt-10 pt-8 border-t border-ink/10">
            <div>
              <dt className="label-caps text-stone mb-1">Medium</dt>
              <dd className="font-serif text-2xl">Mixed media</dd>
            </div>
            <div>
              <dt className="label-caps text-stone mb-1">Mood</dt>
              <dd className="font-serif text-2xl">Smoke and ink</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
