/**
 * HomeSkeleton - 홈 화면 데이터 로딩 중 스켈레톤 UI
 * shimmer 애니메이션 적용
 */
export default function HomeSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_clamp(260px,22vw,320px)] max-xl:grid-cols-1 gap-6 fluid-px pb-8">
      {/* Center */}
      <div>
        {/* Hero Skeleton */}
        <div className="bg-white rounded-2xl p-7 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-7 bg-gray-200 rounded w-64 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-80 mb-6" />
          <div className="grid grid-cols-[280px_1fr] max-md:grid-cols-1 gap-7">
            <div className="aspect-[3/4] bg-gray-200 rounded-xl" />
            <div className="flex flex-col gap-3">
              <div className="h-6 bg-gray-200 rounded w-40" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-24" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-48 mt-2" />
              <div className="space-y-2 mt-3">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="flex gap-2 mt-auto">
                <div className="h-10 bg-gray-200 rounded-lg w-36" />
                <div className="h-10 bg-gray-200 rounded-lg w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Emotion Section Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-44 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-56 mb-5" />
          <div className="flex gap-2 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-200 rounded-full w-24 shrink-0" />
            ))}
          </div>
          <div className="flex gap-3.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[150px]">
                <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <aside className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1.5" />
                    <div className="h-2.5 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </div>
  )
}
