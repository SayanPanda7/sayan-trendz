import { AnimatePresence, motion } from 'framer-motion';
import { Headset, MessageCircle, PhoneCall, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function FloatingActions() {
  const { supportOpen, setSupportOpen } = useStore();

  return (
    <>
      <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
        <AnimatePresence>
          {supportOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="w-[290px] rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-luxe backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-luxe-charcoal text-white">
                  <Headset className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-luxe-charcoal">Need styling help?</p>
                  <p className="text-sm text-luxe-cocoa/70">Live support is online from 10 AM to 8 PM.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <button type="button" className="rounded-full bg-luxe-charcoal px-5 py-3 text-sm font-semibold text-white">
                  Start Live Chat
                </button>
                <button type="button" className="rounded-full border border-luxe-cocoa/10 bg-luxe-sand/35 px-5 py-3 text-sm font-semibold text-luxe-charcoal">
                  Call Boutique Concierge
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe transition hover:-translate-y-1"
          aria-label="WhatsApp"
        >
          <PhoneCall className="h-5 w-5" />
        </a>

        <button
          type="button"
          onClick={() => setSupportOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full bg-luxe-charcoal px-5 py-4 text-sm font-semibold text-white shadow-luxe transition hover:-translate-y-1"
        >
          {supportOpen ? <Send className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
          {supportOpen ? 'Hide Help' : 'Live Help'}
        </button>
      </div>
    </>
  );
}
