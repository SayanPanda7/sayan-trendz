import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-luxe-cocoa/10 bg-[#211712] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <p className="font-display text-4xl">Sayan Trendz</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            A luxury boutique destination for premium kurtis, ethnicwear, and accessories curated with elegant feminine tones and an elevated shopping feel.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Instagram, Facebook, Youtube].map((Icon) => (
              <a
                key={Icon.displayName ?? Icon.name}
                href="#instagram-feed"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn
          title="Quick Links"
          items={['New Arrivals', 'Best Sellers', 'Festival Special', 'Accessories', 'Gift Cards']}
        />
        <FooterColumn
          title="Policies"
          items={['Shipping Policy', 'Returns & Exchange', 'Privacy Policy', 'Terms & Conditions', 'Track Order']}
        />

        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/55">Contact</p>
          <div className="mt-6 space-y-4 text-sm text-white/72">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4" />
              <span>Premium Styling Studio, Kolkata, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4" />
              <span>+91 99999 99999</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>hello@sayantrendz.com</span>
            </div>
          </div>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-5">
            <p className="font-semibold">Newsletter Signup</p>
            <p className="mt-2 text-sm text-white/60">Luxury launches, styling tips, and members-only sale access.</p>
            <div className="mt-4 flex rounded-full bg-white/8 p-1">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35"
              />
              <button type="button" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-luxe-charcoal">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ items, title }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.32em] text-white/55">{title}</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <a key={item} href="#best-sellers" className="block text-sm text-white/72 transition hover:text-white">
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}
