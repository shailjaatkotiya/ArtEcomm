import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ArtImage from './ArtImage';

const ProductCard = ({ product, index }) => {
  const { addItem, openDrawer } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openDrawer();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: 'easeOut' }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="relative w-full aspect-[3/4] bg-parchment overflow-hidden mb-5">
          <ArtImage
            product={product}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          {product.special_edition && (
            <span className="absolute top-4 left-4 bg-clay text-ivory label-caps px-3 py-1.5">
              Special Edition
            </span>
          )}
          <span className="absolute bottom-4 right-4 label-caps text-ivory/0 bg-ink/0 px-3 py-1.5 transition-all duration-300 group-hover:text-ivory group-hover:bg-ink/80">
            View Work
          </span>
        </div>

        {/* Museum wall label */}
        <div className="flex justify-between items-start gap-4 border-t border-ink/15 pt-4">
          <div className="min-w-0">
            <p className="label-caps text-stone mb-1">No. {String(product.id).padStart(3, '0')}</p>
            <h3 className="font-serif text-2xl leading-tight capitalize group-hover:italic transition-all">
              {product.description}
            </h3>
            <p className="text-stone text-sm font-light mt-1">
              {product.dimension || 'Dimensions on request'} · {product.material}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-xl">${Number(product.price).toFixed(2)}</p>
            <button
              onClick={handleAdd}
              className="label-caps text-clay border-b border-clay/40 pb-0.5 mt-2 cursor-pointer hover:border-clay transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
