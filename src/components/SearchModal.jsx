import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/store';

export default function SearchModal() {
  const { catalog, searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) {
      return catalog.slice(0, 8);
    }

    return catalog.filter((product) =>
      `${product.title} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [catalog, query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] bg-luxe-charcoal/45 p-4 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mx-auto mt-16 max-w-5xl rounded-[34px] bg-[#fefaf7] p-5 shadow-luxe dark:bg-[#171310] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-full border border-luxe-cocoa/10 bg-white px-5 py-4 shadow-soft dark:border-white/10 dark:bg-white/5">
              <Search className="h-5 w-5 text-luxe-mocha/70 dark:text-luxe-ink/55" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search jhumkas, oxidised earrings, necklaces, bridal sets..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-luxe-mocha/45 dark:text-luxe-ink dark:placeholder:text-luxe-ink/35"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-luxe-sand/35 text-luxe-charcoal dark:bg-white/10 dark:text-luxe-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {results.map((product) => (
                <Link
                  key={product.id || product._id}
                  to={`/product/${product.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="rounded-[24px] border border-luxe-cocoa/10 bg-white p-3 shadow-soft transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
                >
                  <img
                    src={product.primaryImage}
                    alt={product.title}
                    className="aspect-[0.8] w-full rounded-[18px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="mt-4 text-xs uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">{product.category}</p>
                  <h3 className="mt-2 font-semibold text-luxe-charcoal dark:text-luxe-ink">{product.title}</h3>
                  <p className="mt-2 text-sm font-bold text-luxe-cocoa dark:text-luxe-ink">{formatPrice(product.salePrice)}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
