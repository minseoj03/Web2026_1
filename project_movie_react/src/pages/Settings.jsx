import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

const ottOptions = [
  { id: 'netflix', label: '넷플릭스', initial: 'N', color: 'bg-[#e50914]' },
  { id: 'wavve', label: '웨이브', initial: 'W', color: 'bg-[#1a73e8]' },
  { id: 'disney', label: '디즈니+', initial: 'D+', color: 'bg-[#113cff]' },
  { id: 'tving', label: '티빙', initial: 'T', color: 'bg-[#ff153c]' },
  { id: 'coupang', label: '쿠팡플레이', initial: 'C', color: 'bg-[#00b8e6]' },
  { id: 'watcha', label: '왓챠', initial: 'W', color: 'bg-[#ff0558]' },
]

function calculateAge(birthDateValue) {
  if (!birthDateValue) return 0

  const today = new Date()
  const birthDate = new Date(`${birthDateValue}T00:00:00`)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age
}

export default function Settings() {
  const { user, updateUser, toggleOtt, toggleTheme } = useAuth()
  const { addToast } = useToast()
  const [showAgeModal, setShowAgeModal] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [agreeAgeCheck, setAgreeAgeCheck] = useState(false)
  const [ageError, setAgeError] = useState('')

  const userOtt = user?.ott || []
  const verified = !!user?.verified
  const adultAge = useMemo(() => calculateAge(birthDate), [birthDate])

  const saveToast = () => {
    addToast('저장되었어요.', { type: 'success', duration: 1500 })
  }

  const handleOttToggle = (id) => {
    toggleOtt(id)
    saveToast()
  }

  const handleLangChange = (event) => {
    updateUser({ lang: event.target.value })
    saveToast()
  }

  const handleRegionChange = (event) => {
    updateUser({ region: event.target.value })
    saveToast()
  }

  const handleThemeToggle = () => {
    toggleTheme()
    saveToast()
  }

  const openAgeModal = () => {
    setBirthDate(user?.birthDate || '')
    setAgreeAgeCheck(false)
    setAgeError('')
    setShowAgeModal(true)
  }

  const closeAgeModal = () => {
    setShowAgeModal(false)
    setAgeError('')
  }

  const handleAgeVerify = (event) => {
    event.preventDefault()

    if (!birthDate) {
      setAgeError('생년월일을 입력해주세요.')
      return
    }

    if (!agreeAgeCheck) {
      setAgeError('성인 인증 안내에 동의해주세요.')
      return
    }

    if (adultAge < 19) {
      updateUser({ verified: false, birthDate })
      setAgeError('만 19세 이상만 성인 인증을 완료할 수 있어요.')
      addToast('성인 인증 대상이 아니에요.', { type: 'error' })
      return
    }

    updateUser({
      verified: true,
      birthDate,
      verifiedAt: new Date().toISOString(),
    })
    setShowAgeModal(false)
    addToast('성인 인증이 완료되었어요.', { type: 'success' })
  }

  return (
    <div className="fluid-px pb-8 flex flex-col items-center">
      <div className="w-full max-w-[640px]">
        <h1 className="text-2xl font-extrabold mb-1">⚙️ 설정</h1>
        <p className="text-sm text-gray-500 mb-6">서비스 이용 환경을 설정해보세요.</p>

        <div className="max-w-[640px] flex flex-col gap-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-2">계정</p>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">🔞 성인인증</h3>
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-semibold">본인 인증 상태</p>
                <p className="text-xs text-gray-500">성인 콘텐츠를 이용하려면 본인 인증이 필요해요.</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-gray-900'}`}>
                {verified ? '✅ 인증 완료' : '⚠️ 미인증'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-semibold">성인인증 진행</p>
                <p className="text-xs text-gray-500">생년월일 기준 만 19세 이상인지 확인해요.</p>
              </div>
              <button
                onClick={openAgeModal}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${verified ? 'bg-gray-50 text-green-600 border border-green-200 hover:bg-green-50' : 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]'}`}
              >
                {verified ? '다시 인증' : '인증하기'}
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">🌐 언어</h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">서비스 언어</p>
                <p className="text-xs text-gray-500">인터페이스에 사용하는 언어를 선택해요.</p>
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

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">📍 국가/지역</h3>
            <div className="flex items-center justify-between gap-4">
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

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-4">콘텐츠</p>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-sm font-extrabold mb-1 flex items-center gap-2">📺 구독 OTT</h3>
            <p className="text-xs text-gray-500 mb-4">
              선택한 OTT 기준으로 영화를 추천해드려요. <span className="text-[#7c5cff] font-semibold">({userOtt.length}개 선택됨)</span>
            </p>
            <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2.5">
              {ottOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleOttToggle(option.id)}
                  className={`flex flex-col items-center gap-2 py-4 px-3 border-2 rounded-xl text-xs font-semibold transition-all duration-200 relative hover:shadow-md ${userOtt.includes(option.id) ? 'border-[#7c5cff] shadow-md' : 'border-gray-200 text-gray-500 hover:border-[#9b85ff]'}`}
                >
                  {userOtt.includes(option.id) && (
                    <span className="absolute top-2 right-2 w-[18px] h-[18px] bg-[#7c5cff] text-white rounded-full grid place-items-center text-[10px] font-extrabold">
                      ✓
                    </span>
                  )}
                  <span className={`w-10 h-10 rounded-[10px] ${option.color} grid place-items-center text-white font-extrabold text-sm`}>
                    {option.initial}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">🌙 다크모드</h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">다크모드</p>
                <p className="text-xs text-gray-500">어두운 테마로 전환해요.</p>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out ${user?.theme === 'dark' ? 'bg-[#7c5cff]' : 'bg-gray-200'}`}
                aria-label="다크모드 전환"
              >
                <span className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${user?.theme === 'dark' ? 'right-[3px]' : 'left-[3px]'}`} />
              </button>
            </div>
          </section>
        </div>
      </div>

      {showAgeModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center px-4" role="dialog" aria-modal="true">
          <form onSubmit={handleAgeVerify} className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold">성인인증</h2>
                <p className="text-sm text-gray-500 mt-1">생년월일을 입력해 만 19세 이상인지 확인해요.</p>
              </div>
              <button type="button" onClick={closeAgeModal} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">
                ×
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-bold mb-2" htmlFor="birth-date">
                생년월일
              </label>
              <input
                id="birth-date"
                type="date"
                value={birthDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={event => {
                  setBirthDate(event.target.value)
                  setAgeError('')
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#7c5cff]"
              />

              {birthDate && (
                <p className={`mt-2 text-xs font-semibold ${adultAge >= 19 ? 'text-green-600' : 'text-red-500'}`}>
                  현재 만 {adultAge}세로 계산돼요.
                </p>
              )}

              <label className="mt-5 flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAgeCheck}
                  onChange={event => setAgreeAgeCheck(event.target.checked)}
                  className="mt-1 accent-[#7c5cff]"
                />
                <span>입력한 생년월일이 본인 정보이며, 성인 콘텐츠 이용을 위한 연령 확인에 동의해요.</span>
              </label>

              {ageError && (
                <p className="mt-4 text-sm font-semibold text-red-500">{ageError}</p>
              )}
            </div>

            <div className="p-6 pt-0 flex gap-2">
              <button type="button" onClick={closeAgeModal} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50">
                취소
              </button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#7c5cff] text-white text-sm font-bold hover:bg-[#5d3ee8]">
                인증 완료
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
