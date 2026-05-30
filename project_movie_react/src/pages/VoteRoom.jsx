import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriends } from '../contexts/FriendContext'
import { getPopularMoviesWithOtt, searchMovies } from '../services/movieApi'

const authors = ['송이', '민지', '우진', '세영']

const initialRooms = {
  room1: {
    title: '주말에 뭐 볼까?',
    desc: '주말 밤에 다 같이 볼 영화를 골라보아요! 🎬',
    icon: '🍿',
    creator: '송이',
    createdAt: '2025.05.20',
    deadline: '05.20 (토) 23:59',
    participants: [
      { name: '송이', initial: '송', color: 'from-[#ffd6a5] to-[#fdb88a]', role: '방장' },
      { name: '민지', initial: '민', color: 'from-[#fda4af] to-[#f43f5e]' },
      { name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]' },
      { name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]' },
    ],
    movies: [],
    votes: {},
    myVote: null,
  },
  room2: {
    title: '금요일 영화의 밤',
    desc: '금요일 저녁에 같이 볼 액션 영화를 정해요.',
    icon: '🎬',
    creator: '호준',
    createdAt: '2025.05.18',
    deadline: '05.22 (금) 21:00',
    participants: [
      { name: '송이', initial: '송', color: 'from-[#ffd6a5] to-[#fdb88a]' },
      { name: '호준', initial: '호', color: 'from-[#fbbf24] to-[#f59e0b]', role: '방장' },
    ],
    movies: [],
    votes: {},
    myVote: null,
  },
}

function toVoteMovie(movie, index = 0) {
  return {
    id: String(movie.id),
    title: movie.title,
    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    gradient: 'from-[#2d1b4e] to-[#4a3268]',
    reason: movie.overview || '함께 보기 좋은 인기 영화예요.',
    author: authors[index % authors.length],
    rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : '',
    likes: 0,
  }
}

export default function VoteRoom() {
  const { user } = useAuth()
  const [currentRoom, setCurrentRoom] = useState('room1')
  const [tab, setTab] = useState('recommend')
  const [rooms, setRooms] = useState(initialRooms)
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [createRoomOpen, setCreateRoomOpen] = useState(false)
  const [addMovieOpen, setAddMovieOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const room = rooms[currentRoom]
  const displayName = user?.nickname || '송이'
  const isCreator = room?.creator === displayName

  useEffect(() => {
    setLoadingMovies(true)

    getPopularMoviesWithOtt()
      .then((data) => {
        const apiMovies = (data.results || []).slice(0, 5).map(toVoteMovie)

        setRooms(prev => {
          const next = { ...prev }
          Object.keys(next).forEach((roomId, roomIndex) => {
            if (next[roomId].movies.length > 0) return

            const movies = apiMovies
              .slice(roomIndex, roomIndex + 3)
              .map((movie, index) => ({ ...movie, author: authors[(index + roomIndex) % authors.length] }))

            next[roomId] = {
              ...next[roomId],
              movies,
              votes: movies.reduce((acc, movie, index) => {
                acc[movie.id] = index + 1
                return acc
              }, {}),
            }
          })
          return next
        })
      })
      .catch(error => console.error('[VoteRoom movies]', error))
      .finally(() => setLoadingMovies(false))
  }, [])

  const handleVote = (movieId) => {
    setRooms(prev => {
      const current = prev[currentRoom]
      const oldVote = current.myVote
      const newVotes = { ...current.votes }

      if (oldVote) newVotes[oldVote] = Math.max(0, (newVotes[oldVote] || 0) - 1)

      const newMyVote = oldVote === movieId ? null : movieId
      if (newMyVote) newVotes[newMyVote] = (newVotes[newMyVote] || 0) + 1

      return {
        ...prev,
        [currentRoom]: { ...current, votes: newVotes, myVote: newMyVote },
      }
    })
  }

  const handleDeleteMovie = (movieId) => {
    if (!confirm('이 영화를 추천 목록에서 삭제하시겠어요?')) return

    setRooms(prev => {
      const current = prev[currentRoom]
      const newMovies = current.movies.filter(m => m.id !== movieId)
      const newVotes = { ...current.votes }
      delete newVotes[movieId]
      const newMyVote = current.myVote === movieId ? null : current.myVote

      return {
        ...prev,
        [currentRoom]: { ...current, movies: newMovies, votes: newVotes, myVote: newMyVote },
      }
    })
  }

  const handleDeleteRoom = () => {
    if (!isCreator) return
    if (!confirm('투표방을 삭제하시겠어요?')) return

    setRooms(prev => {
      const next = { ...prev }
      delete next[currentRoom]
      return next
    })

    const remaining = Object.keys(rooms).filter(id => id !== currentRoom)
    setCurrentRoom(remaining[0] || '')
    setTab('rooms')
  }

  const handleLeaveRoom = () => {
    if (!confirm('투표방을 나가시겠어요?')) return

    setRooms(prev => {
      const current = prev[currentRoom]
      return {
        ...prev,
        [currentRoom]: {
          ...current,
          participants: current.participants.filter(p => p.name !== displayName),
        },
      }
    })

    const remaining = Object.keys(rooms).filter(id => id !== currentRoom)
    setCurrentRoom(remaining[0] || '')
    setTab('rooms')
  }

  const getTotalVotes = () => Object.values(room?.votes || {}).reduce((sum, count) => sum + count, 0)

  if (!room) {
    return (
      <div className="px-8 pb-8 text-center py-20">
        <p className="text-lg font-bold text-gray-500">참여 중인 투표방이 없어요.</p>
        <button onClick={() => setCreateRoomOpen(true)} className="mt-4 px-4 py-2 bg-[#7c5cff] text-white rounded-lg text-sm font-bold">
          + 새 투표방 만들기
        </button>
        {createRoomOpen && <CreateRoomModal onClose={() => setCreateRoomOpen(false)} onCreate={(newRoom) => {
          const id = `room-${Date.now()}`
          setRooms(prev => ({ ...prev, [id]: newRoom }))
          setCurrentRoom(id)
          setCreateRoomOpen(false)
        }} />}
      </div>
    )
  }

  return (
    <>
      <div className="px-8 max-md:px-4 pb-8">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <h1 className="text-lg font-extrabold">{room.title} 투표방</h1>
          <span className="bg-[#f3f0ff] text-[#7c5cff] px-2.5 py-1 rounded-full text-xs font-semibold">
            👥 {room.participants.length}명
          </span>
          <div className="ml-auto flex gap-2">
            {isCreator ? (
              <button onClick={handleDeleteRoom} className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition">
                삭제
              </button>
            ) : (
              <button onClick={handleLeaveRoom} className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-[#7c5cff] hover:text-[#7c5cff] transition">
                나가기
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_280px] max-xl:grid-cols-1 gap-5">
          <div>
            <div className="bg-white rounded-2xl p-6 max-md:p-4 shadow-sm flex items-center gap-5 max-md:gap-3 mb-4">
              <div className="w-20 h-20 max-md:w-14 max-md:h-14 rounded-full bg-gradient-to-br from-[#faf3ff] to-[#ede4ff] grid place-items-center text-4xl max-md:text-2xl shrink-0">
                {room.icon}
              </div>
              <div>
                <h2 className="text-xl max-md:text-base font-extrabold mb-1">{room.title}</h2>
                <p className="text-sm max-md:text-xs text-gray-500 mb-2.5">{room.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">👤 {room.creator}</span>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">🗓️ {room.createdAt}</span>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">⏰ {room.deadline}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 border-b border-gray-200 mb-4">
              {[
                { id: 'recommend', label: '영화 추천' },
                { id: 'rooms', label: '투표 진행 중' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition ${
                    tab === item.id ? 'text-[#7c5cff] border-[#7c5cff]' : 'text-gray-400 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === 'recommend' && (
              <div className="bg-white rounded-2xl p-6 max-md:p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold">영화 추천 리스트</h3>
                  <button onClick={() => setAddMovieOpen(true)} className="px-3.5 py-2 bg-[#7c5cff] text-white rounded-full text-xs font-bold hover:bg-[#5d3ee8] transition">
                    + 영화 추천하기
                  </button>
                </div>

                {loadingMovies ? (
                  <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3.5">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="aspect-[2/3] rounded-xl bg-gray-200 mb-2.5" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3.5">
                    {room.movies.map(movie => {
                      const isVoted = room.myVote === movie.id

                      return (
                        <div key={movie.id} className="relative cursor-pointer hover:-translate-y-1 transition">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteMovie(movie.id) }}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center text-sm hover:bg-red-500 transition"
                            title="영화 삭제"
                          >
                            ×
                          </button>
                          {movie.posterPath ? (
                            <img
                              src={movie.posterPath}
                              alt={movie.title}
                              className="aspect-[2/3] rounded-xl object-cover w-full shadow-sm mb-2.5"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${movie.gradient} grid place-items-center text-white font-extrabold text-base p-3 text-center shadow-sm mb-2.5`}>
                              {movie.title}
                            </div>
                          )}
                          <p className="text-sm font-bold mb-1 truncate">{movie.title}</p>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{movie.reason}</p>
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="text-gray-500">{movie.author}</span>
                            {movie.rating && <span className="font-semibold text-gray-500">⭐ {movie.rating}</span>}
                          </div>
                          <button
                            onClick={() => handleVote(movie.id)}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition ${
                              isVoted ? 'bg-[#7c5cff] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#f3f0ff] hover:text-[#7c5cff]'
                            }`}
                          >
                            {isVoted ? '✓ 투표 완료' : '🗳️ 투표하기'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'rooms' && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-end mb-2">
                  <button onClick={() => setCreateRoomOpen(true)} className="px-4 py-2 bg-[#7c5cff] text-white rounded-full text-xs font-bold hover:bg-[#5d3ee8] transition">
                    + 새 투표방 만들기
                  </button>
                </div>
                {Object.entries(rooms).map(([id, item]) => (
                  <div
                    key={id}
                    onClick={() => { setCurrentRoom(id); setTab('recommend') }}
                    className={`bg-white rounded-2xl p-5 max-md:p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition border-2 ${
                      currentRoom === id ? 'border-[#7c5cff] bg-gradient-to-r from-[#faf8ff] to-white' : 'border-transparent'
                    }`}
                  >
                    <div className="w-14 h-14 max-md:w-10 max-md:h-10 rounded-full bg-gradient-to-br from-[#faf3ff] to-[#ede4ff] grid place-items-center text-2xl max-md:text-lg shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-extrabold">{item.title}</h4>
                        {currentRoom === id && <span className="text-[10px] font-bold bg-[#7c5cff] text-white px-2 py-0.5 rounded-full">참여 중</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{item.participants.length}명 참여 · ⏰ {item.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <ParticipantsCard room={room} onInvite={() => setInviteOpen(true)} />
            <VoteStatusCard room={room} totalVotes={getTotalVotes()} />
          </aside>
        </div>
      </div>

      {createRoomOpen && <CreateRoomModal onClose={() => setCreateRoomOpen(false)} onCreate={(newRoom) => {
        const id = `room-${Date.now()}`
        setRooms(prev => ({ ...prev, [id]: newRoom }))
        setCurrentRoom(id)
        setTab('recommend')
        setCreateRoomOpen(false)
      }} />}

      {addMovieOpen && <AddMovieToRoomModal onClose={() => setAddMovieOpen(false)} onAdd={(movie) => {
        setRooms(prev => ({
          ...prev,
          [currentRoom]: {
            ...prev[currentRoom],
            movies: [...prev[currentRoom].movies, movie],
            votes: { ...prev[currentRoom].votes, [movie.id]: 0 },
          },
        }))
        setAddMovieOpen(false)
      }} />}

      {inviteOpen && <InviteFriendModal onClose={() => setInviteOpen(false)} onInvite={(friends) => {
        setRooms(prev => ({
          ...prev,
          [currentRoom]: {
            ...prev[currentRoom],
            participants: [...prev[currentRoom].participants, ...friends],
          },
        }))
        setInviteOpen(false)
      }} currentParticipants={room.participants.map(p => p.name)} />}
    </>
  )
}

function ParticipantsCard({ room, onInvite }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-extrabold mb-3">참여자 ({room.participants.length})</h3>
      <div className="grid grid-cols-4 gap-3">
        {room.participants.map(person => (
          <div key={person.name} className="flex flex-col items-center gap-1">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${person.color} grid place-items-center text-white font-bold text-sm`}>
              {person.initial}
            </div>
            <span className="text-[11px] font-semibold">{person.name}</span>
            {person.role && <span className="text-[9px] text-[#7c5cff] font-bold">{person.role}</span>}
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onInvite}
            className="w-11 h-11 rounded-full border-2 border-dashed border-gray-300 grid place-items-center text-gray-400 text-lg hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
          >
            +
          </button>
          <span className="text-[11px] font-semibold text-gray-400">초대</span>
        </div>
      </div>
    </div>
  )
}

function VoteStatusCard({ room, totalVotes }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-extrabold mb-3">투표 현황</h3>
      <div className="flex flex-col gap-2.5">
        {[...room.movies]
          .sort((a, b) => (room.votes[b.id] || 0) - (room.votes[a.id] || 0))
          .map((movie, index) => {
            const count = room.votes[movie.id] || 0
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0

            return (
              <div key={movie.id} className="flex items-center gap-2">
                <span className="text-xs font-extrabold w-3">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold truncate pr-2">{movie.title}</p>
                    <span className="text-[10px] text-gray-500 shrink-0">{count}표 ({percent}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7c5cff] to-[#9b85ff] rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      {room.myVote && <p className="text-[10px] text-[#7c5cff] font-semibold mt-3">✓ 투표 완료</p>}
    </div>
  )
}

function CreateRoomModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [deadlineEnabled, setDeadlineEnabled] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('23:59')
  const [selectedFriends, setSelectedFriends] = useState([])
  const { friends } = useFriends()

  const toggleFriend = (name) => {
    setSelectedFriends(prev => prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name])
  }

  const handleCreate = () => {
    if (!title.trim()) return

    const participants = [
      { name: '송이', initial: '송', color: 'from-[#ffd6a5] to-[#fdb88a]', role: '방장' },
      ...selectedFriends.map(name => {
        const friend = friends.find(item => item.name === name)
        return { name: friend.name, initial: friend.initial, color: friend.color }
      }),
    ]

    const deadlineStr = deadlineEnabled && deadline ? `${deadline} ${deadlineTime}` : '미정'

    onCreate({
      title: title.trim(),
      desc: desc.trim() || '함께 볼 영화를 골라보아요!',
      icon: '🎬',
      creator: '송이',
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      deadline: deadlineStr,
      participants,
      movies: [],
      votes: {},
      myVote: null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-[420px] max-h-[85vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">새 투표방 만들기</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">×</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">투표방 이름 <span className="text-red-500">*</span></label>
          <input value={title} onChange={event => setTitle(event.target.value)} placeholder="예: 주말에 뭐 볼까?" className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            친구 초대 <span className="text-red-500">*</span>
            {selectedFriends.length > 0 && <span className="text-[#7c5cff] ml-1">({selectedFriends.length}명 선택)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {friends.map(friend => (
              <button
                key={friend.name}
                onClick={() => toggleFriend(friend.name)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-full text-xs font-semibold transition ${
                  selectedFriends.includes(friend.name) ? 'border-[#7c5cff] bg-[#faf8ff] text-[#7c5cff]' : 'border-gray-200 text-gray-500 hover:border-[#9b85ff]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${friend.color} grid place-items-center text-white text-[10px] font-bold`}>{friend.initial}</div>
                {friend.name}
                {selectedFriends.includes(friend.name) && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">설명 <span className="text-gray-400 font-normal">(선택)</span></label>
          <input value={desc} onChange={event => setDesc(event.target.value)} placeholder="함께 볼 영화를 골라보아요!" className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold">투표 종료 시간</label>
            <button
              onClick={() => setDeadlineEnabled(!deadlineEnabled)}
              className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ${deadlineEnabled ? 'bg-[#7c5cff]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${deadlineEnabled ? 'right-[3px]' : 'left-[3px]'}`} />
            </button>
          </div>
          {deadlineEnabled && (
            <div className="flex gap-2 animate-[fadeIn_0.2s_ease]">
              <input type="date" value={deadline} onChange={event => setDeadline(event.target.value)} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
              <input type="time" value={deadlineTime} onChange={event => setDeadlineTime(event.target.value)} className="w-[110px] px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
            </div>
          )}
          {!deadlineEnabled && <p className="text-[10px] text-gray-400">설정하지 않으면 수동으로 종료할 수 있어요.</p>}
        </div>

        <button
          onClick={handleCreate}
          disabled={!title.trim() || selectedFriends.length === 0}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${
            title.trim() && selectedFriends.length > 0 ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          투표방 만들기
        </button>
      </div>
    </div>
  )
}

function InviteFriendModal({ onClose, onInvite, currentParticipants }) {
  const [selected, setSelected] = useState([])
  const { friends: allFriends } = useFriends()
  const friends = allFriends.filter(friend => !currentParticipants.includes(friend.name))

  const toggle = (name) => {
    setSelected(prev => prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name])
  }

  const handleInvite = () => {
    if (selected.length === 0) return

    const invited = selected.map(name => {
      const friend = friends.find(item => item.name === name)
      return { name: friend.name, initial: friend.initial, color: friend.color }
    })

    onInvite(invited)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-[380px] shadow-xl animate-[modalIn_0.25s_ease]" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">친구 초대</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">×</button>
        </div>
        {friends.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">초대할 수 있는 친구가 없어요.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-5">
            {friends.map(friend => (
              <div
                key={friend.name}
                onClick={() => toggle(friend.name)}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                  selected.includes(friend.name) ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'
                }`}
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${friend.color} grid place-items-center text-white font-bold text-sm`}>{friend.initial}</div>
                <span className="text-sm font-semibold flex-1">{friend.name}</span>
                <span className={`w-6 h-6 rounded-full border grid place-items-center text-xs transition ${selected.includes(friend.name) ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400'}`}>
                  {selected.includes(friend.name) ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleInvite}
          disabled={selected.length === 0}
          className={`w-full py-3 rounded-xl text-sm font-bold transition ${
            selected.length > 0 ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selected.length > 0 ? `초대하기 (${selected.length}명)` : '친구를 선택하세요'}
        </button>
      </div>
    </div>
  )
}

function AddMovieToRoomModal({ onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    const load = async () => {
      setLoading(true)
      try {
        const data = query.trim()
          ? await searchMovies(query.trim())
          : (await getPopularMoviesWithOtt()).results

        if (!ignore) setResults((data || []).slice(0, 8))
      } catch (error) {
        console.error('[VoteRoom search]', error)
        if (!ignore) setResults([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    const timer = setTimeout(load, query.trim() ? 300 : 0)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [query])

  const handleAdd = () => {
    if (!selected) return
    onAdd({
      ...toVoteMovie(selected, Date.now()),
      reason: reason || selected.overview || '이 영화 같이 보면 좋을 것 같아요.',
      author: '송이',
      likes: 0,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">영화 추천하기</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">×</button>
        </div>

        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔎</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="영화 제목을 검색하세요"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition"
          />
        </div>

        <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto mb-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">영화를 불러오는 중...</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">검색 결과가 없어요.</p>
          ) : (
            results.map(movie => (
              <div
                key={movie.id}
                onClick={() => setSelected(selected?.id === movie.id ? null : movie)}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                  selected?.id === movie.id ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'
                }`}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-10 h-14 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-[#2d1b4e] to-[#4a3268] grid place-items-center text-white text-[9px] font-bold shrink-0">
                    {movie.title?.slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{movie.title}</p>
                  <p className="text-[11px] text-gray-500">{movie.release_date?.slice(0, 4) || '연도 미상'} · ⭐ {movie.vote_average ? (movie.vote_average / 2).toFixed(1) : '-'}</p>
                </div>
                <span className={`w-7 h-7 rounded-full border grid place-items-center text-sm transition ${selected?.id === movie.id ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400'}`}>
                  {selected?.id === movie.id ? '✓' : '+'}
                </span>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="mb-4 animate-[fadeIn_0.2s_ease]">
            <label className="block text-sm font-bold mb-1.5">추천 이유</label>
            <input
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder="이 영화를 추천하는 이유"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]"
            />
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!selected}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${
            selected ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selected ? '추천 완료' : '영화를 선택하세요'}
        </button>
      </div>
    </div>
  )
}
