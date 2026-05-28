import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriends } from '../contexts/FriendContext'

// [API 연결 후 삭제] 하드코딩 투표방 데이터
// TODO [API 연결]: GET /api/rooms, POST /api/rooms/:id/vote, DELETE /api/rooms/:id
const initialRooms = {
  room1: {
    title: '주말에 뭐 볼까?', desc: '주말 밤에 다 같이 볼 영화를 골라보아요! 🎬', icon: '🍿',
    creator: '송이', createdAt: '2025.05.20', deadline: '05.20 (토) 23:59',
    participants: [
      { name: '송이', initial: '송', color: 'from-[#ffd6a5] to-[#fdb88a]', role: '방장' },
      { name: '민지', initial: '민', color: 'from-[#fda4af] to-[#f43f5e]' },
      { name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]' },
      { name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]' },
    ],
    movies: [
      { id: 'm1', title: '라라랜드', gradient: 'from-[#fef3c7] to-[#fbbf24]', reason: '음악이 너무 좋고 힐링되는 영화에요 💜', author: '민지', likes: 3 },
      { id: 'm2', title: '인터스텔라', gradient: 'from-[#1e3a8a] to-[#3b82f6]', reason: '스토리도 깊고 영상미가 최고에요!', author: '우진', likes: 4 },
      { id: 'm3', title: '어바웃 타임', gradient: 'from-[#2d1b4e] to-[#4a3268]', reason: '따뜻하고 사랑스러운 영화 추천해요 😊', author: '세영', likes: 5 },
    ],
    votes: { 'm1': 1, 'm2': 2, 'm3': 3 }, // movieId: 투표 수
    myVote: null, // 내가 투표한 movieId
  },
  room2: {
    title: '금요일 영화의 밤', desc: '금요일 저녁에 다 같이 볼 액션 영화 정해요!', icon: '🎬',
    creator: '호준', createdAt: '2025.05.18', deadline: '05.22 (금) 21:00',
    participants: [
      { name: '송이', initial: '송', color: 'from-[#ffd6a5] to-[#fdb88a]' },
      { name: '호준', initial: '호', color: 'from-[#fbbf24] to-[#f59e0b]', role: '방장' },
    ],
    movies: [
      { id: 'm4', title: '스파이더맨', gradient: 'from-[#dc2626] to-[#ef4444]', reason: '3세대 스파이더맨 총출동!', author: '호준', likes: 3 },
      { id: 'm5', title: '탑건: 매버릭', gradient: 'from-[#1e3a8a] to-[#0ea5e9]', reason: '비행 장면 IMAX로 보면 소름', author: '송이', likes: 2 },
    ],
    votes: { 'm4': 1, 'm5': 1 },
    myVote: null,
  },
}

export default function VoteRoom() {
  const { user } = useAuth()
  const [currentRoom, setCurrentRoom] = useState('room1')
  const [tab, setTab] = useState('recommend')
  const [rooms, setRooms] = useState(initialRooms)
  const [createRoomOpen, setCreateRoomOpen] = useState(false)
  const [addMovieOpen, setAddMovieOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const room = rooms[currentRoom]
  const displayName = user?.nickname || '송이'
  const isCreator = room?.creator === displayName

  // 투표하기 (단일 투표: 1인 1표)
  const handleVote = (movieId) => {
    setRooms(prev => {
      const r = prev[currentRoom]
      const oldVote = r.myVote
      const newVotes = { ...r.votes }
      // 이전 투표 취소
      if (oldVote) newVotes[oldVote] = Math.max(0, (newVotes[oldVote] || 0) - 1)
      // 새 투표 (같은 영화 다시 클릭하면 취소만)
      const newMyVote = oldVote === movieId ? null : movieId
      if (newMyVote) newVotes[newMyVote] = (newVotes[newMyVote] || 0) + 1
      return { ...prev, [currentRoom]: { ...r, votes: newVotes, myVote: newMyVote } }
    })
  }

  // 투표방 삭제 (방장만)
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

  // 투표방 나가기
  const handleLeaveRoom = () => {
    if (!confirm('투표방을 나가시겠어요?')) return
    setRooms(prev => {
      const r = prev[currentRoom]
      return {
        ...prev,
        [currentRoom]: {
          ...r,
          participants: r.participants.filter(p => p.name !== displayName),
        }
      }
    })
    const remaining = Object.keys(rooms).filter(id => id !== currentRoom)
    setCurrentRoom(remaining[0] || '')
    setTab('rooms')
  }

  // 투표 퍼센트 계산
  const getTotalVotes = () => Object.values(room?.votes || {}).reduce((s, v) => s + v, 0)

  if (!room) return (
    <div className="px-8 pb-8 text-center py-20">
      <p className="text-lg font-bold text-gray-500">참여 중인 투표방이 없어요</p>
      <button onClick={() => setCreateRoomOpen(true)} className="mt-4 px-4 py-2 bg-[#7c5cff] text-white rounded-lg text-sm font-bold">+ 새 투표방 만들기</button>
      {createRoomOpen && <CreateRoomModal onClose={() => setCreateRoomOpen(false)} onCreate={(r) => {
        const id = `room-${Date.now()}`
        setRooms(prev => ({ ...prev, [id]: r }))
        setCurrentRoom(id)
        setCreateRoomOpen(false)
      }} />}
    </div>
  )

  return (
  <>
    <div className="px-8 max-md:px-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h1 className="text-lg font-extrabold">{room.title} 투표방</h1>
        <span className="bg-[#f3f0ff] text-[#7c5cff] px-2.5 py-1 rounded-full text-xs font-semibold">👥 {room.participants.length}명</span>
        <div className="ml-auto flex gap-2">
          {isCreator && (
            <button onClick={handleDeleteRoom} className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition">삭제</button>
          )}
          {!isCreator && (
            <button onClick={handleLeaveRoom} className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-[#7c5cff] hover:text-[#7c5cff] transition">나가기</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] max-xl:grid-cols-1 gap-5">
        {/* Center */}
        <div>
          {/* Room Info */}
          <div className="bg-white rounded-2xl p-6 max-md:p-4 shadow-sm flex items-center gap-5 max-md:gap-3 mb-4">
            <div className="w-20 h-20 max-md:w-14 max-md:h-14 rounded-full bg-gradient-to-br from-[#faf3ff] to-[#ede4ff] grid place-items-center text-4xl max-md:text-2xl shrink-0">{room.icon}</div>
            <div>
              <h2 className="text-xl max-md:text-base font-extrabold mb-1">{room.title}</h2>
              <p className="text-sm max-md:text-xs text-gray-500 mb-2.5">{room.desc}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">👤 {room.creator}</span>
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">📅 {room.createdAt}</span>
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">⏰ {room.deadline}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-4">
            {[{ id: 'recommend', label: '영화 추천' }, { id: 'rooms', label: '투표 진행 중' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition ${tab === t.id ? 'text-[#7c5cff] border-[#7c5cff]' : 'text-gray-400 border-transparent'}`}>{t.label}</button>
            ))}
          </div>

          {/* 영화 추천 탭 */}
          {tab === 'recommend' && (
            <div className="bg-white rounded-2xl p-6 max-md:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold">영화 추천 리스트</h3>
                <button onClick={() => setAddMovieOpen(true)} className="px-3.5 py-2 bg-[#7c5cff] text-white rounded-full text-xs font-bold hover:bg-[#5d3ee8] transition">+ 영화 추천하기</button>
              </div>
              <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3.5">
                {room.movies.map(m => {
                  const isVoted = room.myVote === m.id
                  return (
                    <div key={m.id} className="cursor-pointer hover:-translate-y-1 transition">
                      <div className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${m.gradient} grid place-items-center text-white font-extrabold text-base p-3 text-center shadow-sm mb-2.5`}>{m.title}</div>
                      <p className="text-sm font-bold mb-1">{m.title}</p>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{m.reason}</p>
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="text-gray-500">{m.author}</span>
                      </div>
                      {/* 투표 버튼 */}
                      <button
                        onClick={() => handleVote(m.id)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition ${isVoted ? 'bg-[#7c5cff] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#f3f0ff] hover:text-[#7c5cff]'}`}
                      >
                        {isVoted ? '✓ 투표 완료' : '🗳️ 투표하기'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 투표 진행 중 탭 */}
          {tab === 'rooms' && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end mb-2">
                <button onClick={() => setCreateRoomOpen(true)} className="px-4 py-2 bg-[#7c5cff] text-white rounded-full text-xs font-bold hover:bg-[#5d3ee8] transition">+ 새 투표방 만들기</button>
              </div>
              {Object.entries(rooms).map(([id, r]) => (
                <div
                  key={id}
                  onClick={() => { setCurrentRoom(id); setTab('recommend') }}
                  className={`bg-white rounded-2xl p-5 max-md:p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition border-2 ${currentRoom === id ? 'border-[#7c5cff] bg-gradient-to-r from-[#faf8ff] to-white' : 'border-transparent'}`}
                >
                  <div className="w-14 h-14 max-md:w-10 max-md:h-10 rounded-full bg-gradient-to-br from-[#faf3ff] to-[#ede4ff] grid place-items-center text-2xl max-md:text-lg shrink-0">{r.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-extrabold">{r.title}</h4>
                      {currentRoom === id && <span className="text-[10px] font-bold bg-[#7c5cff] text-white px-2 py-0.5 rounded-full">참여 중</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{r.desc}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{r.participants.length}명 참여 · ⏰ {r.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-extrabold mb-3">참여자 ({room.participants.length})</h3>
            <div className="grid grid-cols-4 gap-3">
              {room.participants.map(p => (
                <div key={p.name} className="flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${p.color} grid place-items-center text-white font-bold text-sm`}>{p.initial}</div>
                  <span className="text-[11px] font-semibold">{p.name}</span>
                  {p.role && <span className="text-[9px] text-[#7c5cff] font-bold">{p.role}</span>}
                </div>
              ))}
              {/* 친구 초대 버튼 */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setInviteOpen(true)}
                  className="w-11 h-11 rounded-full border-2 border-dashed border-gray-300 grid place-items-center text-gray-400 text-lg hover:border-[#7c5cff] hover:text-[#7c5cff] transition"
                >
                  +
                </button>
                <span className="text-[11px] font-semibold text-gray-400">초대</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-extrabold mb-3">투표 현황</h3>
            <div className="flex flex-col gap-2.5">
              {room.movies
                .sort((a, b) => (room.votes[b.id] || 0) - (room.votes[a.id] || 0))
                .map((m, i) => {
                  const total = getTotalVotes()
                  const count = room.votes[m.id] || 0
                  const percent = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={m.id} className="flex items-center gap-2">
                      <span className="text-xs font-extrabold w-3">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-bold">{m.title}</p>
                          <span className="text-[10px] text-gray-500">{count}표 ({percent}%)</span>
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
        </aside>
      </div>
    </div>

    {/* 모달 */}
    {createRoomOpen && <CreateRoomModal onClose={() => setCreateRoomOpen(false)} onCreate={(r) => {
      const id = `room-${Date.now()}`
      setRooms(prev => ({ ...prev, [id]: r }))
      setCurrentRoom(id)
      setTab('recommend')
      setCreateRoomOpen(false)
    }} />}
    {addMovieOpen && <AddMovieToRoomModal onClose={() => setAddMovieOpen(false)} onAdd={(movie) => {
      setRooms(prev => ({
        ...prev,
        [currentRoom]: { ...prev[currentRoom], movies: [...prev[currentRoom].movies, movie] }
      }))
      setAddMovieOpen(false)
    }} />}
    {inviteOpen && <InviteFriendModal onClose={() => setInviteOpen(false)} onInvite={(friends) => {
      setRooms(prev => ({
        ...prev,
        [currentRoom]: { ...prev[currentRoom], participants: [...prev[currentRoom].participants, ...friends] }
      }))
      setInviteOpen(false)
    }} currentParticipants={room.participants.map(p => p.name)} />}
  </>
  )
}

// 새 투표방 만들기 모달
function CreateRoomModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [deadlineEnabled, setDeadlineEnabled] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('23:59')
  const [selectedFriends, setSelectedFriends] = useState([])
  const { friends } = useFriends()

  const toggleFriend = (name) => {
    setSelectedFriends(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const handleCreate = () => {
    if (!title.trim()) return
    const participants = [
      { name: '송이', initial: '송', color: 'from-[#ffd6a5] to-[#fdb88a]', role: '방장' },
      ...selectedFriends.map(name => {
        const f = friends.find(fr => fr.name === name)
        return { name: f.name, initial: f.initial, color: f.color }
      })
    ]
    const deadlineStr = deadlineEnabled && deadline ? `${deadline} ${deadlineTime}` : '미정'
    onCreate({ title: title.trim(), desc: desc.trim() || '함께 볼 영화를 골라보아요!', icon: '🎬', creator: '송이', createdAt: new Date().toISOString().slice(0,10).replace(/-/g,'.'), deadline: deadlineStr, participants, movies: [], votes: {}, myVote: null })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-[420px] max-h-[85vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">새 투표방 만들기</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">✕</button>
        </div>

        {/* [1] 투표방 이름 (필수) */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">투표방 이름 <span className="text-red-500">*</span></label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 주말에 뭐 볼까?" className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
        </div>

        {/* [2] 친구 초대 (필수 느낌 강조) */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            친구 초대 <span className="text-red-500">*</span>
            {selectedFriends.length > 0 && <span className="text-[#7c5cff] ml-1">({selectedFriends.length}명 선택)</span>}
          </label>
          {friends.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {friends.map(f => (
                <button
                  key={f.name}
                  onClick={() => toggleFriend(f.name)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-full text-xs font-semibold transition ${selectedFriends.includes(f.name) ? 'border-[#7c5cff] bg-[#faf8ff] text-[#7c5cff]' : 'border-gray-200 text-gray-500 hover:border-[#9b85ff]'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${f.color} grid place-items-center text-white text-[10px] font-bold`}>{f.initial}</div>
                  {f.name}
                  {selectedFriends.includes(f.name) && <span>✓</span>}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">친구를 먼저 추가해주세요.</p>
          )}
        </div>

        {/* [3] 설명 (선택) */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">설명 <span className="text-gray-400 font-normal">(선택)</span></label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="함께 볼 영화를 골라보아요!" className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
        </div>

        {/* [4] 투표 종료시간 토글 */}
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
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
              <input type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} className="w-[110px] px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
            </div>
          )}
          {!deadlineEnabled && <p className="text-[10px] text-gray-400">설정하지 않으면 수동으로 종료할 수 있어요.</p>}
        </div>

        <button onClick={handleCreate} disabled={!title.trim() || selectedFriends.length === 0} className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${title.trim() && selectedFriends.length > 0 ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          투표방 만들기
        </button>
      </div>
    </div>
  )
}

// 친구 초대 모달
function InviteFriendModal({ onClose, onInvite, currentParticipants }) {
  const [selected, setSelected] = useState([])
  const { friends: allFriends } = useFriends()

  const friends = allFriends.filter(f => !currentParticipants.includes(f.name))

  const toggle = (name) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const handleInvite = () => {
    if (selected.length === 0) return
    const invited = selected.map(name => {
      const f = friends.find(fr => fr.name === name)
      return { name: f.name, initial: f.initial, color: f.color }
    })
    onInvite(invited)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-[380px] shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">친구 초대</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">✕</button>
        </div>
        {friends.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">초대할 수 있는 친구가 없어요</p>
        ) : (
          <div className="flex flex-col gap-2 mb-5">
            {friends.map(f => (
              <div
                key={f.name}
                onClick={() => toggle(f.name)}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${selected.includes(f.name) ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`}
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${f.color} grid place-items-center text-white font-bold text-sm`}>{f.initial}</div>
                <span className="text-sm font-semibold flex-1">{f.name}</span>
                <span className={`w-6 h-6 rounded-full border grid place-items-center text-xs transition ${selected.includes(f.name) ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400'}`}>
                  {selected.includes(f.name) ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleInvite}
          disabled={selected.length === 0}
          className={`w-full py-3 rounded-xl text-sm font-bold transition ${selected.length > 0 ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {selected.length > 0 ? `초대하기 (${selected.length}명)` : '친구를 선택하세요'}
        </button>
      </div>
    </div>
  )
}

// 영화 추천하기 모달
function AddMovieToRoomModal({ onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [reason, setReason] = useState('')
  const mockMovies = [
    { title: '인터스텔라', genre: 'SF', gradient: 'from-[#1e3a8a] to-[#3b82f6]' },
    { title: '라라랜드', genre: '로맨스', gradient: 'from-[#fef3c7] to-[#fbbf24]' },
    { title: '어바웃 타임', genre: '로맨스', gradient: 'from-[#2d1b4e] to-[#4a3268]' },
    { title: '기생충', genre: '스릴러', gradient: 'from-[#831843] to-[#be185d]' },
    { title: '코코', genre: '애니메이션', gradient: 'from-[#f97316] to-[#fbbf24]' },
    { title: '비포 선라이즈', genre: '로맨스', gradient: 'from-[#7c2d12] to-[#b45309]' },
    { title: '위플래쉬', genre: '드라마', gradient: 'from-[#7c2d12] to-[#ea580c]' },
  ]
  const results = query ? mockMovies.filter(m => m.title.includes(query)) : mockMovies
  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-[460px] max-h-[85vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">영화 추천하기</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">✕</button>
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="영화 제목을 검색하세요" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition" />
        </div>
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto mb-4">
          {results.map(m => (
            <div key={m.title} onClick={() => setSelected(selected?.title === m.title ? null : m)} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${selected?.title === m.title ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`}>
              <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${m.gradient} grid place-items-center text-white text-[9px] font-bold shrink-0`}>{m.title.slice(0,2)}</div>
              <div className="flex-1"><p className="text-sm font-bold">{m.title}</p><p className="text-[11px] text-gray-500">{m.genre}</p></div>
              <span className={`w-7 h-7 rounded-full border grid place-items-center text-sm transition ${selected?.title === m.title ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400'}`}>{selected?.title === m.title ? '✓' : '+'}</span>
            </div>
          ))}
        </div>
        {selected && (
          <div className="mb-4 animate-[fadeIn_0.2s_ease]">
            <label className="block text-sm font-bold mb-1.5">추천 이유</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="이 영화를 추천하는 이유" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]" />
          </div>
        )}
        <button onClick={() => { if (!selected) return; onAdd({ id: `m-${Date.now()}`, ...selected, reason: reason || '추천합니다!', author: '송이', likes: 0 }) }} disabled={!selected} className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${selected ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          {selected ? '추천 완료' : '영화를 선택하세요'}
        </button>
      </div>
    </div>
  )
}
