const SENT_RECOMMENDATIONS_KEY = 'moviemate_sent_recommendations'
const RECEIVED_RECOMMENDATIONS_KEY = 'moviemate_received_recommendations'
const RECIPIENT_INBOX_KEY = 'moviemate_recipient_recommendations'

const receivedRecommendationSeed = [
  {
    id: 'received-seed-1',
    recommendationId: 'seed-recommendation-1',
    senderName: '민지',
    movie: {
      id: 313369,
      title: '라라랜드',
      genre: '로맨스, 음악',
      rating: '4.1',
      posterPath: null,
      gradient: 'from-[#831843] to-[#f59e0b]',
      overview: '꿈을 좇는 두 사람의 사랑과 선택을 그린 뮤지컬 영화예요.',
    },
    message: '음악이랑 영상미를 좋아하는 네 취향에 잘 맞을 것 같아!',
    receivedAt: new Date().toISOString(),
    read: false,
    reaction: null,
  },
]

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('moviemate:recommendations-updated'))
}

export async function sendMovieRecommendation(movie, friends, message = '') {
  await new Promise(resolve => setTimeout(resolve, 500))

  const sentAt = new Date().toISOString()
  const recommendation = {
    id: `recommendation-${Date.now()}`,
    movie: {
      id: movie.id,
      title: movie.title,
      genre: movie.genre || '영화',
      rating: movie.rating || '',
      posterPath: movie.posterPath || null,
      gradient: movie.gradient || 'from-[#2d1b4e] to-[#4a3268]',
      overview: movie.overview || '',
    },
    recipients: friends.map(friend => ({
      id: friend.id,
      name: friend.name,
      initial: friend.initial,
      color: friend.color,
    })),
    message: message.trim(),
    sentAt,
    status: 'delivered',
  }

  writeStorage(SENT_RECOMMENDATIONS_KEY, [recommendation, ...readStorage(SENT_RECOMMENDATIONS_KEY)])

  const inbox = readStorage(RECIPIENT_INBOX_KEY)
  const deliveredItems = friends.map(friend => ({
    id: `${recommendation.id}-${friend.id}`,
    recommendationId: recommendation.id,
    recipientId: friend.id,
    recipientName: friend.name,
    senderName: '나',
    movie: recommendation.movie,
    message: recommendation.message,
    receivedAt: sentAt,
    read: false,
    reaction: null,
  }))
  writeStorage(RECIPIENT_INBOX_KEY, [...deliveredItems, ...inbox])

  return { success: true, sentTo: friends.length, recommendation }
}

export function getSentRecommendations() {
  return readStorage(SENT_RECOMMENDATIONS_KEY)
}

export function getReceivedRecommendations() {
  const stored = readStorage(RECEIVED_RECOMMENDATIONS_KEY)
  return stored.length > 0 ? stored : receivedRecommendationSeed
}

export function updateReceivedRecommendation(id, updates) {
  const current = getReceivedRecommendations()
  const next = current.map(item => item.id === id ? { ...item, ...updates } : item)
  writeStorage(RECEIVED_RECOMMENDATIONS_KEY, next)
  return next
}
