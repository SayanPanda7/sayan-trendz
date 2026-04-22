import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/store';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, buyNow } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0]);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-luxe-charcoal/55 p-4 backdrop-blur-sm"
          onClick={() => setQuickViewProduct(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[34px] bg-[#fefaf7] p-4 shadow-luxe dark:bg-[#171310] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {quickViewProduct.images.slice(0, 4).map((image, index) => (
                  <div key={`${quickViewProduct.id}-${index}`} className="overflow-hidden rounded-[26px] bg-white p-2 shadow-soft dark:bg-white/5">
                    <img
                      src={image}
                      alt={quickViewProduct.title}
                      className="aspect-[0.8] w-full rounded-[20px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-5 py-3">
                <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">{quickViewProduct.category}</p>
                <h2 className="font-display text-5xl leading-none text-luxe-espresso dark:text-luxe-ink">{quickViewProduct.title}</h2>
                <p className="max-w-xl text-base leading-7 text-luxe-cocoa/75 dark:text-luxe-ink/65">{quickViewProduct.description}</p>

                <div className="flex items-end gap-3">
                  <span className="text-3xl font-extrabold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(quickViewProduct.salePrice)}</span>
                  <span className="text-base text-luxe-mocha/60 line-through dark:text-luxe-ink/45">{formatPrice(quickViewProduct.mrp)}</span>
                </div>
                <p className="text-sm text-luxe-mocha/80 dark:text-luxe-ink/60">{quickViewProduct.emi}</p>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">Select size</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedSize === size
                            ? 'bg-luxe-charcoal text-white dark:bg-luxe-ink dark:text-luxe-midnight'
                            : 'border border-luxe-cocoa/10 bg-white text-luxe-charcoal dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-white p-1 dark:border-white/10 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-luxe-charcoal dark:text-luxe-ink"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-luxe-charcoal dark:text-luxe-ink"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">{quickViewProduct.stockLabel}</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => addToCart(quickViewProduct, { quantity, size: selectedSize })}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-luxe-charcoal px-6 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => buyNow(quickViewProduct, { quantity, size: selectedSize })}
                    className="rounded-full border border-luxe-cocoa/10 bg-luxe-sand/40 px-6 py-4 text-sm font-semibold text-luxe-charcoal dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-soft dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">Highlights</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-luxe-cocoa/80 dark:text-luxe-ink/65">
                    {quickViewProduct.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
