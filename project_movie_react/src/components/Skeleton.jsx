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
