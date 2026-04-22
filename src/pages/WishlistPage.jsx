import PageTransition from '../components/common/PageTransition';
import SeoMeta from '../components/common/SeoMeta';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function WishlistPage() {
  const { catalog, setLoginOpen, wishlistIds } = useStore();
  const wishlistProducts = catalog.filter((product) =>
    wishlistIds.includes(product.id || product._id),
  );

  return (
    <PageTransition>
      <SeoMeta
        title="Wishlist | Sayan Trendz"
        description="Review your saved luxury kurtis, premium ethnic wear, and boutique accessories on Sayan Trendz."
      />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Wishlist Database</p>
          <h1 className="mt-3 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">Your saved boutique picks</h1>

          {wishlistProducts.length ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[32px] border border-luxe-cocoa/10 bg-white/80 p-10 text-center shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">Your luxury wishlist is empty right now.</p>
              <p className="mt-2 text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">Save premium kurtis and accessories so they stay synced to your account.</p>
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="mt-5 rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
              >
                Sign In And Start Saving
              </button>
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
