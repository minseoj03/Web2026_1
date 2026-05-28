import { createContext, useContext, useState, useCallback } from 'react'

const FriendContext = createContext()

// [API 연결 후 삭제] Mock 초기 친구 목록
const initialFriends = [
  { id: 'f1', name: '민지', initial: '민', color: 'from-[#fda4af] to-[#f43f5e]', email: 'minji@email.com' },
  { id: 'f2', name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]', email: 'woojin@email.com' },
  { id: 'f3', name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]', email: 'seyoung@email.com' },
  { id: 'f4', name: '호준', initial: '호', color: 'from-[#fbbf24] to-[#f59e0b]', email: 'hojun@email.com' },
]

const COLORS = [
  'from-[#fda4af] to-[#f43f5e]',
  'from-[#93c5fd] to-[#2563eb]',
  'from-[#d8b4fe] to-[#9333ea]',
  'from-[#fbbf24] to-[#f59e0b]',
  'from-[#86efac] to-[#16a34a]',
  'from-[#a78bfa] to-[#7c3aed]',
]

export function FriendProvider({ children }) {
  const [friends, setFriends] = useState(initialFriends)

  // 친구 추가 (바로 친구 됨, 요청 없음)
  // TODO [API 연결]: POST /api/friends { email }
  const addFriend = useCallback((email, name) => {
    setFriends(prev => {
      if (prev.some(f => f.email === email)) return prev // 이미 친구
      const newFriend = {
        id: `f-${Date.now()}`,
        name: name || email.split('@')[0],
        initial: (name || email)[0],
        color: COLORS[prev.length % COLORS.length],
        email,
      }
      return [...prev, newFriend]
    })
  }, [])

  // 친구 삭제
  // TODO [API 연결]: DELETE /api/friends/:id
  const removeFriend = useCallback((id) => {
    setFriends(prev => prev.filter(f => f.id !== id))
  }, [])

  // 이미 친구인지 확인
  const isFriend = useCallback((email) => {
    return friends.some(f => f.email === email)
  }, [friends])

  return (
    <FriendContext.Provider value={{ friends, addFriend, removeFriend, isFriend }}>
      {children}
    </FriendContext.Provider>
  )
}

export function useFriends() {
  const context = useContext(FriendContext)
  if (!context) throw new Error('useFriends must be used within FriendProvider')
  return context
}
