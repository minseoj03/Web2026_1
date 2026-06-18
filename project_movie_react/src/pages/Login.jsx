import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { loginApi } from '../services/authApi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const validate = () => {
    const newErrors = {}
    if (!email || !email.includes('@')) newErrors.email = '올바른 이메일을 입력해주세요.'
    if (!password) newErrors.password = '비밀번호를 입력해주세요.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    // 클라이언트 유효성 검사
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // API 호출
    setLoading(true)
    try {
      const { token, user } = await loginApi(email, password)

      // AuthContext에 저장 (user + token)
      login(user, token)

      // role 기반 라우팅
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      // 서버 에러 표시
      setServerError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 입력 시 에러 제거
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setErrors(prev => ({ ...prev, email: '' }))
    setServerError('')
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setErrors(prev => ({ ...prev, password: '' }))
    setServerError('')
  }

  return (
    <div className="grid grid-cols-2 max-lg:grid-cols-1 min-h-screen w-full">
      {/* Left: Branding */}
      <div className="bg-gradient-to-br from-[#7c5cff] via-[#9b85ff] to-[#c4b5fd] flex flex-col justify-center items-center p-16 relative overflow-hidden max-lg:hidden">
        <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-white/8 rounded-full" />
        <div className="relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-14 h-14 bg-white/20 rounded-xl grid place-items-center text-2xl font-extrabold backdrop-blur-sm">M</span>
            <span className="text-3xl font-extrabold text-left leading-tight">Movie<br/>Mate</span>
          </div>
          <h2 className="text-xl font-bold mb-3 leading-relaxed">친구와 함께 고르는<br/>오늘의 영화 🎬</h2>
          <p className="text-sm opacity-85 leading-relaxed">AI 맞춤 추천, 감정 기반 추천, 친구와 투표까지.<br/>영화 선택이 즐거워지는 곳.</p>
          <div className="mt-10 flex flex-col gap-3">
            {[
              ['🤖', 'AI가 취향을 분석해 딱 맞는 영화 추천'],
              ['🗳️', '친구들과 투표로 함께 볼 영화 결정'],
              ['💜', '감정 태그로 지금 기분에 맞는 영화 발견'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2.5 text-sm opacity-90">
                <span className="w-8 h-8 bg-white/15 rounded-lg grid place-items-center text-base shrink-0">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center items-center p-16 max-lg:p-10 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
          <h1 className="text-2xl font-extrabold mb-1.5">로그인</h1>
          <p className="text-sm text-gray-500 mb-7">이메일로 로그인하면 기존 데이터를 불러와요.</p>

          {/* Server Error */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-semibold flex items-center gap-2">
              <span>⚠️</span>{serverError}
            </div>
          )}

          {/* Email */}
          <div className="mb-3.5">
            <label className="block text-sm font-bold mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@email.com"
              disabled={loading}
              className={`w-full px-3.5 py-3 border rounded-xl text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-500 focus:ring-3 focus:ring-red-500/10' : 'border-gray-200 focus:border-[#7c5cff] focus:ring-3 focus:ring-[#7c5cff]/10'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-3.5">
            <label className="block text-sm font-bold mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
              disabled={loading}
              className={`w-full px-3.5 py-3 border rounded-xl text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-500 focus:ring-3 focus:ring-red-500/10' : 'border-gray-200 focus:border-[#7c5cff] focus:ring-3 focus:ring-[#7c5cff]/10'
              }`}
            />
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#7c5cff]" /> 로그인 유지
            </label>
            <span className="text-sm text-[#7c5cff] font-semibold cursor-pointer hover:underline">비밀번호 찾기</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-[15px] font-bold transition flex items-center justify-center gap-2 ${
              loading
                ? 'bg-[#7c5cff]/70 text-white/80 cursor-not-allowed'
                : 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8] active:scale-[0.98]'
            }`}
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            아직 계정이 없으신가요? <Link to="/signup" className="text-[#7c5cff] font-bold hover:underline">회원가입</Link>
          </p>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500">
            <p className="font-bold text-gray-600 mb-1">🧪 데모 계정</p>
            <p>관리자: admin@moviemate.com / admin123</p>
            <p>일반: songi@moviemate.com / movie1234</p>
            <p>등록된 사용자 데이터와 친구·추천 기록을 확인할 수 있어요.</p>
          </div>
        </form>
      </div>
    </div>
  )
}
