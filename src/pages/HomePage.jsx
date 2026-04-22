import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CategoryCircles from '../components/CategoryCircles';
import PageTransition from '../components/common/PageTransition';
import SeoMeta from '../components/common/SeoMeta';
import HeroCarousel from '../components/HeroCarousel';
import InstagramGallery from '../components/InstagramGallery';
import { HomeSkeleton } from '../components/LoadingSkeleton';
import ProductCarouselSection from '../components/ProductCarouselSection';
import ReviewSection from '../components/ReviewSection';
import { useStore } from '../context/StoreContext';
import { serviceHighlights } from '../data/store';

export default function HomePage() {
  const { collectionConfigs, fetchRecommendations, getCollectionProductsFromCatalog, isLoading } = useStore();
  const [aiRecommendations, setAiRecommendations] = useState([]);

  useEffect(() => {
    fetchRecommendations()
      .then((items) => setAiRecommendations(items))
      .catch(() => setAiRecommendations([]));
  }, [fetchRecommendations]);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <PageTransition>
      <SeoMeta
        title="Sayan Trendz | Luxury Fashion eCommerce Platform"
        description="Discover premium kurtis, ethnic wear, accessories, secure checkout, AI recommendations, and boutique-grade shopping design with Sayan Trendz."
      />

      <main className="pb-6">
        <HeroCarousel />

        <section className="px-4 pt-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {serviceHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Signature Promise</p>
                <h3 className="mt-3 font-display text-3xl text-luxe-espresso dark:text-luxe-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-luxe-cocoa/75 dark:text-luxe-ink/65">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <CategoryCircles />

        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-white/70 bg-gradient-to-br from-luxe-charcoal via-luxe-cocoa to-luxe-mocha p-8 text-white shadow-luxe">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/60">Editorial Boutique Note</p>
                <h2 className="mt-4 font-display text-5xl leading-none">Curated for elevated women’s fashion moments</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
                  Sayan Trendz now blends premium storefront design with production-ready commerce features including Firebase auth, Razorpay checkout, MongoDB-backed data, AI recommendations, analytics, and admin operations.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: '30+', label: 'Catalog products' },
                  { value: 'Full', label: 'Admin backend' },
                  { value: 'Live', label: 'Secure checkout' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[26px] border border-white/12 bg-white/8 p-5 text-center backdrop-blur-sm">
                    <p className="font-display text-5xl">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.26em] text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {collectionConfigs.map((collection) => (
          <ProductCarouselSection
            key={collection.id}
            id={collection.id}
            title={collection.title}
            subtitle={collection.subtitle}
            products={getCollectionProductsFromCatalog(collection.tag)}
          />
        ))}

        {aiRecommendations.length ? (
          <ProductCarouselSection
            id="ai-recommendations"
            title="AI Product Recommendations"
            subtitle="A premium recommendation engine blending category affinity, fashion tags, and shopper behavior to surface the most relevant boutique styles."
            products={aiRecommendations}
          />
        ) : null}

        <ReviewSection />
        <InstagramGallery />
      </main>
    </PageTransition>
  );
}
