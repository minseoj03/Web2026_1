import { useEffect, useRef, useState } from 'react'
import EmptyState from '../EmptyState'
import { useToast } from '../Toast'
import { MovieSearchRowSkeleton } from '../Skeleton'
import {
  filterKoreanTitledMovies,
  getMovieProviders,
  getPopularMoviesWithOtt,
  searchMovies,
} from '../../services/movieApi'

const genreMap = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  18: '드라마',
  14: '판타지',
  27: '공포',
  10402: '음악',
  10749: '로맨스',
  878: 'SF',
  53: '스릴러',
  10751: '가족',
  10752: '전쟁',
  37: '서부',
}

const ottLabels = {
  netflix: '넷플릭스',
  disney: '디즈니+',
  wavve: '웨이브',
  tving: '티빙',
  coupang: '쿠팡플레이',
  watcha: '왓챠',
}

function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    genre: genreMap[movie.genre_ids?.[0]] || '영화',
    rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 0,
    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    gradient: 'from-[#2d1b4e] to-[#4a3268]',
    ott: movie.ott || [],
    overview: movie.overview,
    releaseYear: movie.release_date?.slice(0, 4) || '',
  }
}

export default function AddMovieModal({ isOpen, onClose, onAdd, type = 'watched' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const { addToast } = useToast()
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setSearching(true)

      try {
        const sourceMovies = query.trim()
          ? await searchMovies(query.trim())
          : filterKoreanTitledMovies((await getPopularMoviesWithOtt()).results)

        const withOtt = await Promise.all(
          (sourceMovies || []).slice(0, 12).map(async (movie) => ({
            ...movie,
            ott: movie.ott || await getMovieProviders(movie.id).catch(() => []),
          }))
        )

        setResults(withOtt.map(normalizeMovie))
      } catch (error) {
        console.error('[MyPage movie search]', error)
        setResults([])
      } finally {
        setSearching(false)
      }
    }, query.trim() ? 300 : 0)

    return () => clearTimeout(debounceRef.current)
  }, [isOpen, query])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setSearching(false)
      setSelected(null)
      setRating(0)
      setReview('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleAdd = async () => {
    if (!selected) return

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    const movie = {
      ...selected,
      rating: type === 'watched' ? rating || selected.rating || 4.0 : selected.rating,
      review: type === 'watched' ? review : '',
      date: today,
      addedDate: today,
    }

    await onAdd?.(movie)
    addToast(type === 'watched' ? `"${selected.title}" 추가 완료! 🎬` : `"${selected.title}" 찜 완료! 💗`, { type: 'success' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose} role="dialog">
      <div className="bg-white rounded-2xl p-7 w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold">영화 추가</h2>
            <p className="text-xs text-gray-500 mt-1">모든 OTT의 영화를 검색하고 추가할 수 있어요.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]" aria-label="닫기">×</button>
        </div>

        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔎</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
            placeholder="영화 제목을 검색하세요"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition"
          />
        </div>

        <p className="text-xs font-bold text-gray-500 mb-2.5">
          {query ? `"${query}" 검색 결과 ${results.length}` : `인기 영화 ${results.length}`}
        </p>

        <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto mb-4">
          {searching ? (
            <MovieSearchRowSkeleton count={4} />
          ) : results.length > 0 ? (
            results.map(movie => (
              <div key={movie.id}>
                <div
                  onClick={() => setSelected(selected?.id === movie.id ? null : movie)}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${selected?.id === movie.id ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`}
                >
                  {movie.posterPath ? (
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="w-12 h-[66px] rounded-lg object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-12 h-[66px] rounded-lg bg-gradient-to-br ${movie.gradient} grid place-items-center text-white text-[10px] font-bold shrink-0`}>
                      {movie.title.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{movie.title}</p>
                    <p className="text-[11px] text-gray-500">{movie.genre} · ★ {movie.rating || '-'}</p>
                    <p className="text-[10px] text-[#7c5cff] font-semibold mt-0.5 truncate">
                      {movie.ott?.map(ott => ottLabels[ott] || ott).join(', ') || 'OTT 정보 없음'}
                    </p>
                  </div>
                  <span className={`w-8 h-8 rounded-full border grid place-items-center text-base shrink-0 transition ${selected?.id === movie.id ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400 hover:bg-[#7c5cff] hover:text-white hover:border-[#7c5cff]'}`}>
                    {selected?.id === movie.id ? '✓' : '+'}
                  </span>
                </div>

                {selected?.id === movie.id && type === 'watched' && (
                  <div className="ml-4 mt-2 mb-2 p-3 bg-gray-50 rounded-xl border border-[#9b85ff]/30 animate-[fadeIn_0.2s_ease]">
                    <p className="text-[11px] font-bold text-gray-500 mb-2">별점</p>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setRating(star)} className={`text-xl transition ${star <= rating ? 'text-[#fbbf24]' : 'text-gray-300 hover:text-[#fbbf24]'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 mb-1.5">한줄평 (선택)</p>
                    <input
                      value={review}
                      onChange={e => setReview(e.target.value)}
                      placeholder="이 영화에 대한 한줄평"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#7c5cff]"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <EmptyState
              icon="🔎"
              title="검색 결과가 없어요"
              description="다른 영화 제목으로 검색해보세요."
            />
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!selected}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${selected ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {selected ? '추가 완료' : '영화를 선택하세요'}
        </button>
      </div>
    </div>
  )
}
