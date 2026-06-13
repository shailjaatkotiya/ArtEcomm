import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ArtImage from '../components/ArtImage';
import { getArtById, getArts } from '../lib/catalogApi';

const ProductItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setQty(1);
      try {
        const productData = await getArtById(id);

        if (!productData) {
          throw new Error('Work not found');
        }

        setProduct(productData);

        if (productData.type) {
          const relatedItems = await getArts({ type: productData.type });
          setRelated(relatedItems.filter((item) => item.id !== productData.id).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, qty);
    openDrawer();
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    openDrawer();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="font-serif italic text-3xl text-stone">Unwrapping the piece…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-serif italic text-3xl text-stone text-center">
          This work seems to be on loan elsewhere.
        </p>
        <Link to="/gallery" className="label-caps text-clay border-b border-clay pb-1">
          Return to the collection
        </Link>
      </div>
    );
  }

  const specs = [
    { term: 'Catalogue No.', detail: `No. ${String(product.id).padStart(3, '0')}` },
    { term: 'Type', detail: product.type },
    { term: 'Material', detail: product.material },
    { term: 'Finish', detail: product.color },
    { term: 'Format', detail: product.shape },
    { term: 'Dimensions', detail: product.dimension || 'On request' },
    { term: 'Edition', detail: product.special_edition ? 'Special edition' : 'Open edition' },
  ];

  return (
    <div className="relative bg-ivory/90 text-ink min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 label-caps text-stone hover:text-clay transition-colors cursor-pointer mb-12"
        >
          <ArrowLeft size={14} /> Back to the collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Artwork, framed like a vitrine */}
          <motion.div
            className="lg:sticky lg:top-32 self-start"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative bg-parchment p-6 md:p-10">
              <div className="border border-ink/10 overflow-hidden">
                <ArtImage product={product} className="w-full aspect-[3/4] object-cover" />
              </div>
              {product.special_edition && (
                <span className="absolute top-4 left-4 bg-clay text-ivory label-caps px-3 py-1.5">
                  Special Edition
                </span>
              )}
            </div>
            <p className="label-caps text-stone text-center mt-4">
              Photographed in natural light · Frame not included
            </p>
          </motion.div>

          {/* Object record */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label-caps text-clay mb-4">
              Object Record · No. {String(product.id).padStart(3, '0')}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight capitalize mb-6">
              {product.description}
            </h1>
            <p className="font-serif text-4xl mb-10">${Number(product.price).toFixed(2)}</p>

            {/* Museum label table */}
            <dl className="border-t border-ink/15 mb-10">
              {specs.map((spec) => (
                <div
                  key={spec.term}
                  className="grid grid-cols-2 gap-4 py-3.5 border-b border-ink/10"
                >
                  <dt className="label-caps text-stone self-center">{spec.term}</dt>
                  <dd className="font-light capitalize">{spec.detail}</dd>
                </div>
              ))}
            </dl>

            {/* Quantity + actions */}
            <div className="flex items-center gap-6 mb-6">
              <span className="label-caps text-stone">Quantity</span>
              <div className="flex items-center gap-5 border border-ink/25 px-4 py-2.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="cursor-pointer hover:text-clay transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-serif text-xl w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="cursor-pointer hover:text-clay transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 border border-ink text-ink py-4.5 px-8 label-caps cursor-pointer hover:bg-ink hover:text-ivory transition-colors duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-ink text-ivory py-4.5 px-8 label-caps cursor-pointer hover:bg-clay transition-colors duration-300"
              >
                Buy Now
              </button>
            </div>

            <p className="font-light text-stone leading-relaxed mt-10 border-l-2 border-clay/40 pl-5">
              Each work ships flat or rolled in archival packing, with a signed
              certificate of authenticity. Returns accepted within 14 days —
              though the wall rarely gives them back.
            </p>
          </motion.div>
        </div>

        {/* Companion pieces */}
        {related.length > 0 && (
          <div className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <h2 className="font-serif text-4xl md:text-5xl">
                From the same <span className="italic">room.</span>
              </h2>
              <Link
                to="/gallery"
                className="label-caps border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors hidden md:block"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {related.map((p, i) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group block">
                  <div className="w-full aspect-[3/4] bg-parchment overflow-hidden mb-4">
                    <ArtImage
                      product={p}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-serif text-xl capitalize group-hover:italic">{p.description}</p>
                  <p className="text-stone font-light">${Number(p.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItemPage;
