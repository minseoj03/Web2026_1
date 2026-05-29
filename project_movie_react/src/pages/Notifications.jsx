import { useEffect, useState } from 'react'
import MovieDetailModal from '../components/MovieDetailModal'
import { resolveNotification } from '../notifications/template'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationApi'

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3.5 p-5 max-md:p-4 rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48 mb-1.5" />
        <div className="h-3 bg-gray-200 rounded w-36" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="h-3 bg-gray-200 rounded w-12" />
        <div className="h-5 bg-gray-200 rounded-full w-10" />
      </div>
    </div>
  )
}

function NotificationCard({ notif, onMarkRead, onMovieClick }) {
  const resolved = resolveNotification(notif)

  return (
    <div className={`flex items-center gap-3.5 p-5 max-md:p-4 rounded-2xl max-md:rounded-xl border transition ${
      notif.read ? 'opacity-55 border-gray-200' : 'border-[#9b85ff] bg-gradient-to-r from-[#faf8ff] to-white shadow-sm'
    }`}>
      <div className={`w-11 h-11 max-md:w-9 max-md:h-9 rounded-full ${resolved.bgColor} grid place-items-center text-xl max-md:text-lg shrink-0`}>
        {resolved.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-bold mb-0.5 ${resolved.labelColor}`}>{resolved.label}</p>
        <p className="text-sm max-md:text-xs font-bold mb-0.5 truncate">{resolved.title}</p>
        <p className="text-xs max-md:text-[11px] text-gray-500 truncate">{resolved.desc}</p>
        {resolved.hasMovie && notif.movie && (
          <button
            onClick={() => onMovieClick(notif.movie)}
            className="w-full flex items-center gap-2.5 p-2.5 max-md:p-2 bg-gray-100 rounded-lg mt-2.5 text-left hover:bg-[#f3f0ff] transition"
          >
            {notif.movie.posterPath ? (
              <img
                src={notif.movie.posterPath}
                alt={notif.movie.title}
                className="w-10 max-md:w-8 h-14 max-md:h-11 rounded-md object-cover shrink-0"
                loading="lazy"
              />
            ) : (
              <div className={`w-10 max-md:w-8 h-14 max-md:h-11 rounded-md bg-gradient-to-br ${notif.movie.gradient} grid place-items-center text-white text-[8px] font-bold shrink-0`}>
                {notif.movie.title.slice(0, 3)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm max-md:text-xs font-bold truncate">{notif.movie.title}</p>
              <p className="text-[11px] max-md:text-[10px] text-gray-500">{notif.movie.genre} · ★ {notif.movie.rating}</p>
            </div>
          </button>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[11px] max-md:text-[10px] text-gray-400">{notif.time}</span>
        {!notif.read && (
          <button
            onClick={() => onMarkRead(notif.id)}
            className="text-[11px] text-[#7c5cff] font-semibold px-2.5 py-1 bg-[#f3f0ff] rounded-full hover:bg-[#7c5cff] hover:text-white transition"
          >
            읽음
          </button>
        )}
      </div>
    </div>
  )
}

export default function Notifications() {
  const [tab, setTab] = useState('recommend')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    setLoading(true)
    getNotifications()
      .then(data => setNotifications(data))
      .finally(() => setLoading(false))
  }, [])

  const filterByCategory = (category) => {
    return notifications.filter(notification => {
      const resolved = resolveNotification(notification)
      return resolved.category === category
    })
  }

  const recommendList = filterByCategory('recommend')
  const generalList = filterByCategory('general')
  const currentList = tab === 'recommend' ? recommendList : generalList
  const unreadCount = (list) => list.filter(notification => !notification.read).length

  const handleMarkRead = async (id) => {
    await markNotificationRead(id)
    setNotifications(prev => prev.map(notification => notification.id === id ? { ...notification, read: true } : notification))
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  return (
    <div className="fluid-px pb-8">
      <div className="flex items-end justify-between mb-4 max-md:flex-col max-md:items-start max-md:gap-2">
        <div>
          <h1 className="text-2xl max-md:text-xl font-extrabold mb-1">🔔 알림</h1>
          <p className="text-sm max-md:text-xs text-gray-500">추천 알림과 일반 알림을 확인하세요.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm max-md:text-xs font-semibold hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
        >
          모두 읽음
        </button>
      </div>

      <div className="flex gap-0 border-b border-gray-200 mb-5">
        {[
          { id: 'recommend', label: '추천 알림', list: recommendList },
          { id: 'general', label: '일반', list: generalList },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-5 max-md:px-3 py-3 text-sm max-md:text-xs font-semibold border-b-2 -mb-px transition ${
              tab === item.id ? 'text-[#7c5cff] border-[#7c5cff]' : 'text-gray-400 border-transparent hover:text-gray-700'
            }`}
          >
            {item.label}
            {unreadCount(item.list) > 0 && (
              <span className="ml-1.5 min-w-[18px] h-[18px] bg-[#7c5cff] text-white text-[10px] font-bold rounded-full inline-grid place-items-center px-1">
                {unreadCount(item.list)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <NotificationSkeleton key={index} />)
        ) : currentList.length > 0 ? (
          currentList.map(notification => (
            <NotificationCard
              key={notification.id}
              notif={notification}
              onMarkRead={handleMarkRead}
              onMovieClick={setSelectedMovie}
            />
          ))
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔔</p>
            <p className="font-semibold">표시할 알림이 없어요.</p>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}
