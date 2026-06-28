import { Card } from "@/components/ui/card";

export default function JobCardSkeleton() {
  return (
    <Card className="p-6 border-[#e2eaf8] bg-white flex flex-col h-full">
      <div className="flex flex-col flex-1 p-5 pt-3">
        {/* Header: logo + title/company + bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          </div>
          <div className="skeleton w-7 h-7 rounded-lg shrink-0" />
        </div>

        {/* Meta: location + job type */}
        <div className="flex gap-4 mb-3">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-3 w-16" />
        </div>

        {/* Skills badges */}
        <div className="flex gap-1.5 mb-4">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>

        {/* Footer: salary/date + buttons */}
        <div className="mt-auto pt-3 border-t border-[#f0f5ff]">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1.5">
              <div className="skeleton h-3.5 w-28" />
              <div className="skeleton h-3 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="skeleton h-7 w-14 rounded-lg" />
              <div className="skeleton h-7 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
