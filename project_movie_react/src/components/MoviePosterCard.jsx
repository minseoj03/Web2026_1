export default function MoviePosterCard({ movie, type = 'watched', onClick, onRecommend, onMenu }) {
  const { title, genre, rating, date, addedDate, review, gradient, posterPath } = movie

  return (
    <div
      onClick={() => onClick?.(movie)}
      className="shrink-0 w-[calc((100%-64px)/5)] min-w-[clamp(100px,10vw,130px)] max-lg:w-[calc((100%-32px)/3)] max-md:w-[calc((100%-16px)/2.5)] max-md:min-w-[clamp(90px,9vw,110px)] group cursor-pointer hover:-translate-y-1 transition"
    >
      <div className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${gradient || 'from-gray-400 to-gray-600'} grid place-items-center text-white font-extrabold text-sm p-3 text-center shadow-sm mb-2 relative overflow-hidden`}>
        {posterPath ? (
          <img
            src={posterPath}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          title.length > 8 ? `${title.slice(0, 8)}...` : title
        )}

        <button
          onClick={(event) => { event.stopPropagation(); onRecommend?.(movie) }}
          className="absolute top-2 left-2 w-8 h-8 bg-[#7c5cff]/95 rounded-full grid place-items-center text-white text-[11px] font-extrabold opacity-0 group-hover:opacity-100 transition hover:scale-110 shadow-md"
          title="친구에게 영화 추천"
        >
          👤→
        </button>

        <button
          onClick={(event) => { event.stopPropagation(); onMenu?.(movie) }}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full grid place-items-center text-white text-xs opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
          title="영화 메뉴"
        >
          ⋯
        </button>

        {type === 'watched' && review && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/85 text-white p-2.5 text-[11px] leading-relaxed opacity-0 group-hover:opacity-100 transition rounded-b-xl">
            "{review}"
          </div>
        )}
      </div>

      <p className="text-sm font-bold truncate">{title}</p>
      {type === 'watched' && rating && <p className="text-[11px] text-[#7c5cff] font-semibold">⭐ {rating}</p>}
      <p className="text-[10px] text-gray-400">{type === 'watched' ? `${date || ''} 시청` : `${addedDate || ''} 찜`}</p>
      {genre && <p className="text-[10px] text-gray-400">{genre}</p>}
    </div>
  )
}

export function MoviePosterCardSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="shrink-0 w-[calc((100%-64px)/5)] min-w-[clamp(100px,10vw,130px)] max-lg:w-[calc((100%-32px)/3)] max-md:w-[calc((100%-16px)/2.5)] max-md:min-w-[clamp(90px,9vw,110px)] animate-pulse">
          <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </>
  )
}
