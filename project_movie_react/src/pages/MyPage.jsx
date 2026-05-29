import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriends } from '../contexts/FriendContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getWatchedMovies } from '../services/mypageApi'
import ProfileSection from '../components/mypage/ProfileSection'
import MovieScrollSection from '../components/mypage/MovieScrollSection'
import MovieDetailModal from '../components/MovieDetailModal'
import RecommendToFriendModal from '../components/modals/RecommendToFriendModal'
import ProfileEditModal from '../components/modals/ProfileEditModal'
import AddMovieModal from '../components/modals/AddMovieModal'

export default function MyPage() {
  const { user } = useAuth()
  const { friends } = useFriends()
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [tab, setTab] = useState('watched')

  // Movie detail modal
  const [selectedMovie, setSelectedMovie] = useState(null)

  // Recommend modal
  const [recommendMovie, setRecommendMovie] = useState(null)

  // Profile edit modal
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  // Add movie modal
  const [addMovieModalOpen, setAddMovieModalOpen] = useState(false)
  const [addMovieType, setAddMovieType] = useState('watched')

  // Sort
  const [sortType, setSortType] = useState('recent')
  const [wishlistSortType, setWishlistSortType] = useState('recent')

  // Watched state
  const [watched, setWatched] = useState([])
  const [watchedLoading, setWatchedLoading] = useState(true)
  const [watchedError, setWatchedError] = useState(false)

  // Wishlist는 WishlistContext에서 관리
  const wishlistLoading = false
  const wishlistError = false

  // Fetch
  const fetchWatched = useCallback(async () => {
    setWatchedLoading(true)
    setWatchedError(false)
    try {
      const data = await getWatchedMovies(user?.id)
      setWatched(data)
    } catch {
      setWatchedError(true)
    } finally {
      setWatchedLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchWatched()
  }, [fetchWatched])

  // Sorted watched movies
  const sortedWatched = useMemo(() => {
    const sorted = [...watched]
    switch (sortType) {
      case 'name': return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
      case 'recent':
      default: return sorted.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    }
  }, [watched, sortType])

  // Sorted wishlist movies
  const sortedWishlist = useMemo(() => {
    const sorted = [...wishlist]
    switch (wishlistSortType) {
      case 'name': return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
      case 'recent':
      default: return sorted.sort((a, b) => (b.addedDate || '').localeCompare(a.addedDate || ''))
    }
  }, [wishlist, wishlistSortType])

  // Add movie handler (optimistic UI)
  const handleAddMovie = (movie) => {
    if (addMovieType === 'watched') {
      setWatched(prev => [movie, ...prev])
    } else {
      addToWishlist({ ...movie, id: movie.id || `wl-${Date.now()}` })
    }
  }

  // Stats
  const stats = {
    watched: watched.length,
    avgRating: watched.length > 0 ? (watched.reduce((sum, m) => sum + (m.rating || 0), 0) / watched.length).toFixed(1) : '0',
    wishlist: wishlist.length,
    friends: friends.length,
  }

  // ESC key to close modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedMovie(null)
        setRecommendMovie(null)
        setProfileModalOpen(false)
        setAddMovieModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <>
      <div className="px-8 max-md:px-4 pb-8">
        <h1 className="text-2xl max-md:text-xl font-extrabold mb-1">내 페이지</h1>
        <p className="text-sm text-gray-500 mb-5 max-md:mb-4">내가 본 영화와 취향을 관리해보세요.</p>

        <ProfileSection stats={stats} onEditProfile={() => setProfileModalOpen(true)} />

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-5">
          {[
            { id: 'watched', label: '내가 본 영화' },
            { id: 'wishlist', label: '찜한 목록' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition ${tab === t.id ? 'text-[#7c5cff] border-[#7c5cff]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'watched' && (
          <MovieScrollSection
            title="내가 본 영화"
            count={watched.length}
            movies={sortedWatched}
            loading={watchedLoading}
            error={watchedError}
            type="watched"
            sortType={sortType}
            onSortChange={setSortType}
            onAddClick={() => { setAddMovieType('watched'); setAddMovieModalOpen(true) }}
            onMovieClick={(movie) => setSelectedMovie(movie)}
            onRecommend={(movie) => setRecommendMovie(movie)}
            onEdit={(movie) => {/* TODO: 편집 모달 */}}
            onDelete={(movie) => setWatched(prev => prev.filter(m => m.id !== movie.id))}
            onRetry={fetchWatched}
          />
        )}

        {tab === 'wishlist' && (
          <MovieScrollSection
            title="찜한 영화"
            count={wishlist.length}
            movies={sortedWishlist}
            loading={wishlistLoading}
            error={wishlistError}
            type="wishlist"
            sortType={wishlistSortType}
            onSortChange={setWishlistSortType}
            onAddClick={() => { setAddMovieType('wishlist'); setAddMovieModalOpen(true) }}
            onMovieClick={(movie) => setSelectedMovie(movie)}
            onRecommend={(movie) => setRecommendMovie(movie)}
            onDelete={(movie) => removeFromWishlist(movie.id)}
            onRetry={() => {}}
          />
        )}
      </div>

      {/* Modals */}
      {selectedMovie && <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
      <RecommendToFriendModal movie={recommendMovie} isOpen={!!recommendMovie} onClose={() => setRecommendMovie(null)} />
      <ProfileEditModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <AddMovieModal
        isOpen={addMovieModalOpen}
        onClose={() => setAddMovieModalOpen(false)}
        onAdd={handleAddMovie}
        type={addMovieType}
        userOtt={user?.ott || []}
      />
    </>
  )
}
