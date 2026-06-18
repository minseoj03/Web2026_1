import { useEffect, useState } from 'react'
import MovieDetailModal from '../components/MovieDetailModal'
import { FriendActivitySkeleton } from '../components/friends/FriendActivityCard'
import { useFriends } from '../contexts/FriendContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useToast } from '../components/Toast'
import { getFriendActivities } from '../services/friendApi'
import { searchMovies } from '../services/movieApi'
import { getReceivedRecommendations, getSentRecommendations, updateReceivedRecommendation } from '../services/recommendApi'

function formatRecommendationDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function Friends() {
  const [tab, setTab] = useState('activity')
  const [recommendationTab, setRecommendationTab] = useState('sent')
  const [activities, setActivities] = useState([])
  const [sentRecommendations, setSentRecommendations] = useState([])
  const [receivedRecommendations, setReceivedRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [friendSearch, setFriendSearch] = useState('')
  const { friends, removeFriend } = useFriends()
  const { addToWishlist, isWishlisted } = useWishlist()
  const { addToast } = useToast()

  const enrichRecommendationMovies = async (recommendations) => {
    return Promise.all(recommendations.map(async (item) => {
      if (item.movie?.posterPath) return item

      try {
        const results = await searchMovies(item.movie.title)
        const tmdbMovie = results?.find(movie => movie.id === item.movie.id) || results?.[0]
        if (!tmdbMovie) return item

        return {
          ...item,
          movie: {
            ...item.movie,
            id: tmdbMovie.id,
            title: tmdbMovie.title || item.movie.title,
            overview: tmdbMovie.overview || item.movie.overview,
            rating: item.movie.rating || (tmdbMovie.vote_average ? (tmdbMovie.vote_average / 2).toFixed(1) : ''),
            posterPath: tmdbMovie.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
              : item.movie.posterPath,
          },
        }
      } catch (error) {
        console.error('[Friend recommendation movie]', error)
        return item
      }
    }))
  }

  const refreshRecommendations = async () => {
    const [sent, received] = await Promise.all([
      enrichRecommendationMovies(getSentRecommendations()),
      enrichRecommendationMovies(getReceivedRecommendations()),
    ])
    setSentRecommendations(sent)
    setReceivedRecommendations(received)
  }

  useEffect(() => {
    setLoading(true)
    getFriendActivities()
      .then(data => setActivities(data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refreshRecommendations()
    window.addEventListener('moviemate:recommendations-updated', refreshRecommendations)
    return () => window.removeEventListener('moviemate:recommendations-updated', refreshRecommendations)
  }, [])

  const filteredFriends = friendSearch
    ? friends.filter(friend => friend.name.includes(friendSearch) || friend.email.includes(friendSearch.toLowerCase()))
    : friends

  const handleThanks = (item) => {
    updateReceivedRecommendation(item.id, { reaction: 'thanks', read: true })
    refreshRecommendations()
    addToast('추천한 친구에게 고마워요 반응을 보냈어요 💜', { type: 'success' })
  }

  const handleWishlist = (item) => {
    if (!isWishlisted(item.movie.id)) addToWishlist(item.movie)
    updateReceivedRecommendation(item.id, { reaction: 'wishlisted', read: true })
    refreshRecommendations()
    addToast(`“${item.movie.title}”을 찜 목록에 추가했어요.`, { type: 'success' })
  }

  return (
    <>
      <div className="px-8 max-md:px-4 pb-8">
        <h1 className="text-2xl max-md:text-xl font-extrabold mb-1">👥 친구</h1>
        <p className="text-sm text-gray-500 mb-5 max-md:mb-4">친구들의 활동과 주고받은 영화 추천을 확인하세요.</p>

        <div className="flex gap-6 border-b border-gray-200 mb-5 overflow-x-auto scrollbar-hide">
          {[
            { id: 'activity', label: '활동' },
            { id: 'recommendations', label: `주고받은 추천 (${sentRecommendations.length + receivedRecommendations.length})` },
            { id: 'list', label: `친구 목록 (${friends.length})` },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition shrink-0 ${
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activity.type === 'review' ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-[#dcfce7] text-[#16a34a]'}`}>
                        {activity.type === 'review' ? '평가' : '시청'}
                      </span>
                      <span className="text-[11px] max-md:text-[10px] text-gray-400 ml-auto shrink-0">{activity.time}</span>
                    </div>
                    <p className="text-sm max-md:text-xs text-gray-700 mb-2.5 max-md:mb-2">{activity.desc}</p>
                    <button className="w-full flex items-center gap-3 max-md:gap-2 p-3 max-md:p-2.5 bg-gray-100 rounded-xl hover:bg-[#f3f0ff] transition text-left" onClick={() => setSelectedMovie(activity.movieDetail)}>
                      {activity.posterPath ? (
                        <img src={activity.posterPath} alt={activity.movie} className="w-11 h-[60px] max-md:w-9 max-md:h-[50px] rounded-md object-cover shrink-0" loading="lazy" />
                      ) : (
                        <div className={`w-11 h-[60px] max-md:w-9 max-md:h-[50px] rounded-md bg-gradient-to-br ${activity.movieColor} grid place-items-center text-white text-[9px] font-bold shrink-0`}>
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

        {tab === 'recommendations' && (
          <div className="max-w-[760px]">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-4">
              <button onClick={() => setRecommendationTab('sent')} className={`px-4 py-2 rounded-md text-xs font-bold ${recommendationTab === 'sent' ? 'bg-white text-[#7c5cff] shadow-sm' : 'text-gray-500'}`}>
                보낸 추천 {sentRecommendations.length}
              </button>
              <button onClick={() => setRecommendationTab('received')} className={`px-4 py-2 rounded-md text-xs font-bold ${recommendationTab === 'received' ? 'bg-white text-[#7c5cff] shadow-sm' : 'text-gray-500'}`}>
                받은 추천 {receivedRecommendations.length}
              </button>
            </div>

            {recommendationTab === 'sent' ? (
              <div className="flex flex-col gap-3">
                {sentRecommendations.length > 0 ? sentRecommendations.map(item => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <MovieThumb movie={item.movie} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-extrabold truncate">{item.movie.title}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{formatRecommendationDate(item.sentAt)}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold shrink-0">알림 전달됨</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {item.recipients.map(friend => (
                            <span key={friend.id} className="inline-flex items-center gap-1 px-2 py-1 bg-[#f3f0ff] text-[#7c5cff] rounded-full text-[10px] font-bold">
                              <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${friend.color} text-white grid place-items-center text-[8px]`}>{friend.initial}</span>
                              {friend.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 bg-gray-100 rounded-lg p-2.5 mt-2">“{item.message}”</p>
                      </div>
                    </div>
                  </div>
                )) : <RecommendationEmpty text="아직 보낸 영화 추천이 없어요." />}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {receivedRecommendations.length > 0 ? receivedRecommendations.map(item => (
                  <div key={item.id} className="bg-white border border-[#9b85ff]/40 rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <MovieThumb movie={item.movie} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-bold text-[#7c5cff]">{item.senderName}님이 추천했어요</p>
                            <p className="text-sm font-extrabold truncate mt-0.5">{item.movie.title}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0">{formatRecommendationDate(item.receivedAt)}</span>
                        </div>
                        <p className="text-xs text-gray-600 bg-[#faf8ff] rounded-lg p-2.5 mt-2">“{item.message}”</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <button onClick={() => setSelectedMovie(item.movie)} className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:border-[#7c5cff] hover:text-[#7c5cff]">상세보기</button>
                          <button onClick={() => handleWishlist(item)} className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:border-[#7c5cff] hover:text-[#7c5cff]">{item.reaction === 'wishlisted' ? '찜 완료' : '찜하기'}</button>
                          <button onClick={() => handleThanks(item)} className="px-3 py-2 bg-[#7c5cff] text-white rounded-lg text-xs font-bold hover:bg-[#5d3ee8]">{item.reaction === 'thanks' ? '고마워요 전송됨' : '추천 고마워요'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : <RecommendationEmpty text="아직 받은 영화 추천이 없어요." />}
              </div>
            )}
          </div>
        )}

        {tab === 'list' && (
          <div className="max-w-[640px]">
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">🔎</span>
              <input value={friendSearch} onChange={event => setFriendSearch(event.target.value)} placeholder="친구 검색 (이름, 이메일)" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition" />
            </div>
            <div className="flex flex-col gap-2.5">
              {filteredFriends.length > 0 ? filteredFriends.map(friend => (
                <div key={friend.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${friend.color} grid place-items-center text-white font-bold text-sm`}>{friend.initial}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold">{friend.name}</span>
                    <p className="text-[11px] text-gray-500">{friend.email}</p>
                  </div>
                  <button onClick={() => { if (confirm('친구를 삭제하시겠어요?')) removeFriend(friend.id) }} className="px-2.5 py-1.5 text-[11px] font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition shrink-0">삭제</button>
                </div>
              )) : <div className="text-center py-10 text-sm text-gray-400">검색 결과가 없어요.</div>}
            </div>
          </div>
        )}
      </div>

      {selectedMovie && <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  )
}

function MovieThumb({ movie }) {
  return movie.posterPath ? (
    <img src={movie.posterPath} alt={movie.title} className="w-14 h-[78px] rounded-lg object-cover shrink-0" />
  ) : (
    <div className={`w-14 h-[78px] rounded-lg bg-gradient-to-br ${movie.gradient || 'from-[#2d1b4e] to-[#4a3268]'} grid place-items-center text-white text-[9px] font-bold text-center p-1 shrink-0`}>
      {movie.title.slice(0, 4)}
    </div>
  )
}

function RecommendationEmpty({ text }) {
  return (
    <div className="text-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
      <p className="text-3xl mb-2">👤→🎬</p>
      <p className="text-sm text-gray-400 font-semibold">{text}</p>
    </div>
  )
}
