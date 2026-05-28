import { useState } from 'react'
import { useToast } from '../Toast'
import { useFriends } from '../../contexts/FriendContext'

export default function RecommendToFriendModal({ movie, isOpen, onClose }) {
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { addToast } = useToast()
  const { friends: allFriends } = useFriends()

  if (!isOpen || !movie) return null

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSubmit = async () => {
    if (selected.length === 0) return
    setSending(true)
    await new Promise(r => setTimeout(r, 500))
    const names = allFriends.filter(f => selected.includes(f.id)).map(f => f.name)
    addToast(`${names[0]}님${names.length > 1 ? ` 외 ${names.length - 1}명` : ''}에게 추천했어요 💜`, { type: 'success' })
    setSending(false)
    setSelected([])
    setMessage('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose} role="dialog" aria-label="친구에게 추천">
      <div className="bg-white rounded-2xl p-7 w-full max-w-[400px] shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold">친구에게 추천</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]" aria-label="닫기">✕</button>
        </div>
        <p className="text-sm text-gray-500 mb-4"><strong>{movie.title}</strong>을(를) 추천할 친구를 선택하세요.</p>

        <div className="flex flex-col gap-2 mb-4 max-h-[200px] overflow-y-auto">
          {allFriends.map(f => (
            <div
              key={f.id}
              onClick={() => toggle(f.id)}
              className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${selected.includes(f.id) ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`}
            >
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${f.color} grid place-items-center text-white font-bold text-sm`}>{f.initial}</div>
              <span className="text-sm font-semibold flex-1">{f.name}</span>
              <span className={`w-6 h-6 rounded-full border grid place-items-center text-xs transition ${selected.includes(f.id) ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400'}`}>
                {selected.includes(f.id) ? '✓' : ''}
              </span>
            </div>
          ))}
        </div>

        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="추천 메시지 (선택)"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || sending}
          className={`w-full py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${selected.length > 0 ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {sending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {sending ? '전송 중...' : selected.length > 0 ? `추천 보내기 (${selected.length}명)` : '친구를 선택하세요'}
        </button>
      </div>
    </div>
  )
}
