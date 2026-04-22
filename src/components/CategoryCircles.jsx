import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '../data/store';

export default function CategoryCircles() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70">Shop By Category</p>
            <h2 className="mt-3 font-display text-4xl text-luxe-espresso sm:text-5xl">Your Boutique Style Circle</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-luxe-cocoa/70">
            Discover refined jewelry categories styled like a luxury boutique, from festive jhumkas to bridal sets and gifting edits.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {categories.map((category, index) => (
            <motion.a
              key={category.title}
              href="#best-sellers"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/70 bg-white p-2 shadow-soft sm:h-40 sm:w-40">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-luxe-charcoal/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="mt-4 font-semibold text-luxe-charcoal">{category.title}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-luxe-mocha/70">
                {category.count}
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
