import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WishlistContext = createContext()

/**
 * WishlistContext - 찜한 영화 전역 상태 관리
 * 
 * 역할:
 * - 찜 목록 저장/조회
 * - 찜 추가/제거 토글
 * - 특정 영화가 찜되어 있는지 확인
 * - MyPage, Home, MovieDetailModal, MovieCard 등에서 공유
 * 
 * API 연결 시:
 * - GET /api/users/:id/wishlist → 초기 로드
 * - POST /api/users/:id/wishlist → 찜 추가
 * - DELETE /api/users/:id/wishlist/:movieId → 찜 제거
 */

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    // localStorage에서 복원
    const saved = localStorage.getItem('moviemate_wishlist')
    return saved ? JSON.parse(saved) : []
  })

  // wishlist 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('moviemate_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // 찜 추가
  // TODO [API 연결]: POST /api/users/:id/wishlist { movieId }
  const addToWishlist = useCallback((movie) => {
    setWishlist(prev => {
      // 이미 있으면 추가하지 않음
      if (prev.some(m => m.id === movie.id)) return prev
      return [...prev, { ...movie, addedAt: new Date().toISOString() }]
    })
  }, [])

  // 찜 제거
  // TODO [API 연결]: DELETE /api/users/:id/wishlist/:movieId
  const removeFromWishlist = useCallback((movieId) => {
    setWishlist(prev => prev.filter(m => m.id !== movieId))
  }, [])

  // 찜 토글 (있으면 제거, 없으면 추가)
  const toggleWishlist = useCallback((movie) => {
    setWishlist(prev => {
      const exists = prev.some(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, { ...movie, addedAt: new Date().toISOString() }]
      }
    })
  }, [])

  // 특정 영화가 찜되어 있는지 확인
  const isWishlisted = useCallback((movieId) => {
    return wishlist.some(m => m.id === movieId)
  }, [wishlist])

  // 찜 목록 개수
  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
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
