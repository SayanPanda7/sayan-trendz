export function HomeSkeleton() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="skeleton-block h-[620px] rounded-[36px]" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`circle-${index}`} className="flex flex-col items-center gap-4">
              <div className="skeleton-block h-36 w-36 rounded-full" />
              <div className="skeleton-block h-4 w-24 rounded-full" />
            </div>
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="rounded-[34px] bg-white/60 p-6 shadow-soft">
            <div className="skeleton-block h-10 w-56 rounded-full" />
            <div className="mt-6 flex gap-5 overflow-hidden">
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <div key={`card-${cardIndex}`} className="min-w-[280px] flex-1">
                  <div className="skeleton-block h-[350px] rounded-[28px]" />
                  <div className="mt-4 space-y-3">
                    <div className="skeleton-block h-4 w-20 rounded-full" />
                    <div className="skeleton-block h-6 w-40 rounded-full" />
                    <div className="skeleton-block h-10 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function ProductSkeleton() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`product-skeleton-${index}`} className="skeleton-block aspect-[0.82] rounded-[28px]" />
          ))}
        </div>
        <div className="space-y-5">
          <div className="skeleton-block h-6 w-32 rounded-full" />
          <div className="skeleton-block h-16 w-full rounded-[22px]" />
          <div className="skeleton-block h-24 w-full rounded-[22px]" />
          <div className="skeleton-block h-12 w-48 rounded-full" />
          <div className="skeleton-block h-14 w-full rounded-full" />
          <div className="skeleton-block h-64 w-full rounded-[28px]" />
        </div>
      </div>
    </main>
  );
}
