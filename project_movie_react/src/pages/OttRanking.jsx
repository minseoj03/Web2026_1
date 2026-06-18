import { useEffect, useState } from 'react'
import MovieDetailModal from '../components/MovieDetailModal'
import { useFilter } from '../contexts/FilterContext'
import { getOttRankingMovies } from '../services/movieApi'

const ottTabs = [
  { id: 'netflix', label: '넷플릭스', icon: 'N', color: 'bg-[#e50914]' },
  { id: 'disney', label: '디즈니+', icon: 'D+', color: 'bg-[#113cff]' },
  { id: 'wavve', label: '웨이브', icon: 'W', color: 'bg-[#1a73e8]' },
  { id: 'tving', label: '티빙', icon: 'T', color: 'bg-[#ff153c]' },
  { id: 'coupang', label: '쿠팡플레이', icon: 'C', color: 'bg-[#00b8e6]' },
  { id: 'watcha', label: '왓챠', icon: 'W', color: 'bg-[#ff0558]' },
  { id: 'all', label: '전체', icon: '', color: '' },
]

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

export default function OttRanking() {
  const { applyFilters, ottOnly } = useFilter()
  const [selectedOtt, setSelectedOtt] = useState('all')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    setLoading(true)
    setError('')

    getOttRankingMovies(selectedOtt)
      .then((data) => {
        if (ignore) return

        const nextMovies = applyFilters(data || [])

        setMovies(
          nextMovies.slice(0, 10).map((movie, index) => ({
            ...movie,
            rank: index + 1,
          }))
        )
      })
      .catch((err) => {
        console.error('[OTT Ranking]', err)
        if (!ignore) {
          setMovies([])
          setError('영화 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [applyFilters, selectedOtt])

  return (
    <div className="px-8 pb-8">
      <h1 className="text-2xl font-extrabold mb-1">OTT별 인기 영화 TOP</h1>
      <p className="text-sm text-gray-500 mb-6">
        한국에서 해당 OTT로 볼 수 있는 영화를 TMDB 최신 인기도 순으로 보여드려요.
      </p>

      <div className="flex gap-2 flex-wrap mb-6">
        {ottTabs.map(ott => (
          <button
            key={ott.id}
            onClick={() => setSelectedOtt(ott.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${
              selectedOtt === ott.id
                ? 'bg-[#7c5cff] text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-[#9b85ff] hover:text-[#7c5cff]'
            }`}
          >
            {ott.icon && (
              <span className={`w-5 h-5 rounded text-[10px] ${ott.color} grid place-items-center text-white font-extrabold`}>
                {ott.icon}
              </span>
            )}
            {ott.label}
          </button>
        ))}
      </div>

      {ottOnly && (
        <p className="text-xs font-semibold text-[#7c5cff] mb-4">
          내 구독 OTT만 추천 필터가 적용 중입니다.
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎬</p>
          <p className="font-semibold">{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎬</p>
          <p className="font-semibold">조건에 맞는 영화를 찾지 못했어요.</p>
          <p className="text-sm mt-1">OTT 탭이나 내 구독 OTT 설정을 확인해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 gap-4">
          {movies.map(movie => (
            <div
              key={`${movie.id}-${movie.rank}`}
              onClick={() => setSelectedMovie(movie)}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-md transition relative"
            >
              <div className={`absolute top-0 left-3.5 w-8 h-9 grid place-items-center text-white font-extrabold text-base rounded-b-lg z-10 ${
                movie.rank === 1 ? 'bg-gradient-to-b from-[#fbbf24] to-[#f59e0b]' :
                  movie.rank === 2 ? 'bg-gradient-to-b from-[#d1d5db] to-[#9ca3af]' :
                    movie.rank === 3 ? 'bg-gradient-to-b from-[#fb923c] to-[#ea580c]' :
                      'bg-[#7c5cff]'
              }`}>
                {movie.rank}
              </div>

              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="aspect-[2/3] rounded-xl object-cover w-full mb-2.5"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[2/3] rounded-xl bg-gradient-to-br from-[#2d1b4e] to-[#4a3268] grid place-items-end text-white font-extrabold text-sm p-3 text-center mb-2.5">
                  {movie.title}
                </div>
              )}

              <p className="text-sm font-bold truncate">{movie.title}</p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                <span className="font-semibold">★ {(movie.vote_average / 2).toFixed(1)}</span>
                <span>·</span>
                <span>{genreMap[movie.genre_ids?.[0]] || '영화'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}
