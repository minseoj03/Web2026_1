import { useRef, useState } from 'react'
import MoviePosterCard, { MoviePosterCardSkeleton } from '../MoviePosterCard'
import EmptyState from '../EmptyState'

export default function MovieScrollSection({
  title,
  count,
  movies,
  loading,
  error,
  type = 'watched',
  sortType,
  onSortChange,
  onAddClick,
  onMovieClick,
  onRecommend,
  onEdit,
  onDelete,
  onRetry,
}) {
  const scrollRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuMovie, setMenuMovie] = useState(null)

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' })
  }

  const filteredMovies = searchQuery
    ? movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies

  return (
    <div>
      <div className="flex items-center gap-3 max-md:gap-2 mb-4 flex-wrap">
        <h3 className="text-base max-md:text-sm font-extrabold">
          {title} <span className="text-[#7c5cff]">{count}편</span>
        </h3>

        <div className="flex items-center gap-2 max-md:gap-1.5 ml-auto flex-wrap max-md:w-full max-md:mt-2">
          {onSortChange && (
            <select
              value={sortType}
              onChange={event => onSortChange(event.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:border-[#7c5cff] cursor-pointer"
            >
              <option value="recent">최신순</option>
              <option value="name">가나다순</option>
            </select>
          )}

          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder={type === 'watched' ? '내가 본 영화 검색' : '찜한 영화 검색'}
              className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none w-[160px] max-md:w-[120px] focus:border-[#7c5cff] focus:w-[200px] max-md:focus:w-[150px] transition-all"
            />
          </div>

          <button
            onClick={onAddClick}
            disabled={loading}
            className="px-3.5 py-1.5 bg-[#7c5cff] text-white rounded-lg text-xs font-bold hover:bg-[#5d3ee8] transition disabled:opacity-50 shrink-0"
          >
            + 영화 추가
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-semibold flex items-center justify-between">
          <span>데이터를 불러오지 못했어요.</span>
          <button onClick={onRetry} className="text-xs px-2.5 py-1 bg-red-100 rounded-lg hover:bg-red-200 transition">다시 시도</button>
        </div>
      )}

      {!error && (
        <div className="relative">
          {!loading && filteredMovies.length > 0 && (
            <button onClick={() => scroll(-1)} className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition">
              ‹
            </button>
          )}

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {loading ? (
              <MoviePosterCardSkeleton count={5} />
            ) : filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <div
                  key={`${type}-${movie.localId || movie.id}`}
                  className="relative shrink-0 w-[clamp(110px,10vw,140px)] max-md:w-[105px] min-w-0"
                >
                  <MoviePosterCard
                    movie={movie}
                    type={type}
                    onClick={onMovieClick}
                    onRecommend={onRecommend}
                    onMenu={() => setMenuMovie(menuMovie?.id === movie.id ? null : movie)}
                  />

                  {menuMovie?.id === movie.id && (
                    <div className="absolute top-10 right-2 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-20 min-w-[100px] animate-[fadeIn_0.15s_ease]">
                      {type === 'watched' && (
                        <button
                          onClick={() => { onEdit?.(movie); setMenuMovie(null) }}
                          className="block w-full text-left px-3 py-2 text-xs font-semibold rounded-md hover:bg-[#f3f0ff] hover:text-[#7c5cff] transition"
                        >
                          편집
                        </button>
                      )}
                      <button
                        onClick={() => { onDelete?.(movie); setMenuMovie(null) }}
                        className="block w-full text-left px-3 py-2 text-xs font-semibold rounded-md text-red-500 hover:bg-red-50 transition"
                      >
                        {type === 'watched' ? '삭제' : '찜 해제'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                icon={searchQuery ? '🔍' : type === 'watched' ? '🎬' : '💜'}
                title={searchQuery ? '검색 결과가 없어요.' : type === 'watched' ? '아직 본 영화가 없어요.' : '찜한 영화를 추가해보세요.'}
                description={searchQuery ? '다른 키워드로 검색해보세요.' : type === 'watched' ? '영화를 추가하고 별점과 감상평을 남겨보세요.' : '마음에 드는 영화를 찜해두면 나중에 쉽게 찾을 수 있어요.'}
                action={!searchQuery ? { label: '+ 영화 추가', onClick: onAddClick } : undefined}
              />
            )}
          </div>

          {!loading && filteredMovies.length > 0 && (
            <button onClick={() => scroll(1)} className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition">
              ›
            </button>
          )}
        </div>
      )}
    </div>
  )
}
