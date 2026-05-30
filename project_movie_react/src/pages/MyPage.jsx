import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriends } from '../contexts/FriendContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getWatchedMovies, getWishlistMovies } from '../services/mypageApi'
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
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [recommendMovie, setRecommendMovie] = useState(null)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [addMovieModalOpen, setAddMovieModalOpen] = useState(false)
  const [addMovieType, setAddMovieType] = useState('watched')
  const [sortType, setSortType] = useState('recent')
  const [wishlistSortType, setWishlistSortType] = useState('recent')
  const [watched, setWatched] = useState([])
  const [apiWishlist, setApiWishlist] = useState([])
  const [watchedLoading, setWatchedLoading] = useState(true)
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [watchedError, setWatchedError] = useState(false)
  const [wishlistError, setWishlistError] = useState(false)

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

  const fetchWishlist = useCallback(async () => {
    setWishlistLoading(true)
    setWishlistError(false)
    try {
      const data = await getWishlistMovies(user?.id)
      setApiWishlist(data)
    } catch {
      setWishlistError(true)
    } finally {
      setWishlistLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchWatched()
    fetchWishlist()
  }, [fetchWatched, fetchWishlist])

  const displayedWishlist = wishlist.length > 0 ? wishlist : apiWishlist

  const sortedWatched = useMemo(() => {
    const sorted = [...watched]
    switch (sortType) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
      case 'recent':
      default:
        return sorted.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    }
  }, [watched, sortType])

  const sortedWishlist = useMemo(() => {
    const sorted = [...displayedWishlist]
    switch (wishlistSortType) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
      case 'recent':
      default:
        return sorted.sort((a, b) => (b.addedDate || b.addedAt || '').localeCompare(a.addedDate || a.addedAt || ''))
    }
  }, [displayedWishlist, wishlistSortType])

  const handleAddMovie = (movie) => {
    if (addMovieType === 'watched') {
      setWatched(prev => [{
        ...movie,
        date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      }, ...prev])
      return
    }

    const nextMovie = {
      ...movie,
      addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      addedAt: new Date().toISOString(),
    }
    addToWishlist(nextMovie)
    setApiWishlist(prev => [nextMovie, ...prev.filter(item => item.id !== nextMovie.id)])
  }

  const handleDeleteWishlist = (movie) => {
    removeFromWishlist(movie.id)
    setApiWishlist(prev => prev.filter(item => item.id !== movie.id))
  }

  const stats = {
    watched: watched.length,
    avgRating: watched.length > 0 ? (watched.reduce((sum, movie) => sum + Number(movie.rating || 0), 0) / watched.length).toFixed(1) : '0',
    wishlist: displayedWishlist.length,
    friends: friends.length,
  }

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
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

        <div className="flex items-center gap-6 border-b border-gray-200 mb-5">
          {[
            { id: 'watched', label: '내가 본 영화' },
            { id: 'wishlist', label: '찜한 목록' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition ${tab === item.id ? 'text-[#7c5cff] border-[#7c5cff]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

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
            onMovieClick={setSelectedMovie}
            onRecommend={setRecommendMovie}
            onEdit={() => {}}
            onDelete={(movie) => setWatched(prev => prev.filter(item => item.id !== movie.id))}
            onRetry={fetchWatched}
          />
        )}

        {tab === 'wishlist' && (
          <MovieScrollSection
            title="찜한 영화"
            count={displayedWishlist.length}
            movies={sortedWishlist}
            loading={wishlistLoading}
            error={wishlistError}
            type="wishlist"
            sortType={wishlistSortType}
            onSortChange={setWishlistSortType}
            onAddClick={() => { setAddMovieType('wishlist'); setAddMovieModalOpen(true) }}
            onMovieClick={setSelectedMovie}
            onRecommend={setRecommendMovie}
            onDelete={handleDeleteWishlist}
            onRetry={fetchWishlist}
          />
        )}
      </div>

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
