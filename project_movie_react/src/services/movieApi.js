const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN
const TMDB_BASE = 'https://api.themoviedb.org/3'

const providerMap = {
  8: 'netflix',
  337: 'disney',
  356: 'wavve',
  97: 'watcha',
  119: 'coupang',
  21: 'tving',
}

const OTT_PROVIDER_IDS = {
  netflix: 8,
  disney: 337,
  wavve: 356,
  watcha: 97,
  coupang: 119,
  tving: 21,
  apple: 2,
}

const EMOTION_TO_GENRE = {
  bored: '28,12',
  sleepless: '27,53',
  'alone-drink': '10749,18',
  bed: '16,35',
  commute: '28,35',
  rainy: '35,10751',
  winter: '10749,18',
  dawn: '18,10402',
  weekend: '35,10751',
}

const genreNameToIds = {
  SF: [878],
  액션: [28],
  모험: [12],
  애니메이션: [16],
  코미디: [35],
  범죄: [80],
  드라마: [18],
  판타지: [14],
  공포: [27],
  음악: [10402],
  로맨스: [10749],
  스릴러: [53],
  가족: [10751],
  전쟁: [10752],
  서부: [37],
}

const watchedHistoryMock = [
  { title: '인터스텔라', genreIds: [878, 12], rating: 5.0, watchedAt: '2026-05-18', ott: ['netflix'] },
  { title: '라라랜드', genreIds: [10749, 18, 10402], rating: 4.5, watchedAt: '2026-05-02', ott: ['netflix'] },
  { title: '어바웃 타임', genreIds: [10749, 18], rating: 4.5, watchedAt: '2026-04-15', ott: ['netflix'] },
  { title: '기생충', genreIds: [18, 53], rating: 5.0, watchedAt: '2026-03-20', ott: ['netflix', 'wavve'] },
  { title: '비긴 어게인', genreIds: [10402, 18], rating: 4.0, watchedAt: '2026-02-22', ott: ['netflix'] },
]

const friendReactionMock = [
  { movieTitle: '인터스텔라', genreIds: [878, 12], rating: 4.8, reaction: 'liked' },
  { movieTitle: '라라랜드', genreIds: [10749, 18, 10402], rating: 4.6, reaction: 'recommended' },
  { movieTitle: '기생충', genreIds: [18, 53], rating: 5.0, reaction: 'liked' },
  { movieTitle: '서울의 봄', genreIds: [18], rating: 4.7, reaction: 'recommended' },
]

async function fetchTmdb(endpoint) {
  const response = await fetch(`${TMDB_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) throw new Error(`TMDB Error: ${response.status}`)
  return response.json()
}

export async function getMovieProviders(movieId) {
  const data = await fetchTmdb(`/movie/${movieId}/watch/providers`)
  const krProviders = data.results?.KR?.flatrate || []

  return krProviders
    .map(provider => providerMap[provider.provider_id])
    .filter(Boolean)
}

export async function getPopularMovies() {
  return fetchTmdb('/movie/popular?language=ko-KR&page=1')
}

export async function getPopularMoviesWithOtt() {
  const cacheKey = 'moviesWithOtt:v2'
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) return JSON.parse(cached)

  const data = await getPopularMovies()
  const moviesWithOtt = await Promise.all(
    data.results.map(async (movie) => {
      const ott = await getMovieProviders(movie.id).catch(() => [])
      return { ...movie, ott }
    })
  )

  const result = { ...data, results: moviesWithOtt }
  sessionStorage.setItem(cacheKey, JSON.stringify(result))
  return result
}

function getPreferredGenreIds(watchedMovies) {
  const scoreByGenre = new Map()

  watchedMovies.forEach((movie, index) => {
    const recencyWeight = Math.max(1, watchedMovies.length - index)
    const ratingWeight = movie.rating || 3

    movie.genreIds.forEach((genreId) => {
      scoreByGenre.set(
        genreId,
        (scoreByGenre.get(genreId) || 0) + ratingWeight * recencyWeight
      )
    })
  })

  return [...scoreByGenre.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([genreId]) => genreId)
}

function getFriendGenreIds(friendReactions) {
  return [...new Set(
    friendReactions
      .filter(reaction => reaction.rating >= 4.5 || reaction.reaction === 'recommended')
      .flatMap(reaction => reaction.genreIds)
  )]
}

function scoreRecommendedMovie(movie, context) {
  let score = 0
  const reasons = []

  const genreMatches = movie.genre_ids?.filter(id => context.preferredGenreIds.includes(id)) || []
  if (genreMatches.length > 0) {
    score += genreMatches.length * 28
    reasons.push('최근 시청 기록과 선호 장르가 비슷해요')
  }

  const friendMatches = movie.genre_ids?.filter(id => context.friendGenreIds.includes(id)) || []
  if (friendMatches.length > 0) {
    score += friendMatches.length * 14
    reasons.push('친구들이 좋게 반응한 장르와 맞아요')
  }

  if (movie.vote_average >= 7.5) {
    score += 22
    reasons.push('평점이 높은 영화예요')
  } else if (movie.vote_average >= 6.8) {
    score += 12
    reasons.push('평점이 안정적인 영화예요')
  }

  if (movie.popularity >= 100) {
    score += 12
    reasons.push('최근 인기도가 높아요')
  }

  if (Array.isArray(movie.ott) && movie.ott.some(ott => context.userOtt.includes(ott))) {
    score += 18
    reasons.push('구독 중인 OTT에서 볼 수 있어요')
  }

  if (context.watchedTitles.has(movie.title)) {
    score -= 100
  }

  return {
    ...movie,
    recommendScore: Math.max(0, Math.min(99, score)),
    recommendReasons: [...new Set(reasons)].slice(0, 4),
  }
}

export async function getPersonalizedMovies(user = null, limit = 3) {
  const data = await getPopularMoviesWithOtt()
  const watchedMovies = watchedHistoryMock
  const preferredGenreIds = getPreferredGenreIds(watchedMovies)
  const friendGenreIds = getFriendGenreIds(friendReactionMock)
  const userOtt = user?.ott || ['netflix', 'wavve', 'disney']

  const context = {
    preferredGenreIds,
    friendGenreIds,
    userOtt,
    watchedTitles: new Set(watchedMovies.map(movie => movie.title)),
  }

  const scoredMovies = data.results.map(movie => scoreRecommendedMovie(movie, context))

  scoredMovies.sort((a, b) => b.recommendScore - a.recommendScore)
  return scoredMovies.slice(0, limit)
}

export async function getPersonalizedMovie(user = null) {
  const movies = await getPersonalizedMovies(user, 1)
  return movies[0]
}

export async function getEmotionMovies(emotionId) {
  const genreIds = EMOTION_TO_GENRE[emotionId] || '18'
  const data = await fetchTmdb(
    `/discover/movie?language=ko-KR&sort_by=popularity.desc&with_genres=${genreIds}&page=1`
  )

  return data.results || []
}

export async function getMovieDetail(movieId) {
  return fetchTmdb(`/movie/${movieId}?language=ko-KR`)
}

export async function getOttRankingMovies(ottId) {
  const providerId = OTT_PROVIDER_IDS[ottId]

  if (!providerId) {
    const data = await getPopularMoviesWithOtt()
    return data.results
  }

  const data = await fetchTmdb(
    `/discover/movie?language=ko-KR&sort_by=popularity.desc&watch_region=KR&with_watch_providers=${providerId}&page=1`
  )

  return (data.results || []).map(movie => ({
    ...movie,
    ott: [ottId],
  }))
}

export async function getFriendActivity() {
  await new Promise(resolve => setTimeout(resolve, 200))
  return null
}

export async function getPersonalRecommendation() {
  await new Promise(resolve => setTimeout(resolve, 400))
  return null
}

export async function searchMovies(query) {
  const data = await fetchTmdb(
    `/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=1`
  )

  return data.results || []
}
