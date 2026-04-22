import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, MoonStar, Search, ShoppingBag, SunMedium, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { navLinks } from '../data/store';

export default function Navbar() {
  const { pathname } = useLocation();
  const { isAdmin, isAuthenticated, profile, signOutUser } = useAuth();
  const {
    cartCount,
    setCartOpen,
    setLoginOpen,
    setSearchOpen,
    wishlistCount,
  } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-[42px] z-40 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-luxe-cocoa/10 bg-white/80 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-[#171310]/82'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <span className="block font-display text-3xl tracking-wide text-luxe-espresso dark:text-luxe-ink">Sayan Trendz</span>
            <span className="block text-[10px] uppercase tracking-[0.42em] text-luxe-mocha/80 dark:text-luxe-ink/55">
              Luxury Commerce Platform
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={pathname === '/' ? link.href : `/${link.href}`}
                className="text-sm font-medium text-luxe-charcoal/80 transition hover:text-luxe-cocoa dark:text-luxe-ink/75 dark:hover:text-luxe-ink"
              >
                {link.label}
              </a>
            ))}
            <Link to="/admin" className="text-sm font-medium text-luxe-charcoal/80 dark:text-luxe-ink/75">
              Admin
            </Link>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <IconButton label="Search" onClick={() => setSearchOpen(true)} icon={<Search className="h-4 w-4" />} />
            <IconButton as={Link} to="/wishlist" label="Wishlist" count={wishlistCount} icon={<Heart className="h-4 w-4" />} />
            <button type="button" onClick={toggleTheme}>
              <IconButton
                label="Theme"
                icon={isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              />
            </button>
            {isAuthenticated ? (
              <IconButton as={Link} to="/account" label="Profile" icon={<User className="h-4 w-4" />} />
            ) : (
              <IconButton label="Profile" onClick={() => setLoginOpen(true)} icon={<User className="h-4 w-4" />} />
            )}
            <IconButton
              label="Bag"
              count={cartCount}
              onClick={() => setCartOpen(true)}
              icon={<ShoppingBag className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <IconButton label="Search" onClick={() => setSearchOpen(true)} icon={<Search className="h-4 w-4" />} />
            <IconButton
              label="Bag"
              count={cartCount}
              onClick={() => setCartOpen(true)}
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white/80 text-luxe-espresso shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-luxe-charcoal/45 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-[#fbf7f2] p-6 shadow-luxe dark:bg-[#171310]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl text-luxe-espresso dark:text-luxe-ink">Sayan Trendz</p>
                  <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Premium Boutique</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 space-y-5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={pathname === '/' ? link.href : `/${link.href}`}
                    className="block text-lg font-semibold text-luxe-charcoal dark:text-luxe-ink"
                  >
                    {link.label}
                  </a>
                ))}
                <Link to="/wishlist" className="block text-lg font-semibold text-luxe-charcoal dark:text-luxe-ink">
                  Wishlist
                </Link>
                <Link to="/account" className="block text-lg font-semibold text-luxe-charcoal dark:text-luxe-ink">
                  Account
                </Link>
                {isAdmin ? (
                  <Link to="/admin" className="block text-lg font-semibold text-luxe-charcoal dark:text-luxe-ink">
                    Admin Dashboard
                  </Link>
                ) : null}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <SmallAction label="Wishlist" as={Link} to="/wishlist" />
                <SmallAction label="Search" onClick={() => setSearchOpen(true)} />
                <SmallAction label="Bag" onClick={() => setCartOpen(true)} />
                <SmallAction label={isDark ? 'Light Mode' : 'Dark Mode'} onClick={toggleTheme} />
              </div>

              <div className="mt-auto rounded-[28px] bg-luxe-charcoal p-5 text-white dark:bg-luxe-ink dark:text-luxe-midnight">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60 dark:text-luxe-midnight/60">Members Club</p>
                <p className="mt-2 font-display text-3xl">
                  {isAuthenticated ? `Hi ${profile?.name?.split(' ')[0] || 'Muse'}` : 'Unlock early sale access'}
                </p>
                <button
                  type="button"
                  onClick={isAuthenticated ? signOutUser : () => setLoginOpen(true)}
                  className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-luxe-charcoal dark:bg-luxe-midnight dark:text-luxe-ink"
                >
                  {isAuthenticated ? 'Sign Out' : 'Join Now'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({ as: Component = 'button', icon, label, onClick, count, to }) {
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      to={to}
      onClick={onClick}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white/80 text-luxe-espresso shadow-soft transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink dark:hover:bg-white/10"
      aria-label={label}
    >
      {icon}
      {count > 0 && (
        <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-luxe-cocoa px-1.5 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Component>
  );
}

function SmallAction({ as: Component = 'button', label, onClick, to }) {
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      to={to}
      onClick={onClick}
      className="rounded-2xl border border-luxe-cocoa/10 bg-white px-4 py-3 text-left text-sm font-semibold text-luxe-charcoal shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
    >
      {label}
    </Component>
  );
}
