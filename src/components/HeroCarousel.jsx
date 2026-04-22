import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { heroSlides, saleDeadline } from '../data/store';

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[index];

  return (
    <section className="relative overflow-hidden px-4 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[36px] border border-white/50 bg-gradient-to-br from-luxe-sand/70 via-white to-luxe-blush/70 p-5 shadow-luxe sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]"
            >
              <div className="space-y-6 lg:pr-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-luxe-mocha">
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeSlide.eyebrow}
                </div>

                <div className="space-y-5">
                  <span className="inline-flex rounded-full bg-luxe-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white">
                    {activeSlide.badge}
                  </span>
                  <h1 className="max-w-2xl font-display text-5xl leading-none text-luxe-espresso sm:text-6xl lg:text-7xl">
                    {activeSlide.title}
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-luxe-cocoa/80 sm:text-lg">
                    {activeSlide.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#best-sellers"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-luxe-charcoal px-7 py-4 text-sm font-semibold text-white transition hover:translate-y-[-2px]"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#premium-ethnic-collection"
                    className="inline-flex items-center justify-center rounded-full border border-luxe-cocoa/15 bg-white/85 px-7 py-4 text-sm font-semibold text-luxe-charcoal transition hover:bg-white"
                  >
                    Explore Collection
                  </a>
                </div>

                <div className="grid gap-4 rounded-[28px] border border-white/60 bg-white/65 p-5 backdrop-blur-sm sm:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-luxe-mocha/70">Sale countdown</p>
                    <p className="mt-2 font-display text-3xl text-luxe-espresso">Luxury summer event</p>
                    <p className="mt-1 text-sm text-luxe-cocoa/70">Live now with boutique styling edits and limited festive drops.</p>
                  </div>
                  <CountdownTimer targetDate={saleDeadline} />
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-8 hidden rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-luxe-cocoa shadow-soft sm:block">
                  Premium Handfeel
                </div>
                <div className="absolute -right-2 bottom-8 z-10 hidden rounded-[26px] bg-luxe-charcoal px-6 py-5 text-white shadow-luxe sm:block">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Curated edits</p>
                  <p className="mt-2 font-display text-4xl">30+</p>
                  <p className="text-sm text-white/75">Realistic boutique styles</p>
                </div>

                <div className="relative overflow-hidden rounded-[34px] bg-white p-3 shadow-luxe">
                  <div className="absolute inset-0 bg-hero-glow" />
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className="h-[440px] w-full rounded-[28px] object-cover object-center sm:h-[540px]"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === slideIndex ? 'w-10 bg-luxe-charcoal' : 'w-2.5 bg-luxe-cocoa/25'
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white/80 text-luxe-charcoal shadow-soft"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((current) => (current + 1) % heroSlides.length)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white/80 text-luxe-charcoal shadow-soft"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownTimer({ targetDate }) {
  const getRemaining = () => {
    const distance = new Date(targetDate).getTime() - new Date().getTime();
    const safeDistance = Math.max(distance, 0);

    return {
      days: Math.floor(safeDistance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((safeDistance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((safeDistance / (1000 * 60)) % 60),
    };
  };

  const [time, setTime] = useState(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getRemaining()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Days', value: time.days },
        { label: 'Hours', value: time.hours },
        { label: 'Mins', value: time.minutes },
      ].map((item) => (
        <div key={item.label} className="rounded-2xl bg-luxe-charcoal px-4 py-4 text-center text-white">
          <p className="font-display text-3xl leading-none">{String(item.value).padStart(2, '0')}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/60">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
