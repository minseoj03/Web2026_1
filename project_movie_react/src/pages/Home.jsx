import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieDetailModal from '../components/MovieDetailModal'
import HeroSection from '../components/home/HeroSection'
import EmotionSection from '../components/home/EmotionSection'
import { getPopularMovies } from '../services/movieApi'
import { useNotif } from '../contexts/NotifContext'
import { resolveNotification } from '../notifications/template'
import { useFriends } from '../contexts/FriendContext'
import { getFriendActivities } from '../services/friendApi'

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [popularMovies, setPopularMovies] = useState([])
  const [friendActivities, setFriendActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const { notifications, loading: notificationsLoading } = useNotif()
  const { friends } = useFriends()
  const recentNotifications = notifications.slice(0, 3)

  useEffect(() => {
    getPopularMovies()
      .then((data) => {
        setPopularMovies((data.results || []).slice(0, 5))
      })
      .catch(() => setPopularMovies([]))
  }, [])

  useEffect(() => {
    let ignore = false

    getFriendActivities(friends.map(friend => friend.id))
      .then(data => {
        if (!ignore) setFriendActivities(data.slice(0, 3))
      })
      .catch(() => {
        if (!ignore) setFriendActivities([])
      })
      .finally(() => {
        if (!ignore) setActivitiesLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [friends])

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_clamp(260px,22vw,320px)] max-xl:grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] fluid-px pb-8 overflow-hidden">
        <div className="min-w-0">
          <HeroSection />
          <EmotionSection onMovieClick={(movie) => setSelectedMovie(movie)} />
        </div>

        <aside className="min-w-0 flex flex-col gap-4 max-xl:grid max-xl:grid-cols-3 max-lg:grid-cols-1">
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">친구들의 최근 활동</h3>
              <Link to="/friends" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="flex flex-col gap-3">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-11 rounded-lg bg-gray-100 animate-pulse" />
                ))
              ) : friendActivities.length > 0 ? (
                friendActivities.map(activity => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => setSelectedMovie(activity.movieDetail)}
                    className="flex items-center gap-2.5 text-left hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activity.color} grid place-items-center text-white font-bold text-sm shrink-0`}>
                      {activity.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">{activity.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        “{activity.movie}” {activity.type === 'review' ? `★ ${activity.rating} 평가` : '시청 완료 🎬'}
                      </p>
                      <p className="text-[10px] text-gray-400">{activity.time}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="py-3 text-center text-xs text-gray-400">친구들의 최근 활동이 없어요.</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">알림</h3>
              <Link to="/notifications" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {notificationsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-7 rounded-lg bg-gray-100 animate-pulse" />
                ))
              ) : recentNotifications.length > 0 ? (
                recentNotifications.map(notification => {
                  const resolved = resolveNotification(notification)
                  return (
                    <Link
                      key={notification.id}
                      to="/notifications"
                      className={`flex items-center justify-between gap-2 pb-2.5 border-b border-gray-100 last:border-0 last:pb-0 hover:text-[#7c5cff] transition ${notification.read ? 'opacity-55' : ''}`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0 text-xs">
                        <span className="shrink-0">{resolved.icon}</span>
                        <span className="truncate">{resolved.title}</span>
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">{notification.time}</span>
                    </Link>
                  )
                })
              ) : (
                <p className="py-3 text-center text-xs text-gray-400">새로운 알림이 없어요.</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">OTT별 인기 영화 TOP 5</h3>
              <Link to="/ott-ranking" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {popularMovies.map((movie, index) => (
                <div key={movie.id || index} className="flex items-center gap-2">
                  <span className="text-sm font-extrabold w-4">{index + 1}</span>
                  <span className="text-xs font-semibold flex-1 truncate">{movie.title}</span>
                  <span className="text-[11px] text-gray-500">★ {movie.vote_average?.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  )
}
