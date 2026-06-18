export const DEFAULT_DEMO_USER_ID = 'user-songi'

export const mockUsers = [
  {
    id: DEFAULT_DEMO_USER_ID,
    nickname: '송이',
    name: '송이',
    email: 'songi@moviemate.com',
    initial: '송',
    color: 'from-[#ffd6a5] to-[#f97316]',
    role: 'user',
    ott: ['netflix', 'wavve', 'disney'],
    favoriteGenres: ['로맨스', '드라마', '음악'],
    theme: 'light',
    lang: 'ko',
    region: 'kr',
    verified: true,
  },
  {
    id: 'user-minji',
    nickname: '민지',
    name: '민지',
    email: 'minji@email.com',
    initial: '민',
    color: 'from-[#fda4af] to-[#f43f5e]',
    role: 'user',
    ott: ['netflix', 'tving'],
    favoriteGenres: ['스릴러', '드라마'],
  },
  {
    id: 'user-woojin',
    nickname: '우진',
    name: '우진',
    email: 'woojin@email.com',
    initial: '우',
    color: 'from-[#93c5fd] to-[#2563eb]',
    role: 'user',
    ott: ['netflix', 'coupang'],
    favoriteGenres: ['SF', '로맨스'],
  },
  {
    id: 'user-seyoung',
    nickname: '세영',
    name: '세영',
    email: 'seyoung@email.com',
    initial: '세',
    color: 'from-[#d8b4fe] to-[#9333ea]',
    role: 'user',
    ott: ['wavve', 'watcha'],
    favoriteGenres: ['음악', '로맨스'],
  },
  {
    id: 'user-hojun',
    nickname: '호준',
    name: '호준',
    email: 'hojun@email.com',
    initial: '호',
    color: 'from-[#fbbf24] to-[#f59e0b]',
    role: 'user',
    ott: ['disney', 'coupang'],
    favoriteGenres: ['액션', 'SF'],
  },
  {
    id: 'user-suhyun',
    nickname: '수현',
    name: '수현',
    email: 'suhyun@email.com',
    initial: '수',
    color: 'from-[#86efac] to-[#16a34a]',
    role: 'user',
    ott: ['netflix', 'watcha'],
    favoriteGenres: ['코미디', '애니메이션'],
  },
]

const defaultFriendIds = ['user-minji', 'user-woojin', 'user-seyoung', 'user-hojun']

export function getMockUserById(userId) {
  return mockUsers.find(user => user.id === userId)
}

export function getMockUserByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase()
  return mockUsers.find(user => user.email.toLowerCase() === normalizedEmail)
}

export function getMockFriends(userId) {
  const friendIds = userId === DEFAULT_DEMO_USER_ID
    ? defaultFriendIds
    : defaultFriendIds.filter(id => id !== userId)

  return friendIds.map(getMockUserById).filter(Boolean)
}

export function getDiscoverableUsers(currentUserId, friendIds = []) {
  const excludedIds = new Set([currentUserId, ...friendIds])
  return mockUsers.filter(user => !excludedIds.has(user.id))
}

export function toPublicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name || user.nickname,
    nickname: user.nickname || user.name,
    email: user.email,
    initial: user.initial || (user.name || user.nickname || '?')[0],
    color: user.color || 'from-[#a78bfa] to-[#7c3aed]',
    ott: user.ott || [],
    favoriteGenres: user.favoriteGenres || [],
  }
}
