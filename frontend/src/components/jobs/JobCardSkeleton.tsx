export default function JobCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-card border border-border p-5 shadow-xs h-full">
      <div>
        {/* Header: logo + title/company + bookmark */}
        <div className="flex items-start justify-between gap-3.5 mb-3.5">
          <div className="flex items-start gap-3.5 flex-1">
            <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="skeleton h-4 w-4/5 rounded-md" />
              <div className="skeleton h-3 w-1/2 rounded-md" />
            </div>
          </div>
          <div className="skeleton w-8 h-8 rounded-lg shrink-0" />
        </div>

        {/* Meta badges */}
        <div className="flex gap-2 mb-3.5">
          <div className="skeleton h-6 w-24 rounded-md" />
          <div className="skeleton h-6 w-16 rounded-md" />
          <div className="skeleton h-6 w-20 rounded-md" />
        </div>

        {/* Skills */}
        <div className="flex gap-1.5 mb-4">
          <div className="skeleton h-5 w-16 rounded-md" />
          <div className="skeleton h-5 w-20 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 border-t border-border flex items-center justify-between gap-3 mt-auto">
        <div className="space-y-1.5">
          <div className="skeleton h-4 w-24 rounded-md" />
          <div className="skeleton h-3 w-16 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-14 rounded-lg" />
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
