import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Mail, Sparkles, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function StoreOverlays() {
  const {
    exitIntentOpen,
    flashMessage,
    newsletterOpen,
    recentPurchase,
    setExitIntentOpen,
    setFlashMessage,
    setNewsletterOpen,
  } = useStore();

  return (
    <>
      <AnimatePresence>
        {newsletterOpen && (
          <OfferPopup
            key="newsletter"
            title="Luxury inbox perks"
            description="Unlock first-order savings, bridal launch alerts, festive jewelry edits, and boutique gifting notes straight to your inbox."
            icon={<Mail className="h-5 w-5" />}
            cta="Join Newsletter"
            onClose={() => setNewsletterOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {exitIntentOpen && (
          <OfferPopup
            key="exit-intent"
            title="Wait, your 10% boutique welcome offer is live"
            description="Stay a little longer and explore our bridal sparkle, statement jhumkas, premium necklaces, and gift-worthy jewelry picks."
            icon={<Gift className="h-5 w-5" />}
            cta="Claim Offer"
            onClose={() => setExitIntentOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed left-1/2 top-24 z-[85] w-[92%] max-w-sm -translate-x-1/2 rounded-full bg-luxe-charcoal px-5 py-4 text-center text-sm font-semibold text-white shadow-luxe"
            onClick={() => setFlashMessage(null)}
          >
            {flashMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={recentPurchase}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-6 left-4 z-30 hidden max-w-sm rounded-[24px] border border-white/70 bg-white/90 px-5 py-4 shadow-luxe backdrop-blur-md md:block"
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-luxe-sand/40 text-luxe-cocoa">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-luxe-mocha/70">Recently purchased</p>
            <p className="mt-2 text-sm leading-6 text-luxe-charcoal">{recentPurchase}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function OfferPopup({ cta, description, icon, onClose, title }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[84] grid place-items-center bg-luxe-charcoal/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.26 }}
        className="w-full max-w-md overflow-hidden rounded-[32px] bg-[#fefaf7] shadow-luxe"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-luxe-charcoal via-luxe-cocoa to-luxe-mocha px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/12 backdrop-blur-md">
              {icon}
            </span>
            <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>
          <h3 className="mt-6 font-display text-4xl leading-none">{title}</h3>
        </div>

        <div className="p-6">
          <p className="text-sm leading-7 text-luxe-cocoa/75">{description}</p>
          <button type="button" onClick={onClose} className="mt-6 w-full rounded-full bg-luxe-charcoal px-5 py-4 text-sm font-semibold text-white">
            {cta}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
