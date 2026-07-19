export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f0f5ff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2">
        <div className="skeleton h-4 w-24" />
      </div>

      <div className="sticky top-16 z-30 bg-white border-b border-[#e2eaf8] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="skeleton w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0" />
              <div className="min-w-0 space-y-2">
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-3 w-32" />
              </div>
            </div>
            <div className="skeleton h-9 w-28 rounded-xl shrink-0" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-5">
        <section className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-sm">
          <div className="skeleton h-4 w-32 mb-5" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 bg-[#f8fbff] rounded-xl border border-[#e2eaf8]"
              >
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-sm space-y-3">
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-3/4" />
        </section>

        <section className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-sm">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-7 w-20 rounded-full" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
