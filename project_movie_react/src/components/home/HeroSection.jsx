import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { getPersonalizedMovies } from '../../services/movieApi'

const loadingMovie = {
  id: 'hero-loading',
  title: '추천 영화를 불러오는 중...',
  originalTitle: '',
  rating: 0,
  releaseYear: '',
  overview: '',
  posterPath: null,
  recommendScore: 0,
  recommendReasons: ['시청 기록과 취향을 분석하고 있어요.'],
  gradient: 'from-[#2d1b4e] to-[#4a3268]',
}

function toHeroMovie(movie, index) {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : '0.0',
    releaseYear: movie.release_date?.slice(0, 4) || '',
    recommendScore: movie.recommendScore || 0,
    recommendReasons: movie.recommendReasons?.length
      ? movie.recommendReasons
      : ['취향 분석 기반 맞춤 추천 영화예요.'],
    gradient: [
      'from-[#2d1b4e] to-[#4a3268]',
      'from-[#0f766e] to-[#2563eb]',
      'from-[#831843] to-[#f97316]',
    ][index % 3],
  }
}

export default function HeroSection() {
  const { user } = useAuth()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [heroMovies, setHeroMovies] = useState([loadingMovie])
  const [activeIndex, setActiveIndex] = useState(0)

  const heroMovie = heroMovies[activeIndex] || loadingMovie
  const wishlisted = isWishlisted(heroMovie.id)
  const hasMultipleMovies = heroMovies.length > 1

  useEffect(() => {
    let cancelled = false

    setHeroMovies([loadingMovie])
    setActiveIndex(0)

    getPersonalizedMovies(user, 3).then((movies) => {
      if (cancelled || !movies?.length) return
      setHeroMovies(movies.map(toHeroMovie))
      setActiveIndex(0)
    })

    return () => {
      cancelled = true
    }
  }, [user])

  const goPrev = () => {
    setActiveIndex(index => (index - 1 + heroMovies.length) % heroMovies.length)
  }

  const goNext = () => {
    setActiveIndex(index => (index + 1) % heroMovies.length)
  }

  return (
    <section className="bg-white rounded-2xl p-7 max-md:p-5 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-5 max-md:flex-col">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 mb-1.5">안녕하세요, {user?.nickname || '회원'}님! 👋</p>
          <h1 className="text-2xl font-extrabold mb-2">
            회원님을 위한 맞춤 추천 <span className="text-[#7c5cff]">💜</span>
          </h1>
          <p className="text-sm text-gray-500">
            시청 기록, 평점, 취향, 구독 OTT, 친구 반응을 종합 분석했어요.
          </p>
        </div>

        {hasMultipleMovies && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={goPrev}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
              aria-label="이전 추천 영화"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
              aria-label="다음 추천 영화"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[clamp(210px,22vw,300px)_minmax(0,1fr)] max-lg:grid-cols-[220px_minmax(0,1fr)] max-md:grid-cols-1 gap-[clamp(1rem,2vw,1.75rem)] min-w-0">
        <div className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-gradient-to-br ${heroMovie.gradient} cursor-pointer hover:-translate-y-0.5 transition max-md:max-w-[260px]`}>
          <span className="absolute top-3 left-3 z-10 bg-[#7c5cff] text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
            오늘의 추천 {hasMultipleMovies ? `${activeIndex + 1}/${heroMovies.length}` : ''}
          </span>

          {heroMovie.posterPath ? (
            <img
              src={heroMovie.posterPath}
              alt={heroMovie.title}
              className="w-full h-full object-cover"
              onError={(event) => { event.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-white">
              <div className="w-14 h-14 bg-white/95 rounded-full grid place-items-center text-[#7c5cff] text-lg mb-16">M</div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-xl font-extrabold text-white mb-1">{heroMovie.title}</h3>
            <p className="text-[11px] text-white opacity-80">{heroMovie.originalTitle}</p>
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-2xl max-md:text-xl font-extrabold break-words min-w-0">{heroMovie.title}</h2>
            {hasMultipleMovies && (
              <div className="flex gap-1.5 pt-1 shrink-0" aria-label="추천 영화 순서">
                {heroMovies.map((movie, index) => (
                  <button
                    key={movie.id}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition ${activeIndex === index ? 'bg-[#7c5cff]' : 'bg-gray-200 hover:bg-gray-300'}`}
                    aria-label={`${index + 1}번째 추천 영화 보기`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-[#f3f0ff] text-[#7c5cff] px-3 py-1.5 rounded-full text-xs font-bold">
              취향 일치 {Math.min(Math.round(heroMovie.recommendScore), 99)}%
            </span>
            <span className="text-sm font-semibold">⭐ {heroMovie.rating}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3.5">{heroMovie.releaseYear}</p>
          <p className="text-xs text-gray-500 mb-3.5 line-clamp-3 break-words">{heroMovie.overview}</p>
          <p className="text-sm text-[#7c5cff] font-bold mb-2.5">추천 이유</p>
          <ul className="flex flex-col gap-2 mb-5 text-sm">
            {heroMovie.recommendReasons.map(reason => (
              <li key={reason} className="flex items-center gap-2">
                <span className="text-[#7c5cff] font-bold">✓</span>
                {reason}
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-auto flex-wrap">
            <a
              href={`https://www.netflix.com/search?q=${encodeURIComponent(heroMovie.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold flex items-center gap-1.5"
            >
              <span className="w-[18px] h-[18px] bg-[#e50914] rounded text-[9px] grid place-items-center font-extrabold">
                N
              </span>
              넷플릭스에서 보기 ↗
            </a>

            <button
              onClick={() => toggleWishlist(heroMovie)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                wishlisted
                  ? 'bg-[#7c5cff] text-white'
                  : 'bg-white border border-gray-200 hover:border-[#7c5cff] hover:text-[#7c5cff]'
              }`}
            >
              {wishlisted ? '💜 찜 완료' : '💗 찜하기'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
