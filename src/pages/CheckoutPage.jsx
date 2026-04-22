import { LockKeyhole, ShieldCheck, Sparkles, TicketPercent } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import SeoMeta from '../components/common/SeoMeta';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/store';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const {
    applyCoupon,
    cartDetailedItems,
    cartTotals,
    placeOrder,
    setLoginOpen,
    verifyPayment,
  } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponState, setCouponState] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    const defaultAddress = profile?.addresses?.find((address) => address.isDefault) || profile?.addresses?.[0];

    if (defaultAddress) {
      setFormState({
        fullName: defaultAddress.fullName || profile?.name || '',
        phone: defaultAddress.phone || profile?.phone || '',
        line1: defaultAddress.line1 || '',
        line2: defaultAddress.line2 || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        postalCode: defaultAddress.postalCode || '',
        country: defaultAddress.country || 'India',
      });
      return;
    }

    setFormState((current) => ({
      ...current,
      fullName: profile?.name || current.fullName,
      phone: profile?.phone || current.phone,
    }));
  }, [profile]);

  const payableTotals = useMemo(() => {
    if (!couponState) {
      return cartTotals;
    }

    return {
      ...cartTotals,
      discount: couponState.discount,
      shipping: couponState.totals.shipping,
      tax: couponState.totals.tax,
      total: couponState.totals.total,
    };
  }, [cartTotals, couponState]);

  const handleApplyCoupon = async () => {
    try {
      const response = await applyCoupon(couponCode);
      setCouponState(response);
    } catch (error) {
      setCouponState({
        error: error.response?.data?.message || error.message,
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await placeOrder({
        address: formState,
        couponCode: couponState?.coupon?.code || couponCode,
        paymentMethod,
      });

      if (response.payment.mode === 'cod' || response.payment.mode === 'simulation') {
        navigate('/account');
        return;
      }

      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: response.payment.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.payment.razorpayOrder.amount,
        currency: response.payment.razorpayOrder.currency,
        name: 'Sayan Trendz',
        description: 'Luxury jewelry checkout',
        order_id: response.payment.razorpayOrder.id,
        theme: { color: '#271c16' },
        prefill: {
          name: formState.fullName,
          email: profile?.email,
          contact: formState.phone,
        },
        handler: async (paymentResponse) => {
          await verifyPayment({
            orderId: response.order._id,
            ...paymentResponse,
          });
          navigate('/account');
        },
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <PageTransition>
      <SeoMeta
        title="Secure Checkout | Sayan Trendz"
        description="Complete your premium Sayan Trendz order with secure checkout, coupons, Razorpay, and boutique delivery support."
      />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-luxe-mocha/70 dark:text-luxe-ink/55">Secure Checkout</p>
              <h1 className="mt-3 font-display text-5xl text-luxe-espresso dark:text-luxe-ink">Luxury order experience</h1>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                { label: 'Razorpay', icon: LockKeyhole },
                { label: 'Protected checkout', icon: ShieldCheck },
                { label: 'Boutique support', icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-white/70 px-4 py-3 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Delivery details</h2>
              {!isAuthenticated ? (
                <div className="mt-6 rounded-[26px] border border-luxe-cocoa/10 bg-luxe-sand/30 p-5 dark:border-white/10 dark:bg-white/5">
                  <p className="font-semibold text-luxe-charcoal dark:text-luxe-ink">Sign in to sync your account, wishlist, and order history.</p>
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="mt-4 rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                  >
                    Sign In To Continue
                  </button>
                </div>
              ) : null}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['fullName', 'Full Name'],
                  ['phone', 'Phone Number'],
                  ['line1', 'Address Line 1'],
                  ['line2', 'Address Line 2'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['postalCode', 'Pincode'],
                  ['country', 'Country'],
                ].map(([field, label]) => (
                  <label key={field} className={field === 'line1' || field === 'line2' ? 'sm:col-span-2' : ''}>
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

              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.26em] text-luxe-mocha/70 dark:text-luxe-ink/55">Payment Method</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    { value: 'razorpay', label: 'Razorpay Secure Payment' },
                    { value: 'cod', label: 'Cash On Delivery' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setPaymentMethod(item.value)}
                      className={`rounded-[20px] border px-5 py-4 text-left text-sm font-semibold transition ${
                        paymentMethod === item.value
                          ? 'border-transparent bg-luxe-charcoal text-white dark:bg-luxe-ink dark:text-luxe-midnight'
                          : 'border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-luxe-sand/30 to-luxe-blush/40 p-6 shadow-luxe dark:border-white/10 dark:from-[#1c1713] dark:via-[#171310] dark:to-[#221a15]">
              <h2 className="font-display text-4xl text-luxe-espresso dark:text-luxe-ink">Order summary</h2>

              <div className="mt-6 space-y-4">
                {cartDetailedItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[78px_1fr] gap-4 rounded-[24px] border border-luxe-cocoa/10 bg-white/80 p-3 shadow-soft dark:border-white/10 dark:bg-white/5"
                  >
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      className="aspect-[0.82] w-full rounded-[18px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-luxe-mocha/60 dark:text-luxe-ink/55">{item.product.category}</p>
                      <h3 className="mt-1 font-semibold text-luxe-charcoal dark:text-luxe-ink">{item.product.title}</h3>
                      <p className="mt-1 text-sm text-luxe-cocoa/70 dark:text-luxe-ink/65">
                        {item.size} x {item.quantity}
                      </p>
                      <p className="mt-3 font-bold text-luxe-charcoal dark:text-luxe-ink">{formatPrice(item.lineTotal)}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] border border-luxe-cocoa/10 bg-white/85 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-luxe-charcoal dark:text-luxe-ink">
                  <TicketPercent className="h-4 w-4" />
                  Coupon System
                </div>
                <div className="mt-3 flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full rounded-full border border-luxe-cocoa/10 bg-luxe-mist px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                  >
                    Apply
                  </button>
                </div>
                {couponState?.error ? <p className="mt-3 text-sm text-red-600">{couponState.error}</p> : null}
                {couponState?.coupon ? (
                  <p className="mt-3 text-sm text-luxe-cocoa dark:text-luxe-ink/70">
                    Coupon <strong>{couponState.coupon.code}</strong> applied. You saved {formatPrice(couponState.discount)}.
                  </p>
                ) : null}
              </div>

              <div className="mt-6 space-y-3 text-sm text-luxe-cocoa/75 dark:text-luxe-ink/65">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotals.subtotal)}</span>
                </div>
                {couponState?.discount ? (
                  <div className="flex justify-between">
                    <span>Coupon Discount</span>
                    <span>- {formatPrice(couponState.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{payableTotals.shipping === 0 ? 'Free' : formatPrice(payableTotals.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(payableTotals.tax)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-luxe-cocoa/10 pt-5 text-lg font-semibold text-luxe-charcoal dark:border-white/10 dark:text-luxe-ink">
                <span>Total Payable</span>
                <span>{formatPrice(payableTotals.total)}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!cartDetailedItems.length || placingOrder}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-luxe-charcoal px-5 py-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-luxe-ink dark:text-luxe-midnight"
              >
                {placingOrder ? 'Processing Order...' : 'Place Secure Order'}
              </button>
            </aside>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
