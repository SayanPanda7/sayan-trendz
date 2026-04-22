import { BadgeCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';
import { customerReviews, ratingBreakdown } from '../data/store';

export default function ReviewSection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -360 : 360,
      behavior: 'smooth',
    });
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[34px] border border-white/70 bg-gradient-to-br from-white/90 to-luxe-sand/45 p-6 shadow-luxe lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
        <div className="rounded-[30px] bg-luxe-charcoal p-7 text-white">
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">Customer Love</p>
          <h2 className="mt-3 font-display text-5xl">4.9/5 boutique rating</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
            Verified shoppers love the premium drape, luxe colors, and polished store experience across the collection.
          </p>

          <div className="mt-8 space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.label} className="grid grid-cols-[56px_1fr_34px] items-center gap-3 text-sm">
                <span>{item.label}</span>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-luxe-almond" style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-right text-white/70">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70">Verified Stories</p>
              <h3 className="mt-2 font-display text-4xl text-luxe-espresso">Real-looking reviews, styled beautifully</h3>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white shadow-soft"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white shadow-soft"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="hide-scrollbar mt-8 flex gap-5 overflow-x-auto pb-2">
            {customerReviews.map((review) => (
              <article
                key={review.name}
                className="min-w-[290px] max-w-[360px] rounded-[28px] border border-luxe-cocoa/10 bg-white p-4 shadow-soft"
              >
                <img src={review.image} alt={review.name} className="aspect-[1.08] w-full rounded-[22px] object-cover" />
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={`${review.name}-${index}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-luxe-sand/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxe-cocoa">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <h4 className="mt-4 text-lg font-semibold text-luxe-charcoal">{review.title}</h4>
                <p className="mt-3 text-sm leading-7 text-luxe-cocoa/75">{review.body}</p>
                <div className="mt-5">
                  <p className="font-semibold text-luxe-charcoal">{review.name}</p>
                  <p className="text-sm text-luxe-mocha/65">{review.city}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
