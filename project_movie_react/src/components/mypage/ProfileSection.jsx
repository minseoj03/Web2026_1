import { useAuth } from '../../contexts/AuthContext'

export default function ProfileSection({ stats, onEditProfile }) {
  const { user } = useAuth()
  const displayName = user?.nickname || '송이'
  const initial = displayName[0]
  const bio = user?.bio || '영화가 좋은 사람 🎬'
  const avatarColor = user?.color || 'from-[#ffd6a5] to-[#fdb88a]'

  return (
    <section className="bg-white rounded-2xl max-md:rounded-xl p-7 max-md:p-5 shadow-sm flex items-center gap-6 max-md:gap-4 mb-6 max-md:flex-col max-md:text-center">
      <div className={`w-[88px] h-[88px] max-md:w-[72px] max-md:h-[72px] rounded-full bg-gradient-to-br ${avatarColor} grid place-items-center text-3xl max-md:text-2xl font-extrabold text-white shrink-0`}>
        {initial}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2.5 mb-1 max-md:justify-center flex-wrap">
          <span className="text-xl max-md:text-lg font-extrabold">{displayName}</span>
          <button onClick={onEditProfile} className="text-[11px] font-semibold text-[#7c5cff] bg-[#f3f0ff] border border-gray-200 px-2.5 py-1 rounded-full hover:bg-[#7c5cff] hover:text-white transition">
            ✏️ 프로필 편집
          </button>
        </div>
        <p className="text-sm max-md:text-xs text-gray-500 break-words">“{bio}”</p>
      </div>
      <div className="flex gap-5 max-md:gap-3 max-md:flex-wrap max-md:justify-center">
        {[
          { label: '본 영화', value: `${stats.watched}편` },
          { label: '평균 평점', value: `⭐ ${stats.avgRating}` },
          { label: '찜한 영화', value: `${stats.wishlist}편` },
          { label: '친구', value: `${stats.friends}명` },
        ].map(s => (
          <div key={s.label} className="text-center px-4 max-md:px-3 py-3 max-md:py-2 bg-gray-100 rounded-xl">
            <p className="text-[11px] max-md:text-[10px] text-gray-500 mb-1">{s.label}</p>
            <p className="text-lg max-md:text-base font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
