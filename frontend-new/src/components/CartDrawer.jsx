import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ArtImage from './ArtImage';

const CartDrawer = () => {
  const { items, drawerOpen, closeDrawer, updateQty, removeItem, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-md bg-ivory text-ink flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-ink/10">
              <h2 className="font-serif text-3xl">Acquisitions</h2>
              <button onClick={closeDrawer} aria-label="Close cart" className="cursor-pointer hover:rotate-90 transition-transform duration-300">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <p className="font-serif italic text-2xl text-stone mb-6">
                  Your collection awaits its first piece.
                </p>
                <Link
                  to="/gallery"
                  onClick={closeDrawer}
                  className="label-caps border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors"
                >
                  Browse the gallery
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 border-b border-ink/10 pb-6">
                      <div className="w-20 h-24 bg-parchment overflow-hidden shrink-0">
                        <ArtImage product={item} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg leading-tight truncate">{item.description}</p>
                        <p className="label-caps text-stone mt-1">
                          {item.dimension || '—'} · {item.material}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 border border-ink/20 px-2 py-1">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="cursor-pointer" aria-label="Decrease quantity">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="cursor-pointer" aria-label="Increase quantity">
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-serif text-lg">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start text-stone hover:text-clay transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="px-8 py-6 border-t border-ink/10 bg-parchment/50">
                  <div className="flex justify-between items-baseline mb-5">
                    <span className="label-caps text-stone">Total</span>
                    <span className="font-serif text-3xl">${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert('Order placed — our registrar will be in touch to arrange shipping.');
                      clearCart();
                      closeDrawer();
                    }}
                    className="w-full bg-ink text-ivory py-4 label-caps cursor-pointer hover:bg-clay transition-colors duration-300"
                  >
                    Complete Acquisition
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
