import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { instagramFeed } from '../data/store';

export default function InstagramGallery() {
  return (
    <section id="instagram-feed" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70">@sayantrendz</p>
            <h2 className="mt-3 font-display text-4xl text-luxe-espresso sm:text-5xl">Instagram-worthy boutique moments</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-luxe-cocoa/70">
            A visual feed inspired by fashion boutiques and premium social-first stores, styled with soft beige luxe tones.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {instagramFeed.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white p-2 shadow-soft"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="aspect-[0.95] w-full rounded-[24px] object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-2 flex flex-col justify-between rounded-[24px] bg-gradient-to-t from-luxe-charcoal/75 via-luxe-charcoal/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="flex justify-end">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    <Camera className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/70">Instagram Edit</p>
                  <p className="mt-2 text-lg font-semibold text-white">{post.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
