import { announcements } from '../data/store';

export default function AnnouncementBar() {
  const loopedAnnouncements = [...announcements, ...announcements, ...announcements];

  return (
    <div className="sticky top-0 z-50 overflow-hidden border-b border-white/10 bg-luxe-charcoal text-white">
      <div className="animate-marquee whitespace-nowrap py-3">
        {loopedAnnouncements.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="mx-6 inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.42em] text-white/85 sm:text-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-luxe-almond" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
