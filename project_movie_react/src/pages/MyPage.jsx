import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriends } from '../contexts/FriendContext'
import { useWishlist } from '../contexts/WishlistContext'
import {
  addWatchedMovie,
  deleteWatchedMovie,
  getWatchedMovies,
  updateWatchedMovie,
} from '../services/mypageApi'
import ProfileSection from '../components/mypage/ProfileSection'
import MovieScrollSection from '../components/mypage/MovieScrollSection'
import MovieDetailModal from '../components/MovieDetailModal'
import RecommendToFriendModal from '../components/modals/RecommendToFriendModal'
import ProfileEditModal from '../components/modals/ProfileEditModal'
import AddMovieModal from '../components/modals/AddMovieModal'

export default function MyPage() {
  const { user } = useAuth()
  const { friends } = useFriends()
  const {
    wishlist,
    loading: wishlistLoading,
    error: wishlistError,
    addToWishlist,
    removeFromWishlist,
    retryFetch,
  } = useWishlist()

  const [tab, setTab] = useState('watched')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedMovieSource, setSelectedMovieSource] = useState(null)
  const [recommendMovie, setRecommendMovie] = useState(null)
  const [editingMovie, setEditingMovie] = useState(null)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [addMovieModalOpen, setAddMovieModalOpen] = useState(false)
  const [addMovieType, setAddMovieType] = useState('watched')
  const [sortType, setSortType] = useState('recent')
  const [wishlistSortType, setWishlistSortType] = useState('recent')
  const [watched, setWatched] = useState([])
  const [watchedLoading, setWatchedLoading] = useState(true)
  const [watchedError, setWatchedError] = useState(false)

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
    const sorted = [...wishlist]
    switch (wishlistSortType) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
      case 'recent':
      default:
        return sorted.sort((a, b) =>
          (b.addedDate || b.addedAt || '').localeCompare(a.addedDate || a.addedAt || '')
        )
    }
  }, [wishlist, wishlistSortType])

  const handleAddMovie = async (movie) => {
    if (addMovieType === 'watched') {
      const savedMovie = await addWatchedMovie(user?.id, movie)
      setWatched(prev => [
        savedMovie,
        ...prev.filter(item => getMovieKey(item) !== getMovieKey(savedMovie)),
      ])
      return
    }
    addToWishlist(movie)
  }

  const getMovieKey = (movie) => movie.localId || movie.id

  const handleUpdateWatchedMovie = async (updatedMovie) => {
    const savedMovie = await updateWatchedMovie(user?.id, updatedMovie)
    setWatched(prev => prev.map(movie => (
      getMovieKey(movie) === getMovieKey(savedMovie) ? savedMovie : movie
    )))
    setEditingMovie(null)
  }

  const handleDeleteWatchedMovie = async (movie) => {
    const movieId = getMovieKey(movie)
    await deleteWatchedMovie(user?.id, movieId)
    setWatched(prev => prev.filter(item => getMovieKey(item) !== movieId))
  }

  const stats = {
    watched: watched.length,
    avgRating: watched.length > 0
      ? (watched.reduce((sum, movie) => sum + Number(movie.rating || 0), 0) / watched.length).toFixed(1)
      : '0',
    wishlist: wishlist.length,
    friends: friends.length,
  }

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedMovie(null)
        setSelectedMovieSource(null)
        setRecommendMovie(null)
        setEditingMovie(null)
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
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition ${
                tab === item.id
                  ? 'text-[#7c5cff] border-[#7c5cff]'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
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
            onMovieClick={(movie) => {
              setSelectedMovie(movie)
              setSelectedMovieSource('watched')
            }}
            onRecommend={setRecommendMovie}
            onEdit={setEditingMovie}
            onDelete={handleDeleteWatchedMovie}
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
            onMovieClick={(movie) => {
              setSelectedMovie(movie)
              setSelectedMovieSource('wishlist')
            }}
            onRecommend={setRecommendMovie}
            onDelete={(movie) => removeFromWishlist(movie.id)}
            onRetry={retryFetch}
          />
        )}
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => {
            setSelectedMovie(null)
            setSelectedMovieSource(null)
          }}
          hideWishlist={selectedMovieSource === 'watched'}
        />
      )}
      <RecommendToFriendModal
        movie={recommendMovie}
        isOpen={!!recommendMovie}
        onClose={() => setRecommendMovie(null)}
      />
      <WatchedMovieEditModal
        movie={editingMovie}
        onClose={() => setEditingMovie(null)}
        onSave={handleUpdateWatchedMovie}
      />
      <ProfileEditModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <AddMovieModal
        isOpen={addMovieModalOpen}
        onClose={() => setAddMovieModalOpen(false)}
        onAdd={handleAddMovie}
        type={addMovieType}
      />
    </>
  )
}

function toDateInputValue(date) {
  return date ? date.replace(/\./g, '-') : new Date().toISOString().slice(0, 10)
}

function toDisplayDate(date) {
  return date ? date.replace(/-/g, '.') : new Date().toISOString().slice(0, 10).replace(/-/g, '.')
}

function WatchedMovieEditModal({ movie, onClose, onSave }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (!movie) return
    setRating(Number(movie.rating || 0))
    setReview(movie.review || '')
    setDate(toDateInputValue(movie.date))
  }, [movie])

  if (!movie) return null

  const handleSave = () => {
    onSave({
      ...movie,
      rating,
      review: review.trim(),
      date: toDisplayDate(date),
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center"
      onClick={onClose}
      role="dialog"
      aria-label="본 영화 편집"
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-[420px] shadow-xl animate-[modalIn_0.25s_ease]"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold">본 영화 편집</h2>
            <p className="text-sm text-gray-500 truncate mt-1">{movie.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">별점</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${star <= rating ? 'text-[#fbbf24]' : 'text-gray-300 hover:text-[#fbbf24]'}`}
                aria-label={`${star}점`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">시청 날짜</label>
          <input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-bold mb-1.5">한줄평</label>
          <textarea
            value={review}
            onChange={event => setReview(event.target.value)}
            rows={3}
            placeholder="이 영화에 대한 감상평"
            className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl text-sm font-bold bg-[#7c5cff] text-white hover:bg-[#5d3ee8] transition"
        >
          저장하기
        </button>
      </div>
    </div>
  )
}
