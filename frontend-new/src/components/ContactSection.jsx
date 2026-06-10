import React, { useState } from 'react';
import { motion } from 'framer-motion';

const fieldClass =
  'w-full bg-transparent border-b border-ink/25 text-ink px-0 py-4 font-light text-lg outline-none transition-colors duration-300 focus:border-clay placeholder:text-ink/30 rounded-none';

const ContactSection = ({ standalone = false }) => {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className={`relative bg-ivory/60 text-ink flex flex-col justify-center py-32 px-6 md:px-12 ${standalone ? 'min-h-screen pt-40' : 'min-h-screen'}`}
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-5 gap-16">
        {/* Left: heading + visit info */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="label-caps text-clay mb-4">Room 04 — Enquiries</p>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8">
            Write to the <span className="italic">gallery.</span>
          </h2>
          <p className="text-lg font-light text-stone leading-relaxed mb-12">
            Commissions, studio visits, or questions about a work —
            we answer every letter. Usually within a day, occasionally
            within the hour.
          </p>

          <dl className="space-y-6">
            <div>
              <dt className="label-caps text-stone mb-1">Correspondence</dt>
              <dd className="font-serif text-xl">hello@artecomm.gallery</dd>
            </div>
            <div>
              <dt className="label-caps text-stone mb-1">Viewing hours</dt>
              <dd className="font-serif text-xl">By appointment, Tue – Sat</dd>
            </div>
          </dl>
        </motion.div>

        {/* Right: form */}
        <motion.form
          className="md:col-span-3 space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label htmlFor="contact-name" className="label-caps text-stone block mb-2">
                Name
              </label>
              <input id="contact-name" type="text" placeholder="Your name" className={fieldClass} required />
            </div>
            <div>
              <label htmlFor="contact-email" className="label-caps text-stone block mb-2">
                Email
              </label>
              <input id="contact-email" type="email" placeholder="you@example.com" className={fieldClass} required />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="label-caps text-stone block mb-2">
              Message
            </label>
            <textarea
              id="contact-message"
              rows="5"
              placeholder="Tell us about your walls…"
              className={`${fieldClass} resize-y`}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-ink text-ivory px-14 py-5 label-caps cursor-pointer hover:bg-clay transition-colors duration-300"
          >
            {sent ? 'Letter sent ✦' : 'Send letter'}
          </button>
          {sent && (
            <p className="font-serif italic text-stone text-lg">
              Thank you — the gallery will reply shortly.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
