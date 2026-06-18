import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useFilter } from '../../contexts/FilterContext'
import MovieCard, { MovieCardSkeleton } from '../MovieCard'
import EmptyState from '../EmptyState'
import { getEmotionMovies, getMovieProviders } from '../../services/movieApi'

const GENRE_MAP = {
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

const emotionTags = [
  { id: 'bored', icon: '😮‍💨', label: '무료할 때' },
  { id: 'sleepless', icon: '🌙', label: '잠이 안 올 때' },
  { id: 'alone-drink', icon: '🍷', label: '혼술할 때' },
  { id: 'bed', icon: '🛏️', label: '침대에 누워서' },
  { id: 'commute', icon: '🚇', label: '이동 중일 때' },
  { id: 'rainy', icon: '☔', label: '비 오는 날' },
  { id: 'winter', icon: '❄️', label: '겨울 감성' },
  { id: 'dawn', icon: '🌆', label: '새벽 감성' },
  { id: 'weekend', icon: '🍿', label: '주말 아침' },
]

function scoreEmotionMovie(movie, ott, userOtt) {
  const popularityScore = Math.min(movie.popularity || 0, 300) * 0.4
  const voteAverageScore = (movie.vote_average || 0) * 8
  const voteCountWeight = Math.min(Math.log10((movie.vote_count || 0) + 1) * 6, 25)
  const ottMatchBonus = ott.some(provider => userOtt.includes(provider)) ? 25 : 0
  const releaseYear = Number(movie.release_date?.slice(0, 4))
  const currentYear = new Date().getFullYear()
  const recentBonus = releaseYear >= currentYear - 1 ? 15 : releaseYear >= currentYear - 3 ? 8 : 0

  const rawScore =
    popularityScore +
    voteAverageScore +
    voteCountWeight +
    ottMatchBonus +
    recentBonus

  return Math.min(100, Math.round((rawScore / 265) * 100))
}

export default function EmotionSection({ onMovieClick }) {
  const { user } = useAuth()
  const [selectedEmotion, setSelectedEmotion] = useState('bored')
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const { ottOnly, filterByOtt } = useFilter()
  const tagScrollRef = useRef(null)
  const movieScrollRef = useRef(null)
  const userOtt = user?.ott || ['netflix', 'wavve', 'disney']

  useEffect(() => {
    let ignore = false
    setLoading(true)

    getEmotionMovies(selectedEmotion)
      .then(async (results) => {
        const scoredMovies = await Promise.all(
          (results || []).map(async (movie) => {
            const ott = await getMovieProviders(movie.id).catch(() => [])
            const aiScore = scoreEmotionMovie(movie, ott, userOtt)

            return {
              ...movie,
              id: movie.id,
              title: movie.title,
              genre: GENRE_MAP[movie.genre_ids?.[0]] || '영화',
              rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : '',
              posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              gradient: 'from-[#2d1b4e] to-[#4a3268]',
              ott,
              aiScore,
            }
          })
        )

        scoredMovies.sort((a, b) => b.aiScore - a.aiScore)
        if (!ignore) setMovies(scoredMovies)
      })
      .catch((error) => {
        console.error('[Emotion movies]', error)
        if (!ignore) setMovies([])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [selectedEmotion, userOtt.join('|')])

  const filteredMovies = filterByOtt(movies)
  const scrollTags = (left) => tagScrollRef.current?.scrollBy({ left, behavior: 'smooth' })
  const scrollMovies = (left) => movieScrollRef.current?.scrollBy({ left, behavior: 'smooth' })

  return (
    <section className="bg-gradient-to-br from-[#faf8ff] to-white rounded-2xl p-6 max-md:p-5 shadow-sm mt-6 overflow-hidden min-w-0">
      <h2 className="text-base font-extrabold mb-1">기분별 영화 큐레이션</h2>
      <p className="text-xs text-gray-500 mb-4">
        인기, 평점, 평가 수, 구독 OTT, 최신성을 함께 계산해 지금 기분에 맞는 영화를 추천해요.
      </p>

      <div className="relative mb-5 min-w-0">
        <button
          type="button"
          onClick={() => scrollTags(-220)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
          aria-label="감정 태그 왼쪽으로 이동"
        >
          ‹
        </button>
        <div
          ref={tagScrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 px-8 scroll-smooth max-w-full"
        >
          {emotionTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedEmotion(tag.id)}
              className={`flex items-center gap-1.5 px-[clamp(0.75rem,1.2vw,0.875rem)] py-[clamp(0.5rem,0.8vw,0.625rem)] rounded-full text-[clamp(12px,0.9vw,14px)] font-semibold transition shrink-0 whitespace-nowrap ${
                selectedEmotion === tag.id
                  ? 'bg-[#7c5cff] text-white shadow-lg shadow-[#7c5cff]/30'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-[#f3f0ff] hover:border-[#9b85ff] hover:text-[#7c5cff]'
              }`}
            >
              <span>{tag.icon}</span>
              {tag.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollTags(220)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
          aria-label="감정 태그 오른쪽으로 이동"
        >
          ›
        </button>
      </div>

      <div className="relative min-w-0">
        {!loading && filteredMovies.length > 0 && (
          <button
            onClick={() => scrollMovies(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
            aria-label="영화 목록 왼쪽으로 이동"
          >
            ‹
          </button>
        )}
        <div ref={movieScrollRef} className="flex gap-[clamp(0.75rem,1.2vw,0.875rem)] overflow-x-auto pb-2 scrollbar-hide scroll-smooth max-w-full">
          {loading ? (
            <MovieCardSkeleton count={5} />
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map(movie => (
              <div key={movie.id} className="relative shrink-0">
                <MovieCard movie={movie} onClick={onMovieClick} />
                <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  AI {movie.aiScore}%
                </span>
              </div>
            ))
          ) : (
            <div className="flex-1 min-w-full">
              <EmptyState
                icon="🎬"
                title="추천 가능한 영화가 없어요."
                description={ottOnly ? '현재 구독 OTT에서 이 감정에 맞는 영화를 찾지 못했어요. OTT 필터를 끄면 더 많은 영화를 볼 수 있어요.' : '이 감정에 맞는 영화를 준비 중이에요.'}
              />
            </div>
          )}
        </div>
        {!loading && filteredMovies.length > 0 && (
          <button
            onClick={() => scrollMovies(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
            aria-label="영화 목록 오른쪽으로 이동"
          >
            ›
          </button>
        )}
      </div>
    </section>
  )
}
