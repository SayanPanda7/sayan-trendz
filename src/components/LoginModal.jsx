import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, LockKeyhole, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function LoginModal() {
  const { authMode, isFirebaseConfigured, loginWithEmail, loginWithGoogle, registerWithEmail } = useAuth();
  const { loginOpen, setFlashMessage, setLoginOpen } = useStore();
  const [mode, setMode] = useState('signin');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!loginOpen) {
      setMode('signin');
      setFormState({ name: '', email: '', password: '' });
      setErrorMessage('');
      setSubmitting(false);
    }
  }, [loginOpen]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage('');

    try {
      if (mode === 'signin') {
        await loginWithEmail({
          email: formState.email,
          password: formState.password,
        });
        setFlashMessage('Signed in to your Sayan Trendz account');
      } else {
        await registerWithEmail(formState);
        setFlashMessage('Your Sayan Trendz account is ready');
      }

      setLoginOpen(false);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to complete authentication right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setErrorMessage('');

    try {
      await loginWithGoogle();
      setFlashMessage('Signed in to your Sayan Trendz account');
      setLoginOpen(false);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to complete Google sign-in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-luxe-charcoal/55 p-4 backdrop-blur-sm"
          onClick={() => setLoginOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className="grid w-full max-w-5xl overflow-hidden rounded-[34px] bg-[#fefaf7] shadow-luxe lg:grid-cols-[0.92fr_1.08fr] dark:bg-[#171310]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-luxe-charcoal via-luxe-cocoa to-luxe-mocha p-8 text-white">
              <div className="absolute -right-14 top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-10 bottom-8 h-32 w-32 rounded-full bg-luxe-sand/15 blur-2xl" />
              <p className="text-xs uppercase tracking-[0.34em] text-white/70">Members Access</p>
              <h2 className="mt-4 font-display text-5xl leading-none">Premium accounts, faster checkout</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">
                Firebase authentication, wishlist sync, order history, personalized recommendations, and members-only jewelry drops.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  'Firebase-backed secure sign-in',
                  'Wishlist database and order history',
                  'Luxury checkout with Razorpay integration',
                ].map((point) => (
                  <div key={point} className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 text-sm">
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm">
                <p className="font-semibold">Mode: {authMode === 'firebase' ? 'Firebase Live' : 'Demo Preview'}</p>
                <p className="mt-2 text-white/72">
                  {isFirebaseConfigured
                    ? 'Use your live Firebase credentials to access the production-ready auth flow.'
                    : 'Firebase env vars are not set, so the UI falls back to a local demo auth experience.'}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-cocoa/10 bg-white dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mx-auto mt-4 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-luxe-cocoa/10 bg-luxe-sand/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-luxe-mocha dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink/75">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Secure login
                </div>

                <h3 className="mt-5 font-display text-4xl text-luxe-espresso dark:text-luxe-ink">
                  {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-luxe-cocoa/75 dark:text-luxe-ink/65">
                  Luxury account access for checkout, saved addresses, wishlist sync, and premium recommendations.
                </p>

                <div className="mt-6 inline-flex rounded-full border border-luxe-cocoa/10 bg-luxe-mist p-1 dark:border-white/10 dark:bg-white/8">
                  {[
                    ['signin', 'Sign In'],
                    ['signup', 'Create Account'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMode(value)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        mode === value
                          ? 'bg-luxe-charcoal text-white dark:bg-luxe-ink dark:text-luxe-midnight'
                          : 'text-luxe-charcoal dark:text-luxe-ink'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  {mode === 'signup' ? (
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Full Name</span>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Sayan Trendz Muse"
                        className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-4 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                      />
                    </label>
                  ) : null}

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Email Address</span>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                      placeholder="you@example.com"
                      className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-4 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70 dark:text-luxe-ink/55">Password</span>
                    <input
                      type="password"
                      value={formState.password}
                      onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
                      placeholder="Enter secure password"
                      className="mt-3 w-full rounded-[18px] border border-luxe-cocoa/10 bg-luxe-mist px-4 py-4 text-sm outline-none dark:border-white/10 dark:bg-white/8 dark:text-luxe-ink"
                    />
                  </label>
                </div>

                {errorMessage ? <p className="mt-4 text-sm text-red-600">{errorMessage}</p> : null}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-luxe-charcoal px-6 py-4 text-sm font-semibold text-white dark:bg-luxe-ink dark:text-luxe-midnight"
                >
                  {submitting ? 'Please wait...' : mode === 'signin' ? 'Continue Securely' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-luxe-cocoa/10 bg-white px-6 py-4 text-sm font-semibold text-luxe-charcoal dark:border-white/10 dark:bg-white/5 dark:text-luxe-ink"
                >
                  <Sparkles className="h-4 w-4" />
                  Continue With Google
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
