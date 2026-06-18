export function SkeletonBox({ className = '' }) {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
  )
}

export function MovieDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Poster skeleton */}
      <div className="w-full h-[240px] bg-gray-200 rounded-t-2xl" />

      <div className="p-7">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-4" />

        {/* Meta */}
        <div className="flex gap-3 mb-4">
          <div className="h-4 bg-gray-200 rounded-full w-16" />
          <div className="h-4 bg-gray-200 rounded-full w-12" />
          <div className="h-4 bg-gray-200 rounded-full w-10" />
          <div className="h-4 bg-gray-200 rounded-full w-14" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Cast */}
        <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
        <div className="flex gap-3 mb-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded w-10" />
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-5">
          <div className="h-6 bg-gray-200 rounded-full w-14" />
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-12" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-lg w-36" />
          <div className="h-10 bg-gray-200 rounded-lg w-20" />
        </div>
      </div>
    </div>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="shrink-0 w-[150px] animate-pulse">
      <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  )
}

// HeroSection 로딩 스켈레톤
export function HeroSkeleton() {
  return (
    <section className="bg-white rounded-2xl p-7 max-md:p-5 shadow-sm overflow-hidden animate-pulse">
      <div className="mb-5">
        <div className="h-3 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-7 bg-gray-200 rounded w-64 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-80" />
      </div>
      <div className="grid grid-cols-[clamp(210px,22vw,300px)_minmax(0,1fr)] max-lg:grid-cols-[220px_minmax(0,1fr)] max-md:grid-cols-1 gap-[clamp(1rem,2vw,1.75rem)]">
        {/* Poster */}
        <div className="aspect-[3/4] bg-gray-200 rounded-xl max-md:max-w-[260px]" />
        {/* Info */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="h-7 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-24" />
            <div className="h-6 bg-gray-200 rounded-full w-12" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 mt-2" />
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
          <div className="flex gap-2 mt-auto">
            <div className="h-10 bg-gray-200 rounded-lg w-40" />
            <div className="h-10 bg-gray-200 rounded-lg w-24" />
          </div>
        </div>
      </div>
    </section>
  )
}

// Home 사이드바 위젯 스켈레톤
export function HomeSidebarSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3.5">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-10" />
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-12 mb-1.5" />
              <div className="h-2.5 bg-gray-200 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 영화 검색 결과 행 스켈레톤
export function MovieSearchRowSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl animate-pulse">
          <div className="w-12 h-[66px] rounded-lg bg-gray-200 shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-1.5" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
        </div>
      ))}
    </>
  )
}
