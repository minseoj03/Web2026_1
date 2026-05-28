import { useState, useEffect } from 'react'
import { getFriendActivities } from '../services/friendApi'
import { FriendActivitySkeleton } from '../components/friends/FriendActivityCard'
import { useFriends } from '../contexts/FriendContext'
import MovieDetailModal from '../components/MovieDetailModal'

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

  // 친구 검색 필터
  const filteredFriends = friendSearch
    ? friends.filter(f => f.name.includes(friendSearch) || f.email.includes(friendSearch.toLowerCase()))
    : friends

  return (
    <>
      <div className="px-8 max-md:px-4 pb-8">
        <h1 className="text-2xl max-md:text-xl font-extrabold mb-1">👥 친구</h1>
        <p className="text-sm text-gray-500 mb-5 max-md:mb-4">친구들의 활동을 확인하고 관리하세요.</p>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-5">
          {[
            { id: 'activity', label: '활동' },
            { id: 'list', label: `친구 목록 (${friends.length})` },
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

        {/* 활동 탭 */}
        {tab === 'activity' && (
          <div className="flex flex-col gap-3 max-md:gap-2.5 max-w-[640px]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <FriendActivitySkeleton key={i} />)
            ) : (
              activities.map(a => (
                <div key={a.id} className="bg-white rounded-2xl max-md:rounded-xl p-5 max-md:p-4 shadow-sm flex gap-3.5 max-md:gap-2.5 hover:-translate-y-0.5 hover:shadow-md transition">
                  <div className={`w-11 h-11 max-md:w-9 max-md:h-9 rounded-full bg-gradient-to-br ${a.color} grid place-items-center text-white font-bold text-base max-md:text-sm shrink-0`}>{a.initial}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm max-md:text-xs font-bold">{a.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.type === 'review' ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-[#dcfce7] text-[#16a34a]'}`}>
                        {a.type === 'review' ? '평가' : '시청'}
                      </span>
                      <span className="text-[11px] max-md:text-[10px] text-gray-400 ml-auto shrink-0">{a.time}</span>
                    </div>
                    <p className="text-sm max-md:text-xs text-gray-700 mb-2.5 max-md:mb-2">{a.desc}</p>
                    <div
                      className="flex items-center gap-3 max-md:gap-2 p-3 max-md:p-2.5 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => setSelectedMovie({ id: a.id, title: a.movie, genre: a.genre, rating: a.rating, gradient: a.movieColor })}
                    >
                      <div className={`w-11 h-[60px] max-md:w-9 max-md:h-[50px] rounded-md bg-gradient-to-br ${a.movieColor} grid place-items-center text-white text-[9px] max-md:text-[8px] font-bold shrink-0`}>{a.movie.slice(0, 3)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm max-md:text-xs font-bold truncate">{a.movie}</p>
                        <p className="text-[11px] max-md:text-[10px] text-gray-500 truncate">⭐ {a.rating} · {a.genre} · {a.year}</p>
                        {a.review && <p className="text-[11px] max-md:text-[10px] text-gray-500 italic mt-1 line-clamp-2">{a.review}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 친구 목록 탭 */}
        {tab === 'list' && (
          <div className="max-w-[640px]">
            {/* 검색 */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">🔍</span>
              <input
                value={friendSearch}
                onChange={e => setFriendSearch(e.target.value)}
                placeholder="친구 검색 (이름, 이메일)"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition"
              />
            </div>

            {/* 목록 */}
            <div className="flex flex-col gap-2.5">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(f => (
                  <div key={f.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition">
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${f.color} grid place-items-center text-white font-bold text-sm`}>{f.initial}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold">{f.name}</span>
                      <p className="text-[11px] text-gray-500">{f.email}</p>
                    </div>

                    {/* 삭제 */}
                    <button
                      onClick={() => { if (confirm('친구를 삭제하시겠어요?')) removeFriend(f.id) }}
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition shrink-0"
                    >
                      삭제
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-sm text-gray-400">검색 결과가 없어요</div>
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
