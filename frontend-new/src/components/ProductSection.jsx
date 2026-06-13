import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getArts } from '../lib/catalogApi';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getArts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="products" className="relative bg-ivory/90 text-ink py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <p className="label-caps text-clay mb-4">Room 03 — On View</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-none">
              Selected <span className="italic">works.</span>
            </h2>
          </div>
          <Link
            to="/gallery"
            className="label-caps border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors w-fit"
          >
            View complete collection →
          </Link>
        </div>

        {loading && (
          <p className="text-center font-serif italic text-2xl text-stone py-20">
            Hanging the works…
          </p>
        )}
        {error && <p className="text-center text-clay text-lg py-20">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {products.slice(0, 6).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
