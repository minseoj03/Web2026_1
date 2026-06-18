import { DEFAULT_DEMO_USER_ID, getMockUserById, toPublicUser } from '../data/mockUsers'

const RECOMMENDATIONS_KEY = 'moviemate_recommendations_v2'

const movies = {
  laLaLand: {
    id: 313369,
    title: '라라랜드',
    genre: '로맨스, 음악',
    rating: '4.1',
    posterPath: null,
    gradient: 'from-[#831843] to-[#f59e0b]',
    overview: '꿈을 좇는 두 사람의 사랑과 선택을 그린 뮤지컬 영화예요.',
  },
  parasite: {
    id: 496243,
    title: '기생충',
    genre: '스릴러, 드라마',
    rating: '4.4',
    posterPath: null,
    gradient: 'from-[#831843] to-[#be185d]',
    overview: '두 가족의 만남이 걷잡을 수 없는 사건으로 이어지는 이야기예요.',
  },
  interstellar: {
    id: 157336,
    title: '인터스텔라',
    genre: 'SF, 드라마',
    rating: '4.6',
    posterPath: null,
    gradient: 'from-[#1e3a8a] to-[#3b82f6]',
    overview: '인류의 미래를 찾아 우주로 떠난 탐사대의 여정을 그린 영화예요.',
  },
  aboutTime: {
    id: 122906,
    title: '어바웃 타임',
    genre: '로맨스, 판타지',
    rating: '4.5',
    posterPath: null,
    gradient: 'from-[#7c2d12] to-[#b45309]',
    overview: '시간 여행 능력을 가진 남자가 일상의 소중함을 알아가는 이야기예요.',
  },
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function createSeedRecommendations(currentUserId) {
  const recipientId = currentUserId || DEFAULT_DEMO_USER_ID
  const otherUserIds = ['user-minji', 'user-woojin', 'user-seyoung', 'user-hojun', 'user-suhyun']
    .filter(userId => userId !== recipientId)
  const [firstFriendId, secondFriendId, thirdFriendId] = otherUserIds

  return [
    {
      id: `recommendation-seed-received-1-${recipientId}`,
      senderId: firstFriendId,
      recipientIds: [recipientId],
      movie: movies.laLaLand,
      message: '음악이랑 영상미를 좋아하는 네 취향에 잘 맞을 것 같아!',
      createdAt: hoursAgo(2),
      status: 'delivered',
      readBy: [],
      reactions: {},
    },
    {
      id: `recommendation-seed-received-2-${recipientId}`,
      senderId: thirdFriendId,
      recipientIds: [recipientId],
      movie: movies.interstellar,
      message: 'SF 좋아하면 이건 꼭 봐야 해. 보고 나서 같이 얘기하자!',
      createdAt: hoursAgo(7),
      status: 'delivered',
      readBy: [recipientId],
      reactions: {},
    },
    {
      id: `recommendation-seed-sent-1-${recipientId}`,
      senderId: recipientId,
      recipientIds: [secondFriendId, thirdFriendId],
      movie: movies.aboutTime,
      message: '따뜻하고 잔잔한 영화 찾는다고 해서 생각났어.',
      createdAt: hoursAgo(20),
      status: 'delivered',
      readBy: [secondFriendId],
      reactions: { [secondFriendId]: 'thanks' },
    },
    {
      id: `recommendation-seed-sent-2-${recipientId}`,
      senderId: recipientId,
      recipientIds: [firstFriendId],
      movie: movies.parasite,
      message: '반전 있는 드라마 좋아하니까 분명 재미있게 볼 것 같아!',
      createdAt: hoursAgo(48),
      status: 'delivered',
      readBy: [firstFriendId],
      reactions: { [firstFriendId]: 'wishlisted' },
    },
  ]
}

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(RECOMMENDATIONS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeStorage(value) {
  localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('moviemate:recommendations-updated'))
}

function getAllRecommendations(currentUserId) {
  const stored = readStorage()
  const storedIds = new Set(stored.map(item => item.id))
  const seeds = createSeedRecommendations(currentUserId).filter(item => !storedIds.has(item.id))
  return [...stored, ...seeds]
}

function getUser(userId) {
  return toPublicUser(getMockUserById(userId)) || {
    id: userId,
    name: userId === DEFAULT_DEMO_USER_ID ? '송이' : '사용자',
    nickname: userId === DEFAULT_DEMO_USER_ID ? '송이' : '사용자',
    email: '',
    initial: userId === DEFAULT_DEMO_USER_ID ? '송' : '?',
    color: 'from-[#a78bfa] to-[#7c3aed]',
  }
}

function hydrateRecommendation(item, currentUserId) {
  const sender = getUser(item.senderId)
  return {
    ...item,
    sender,
    senderName: item.senderId === currentUserId ? '나' : sender.name,
    recipients: item.recipientIds.map(getUser),
    sentAt: item.createdAt,
    receivedAt: item.createdAt,
    read: item.readBy?.includes(currentUserId) || false,
    reaction: item.reactions?.[currentUserId] || null,
  }
}

export async function sendMovieRecommendation(movie, friends, message = '', senderId = DEFAULT_DEMO_USER_ID) {
  await new Promise(resolve => setTimeout(resolve, 500))

  const posterPath = movie.posterPath
    || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null)

  const recommendation = {
    id: `recommendation-${Date.now()}`,
    senderId,
    recipientIds: friends.map(friend => friend.id),
    movie: {
      id: movie.id,
      title: movie.title,
      genre: movie.genre || '영화',
      rating: movie.rating || '',
      posterPath,
      gradient: movie.gradient || 'from-[#2d1b4e] to-[#4a3268]',
      overview: movie.overview || '',
    },
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'delivered',
    readBy: [],
    reactions: {},
  }

  writeStorage([recommendation, ...readStorage()])
  return {
    success: true,
    sentTo: friends.length,
    recommendation: hydrateRecommendation(recommendation, senderId),
  }
}

export function getSentRecommendations(currentUserId = DEFAULT_DEMO_USER_ID) {
  return getAllRecommendations(currentUserId)
    .filter(item => item.senderId === currentUserId)
    .map(item => hydrateRecommendation(item, currentUserId))
}

export function getReceivedRecommendations(currentUserId = DEFAULT_DEMO_USER_ID) {
  return getAllRecommendations(currentUserId)
    .filter(item => item.recipientIds.includes(currentUserId))
    .map(item => hydrateRecommendation(item, currentUserId))
}

export function updateReceivedRecommendation(id, currentUserId, updates) {
  const current = getAllRecommendations(currentUserId)
  const next = current.map(item => {
    if (item.id !== id) return item

    const nextItem = { ...item }
    if (updates.read) {
      nextItem.readBy = [...new Set([...(item.readBy || []), currentUserId])]
    }
    if (updates.reaction) {
      nextItem.reactions = { ...(item.reactions || {}), [currentUserId]: updates.reaction }
    }
    return nextItem
  })
  writeStorage(next)
  return next
}
