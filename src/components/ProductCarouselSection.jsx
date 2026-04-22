import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import ProductCard from './ProductCard';

export default function ProductCarouselSection({ id, title, subtitle, products }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -340 : 340,
      behavior: 'smooth',
    });
  };

  return (
    <section id={id} className="px-4 py-9 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[34px] border border-white/70 bg-white/60 p-5 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Curated Edit</p>
            <h2 className="mt-3 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-luxe-cocoa/70 dark:text-luxe-ink/65">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white text-luxe-charcoal shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white text-luxe-charcoal shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="hide-scrollbar mt-8 flex gap-5 overflow-x-auto pb-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
