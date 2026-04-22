import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SeoMeta from '../components/common/SeoMeta';
import PageTransition from '../components/common/PageTransition';
import { ProductSkeleton } from '../components/LoadingSkeleton';
import ProductCarouselSection from '../components/ProductCarouselSection';
import { useStore } from '../context/StoreContext';
import { customerReviews, formatPrice, sizeChart } from '../data/store';

export default function ProductPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    addToCart,
    buyNow,
    fetchRecommendations,
    getProductBySlugFromCatalog,
    isLoading,
    trackEvent,
  } = useStore();
  const product = useMemo(() => getProductBySlugFromCatalog(slug), [getProductBySlugFromCatalog, slug]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(product?.images[0] ?? '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('Enter your pincode to check express delivery.');
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      trackEvent({
        type: 'product_view',
        product: product._id || product.id,
        path: `/product/${product.slug}`,
        value: product.salePrice,
        meta: { category: product.category },
      });

      fetchRecommendations(product._id || product.id)
        .then((items) => setRelatedProducts(items))
        .catch(() => setRelatedProducts([]));
    }
  }, [fetchRecommendations, product, trackEvent]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <PageTransition>
        <main className="px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Product not found</p>
          <h1 className="mt-4 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">This boutique piece has moved</h1>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-luxe-charcoal px-6 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
          >
            Back to Home
          </Link>
        </main>
      </PageTransition>
    );
  }

  const canonicalUrl = `${import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}/product/${product.slug}`;

  const handleDeliveryCheck = () => {
    if (deliveryPincode.trim().length >= 6) {
      setDeliveryMessage('Express delivery available in 2-4 business days. COD available on selected pincodes.');
      return;
    }

    setDeliveryMessage('Please enter a valid 6-digit pincode.');
  };

  return (
    <PageTransition>
      <SeoMeta
        title={`${product.title} | Sayan Trendz`}
        description={product.description}
        image={product.primaryImage}
        canonical={canonicalUrl}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          image: product.images,
          description: product.description,
          brand: { '@type': 'Brand', name: 'Sayan Trendz' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.salePrice,
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
          },
        }}
      />

      <main className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-sm text-luxe-cocoa/70 dark:text-luxe-ink/55">
            <Link to="/" className="hover:text-luxe-charcoal dark:hover:text-luxe-ink">
              Home
            </Link>{' '}
            / <span>{product.category}</span> / <span className="text-luxe-charcoal dark:text-luxe-ink">{product.title}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
                  {product.images.map((image, index) => (
                    <button
                      key={`${product.id || product._id}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`overflow-hidden rounded-[22px] border p-1 shadow-soft transition ${
                        activeImage === image
                          ? 'border-luxe-cocoa bg-white dark:border-luxe-ink dark:bg-white/10'
                          : 'border-white/70 bg-white/70 dark:border-white/10 dark:bg-white/5'
                      }`}
                    >
                      <img
                        src={image}
                        alt={product.title}
                        className="h-24 w-20 rounded-[18px] object-cover sm:h-28 sm:w-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>

                <div
                  className="order-1 overflow-hidden rounded-[32px] border border-white/70 bg-white p-3 shadow-luxe dark:border-white/10 dark:bg-white/5 sm:order-2"
                  onMouseMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const x = ((event.clientX - rect.left) / rect.width) * 100;
                    const y = ((event.clientY - rect.top) / rect.height) * 100;
                    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(1.55)' });
                  }}
                  onMouseLeave={() => setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' })}
                >
                  <img
                    src={activeImage}
                    alt={product.title}
                    style={zoomStyle}
                    className="aspect-[0.82] w-full rounded-[26px] object-cover transition duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5 lg:p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">{product.category}</p>
              <h1 className="mt-3 font-display text-5xl leading-none text-luxe-espresso dark:text-luxe-ink">{product.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-luxe-cocoa/75 dark:text-luxe-ink/65">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`${product.id || product._id}-star-${index}`}
                      className={`h-4 w-4 ${index < Math.round(product.rating) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span>{product.rating} rating</span>
                <span>{product.reviews} reviews</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-luxe-sand/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxe-cocoa dark:bg-white/10 dark:text-luxe-ink">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified bestseller
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <span className="text-4xl font-extrabold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(product.salePrice)}</span>
                <span className="text-xl text-luxe-mocha/60 line-through dark:text-luxe-ink/45">{formatPrice(product.mrp)}</span>
                <span className="rounded-full bg-luxe-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white dark:bg-luxe-ink dark:text-luxe-midnight">
                  {product.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-luxe-mocha/70 dark:text-luxe-ink/55">{product.emi}</p>
              <p className="mt-5 text-base leading-8 text-luxe-cocoa/78 dark:text-luxe-ink/70">{product.description}</p>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Select size</p>
                  <button
                    type="button"
                    onClick={() => setSizeChartOpen(true)}
                    className="text-sm font-semibold text-luxe-cocoa underline-offset-4 hover:underline dark:text-luxe-ink"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
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

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-luxe-mist p-1 dark:border-white/10 dark:bg-white/8">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-luxe-charcoal dark:text-luxe-ink"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-luxe-charcoal dark:text-luxe-ink"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product, { quantity, size: selectedSize })}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-luxe-charcoal px-7 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    buyNow(product, { quantity, size: selectedSize });
                    navigate('/checkout');
                  }}
                  className="flex-1 rounded-full border border-luxe-cocoa/10 bg-luxe-sand/35 px-7 py-4 text-sm font-semibold text-luxe-charcoal dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <InfoPanel icon={<Truck className="h-5 w-5" />} title="Delivery Checker">
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={deliveryPincode}
                      onChange={(event) => setDeliveryPincode(event.target.value)}
                      placeholder="Enter pincode"
                      className="w-full rounded-full border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                    />
                    <button
                      type="button"
                      onClick={handleDeliveryCheck}
                      className="rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                    >
                      Check
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-luxe-cocoa/70 dark:text-luxe-ink/65">{deliveryMessage}</p>
                </InfoPanel>
                <InfoPanel icon={<ShieldCheck className="h-5 w-5" />} title="Current Offers">
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-luxe-cocoa/70 dark:text-luxe-ink/65">
                    {product.offers.map((offer) => (
                      <li key={offer}>{offer}</li>
                    ))}
                  </ul>
                </InfoPanel>
              </div>

              <div className="mt-8 grid gap-4 xl:grid-cols-2">
                <ContentBlock title="Product Details" items={product.details} />
                <ContentBlock title="Wash Care" items={product.washCare} />
              </div>
            </div>
          </div>

          <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <ContentBlock title="Material & Finish" items={[product.fabric, ...product.shipping]} />
            <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Reviews</p>
              <h2 className="mt-3 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Styled and loved by shoppers</h2>
              <div className="mt-6 space-y-5">
                {customerReviews.slice(0, 3).map((review) => (
                  <div key={review.name} className="rounded-[24px] bg-luxe-mist p-4 dark:bg-white/8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{review.name}</p>
                        <p className="text-sm text-luxe-mocha/65 dark:text-luxe-ink/55">{review.city}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxe-cocoa shadow-soft dark:bg-white/10 dark:text-luxe-ink">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-luxe-cocoa/75 dark:text-luxe-ink/65">{review.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-14">
            <ProductCarouselSection
              title="AI Related Products"
              subtitle="More premium boutique picks aligned with this silhouette, style mood, and recommendation engine."
              products={relatedProducts}
            />
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 z-30 border-t border-luxe-cocoa/10 bg-white/95 p-4 shadow-luxe backdrop-blur-md dark:border-white/10 dark:bg-[#171310]/95 md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-luxe-mocha/60 dark:text-luxe-ink/55">Now at</p>
              <p className="text-lg font-extrabold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(product.salePrice)}</p>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product, { quantity, size: selectedSize })}
              className="flex-1 rounded-full bg-luxe-charcoal px-5 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
            >
              Sticky Add to Cart
            </button>
          </div>
        </div>

        <AnimatePresence>
          {sizeChartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[85] grid place-items-center bg-luxe-charcoal/45 p-4 backdrop-blur-sm"
              onClick={() => setSizeChartOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                className="w-full max-w-2xl rounded-[30px] bg-[#fefaf7] p-6 shadow-luxe dark:bg-[#171310]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Jewelry Size Guide</p>
                    <h3 className="mt-2 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Find your best fit</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSizeChartOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 overflow-hidden rounded-[24px] border border-luxe-cocoa/10 dark:border-white/10">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-luxe-charcoal text-white dark:bg-luxe-ink dark:text-luxe-midnight">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Size</th>
                        <th className="px-4 py-3 font-semibold">Ring</th>
                        <th className="px-4 py-3 font-semibold">Bangle</th>
                        <th className="px-4 py-3 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.map((row) => (
                        <tr key={row.size} className="border-t border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-[#201915] dark:text-luxe-ink">
                          <td className="px-4 py-3 font-semibold text-luxe-charcoal dark:text-luxe-ink">{row.size}</td>
                          <td className="px-4 py-3">{row.ring}</td>
                          <td className="px-4 py-3">{row.bangle}</td>
                          <td className="px-4 py-3">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}

function InfoPanel({ children, icon, title }) {
  return (
    <div className="rounded-[28px] border border-luxe-cocoa/10 bg-luxe-mist p-5 dark:border-white/10 dark:bg-white/8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-luxe-cocoa shadow-soft dark:bg-white/10 dark:text-luxe-ink">
          {icon}
        </span>
        <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ContentBlock({ items, title }) {
  return (
    <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">{title}</p>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-luxe-cocoa/78 dark:text-luxe-ink/65">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
