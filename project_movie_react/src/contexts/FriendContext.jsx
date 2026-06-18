import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getMockFriends, getMockUserByEmail, getMockUserById, toPublicUser } from '../data/mockUsers'

const FriendContext = createContext()

const COLORS = [
  'from-[#fda4af] to-[#f43f5e]',
  'from-[#93c5fd] to-[#2563eb]',
  'from-[#d8b4fe] to-[#9333ea]',
  'from-[#fbbf24] to-[#f59e0b]',
  'from-[#86efac] to-[#16a34a]',
  'from-[#a78bfa] to-[#7c3aed]',
]

export function FriendProvider({ children }) {
  const { user } = useAuth()
  const storageKey = `moviemate_friend_ids_${user?.id || 'guest'}`
  return (
    <FriendStateProvider key={storageKey} userId={user?.id} storageKey={storageKey}>
      {children}
    </FriendStateProvider>
  )
}

function FriendStateProvider({ children, userId, storageKey }) {
  const [friends, setFriends] = useState(() => {
    const defaultFriends = getMockFriends(userId).map(toPublicUser)

    if (!userId) return defaultFriends

    try {
      const savedIds = JSON.parse(localStorage.getItem(storageKey) || 'null')
      if (Array.isArray(savedIds)) {
        return savedIds
          .map(getMockUserById)
          .filter(Boolean)
          .map(toPublicUser)
      }
    } catch {
      // 손상된 mock 저장값은 기본 친구 관계로 복구합니다.
    }

    return defaultFriends
  })

  useEffect(() => {
    if (!userId) return
    localStorage.setItem(storageKey, JSON.stringify(friends.map(friend => friend.id)))
  }, [friends, storageKey, userId])

  // 친구 추가 (바로 친구 됨, 요청 없음)
  // TODO [API 연결]: POST /api/friends { email }
  const addFriend = useCallback((email, name) => {
    setFriends(prev => {
      if (prev.some(f => f.email === email)) return prev // 이미 친구
      const mockUser = getMockUserByEmail(email)
      const newFriend = mockUser ? toPublicUser(mockUser) : {
        id: `user-${email.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: name || email.split('@')[0],
        nickname: name || email.split('@')[0],
        initial: (name || email)[0],
        color: COLORS[prev.length % COLORS.length],
        email,
        ott: [],
        favoriteGenres: [],
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
