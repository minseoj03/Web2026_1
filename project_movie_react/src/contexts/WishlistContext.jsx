import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getWishlistMovies } from '../services/mypageApi'
import { searchMovies } from '../services/movieApi'

const WishlistContext = createContext()

/**
 * WishlistContext - 찜한 영화 전역 상태 관리 (단일 출처)
 *
 * - 앱 시작 시 API에서 초기 찜 목록을 불러오고 TMDB 포스터로 보강
 * - localStorage로 변경사항 즉시 반영 (낙관적 업데이트)
 * - MyPage, Home, MovieDetailModal 등 모든 곳에서 이 Context만 사용
 *
 * API 연결 시:
 * - GET /api/users/:id/wishlist → 초기 로드 (getWishlistMovies 교체)
 * - POST /api/users/:id/wishlist → addToWishlist 내 API 호출 추가
 * - DELETE /api/users/:id/wishlist/:movieId → removeFromWishlist 내 API 호출 추가
 */

async function enrichWithTmdb(movie) {
  if (movie.posterPath && movie.overview) return movie
  try {
    const results = await searchMovies(movie.title)
    const tmdb = results?.find(item => item.id === movie.id) || results?.[0]
    if (!tmdb) return movie
    return {
      ...movie,
      original_title: tmdb.original_title || movie.original_title,
      overview: tmdb.overview || movie.overview,
      poster_path: tmdb.poster_path || movie.poster_path,
      release_date: tmdb.release_date || movie.release_date,
      vote_average: tmdb.vote_average || movie.vote_average,
      title: tmdb.title || movie.title,
      rating: movie.rating || (tmdb.vote_average ? (tmdb.vote_average / 2).toFixed(1) : ''),
      posterPath: tmdb.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
        : movie.posterPath,
    }
  } catch {
    return movie
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('moviemate_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 앱 시작 시 API에서 초기 목록 로드 + TMDB 보강
  // localStorage에 이미 데이터가 있으면 API 목록은 병합하지 않고 보강만 함
  useEffect(() => {
    let ignore = false

    const init = async () => {
      setLoading(true)
      setError(false)
      try {
        const apiData = await getWishlistMovies()

        if (ignore) return

        setWishlist(prev => {
          // localStorage에 데이터가 있으면 그것을 우선 사용하되 TMDB 보강 적용
          const base = prev.length > 0 ? prev : apiData
          // 비동기 보강은 별도 effect에서 처리
          return base
        })
      } catch {
        if (!ignore) setError(true)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    init()
    return () => { ignore = true }
  }, [])

  // wishlist 변경 시 localStorage 동기화
  useEffect(() => {
    localStorage.setItem('moviemate_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // TMDB 포스터/정보 보강 (posterPath 없는 항목만)
  useEffect(() => {
    const needsEnrich = wishlist.filter(m => !m.posterPath || !m.overview)
    if (needsEnrich.length === 0) return

    let ignore = false

    Promise.all(wishlist.map(enrichWithTmdb)).then(enriched => {
      if (!ignore) setWishlist(enriched)
    })

    return () => { ignore = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 초기 1회만 실행 (추가 시 enrichWithTmdb 직접 호출)

  const addToWishlist = useCallback(async (movie) => {
    // 낙관적 업데이트
    const enriched = await enrichWithTmdb({
      ...movie,
      addedAt: new Date().toISOString(),
      addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    })
    setWishlist(prev => {
      if (prev.some(m => m.id === enriched.id)) return prev
      return [enriched, ...prev]
    })
    // TODO [API 연결]: POST /api/users/:id/wishlist { movieId }
  }, [])

  const removeFromWishlist = useCallback((movieId) => {
    setWishlist(prev => prev.filter(m => m.id !== movieId))
    // TODO [API 연결]: DELETE /api/users/:id/wishlist/:movieId
  }, [])

  const toggleWishlist = useCallback(async (movie) => {
    setWishlist(prev => {
      if (prev.some(m => m.id === movie.id)) {
        return prev.filter(m => m.id !== movie.id)
      }
      return prev // 추가는 addToWishlist에서 보강 후 처리
    })

    const exists = wishlist.some(m => m.id === movie.id)
    if (!exists) {
      await addToWishlist(movie)
    }
  }, [wishlist, addToWishlist])

  const isWishlisted = useCallback((movieId) => {
    return wishlist.some(m => m.id === movieId)
  }, [wishlist])

  const retryFetch = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await getWishlistMovies()
      const enriched = await Promise.all(data.map(enrichWithTmdb))
      setWishlist(enriched)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      loading,
      error,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      retryFetch,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
