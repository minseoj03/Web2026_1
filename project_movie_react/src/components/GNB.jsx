import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFilter } from '../contexts/FilterContext'
import { useNotif } from '../contexts/NotifContext'
import { useFriends } from '../contexts/FriendContext'
import { getDiscoverableUsers } from '../data/mockUsers'

export default function GNB({ isMobile, onHamburgerClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [friendModalOpen, setFriendModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const { ottOnly, toggleOttOnly } = useFilter()
  const { unreadCount } = useNotif()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const displayName = user?.nickname || '송이'
  const initial = displayName[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <>
      <header className="sticky top-0 bg-gray-100 z-40 flex items-center gap-3 px-8 py-3.5 max-md:px-4 max-md:gap-2 transition-colors duration-300">
        {/* Hamburger (mobile) */}
        {isMobile && (
          <button onClick={onHamburgerClick} className="-ml-2 -mt-1 w-10 h-10 rounded-lg bg-gray-50 grid place-items-center text-4xl text-[#7c5cff] shrink-0" aria-label="메뉴">
            ≡
          </button>
        )}

        {/* OTT Filter: 텍스트 + 토글 */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-semibold text-gray-700">내 구독 OTT만 추천</span>
          <button onClick={toggleOttOnly} className={`w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0 ${ottOnly ? 'bg-[#7c5cff]' : 'bg-gray-300'}`} aria-label="OTT 필터">
            <span className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow transition-all duration-200 ${ottOnly ? 'right-[3px]' : 'left-[3px]'}`} />
          </button>
        </div>

        {/* Notification */}
        <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f0ff] transition shrink-0">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3a1.5 1.5 0 0 0-1.5 1.5v.3C8.1 5.5 6.5 7.8 6.5 10.5v4l-1.8 2.2a.8.8 0 0 0 .6 1.3h13.4a.8.8 0 0 0 .6-1.3l-1.8-2.2v-4c0-2.7-1.6-5-4-5.7v-.3A1.5 1.5 0 0 0 12 3z" fill="#7c5cff"/>
            <circle cx="12" cy="20.5" r="1.8" fill="#7c5cff"/>
          </svg>
          {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-extrabold rounded-full grid place-items-center px-0.5 border-[1.5px] border-gray-50">{unreadCount}</span>}
        </Link>

        {/* Profile */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1.5 px-2.5 py-1 pl-1 border border-gray-200 rounded-full bg-white cursor-pointer hover:border-[#9b85ff] transition">
            <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${user?.color || 'from-[#ffd6a5] to-[#fdb88a]'} grid place-items-center text-white text-xs font-bold shrink-0`}>{initial}</span>
            <span className="text-xs font-semibold max-md:hidden">{displayName}</span>
            <span className="text-gray-400 text-[10px]">▾</span>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50 animate-[fadeIn_0.15s_ease]">
              <button onClick={() => { setFriendModalOpen(true); setDropdownOpen(false) }} className="block w-full text-left px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#f3f0ff] hover:text-[#7c5cff] transition">친구 추가</button>
              <button onClick={() => { logout(); navigate('/login'); setDropdownOpen(false) }} className="block w-full text-left px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#f3f0ff] hover:text-[#7c5cff] transition">로그아웃</button>
            </div>
          )}
        </div>
      </header>

      {friendModalOpen && <AddFriendModal onClose={() => setFriendModalOpen(false)} />}
    </>
  )
}

function AddFriendModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [added, setAdded] = useState([])
  const { user } = useAuth()
  const { friends, addFriend } = useFriends()
  const users = getDiscoverableUsers(user?.id, friends.map(friend => friend.id))

  const filtered = query ? users.filter(u => u.email.includes(query.toLowerCase()) || u.name.includes(query)) : users
  const toggleAdd = (email) => setAdded(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email])

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-[440px] shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold">친구 추가</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]">✕</button>
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="이메일을 검색하세요" className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition" />
        </div>
        <p className="text-xs font-bold text-gray-500 mb-2.5">{query ? `"${query}" 검색 결과 ${filtered.length}명` : '추천 친구'}</p>
        <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto mb-5">
          {filtered.map(u => (
            <div key={u.email} className={`flex items-center gap-3 p-3 border rounded-xl transition cursor-pointer ${added.includes(u.email) ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`} onClick={() => toggleAdd(u.email)}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${u.color} grid place-items-center text-white font-extrabold text-sm shrink-0`}>{u.initial}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">{u.name}</div>
                <div className="text-[11px] text-gray-500">{u.email}</div>
                <div className="text-[10px] text-[#7c5cff] mt-0.5 truncate">{u.favoriteGenres.join(' · ')}</div>
              </div>
              <span className={`w-8 h-8 rounded-full border grid place-items-center text-base shrink-0 transition ${added.includes(u.email) ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-[#7c5cff] hover:text-white hover:border-[#7c5cff]'}`}>{added.includes(u.email) ? '✓' : '+'}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { if (added.length > 0) { added.forEach(email => { const u = users.find(x => x.email === email); addFriend(email, u?.name) }); alert('친구가 추가되었어요!'); onClose() } }} className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${added.length > 0 ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          {added.length > 0 ? `추가 완료 (${added.length}명)` : '추가 완료'}
        </button>
      </div>
    </div>
  )
}
