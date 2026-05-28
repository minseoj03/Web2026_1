import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

const DEFAULT_USER = {
  email: '',
  nickname: '송이',
  role: 'user', // 'user' | 'admin'
  ott: ['netflix', 'wavve', 'disney'],
  theme: 'light', // 'light' | 'dark'
  lang: 'ko',
  region: 'kr',
  verified: false, // 성인인증
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('moviemate_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('moviemate_token') || null
  })

  // user 변경 시 localStorage에 저장
  useEffect(() => {
    if (user) {
      localStorage.setItem('moviemate_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('moviemate_user')
    }
  }, [user])

  // token 변경 시 localStorage에 저장
  useEffect(() => {
    if (token) {
      localStorage.setItem('moviemate_token', token)
    } else {
      localStorage.removeItem('moviemate_token')
    }
  }, [token])

  // 테마 적용 (documentElement class 기반)
  useEffect(() => {
    if (user?.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [user?.theme])

  // 로그인 (API 응답의 user + token을 저장)
  const login = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
  }

  // 회원가입 (API 응답의 user + token을 저장)
  const signup = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
  }

  // 로그아웃
  const logout = () => {
    setUser(null)
    setToken(null)
  }

  // 사용자 정보 업데이트
  // TODO [API 연결]: PUT /api/users/:id 로 서버에 변경사항 저장
  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  // OTT 구독 목록 토글 (추가/제거)
  // TODO [API 연결]: PUT /api/users/:id/ott 로 서버에 OTT 목록 업데이트
  const toggleOtt = useCallback((ottId) => {
    setUser(prev => {
      if (!prev) return null
      const newOtt = prev.ott.includes(ottId)
        ? prev.ott.filter(o => o !== ottId)
        : [...prev.ott, ottId]
      return { ...prev, ott: newOtt }
    })
  }, [])

  // 테마 토글
  const toggleTheme = useCallback(() => {
    setUser(prev => prev ? { ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' } : null)
  }, [])

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn,
      isAdmin,
      login,
      signup,
      logout,
      updateUser,
      toggleOtt,
      toggleTheme,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
