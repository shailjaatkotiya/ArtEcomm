import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const API_URL = 'http://localhost:5000/api/arts';

const FILTERS = [
  {
    name: 'type',
    label: 'Type',
    options: [
      { value: 'wall decor', label: 'Wall Decor' },
      { value: 'room decor', label: 'Room Decor' },
      { value: 'digital', label: 'Digital' },
    ],
  },
  {
    name: 'material',
    label: 'Material',
    options: [
      { value: 'canvas', label: 'Canvas' },
      { value: 'paper', label: 'Paper' },
      { value: 'prints', label: 'Prints' },
    ],
  },
  {
    name: 'color',
    label: 'Finish',
    options: [
      { value: 'acrylic', label: 'Acrylic' },
      { value: 'poster', label: 'Poster' },
    ],
  },
  {
    name: 'shape',
    label: 'Format',
    options: [
      { value: 'landscape', label: 'Landscape' },
      { value: 'portrait', label: 'Portrait' },
      { value: 'square', label: 'Square' },
    ],
  },
  {
    name: 'special_edition',
    label: 'Edition',
    options: [
      { value: 'true', label: 'Special' },
      { value: 'false', label: 'Standard' },
    ],
  },
];

const emptyFilters = { type: '', material: '', color: '', shape: '', special_edition: '' };

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    material: searchParams.get('material') || '',
    color: searchParams.get('color') || '',
    shape: searchParams.get('shape') || '',
    special_edition: searchParams.get('special_edition') || '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        Object.keys(filters).forEach((key) => {
          if (filters[key]) query.append(key, filters[key]);
        });
        setSearchParams(query, { replace: true });

        const response = await fetch(`${API_URL}?${query.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch arts: ${response.status}`);
        const json = await response.json();
        setProducts(json.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, setSearchParams]);

  // Toggle behavior — clicking the active pill clears it
  const handleFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: prev[name] === value ? '' : value }));
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative bg-ivory text-ink min-h-screen pt-36 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full">
        {/* Page heading */}
        <div className="mb-16">
          <p className="label-caps text-clay mb-4">The Complete Collection</p>
          <h1 className="font-serif text-6xl md:text-8xl leading-none">
            Every work,<br />
            <span className="italic">catalogued.</span>
          </h1>
        </div>

        {/* Filter index */}
        <div className="border-y border-ink/15 py-8 mb-16 space-y-6">
          {FILTERS.map((group) => (
            <div key={group.name} className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="label-caps text-stone w-24 shrink-0">{group.label}</span>
              {group.options.map((opt) => {
                const active = filters[group.name] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleFilter(group.name, opt.value)}
                    className={`cursor-pointer font-serif text-xl transition-all duration-300 border-b pb-0.5
                      ${active ? 'italic text-clay border-clay' : 'text-ink/70 border-transparent hover:text-ink hover:border-ink/30'}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="label-caps text-stone">
              {loading ? 'Consulting the registrar…' : `${products.length} work${products.length === 1 ? '' : 's'} on view`}
            </span>
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(emptyFilters)}
                className="label-caps text-clay cursor-pointer hover:underline"
              >
                Clear all ({activeCount})
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {error && <p className="text-center text-clay text-lg py-20">Error: {error}</p>}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif italic text-3xl text-stone">
              Nothing hangs here — yet. Try loosening a filter.
            </p>
          </div>
        )}

        {!error && products.length > 0 && (
          <motion.div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}
          >
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
