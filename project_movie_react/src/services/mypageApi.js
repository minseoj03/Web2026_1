import { searchMovies } from './movieApi'

const watchedMock = [
  { id: 'w1', title: '인터스텔라', genre: 'SF', rating: 5.0, date: '2024.05.18', review: '인생 영화. 매번 볼 때마다 새로운 감동.', gradient: 'from-[#1e3a8a] to-[#3b82f6]', ott: ['netflix'] },
  { id: 'w2', title: '라라랜드', genre: '로맨스', rating: 4.5, date: '2024.05.02', review: 'OST가 너무 좋고 영상미가 아름다워요.', gradient: 'from-[#fef3c7] to-[#fbbf24]', ott: ['netflix'] },
  { id: 'w3', title: '어바웃 타임', genre: '로맨스', rating: 4.5, date: '2024.04.15', review: '따뜻하고 잔잔한 영화.', gradient: 'from-[#2d1b4e] to-[#4a3268]', ott: ['netflix'] },
  { id: 'w4', title: '기생충', genre: '드라마', rating: 5.0, date: '2024.03.20', review: '봉준호 감독 천재... 반전에 반전.', gradient: 'from-[#831843] to-[#be185d]', ott: ['netflix', 'wavve'] },
  { id: 'w5', title: '비긴 어게인', genre: '음악', rating: 4.0, date: '2024.02.22', review: '음악도 좋고 뉴욕 분위기 최고.', gradient: 'from-[#064e3b] to-[#059669]', ott: ['netflix'] },
]

const wishlistMock = [
  { id: 'wl1', title: '듄: 파트 2', genre: 'SF', gradient: 'from-[#78350f] to-[#b45309]', addedDate: '2024.05.15' },
  { id: 'wl2', title: '오펜하이머', genre: '드라마', gradient: 'from-[#18181b] to-[#3f3f46]', addedDate: '2024.05.10' },
  { id: 'wl3', title: '웡카', genre: '판타지', gradient: 'from-[#312e81] to-[#6366f1]', addedDate: '2024.04.28' },
  { id: 'wl4', title: '플라워 킬링 문', genre: '드라마', gradient: 'from-[#7c2d12] to-[#ea580c]', addedDate: '2024.04.20' },
  { id: 'wl5', title: '엘리멘탈', genre: '애니메이션', gradient: 'from-[#0c4a6e] to-[#0ea5e9]', addedDate: '2024.03.30' },
]

const WATCHED_STORAGE_PREFIX = 'moviemate_watched_movies_'

function getWatchedStorageKey(userId) {
  return `${WATCHED_STORAGE_PREFIX}${userId || 'guest'}`
}

function readWatchedMovies(userId) {
  try {
    const saved = localStorage.getItem(getWatchedStorageKey(userId))
    return saved ? JSON.parse(saved) : watchedMock
  } catch {
    return watchedMock
  }
}

function writeWatchedMovies(userId, movies) {
  localStorage.setItem(getWatchedStorageKey(userId), JSON.stringify(movies))
  window.dispatchEvent(new CustomEvent('moviemate:watched-updated', {
    detail: { userId },
  }))
}

async function attachTmdbMovie(movie) {
  try {
    const results = await searchMovies(movie.title)
    const tmdbMovie = results?.[0]

    if (!tmdbMovie) return movie

    return {
      ...movie,
      ...tmdbMovie,
      id: tmdbMovie.id,
      localId: movie.id,
      title: tmdbMovie.title || movie.title,
      genre: movie.genre,
      rating: movie.rating || (tmdbMovie.vote_average ? (tmdbMovie.vote_average / 2).toFixed(1) : ''),
      date: movie.date,
      addedDate: movie.addedDate,
      review: movie.review,
      gradient: movie.gradient,
      posterPath: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
    }
  } catch (error) {
    console.error('[MyPage movie API]', error)
    return movie
  }
}

export async function getWatchedMovies(userId) {
  await new Promise(resolve => setTimeout(resolve, 300))
  return Promise.all(readWatchedMovies(userId).map(attachTmdbMovie))
}

export async function getWishlistMovies(userId) {
  await new Promise(resolve => setTimeout(resolve, 250))
  return Promise.all(wishlistMock.map(attachTmdbMovie))
}

export async function addWatchedMovie(userId, movie) {
  await new Promise(resolve => setTimeout(resolve, 200))
  const current = readWatchedMovies(userId)
  const movieId = movie.localId || movie.id
  const savedMovie = {
    ...movie,
    id: movieId || `watched-${Date.now()}`,
    date: movie.date || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
  }
  writeWatchedMovies(userId, [
    savedMovie,
    ...current.filter(item => (item.localId || item.id) !== movieId),
  ])
  return attachTmdbMovie(savedMovie)
}

export async function updateWatchedMovie(userId, movie) {
  await new Promise(resolve => setTimeout(resolve, 150))
  const movieId = movie.localId || movie.id
  const next = readWatchedMovies(userId).map(item => (
    (item.localId || item.id) === movieId
      ? { ...item, ...movie, id: item.id }
      : item
  ))
  writeWatchedMovies(userId, next)
  const updated = next.find(item => (item.localId || item.id) === movieId)
  return updated ? attachTmdbMovie(updated) : movie
}

export async function deleteWatchedMovie(userId, movieId) {
  await new Promise(resolve => setTimeout(resolve, 200))
  writeWatchedMovies(
    userId,
    readWatchedMovies(userId).filter(item => (item.localId || item.id) !== movieId)
  )
  return { success: true }
}

export async function addWishlistMovie(userId, movie) {
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    ...movie,
    id: movie.id || `wl-${Date.now()}`,
    addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
  }
}

export async function deleteWishlistMovie(userId, movieId) {
  await new Promise(resolve => setTimeout(resolve, 200))
  return { success: true }
}
