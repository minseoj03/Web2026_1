import { useEffect, useState } from 'react'
import MovieDetailModal from '../components/MovieDetailModal'
import { FriendActivitySkeleton } from '../components/friends/FriendActivityCard'
import { useFriends } from '../contexts/FriendContext'
import { getFriendActivities } from '../services/friendApi'

export default function Friends() {
  const [tab, setTab] = useState('activity')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [friendSearch, setFriendSearch] = useState('')
  const { friends, removeFriend } = useFriends()

  useEffect(() => {
    setLoading(true)
    getFriendActivities()
      .then(data => setActivities(data))
      .finally(() => setLoading(false))
  }, [])

  const filteredFriends = friendSearch
    ? friends.filter(friend => friend.name.includes(friendSearch) || friend.email.includes(friendSearch.toLowerCase()))
    : friends

  return (
    <>
      <div className="px-8 max-md:px-4 pb-8">
        <h1 className="text-2xl max-md:text-xl font-extrabold mb-1">👥 친구</h1>
        <p className="text-sm text-gray-500 mb-5 max-md:mb-4">친구들의 활동을 확인하고 관리하세요.</p>

        <div className="flex gap-6 border-b border-gray-200 mb-5">
          {[
            { id: 'activity', label: '활동' },
            { id: 'list', label: `친구 목록 (${friends.length})` },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition ${
                tab === item.id ? 'text-[#7c5cff] border-[#7c5cff]' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'activity' && (
          <div className="flex flex-col gap-3 max-md:gap-2.5 max-w-[640px]">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <FriendActivitySkeleton key={index} />)
            ) : (
              activities.map(activity => (
                <div key={activity.id} className="bg-white rounded-2xl max-md:rounded-xl p-5 max-md:p-4 shadow-sm flex gap-3.5 max-md:gap-2.5 hover:-translate-y-0.5 hover:shadow-md transition">
                  <div className={`w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-gradient-to-br ${activity.color} grid place-items-center text-white font-bold text-base max-md:text-sm shrink-0`}>
                    {activity.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm max-md:text-xs font-bold">{activity.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activity.type === 'review' ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-[#dcfce7] text-[#16a34a]'
                      }`}>
                        {activity.type === 'review' ? '평가' : '시청'}
                      </span>
                      <span className="text-[11px] max-md:text-[10px] text-gray-400 ml-auto shrink-0">{activity.time}</span>
                    </div>
                    <p className="text-sm max-md:text-xs text-gray-700 mb-2.5 max-md:mb-2">{activity.desc}</p>
                    <button
                      className="w-full flex items-center gap-3 max-md:gap-2 p-3 max-md:p-2.5 bg-gray-100 rounded-xl cursor-pointer hover:bg-[#f3f0ff] transition text-left"
                      onClick={() => setSelectedMovie(activity.movieDetail)}
                    >
                      {activity.posterPath ? (
                        <img
                          src={activity.posterPath}
                          alt={activity.movie}
                          className="w-11 h-[60px] max-md:w-9 max-md:h-[50px] rounded-md object-cover shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-11 h-[60px] max-md:w-9 max-md:h-[50px] rounded-md bg-gradient-to-br ${activity.movieColor} grid place-items-center text-white text-[9px] max-md:text-[8px] font-bold shrink-0`}>
                          {activity.movie.slice(0, 3)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm max-md:text-xs font-bold truncate">{activity.movie}</p>
                        <p className="text-[11px] max-md:text-[10px] text-gray-500 truncate">★ {activity.rating} · {activity.genre} · {activity.year}</p>
                        {activity.review && <p className="text-[11px] max-md:text-[10px] text-gray-500 italic mt-1 line-clamp-2">{activity.review}</p>}
                      </div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'list' && (
          <div className="max-w-[640px]">
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">🔎</span>
              <input
                value={friendSearch}
                onChange={event => setFriendSearch(event.target.value)}
                placeholder="친구 검색 (이름, 이메일)"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div key={friend.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${friend.color} grid place-items-center text-white font-bold text-sm`}>
                      {friend.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold">{friend.name}</span>
                      <p className="text-[11px] text-gray-500">{friend.email}</p>
                    </div>
                    <button
                      onClick={() => { if (confirm('친구를 삭제하시겠어요?')) removeFriend(friend.id) }}
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition shrink-0"
                    >
                      삭제
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-sm text-gray-400">검색 결과가 없어요.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  )
}
