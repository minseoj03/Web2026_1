import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signupApi } from '../services/authApi'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', nickname: '', lang: 'ko', region: 'kr', theme: 'light', ott: ['netflix'] })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const ottOptions = [
    { id: 'netflix', label: '넷플릭스', initial: 'N', color: 'bg-[#e50914]' },
    { id: 'wavve', label: '웨이브', initial: 'W', color: 'bg-[#1a73e8]' },
    { id: 'disney', label: '디즈니+', initial: 'D+', color: 'bg-[#113cff]' },
    { id: 'tving', label: '티빙', initial: 'T', color: 'bg-[#ff153c]' },
    { id: 'coupang', label: '쿠팡플레이', initial: 'C', color: 'bg-[#00b8e6]' },
    { id: 'watcha', label: '왓챠', initial: 'W', color: 'bg-[#ff0558]' },
  ]

  const handleNext = () => {
    const newErrors = {}
    if (!form.email || !form.email.includes('@')) newErrors.email = '올바른 이메일을 입력해주세요.'
    if (!form.password || form.password.length < 8) newErrors.password = '8자 이상 입력해주세요.'
    if (form.password !== form.passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않아요.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) setStep(2)
  }

  const handleComplete = async () => {
    setLoading(true)
    setServerError('')
    try {
      const { token, user } = await signupApi({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        lang: form.lang,
        region: form.region,
        theme: form.theme,
        ott: form.ott,
      })
      login(user, token)
      navigate('/')
    } catch (err) {
      setServerError(err.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const toggleOtt = (id) => {
    setForm(prev => ({
      ...prev,
      ott: prev.ott.includes(id) ? prev.ott.filter(o => o !== id) : [...prev.ott, id]
    }))
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-10">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[460px] shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="w-9 h-9 bg-gradient-to-br from-[#7c5cff] to-[#9b85ff] rounded-lg grid place-items-center text-white font-extrabold text-base">M</span>
          <span className="text-xl font-extrabold text-[#7c5cff]">Movie Mate</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold border-2 transition ${step === 1 ? 'border-[#7c5cff] text-[#7c5cff]' : 'border-[#7c5cff] bg-[#7c5cff] text-white'}`}>1</span>
          <span className={`w-10 h-0.5 rounded-full transition ${step === 2 ? 'bg-[#7c5cff]' : 'bg-gray-200'}`} />
          <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold border-2 transition ${step === 2 ? 'border-[#7c5cff] text-[#7c5cff]' : 'border-[#7c5cff] text-[#7c5cff]'}`}>2</span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-extrabold text-center mb-1">계정 만들기</h2>
            <p className="text-sm text-gray-500 text-center mb-6">이메일과 비밀번호를 입력해주세요.</p>

            {[
              { key: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com' },
              { key: 'password', label: '비밀번호', type: 'password', placeholder: '8자 이상 입력하세요' },
              { key: 'passwordConfirm', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력하세요' },
            ].map(field => (
              <div key={field.key} className="mb-3.5">
                <label className="block text-sm font-bold mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => { setForm(p => ({...p, [field.key]: e.target.value})); setErrors(p => ({...p, [field.key]: ''})) }}
                  placeholder={field.placeholder}
                  className={`w-full px-3.5 py-3 border rounded-xl text-sm outline-none transition ${errors[field.key] ? 'border-red-500' : 'border-gray-200 focus:border-[#7c5cff]'}`}
                />
                {errors[field.key] && <p className="text-[11px] text-red-500 mt-1">{errors[field.key]}</p>}
              </div>
            ))}

            <div className="mb-3.5">
              <label className="block text-sm font-bold mb-1.5">닉네임 <span className="font-normal text-gray-400">(선택)</span></label>
              <input
                type="text"
                value={form.nickname}
                onChange={e => setForm(p => ({...p, nickname: e.target.value}))}
                placeholder="비워두면 이메일로 설정돼요"
                maxLength={12}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]"
              />
            </div>

            <button onClick={handleNext} className="w-full py-3.5 bg-[#7c5cff] text-white rounded-xl text-[15px] font-bold hover:bg-[#5d3ee8] transition mt-2">
              다음
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">이미 계정이 있으신가요? <Link to="/login" className="text-[#7c5cff] font-bold hover:underline">로그인</Link></p>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-extrabold text-center mb-1">환경 설정</h2>
            <p className="text-sm text-gray-500 text-center mb-6">서비스 이용 환경을 선택해주세요.</p>

            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
              <div>
                <label className="block text-sm font-bold mb-1.5">언어</label>
                <select value={form.lang} onChange={e => setForm(p => ({...p, lang: e.target.value}))} className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]">
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">국가/지역</label>
                <select value={form.region} onChange={e => setForm(p => ({...p, region: e.target.value}))} className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff]">
                  <option value="kr">대한민국</option>
                  <option value="us">미국</option>
                </select>
              </div>
            </div>

            <div className="mb-3.5">
              <label className="block text-sm font-bold mb-1.5">테마</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ id: 'light', icon: '☀️', label: '라이트' }, { id: 'dark', icon: '🌙', label: '다크' }].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setForm(p => ({...p, theme: t.id}))
                      // 즉시 화면에 다크모드 반영
                      if (t.id === 'dark') {
                        document.documentElement.classList.add('dark')
                      } else {
                        document.documentElement.classList.remove('dark')
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-3.5 border-2 rounded-xl text-sm font-semibold transition ${form.theme === t.id ? 'border-[#7c5cff] bg-[#f3f0ff] text-[#7c5cff]' : 'border-gray-200 text-gray-500 hover:border-[#9b85ff]'}`}
                  >
                    <span className="text-xl">{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold mb-1.5">구독 OTT <span className="font-normal text-gray-400">(선택)</span></label>
              <div className="grid grid-cols-3 gap-2">
                {ottOptions.map(ott => (
                  <button
                    key={ott.id}
                    type="button"
                    onClick={() => toggleOtt(ott.id)}
                    className={`flex flex-col items-center gap-1.5 py-3.5 px-2 border-2 rounded-xl text-[11px] font-semibold transition relative ${form.ott.includes(ott.id) ? 'border-[#7c5cff] bg-gradient-to-b from-[#faf8ff] to-[#f3f0ff] shadow-md' : 'border-gray-200 text-gray-500 hover:border-[#9b85ff]'}`}
                  >
                    {form.ott.includes(ott.id) && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#7c5cff] text-white rounded-full grid place-items-center text-[9px] font-extrabold">✓</span>}
                    <span className={`w-9 h-9 rounded-[9px] ${ott.color} grid place-items-center text-white font-extrabold text-xs`}>{ott.initial}</span>
                    {ott.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-[#7c5cff] hover:text-[#7c5cff]">이전</button>
              <button onClick={handleComplete} className="flex-1 py-3.5 bg-[#7c5cff] text-white rounded-xl text-[15px] font-bold hover:bg-[#5d3ee8] transition">가입 완료</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
