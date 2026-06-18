import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieDetailModal from '../components/MovieDetailModal'
import HeroSection from '../components/home/HeroSection'
import EmotionSection from '../components/home/EmotionSection'
import { HomeSidebarSkeleton } from '../components/Skeleton'
import { getPopularMovies } from '../services/movieApi'

const friendActivities = [
  { name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]', desc: '"어바웃 타임" ★ 4.5 평가', time: '30분 전' },
  { name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]', desc: '"인터스텔라" 시청 완료 🎬', time: '1시간 전' },
  { name: '민지', initial: '민', color: 'from-[#fda4af] to-[#f43f5e]', desc: '"기생충" ★ 5.0 평가', time: '5시간 전' },
]

const notifications = [
  { icon: '💜', text: '민지님이 "라라랜드"를 추천했어요', time: '10분 전' },
  { icon: '🗳️', text: '"주말에 뭐 볼까?" 투표 결과가 나왔어요', time: '25분 전' },
  { icon: '👥', text: '세영님이 투표방에 초대했어요', time: '1시간 전' },
]

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [popularMovies, setPopularMovies] = useState([])
  const [popularLoading, setPopularLoading] = useState(true)

  useEffect(() => {
    getPopularMovies()
      .then((data) => {
        setPopularMovies((data.results || []).slice(0, 5))
      })
      .catch(() => setPopularMovies([]))
      .finally(() => setPopularLoading(false))
  }, [])

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
              {friendActivities.map(activity => (
                <div key={activity.name} className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activity.color} grid place-items-center text-white font-bold text-sm shrink-0`}>
                    {activity.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{activity.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{activity.desc}</p>
                    <p className="text-[10px] text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">알림</h3>
              <Link to="/notifications" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center justify-between gap-2 pb-2.5 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="flex items-center gap-1.5 min-w-0 text-xs text-gray-700">
                    <span className="shrink-0">{notification.icon}</span>
                    <span className="truncate">{notification.text}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">{notification.time}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">OTT별 인기 영화 TOP 5</h3>
              <Link to="/ott-ranking" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            {popularLoading ? (
              <div className="flex flex-col gap-2.5 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-gray-200 rounded shrink-0" />
                    <div className="h-3 bg-gray-200 rounded flex-1" />
                    <div className="w-8 h-3 bg-gray-200 rounded shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {popularMovies.map((movie, index) => (
                  <div key={movie.id || index} className="flex items-center gap-2">
                    <span className="text-sm font-extrabold w-4">{index + 1}</span>
                    <span className="text-xs font-semibold flex-1 truncate">{movie.title}</span>
                    <span className="text-[11px] text-gray-500">★ {movie.vote_average?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}
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
