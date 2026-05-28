import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

export default function Settings() {
  const { user, updateUser, toggleOtt, toggleTheme } = useAuth()
  const { addToast } = useToast()
  const [verified, setVerified] = useState(user?.verified || false)

  const userOtt = user?.ott || []

  const ottOptions = [
    { id: 'netflix', label: '넷플릭스', initial: 'N', color: 'bg-[#e50914]' },
    { id: 'wavve', label: '웨이브', initial: 'W', color: 'bg-[#1a73e8]' },
    { id: 'disney', label: '디즈니+', initial: 'D+', color: 'bg-[#113cff]' },
    { id: 'tving', label: '티빙', initial: 'T', color: 'bg-[#ff153c]' },
    { id: 'coupang', label: '쿠팡플레이', initial: 'C', color: 'bg-[#00b8e6]' },
    { id: 'watcha', label: '왓챠', initial: 'W', color: 'bg-[#ff0558]' },
  ]

  const handleOttToggle = (id) => {
    toggleOtt(id)
    addToast('저장되었어요 ✓', { type: 'success', duration: 1500 })
  }

  const handleLangChange = (e) => {
    updateUser({ lang: e.target.value })
    addToast('저장되었어요 ✓', { type: 'success', duration: 1500 })
  }

  const handleRegionChange = (e) => {
    updateUser({ region: e.target.value })
    addToast('저장되었어요 ✓', { type: 'success', duration: 1500 })
  }

  const handleThemeToggle = () => {
    toggleTheme()
    addToast('저장되었어요 ✓', { type: 'success', duration: 1500 })
  }

  return (
    <div className="fluid-px pb-8 flex flex-col items-center">
      <div className="w-full max-w-[640px]">
      <h1 className="text-2xl font-extrabold mb-1">⚙️ 설정</h1>
      <p className="text-sm text-gray-500 mb-6">서비스 이용 환경을 설정해보세요.</p>

      <div className="max-w-[640px] flex flex-col gap-4">

        {/* 섹션: 계정 */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-2">계정</p>

        {/* 성인인증 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">🔞 성인인증</h3>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-semibold">본인 인증 상태</p>
              <p className="text-xs text-gray-500">성인 콘텐츠를 이용하려면 본인 인증이 필요해요.</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-gray-900'}`} style={!verified ? { color: '#111827' } : undefined}>
              {verified ? '✅ 인증 완료' : '⚠️ 미인증'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold">성인인증 진행</p>
              <p className="text-xs text-gray-500">휴대폰 또는 아이핀으로 인증할 수 있어요.</p>
            </div>
            <button
              onClick={() => { setVerified(true); updateUser({ verified: true }); addToast('인증 완료! ✓', { type: 'success' }) }}
              disabled={verified}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${verified ? 'bg-gray-50 text-green-600 border border-green-200 cursor-default' : 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]'}`}
            >
              {verified ? '인증 완료' : '인증하기'}
            </button>
          </div>
        </section>

        {/* 언어 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">🌐 언어</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">서비스 언어</p>
              <p className="text-xs text-gray-500">인터페이스에 사용되는 언어를 선택해요.</p>
            </div>
            <select
              value={user?.lang || 'ko'}
              onChange={handleLangChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-[#7c5cff] cursor-pointer"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>
        </section>

        {/* 국가/지역 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">📍 국가/지역</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">국가/지역 설정</p>
              <p className="text-xs text-gray-500">OTT 콘텐츠 제공 범위와 추천에 영향을 줘요.</p>
            </div>
            <select
              value={user?.region || 'kr'}
              onChange={handleRegionChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-[#7c5cff] cursor-pointer"
            >
              <option value="kr">대한민국</option>
              <option value="us">미국</option>
            </select>
          </div>
        </section>

        {/* 섹션: 콘텐츠 */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-4">콘텐츠</p>

        {/* 구독 OTT */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <h3 className="text-sm font-extrabold mb-1 flex items-center gap-2">📺 구독 OTT</h3>
          <p className="text-xs text-gray-500 mb-4">선택한 OTT 기준으로 영화를 추천해드려요. <span className="text-[#7c5cff] font-semibold">({userOtt.length}개 선택됨)</span></p>
          <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2.5">
            {ottOptions.map(o => (
              <button
                key={o.id}
                onClick={() => handleOttToggle(o.id)}
                className={`flex flex-col items-center gap-2 py-4 px-3 border-2 rounded-xl text-xs font-semibold transition-all duration-200 relative hover:shadow-md ${userOtt.includes(o.id) ? 'border-[#7c5cff] shadow-md' : 'border-gray-200 text-gray-500 hover:border-[#9b85ff]'}`}
              >
                {userOtt.includes(o.id) && <span className="absolute top-2 right-2 w-[18px] h-[18px] bg-[#7c5cff] text-white rounded-full grid place-items-center text-[10px] font-extrabold">✓</span>}
                <span className={`w-10 h-10 rounded-[10px] ${o.color} grid place-items-center text-white font-extrabold text-sm`}>{o.initial}</span>
                {o.label}
              </button>
            ))}
          </div>
        </section>

        {/* 다크모드 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">🌙 다크모드</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">다크모드</p>
              <p className="text-xs text-gray-500">어두운 테마로 전환해요.</p>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out ${user?.theme === 'dark' ? 'bg-[#7c5cff]' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${user?.theme === 'dark' ? 'right-[3px]' : 'left-[3px]'}`} />
            </button>
          </div>
        </section>
      </div>
      </div>
    </div>
  )
}
