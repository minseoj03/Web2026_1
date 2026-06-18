import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../Toast'

export default function ProfileEditModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [bio, setBio] = useState(user?.bio || '영화가 좋은 사람 🎬')
  const [avatarColor, setAvatarColor] = useState(user?.color || 'from-[#ffd6a5] to-[#fdb88a]')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setNickname(user?.nickname || '')
    setBio(user?.bio || '영화가 좋은 사람 🎬')
    setAvatarColor(user?.color || 'from-[#ffd6a5] to-[#fdb88a]')
  }, [isOpen, user?.bio, user?.color, user?.nickname])

  if (!isOpen) return null

  const handleSave = async () => {
    if (!nickname.trim()) return
    setSaving(true)
    // TODO [API 연결]: PUT /api/users/:id { nickname, bio }
    await new Promise(r => setTimeout(r, 400))
    updateUser({
      nickname: nickname.trim(),
      bio: bio.trim(),
      color: avatarColor,
    })
    addToast('프로필이 수정되었어요 ✨', { type: 'success' })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose} role="dialog">
      <div className="bg-white rounded-2xl p-7 w-full max-w-[400px] shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">프로필 편집</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]" aria-label="닫기">✕</button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} grid place-items-center text-2xl font-extrabold text-white`}>
            {nickname[0] || '?'}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">프로필 색상</p>
            <div className="flex gap-1.5">
              {[
                'from-[#ffd6a5] to-[#fdb88a]',
                'from-[#fda4af] to-[#f43f5e]',
                'from-[#93c5fd] to-[#2563eb]',
                'from-[#d8b4fe] to-[#9333ea]',
                'from-[#86efac] to-[#16a34a]',
              ].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} border-2 ${avatarColor === color ? 'border-[#7c5cff] scale-110' : 'border-white'} shadow-sm transition`}
                  aria-label="프로필 색상 선택"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">닉네임</label>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={12}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]"
          />
          <p className="text-[10px] text-gray-400 mt-1 text-right">{nickname.length}/12</p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-bold mb-1.5">소개말</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={50}
            rows={2}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] resize-none"
          />
          <p className="text-[10px] text-gray-400 mt-1 text-right">{bio.length}/50</p>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold hover:border-[#7c5cff] hover:text-[#7c5cff] transition">취소</button>
          <button
            onClick={handleSave}
            disabled={!nickname.trim() || saving}
            className="flex-1 py-2.5 bg-[#7c5cff] text-white rounded-xl text-sm font-bold hover:bg-[#5d3ee8] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
