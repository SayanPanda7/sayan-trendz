import { Heart, Package, Save, User2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import SeoMeta from '../../components/common/SeoMeta';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../data/store';

export default function AccountPage() {
  const { isAuthenticated, profile, updateCurrentUser } = useAuth();
  const { orders, setLoginOpen, wishlistCount } = useStore();
  const [formState, setFormState] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormState({
      name: profile?.name || '',
      phone: profile?.phone || '',
    });
  }, [profile]);

  const orderStats = useMemo(
    () => ({
      count: orders.length,
      spend: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    }),
    [orders],
  );

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateCurrentUser(formState);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <main className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[34px] border border-luxe-cocoa/10 bg-white/80 p-10 text-center shadow-luxe dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">User Accounts</p>
            <h1 className="mt-3 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">Sign in to your Sayan Trendz account</h1>
            <p className="mt-4 text-sm leading-7 text-luxe-cocoa/75 dark:text-luxe-ink/65">
              Access order history, saved wishlist items, addresses, and premium shopping recommendations.
            </p>
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="mt-6 rounded-full bg-luxe-charcoal px-6 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
            >
              Sign In
            </button>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SeoMeta
        title="My Account | Sayan Trendz"
        description="Manage your Sayan Trendz profile, view order history, track boutique purchases, and update preferences."
      />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Customer Account</p>
          <h1 className="mt-3 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">Welcome back, {profile?.name || 'Fashion Muse'}</h1>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { label: 'Orders', value: orderStats.count, icon: Package },
              { label: 'Wishlist', value: wishlistCount, icon: Heart },
              { label: 'Lifetime Spend', value: formatPrice(orderStats.spend), icon: User2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-luxe-sand/35 text-luxe-cocoa dark:bg-white/10 dark:text-luxe-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs uppercase tracking-[0.26em] text-luxe-mocha/65 dark:text-luxe-ink/55">{item.label}</p>
                  <p className="mt-2 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
              <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Profile Details</h2>
              <div className="mt-6 grid gap-4">
                {[
                  ['name', 'Full Name'],
                  ['phone', 'Phone Number'],
                ].map(([field, label]) => (
                  <label key={field}>
                    <span className="text-xs uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">{label}</span>
                    <input
                      type="text"
                      value={formState[field]}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                    />
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </section>

            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
              <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Order History</h2>
              <div className="mt-6 space-y-4">
                {orders.length ? (
                  orders.map((order) => (
                    <article
                      key={order._id}
                      className="rounded-[24px] border border-luxe-cocoa/10 bg-luxe-mist p-4 dark:border-white/10 dark:bg-white/8"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{order.orderNumber}</p>
                          <p className="text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">
                            {order.items.length} items · {order.paymentMethod.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm uppercase tracking-[0.2em] text-luxe-mocha/60 dark:text-luxe-ink/55">{order.status}</p>
                          <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-luxe-cocoa/10 bg-luxe-mist p-5 text-sm text-luxe-cocoa/75 dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink/65">
                    Your order history will appear here after checkout.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
