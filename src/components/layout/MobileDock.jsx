import { Heart, Home, MoonStar, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';

export default function MobileDock() {
  const { pathname } = useLocation();
  const { cartCount, setCartOpen, wishlistCount } = useStore();
  const { toggleTheme } = useTheme();

  const links = [
    { label: 'Home', icon: Home, to: '/' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist', count: wishlistCount },
    { label: 'Account', icon: User, to: '/account' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-white/70 bg-white/85 px-4 py-3 shadow-luxe backdrop-blur-xl dark:border-white/10 dark:bg-[#171310]/90 md:hidden">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.to;

        return (
          <Link
            key={item.label}
            to={item.to}
            className={`relative inline-flex flex-col items-center gap-1 text-[11px] font-semibold ${
              isActive ? 'text-luxe-charcoal dark:text-luxe-ink' : 'text-luxe-mocha/65 dark:text-luxe-ink/65'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {item.count ? (
              <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-luxe-cocoa px-1 text-[9px] text-white">
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="relative inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-luxe-mocha/65 dark:text-luxe-ink/65"
      >
        <ShoppingBag className="h-4 w-4" />
        Bag
        {cartCount ? (
          <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-luxe-cocoa px-1 text-[9px] text-white">
            {cartCount}
          </span>
        ) : null}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-luxe-mocha/65 dark:text-luxe-ink/65"
      >
        <MoonStar className="h-4 w-4" />
        Theme
      </button>
    </div>
  );
}
