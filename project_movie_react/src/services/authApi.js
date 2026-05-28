/**
 * 인증 API 서비스 레이어
 * 
 * 실제 서비스에서는:
 * - Firebase Auth로 이메일/비밀번호 인증
 * - Firebase ID Token을 서버로 전송
 * - 서버에서 MongoDB 유저 정보 조회 후 JWT + user 반환
 */

const API_BASE = '/api' // TODO: import.meta.env.VITE_API_URL

/**
 * 로그인 API
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: { id, nickname, email, role, ott, theme, lang, region } }}
 */
export async function loginApi(email, password) {
  // TODO [API 연결]: 실제 API 호출로 교체
  // const response = await fetch(`${API_BASE}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // })
  // if (!response.ok) {
  //   const error = await response.json()
  //   throw new Error(error.message || '로그인에 실패했습니다.')
  // }
  // return response.json()

  // [API 연결 후 삭제] 아래 시뮬레이션 전체 제거 ─────────────────────
  await new Promise(resolve => setTimeout(resolve, 800)) // 네트워크 딜레이 시뮬레이션

  // 데모용 인증 로직
  if (email === 'admin@moviemate.com' && password === 'admin123') {
    return {
      token: 'demo-jwt-token-admin',
      user: { id: 'admin-1', nickname: '관리자', email, role: 'admin', ott: ['netflix', 'wavve', 'disney'], theme: 'light', lang: 'ko', region: 'kr', verified: true },
    }
  }

  if (password.length < 4) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  // 일반 유저
  const nickname = email.split('@')[0]
  return {
    token: 'demo-jwt-token-user',
    user: { id: `user-${Date.now()}`, nickname, email, role: 'user', ott: ['netflix', 'wavve', 'disney'], theme: 'light', lang: 'ko', region: 'kr', verified: false },
  }
  // ─────────────────────────────────────────────────────────────────
}

/**
 * 회원가입 API
 * @param {{ email, password, nickname, lang, region, theme, ott }} data
 * @returns {{ token: string, user: object }}
 */
export async function signupApi(data) {
  // TODO [API 연결]: 실제 API 호출로 교체
  // const response = await fetch(`${API_BASE}/auth/signup`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // if (!response.ok) {
  //   const error = await response.json()
  //   throw new Error(error.message || '회원가입에 실패했습니다.')
  // }
  // return response.json()

  // [API 연결 후 삭제] 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 600))
  return {
    token: 'demo-jwt-token-new',
    user: {
      id: `user-${Date.now()}`,
      nickname: data.nickname || data.email.split('@')[0],
      email: data.email,
      role: 'user',
      ott: data.ott || ['netflix'],
      theme: data.theme || 'light',
      lang: data.lang || 'ko',
      region: data.region || 'kr',
      verified: false,
    },
  }
}

/**
 * 토큰 검증 (앱 시작 시 로그인 상태 복원)
 * @param {string} token
 * @returns {{ user: object }}
 */
export async function verifyToken(token) {
  // TODO [API 연결]: 실제 API 호출로 교체
  // const response = await fetch(`${API_BASE}/auth/verify`, {
  //   headers: { 'Authorization': `Bearer ${token}` },
  // })
  // if (!response.ok) throw new Error('Token expired')
  // return response.json()

  // [API 연결 후 삭제] localStorage에서 복원
  return null
}
