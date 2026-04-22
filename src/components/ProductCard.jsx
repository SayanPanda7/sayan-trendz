import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/store';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, buyNow, setQuickViewProduct, toggleWishlist, wishlistIds } = useStore();
  const productId = product.id || product._id;
  const isLiked = wishlistIds.includes(productId);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="group flex h-full min-w-[280px] max-w-[320px] flex-col rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
    >
      <div className="relative overflow-hidden rounded-[24px] bg-luxe-mist dark:bg-white/8">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[0.78] overflow-hidden">
            <img
              src={product.primaryImage}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0"
              loading="lazy"
              decoding="async"
            />
            <img
              src={product.secondaryImage}
              alt={`${product.title} alternate`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-luxe-charcoal px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
          {product.badge}
        </span>

        <button
          type="button"
          onClick={() => toggleWishlist(productId)}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition ${
            isLiked
              ? 'border-transparent bg-luxe-cocoa text-white'
              : 'border-white/60 bg-white/70 text-luxe-charcoal dark:border-white/20 dark:bg-[#171310]/70 dark:text-luxe-ink'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          className="absolute bottom-3 left-3 right-3 inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-luxe-charcoal opacity-0 shadow-soft transition duration-300 group-hover:opacity-100 dark:bg-[#f5eee7] dark:text-luxe-charcoal"
        >
          <Eye className="h-4 w-4" />
          Quick View
        </button>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <Link to={`/product/${product.slug}`}>
          <p className="text-sm uppercase tracking-[0.26em] text-luxe-mocha/65 dark:text-luxe-ink/55">{product.category}</p>
          <h3 className="mt-2 text-lg font-semibold text-luxe-charcoal dark:text-luxe-ink">{product.title}</h3>
        </Link>

        <div className="mt-3 flex items-center gap-2 text-sm text-luxe-cocoa/80 dark:text-luxe-ink/65">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={`${productId}-${index}`} className={`h-4 w-4 ${index < Math.round(product.rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span>
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="mt-4 flex items-end gap-3">
          <span className="text-2xl font-extrabold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(product.salePrice)}</span>
          <span className="text-sm text-luxe-mocha/60 line-through dark:text-luxe-ink/45">{formatPrice(product.mrp)}</span>
        </div>
        <p className="mt-1 text-sm text-luxe-mocha/70 dark:text-luxe-ink/55">{product.emi}</p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-luxe-ink dark:text-luxe-midnight"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => {
              buyNow(product);
              navigate('/checkout');
            }}
            className="rounded-full border border-luxe-cocoa/10 bg-luxe-sand/35 px-5 py-3 text-sm font-semibold text-luxe-charcoal transition hover:bg-luxe-sand/55 dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.article>
  );
}
