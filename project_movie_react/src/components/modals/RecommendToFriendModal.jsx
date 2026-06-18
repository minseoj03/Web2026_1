import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../Toast'
import { useFriends } from '../../contexts/FriendContext'
import { sendMovieRecommendation } from '../../services/recommendApi'
import { useAuth } from '../../contexts/AuthContext'

const MESSAGE_LIMIT = 120

export default function RecommendToFriendModal({ movie, isOpen, onClose }) {
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [step, setStep] = useState('compose')
  const [sending, setSending] = useState(false)
  const { addToast } = useToast()
  const { friends: allFriends } = useFriends()
  const { user } = useAuth()

  useEffect(() => {
    if (!isOpen) {
      setSelected([])
      setMessage('')
      setQuery('')
      setStep('compose')
      setSending(false)
    }
  }, [isOpen])

  const selectedFriends = useMemo(
    () => allFriends.filter(friend => selected.includes(friend.id)),
    [allFriends, selected]
  )
  const filteredFriends = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return allFriends
    return allFriends.filter(friend => (
      friend.name.toLowerCase().includes(keyword) || friend.email.toLowerCase().includes(keyword)
    ))
  }, [allFriends, query])

  if (!isOpen || !movie) return null

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  const handleConfirm = () => {
    if (selected.length === 0 || !message.trim()) return
    setStep('confirm')
  }

  const handleSubmit = async () => {
    if (selectedFriends.length === 0 || !message.trim()) return
    setSending(true)

    try {
      await sendMovieRecommendation(movie, selectedFriends, message, user?.id)
      const targetText = selectedFriends.length === 1
        ? `${selectedFriends[0].name}님`
        : `${selectedFriends[0].name}님 외 ${selectedFriends.length - 1}명`
      addToast(`${targetText}에게 "${movie.title}"을 추천했어요 💜`, { type: 'success', duration: 4000 })
      onClose()
    } catch (error) {
      console.error('[Movie recommendation]', error)
      addToast('추천을 보내지 못했어요. 다시 시도해주세요.', { type: 'error' })
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/55 z-[1000] grid place-items-center p-4" onClick={onClose} role="dialog" aria-label="친구에게 영화 추천">
      <div className="bg-white rounded-2xl p-7 w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold text-[#7c5cff] mb-1">PERSONAL MOVIE PICK</p>
            <h2 className="text-lg font-extrabold">친구에게 영화 추천</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]" aria-label="닫기">×</button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl mb-5">
          {movie.posterPath ? (
            <img src={movie.posterPath} alt={movie.title} className="w-12 h-[68px] rounded-lg object-cover shrink-0" />
          ) : (
            <div className={`w-12 h-[68px] rounded-lg bg-gradient-to-br ${movie.gradient || 'from-[#2d1b4e] to-[#4a3268]'} grid place-items-center text-white text-[10px] font-bold shrink-0`}>
              {movie.title.slice(0, 3)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-extrabold truncate">{movie.title}</p>
            <p className="text-xs text-gray-500 mt-1">{movie.genre || '영화'}{movie.rating ? ` · ★ ${movie.rating}` : ''}</p>
            <p className="text-[11px] text-[#7c5cff] font-semibold mt-1">내가 고른 영화를 개인 메시지와 함께 보내요.</p>
          </div>
        </div>

        {step === 'compose' ? (
          <>
            <label className="block text-sm font-bold mb-2">
              추천할 친구 <span className="text-[#7c5cff]">{selected.length > 0 ? `${selected.length}명 선택` : ''}</span>
            </label>
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">🔎</span>
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="친구 이름 또는 이메일 검색"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]"
              />
            </div>

            <div className="flex flex-col gap-2 mb-5 max-h-[190px] overflow-y-auto pr-1">
              {filteredFriends.map(friend => (
                <button
                  type="button"
                  key={friend.id}
                  onClick={() => toggle(friend.id)}
                  className={`flex items-center gap-3 p-3 border rounded-xl text-left transition ${selected.includes(friend.id) ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`}
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${friend.color} grid place-items-center text-white font-bold text-sm shrink-0`}>{friend.initial}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{friend.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{friend.email}</p>
                    {friend.favoriteGenres?.length > 0 && (
                      <p className="text-[10px] text-[#7c5cff] mt-0.5 truncate">취향: {friend.favoriteGenres.join(' · ')}</p>
                    )}
                  </div>
                  <span className={`w-6 h-6 rounded-full border grid place-items-center text-xs ${selected.includes(friend.id) ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400'}`}>
                    {selected.includes(friend.id) ? '✓' : '+'}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold">개인 추천 메시지 <span className="text-red-500">*</span></label>
                <span className="text-[10px] text-gray-400">{message.length}/{MESSAGE_LIMIT}</span>
              </div>
              <textarea
                value={message}
                onChange={event => setMessage(event.target.value.slice(0, MESSAGE_LIMIT))}
                rows={3}
                placeholder="예: 네가 좋아하는 SF 장르라서 꼭 추천하고 싶었어!"
                className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] resize-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['네 취향일 것 같아서 추천해!', '같이 이야기해보고 싶은 영화야.', '내가 정말 재미있게 봤어!'].map(example => (
                  <button key={example} type="button" onClick={() => setMessage(example)} className="px-2.5 py-1.5 bg-gray-100 rounded-full text-[10px] text-gray-500 hover:bg-[#f3f0ff] hover:text-[#7c5cff] transition">
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={selected.length === 0 || !message.trim()}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${selected.length > 0 && message.trim() ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              추천 내용 확인하기
            </button>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-[#9b85ff] bg-[#faf8ff] p-4 mb-4">
              <p className="text-xs font-bold text-[#7c5cff] mb-3">전송 전 마지막 확인</p>
              <div className="flex -space-x-2 mb-3">
                {selectedFriends.map(friend => (
                  <div key={friend.id} title={friend.name} className={`w-9 h-9 rounded-full bg-gradient-to-br ${friend.color} border-2 border-white grid place-items-center text-white font-bold text-xs`}>
                    {friend.initial}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold mb-1">
                {selectedFriends.map(friend => friend.name).join(', ')}님에게
              </p>
              <p className="text-sm text-gray-600 mb-3"><strong>“{movie.title}”</strong>을(를) 추천합니다.</p>
              <blockquote className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600 leading-relaxed">
                “{message}”
              </blockquote>
              <p className="text-[11px] text-gray-400 mt-3">친구의 추천 알림과 주고받은 추천 기록에 전달됩니다.</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep('compose')} disabled={sending} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold hover:border-[#7c5cff] hover:text-[#7c5cff] transition">
                이전
              </button>
              <button onClick={handleSubmit} disabled={sending} className="flex-[2] py-3 rounded-xl bg-[#7c5cff] text-white text-sm font-bold hover:bg-[#5d3ee8] transition flex items-center justify-center gap-2">
                {sending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {sending ? '추천 전송 중...' : `추천 보내기 (${selectedFriends.length}명)`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
