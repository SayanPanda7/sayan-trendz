import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../data/store';

export default function CartDrawer() {
  const {
    cartDetailedItems,
    cartOpen,
    cartTotals,
    removeCartItem,
    setCartOpen,
    updateCartItem,
  } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[78] bg-luxe-charcoal/45 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="ml-auto flex h-full w-full max-w-xl flex-col bg-[#fefaf7] p-5 shadow-luxe dark:bg-luxe-midnight"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Shopping Bag</p>
                <h2 className="mt-2 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Luxury checkout</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
              {cartDetailedItems.length === 0 ? (
                <div className="rounded-[28px] border border-luxe-cocoa/10 bg-white p-8 text-center shadow-soft dark:border-white/10 dark:bg-white/5">
                  <ShoppingBag className="mx-auto h-10 w-10 text-luxe-cocoa/60 dark:text-luxe-ink/60" />
                  <p className="mt-4 font-semibold text-luxe-charcoal dark:text-luxe-ink">Your premium bag is empty</p>
                  <p className="mt-2 text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">Add curated picks to continue to secure checkout.</p>
                </div>
              ) : (
                cartDetailedItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[92px_1fr] gap-4 rounded-[26px] border border-luxe-cocoa/10 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-white/5"
                  >
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      className="aspect-[0.82] w-full rounded-[20px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-luxe-mocha/60 dark:text-luxe-ink/55">{item.product.category}</p>
                          <h3 className="mt-1 font-semibold text-luxe-charcoal dark:text-luxe-ink">{item.product.title}</h3>
                          <p className="mt-1 text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">Size {item.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-luxe-sand/35 text-luxe-charcoal dark:bg-white/10 dark:text-luxe-ink"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-luxe-mist p-1 dark:border-white/10 dark:bg-white/10">
                          <button
                            type="button"
                            onClick={() => updateCartItem(item.id, { quantity: item.quantity - 1 })}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-lg font-extrabold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(item.lineTotal)}</p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-6 rounded-[28px] border border-luxe-cocoa/10 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="space-y-2 text-sm text-luxe-cocoa/75 dark:text-luxe-ink/65">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cartTotals.shipping === 0 ? 'Free' : formatPrice(cartTotals.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tax</span>
                  <span>{formatPrice(cartTotals.tax)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-luxe-cocoa/10 pt-4 font-semibold text-luxe-charcoal dark:border-white/10 dark:text-luxe-ink">
                <span>Total</span>
                <span>{formatPrice(cartTotals.total)}</span>
              </div>

              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-luxe-charcoal px-5 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
              >
                Proceed To Secure Checkout
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
