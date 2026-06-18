import { searchMovies } from './movieApi'
import { getReceivedRecommendations } from './recommendApi'
import { getMockUserById } from '../data/mockUsers'

const mockNotifications = [
  {
    id: 1,
    type: 'movie_recommend_friend',
    actorId: 'user-minji',
    message: '정말 따뜻한 영화예요! 꼭 봐보세요 💜',
    movieTitle: '라라랜드',
    fallbackMovie: { title: '라라랜드', genre: '로맨스, 뮤지컬', rating: 4.5, gradient: 'from-[#fef3c7] to-[#fbbf24]' },
    time: '10분 전',
    read: false,
  },
  {
    id: 2,
    type: 'movie_recommend_ai',
    message: '취향 일치 95%! 지금 확인해보세요.',
    movieTitle: '비포 선라이즈',
    fallbackMovie: { title: '비포 선라이즈', genre: '로맨스', rating: 4.6, gradient: 'from-[#7c2d12] to-[#b45309]' },
    time: '2시간 전',
    read: false,
  },
  {
    id: 3,
    type: 'movie_recommend_friend',
    actorId: 'user-hojun',
    message: '액션 좋아하면 무조건 봐야 해요! 🔥',
    movieTitle: '스파이더맨: 노 웨이 홈',
    fallbackMovie: { title: '스파이더맨: 노 웨이 홈', genre: '액션, SF', rating: 4.4, gradient: 'from-[#dc2626] to-[#ef4444]' },
    time: '5시간 전',
    read: false,
  },
  {
    id: 4,
    type: 'movie_recommend_friend',
    actorId: 'user-woojin',
    message: '반전이 미쳤어요! 꼭 보세요',
    movieTitle: '기생충',
    fallbackMovie: { title: '기생충', genre: '스릴러, 드라마', rating: 4.4, gradient: 'from-[#831843] to-[#be185d]' },
    time: '어제',
    read: true,
  },
  { id: 5, type: 'vote_result', roomName: '주말에 뭐 볼까?', movieTitle: '어바웃 타임', time: '25분 전', read: false },
  { id: 6, type: 'vote_invite', actorId: 'user-seyoung', roomName: '금요일 영화의 밤', time: '1시간 전', read: false },
  { id: 7, type: 'realtime_review', actorId: 'user-woojin', movieTitle: '인터스텔라', rating: 4.8, time: '방금', read: false },
  { id: 8, type: 'friend_add', actorId: 'user-hojun', time: '2일 전', read: true },
  { id: 9, type: 'vote_result', roomName: '감성 로맨스 모임', movieTitle: '비포 선라이즈', time: '3일 전', read: true },
]

async function attachMovie(notification) {
  const hydratedNotification = {
    ...notification,
    actorName: notification.actorId
      ? getMockUserById(notification.actorId)?.name || '친구'
      : notification.actorName,
  }
  if (!notification.movieTitle) return hydratedNotification
  if (notification.movie?.posterPath) return hydratedNotification

  const fallbackMovie = notification.movie || notification.fallbackMovie

  try {
    const results = await searchMovies(notification.movieTitle)
    const movie = results?.find(item => item.id === notification.movie?.id) || results?.[0]

    if (!movie) {
      return {
        ...hydratedNotification,
        movie: fallbackMovie,
      }
    }

    return {
      ...hydratedNotification,
      movie: {
        ...fallbackMovie,
        ...movie,
        title: movie.title || notification.movieTitle,
        genre: fallbackMovie?.genre || '영화',
        rating: fallbackMovie?.rating || (movie.vote_average ? (movie.vote_average / 2).toFixed(1) : ''),
        gradient: fallbackMovie?.gradient || 'from-[#2d1b4e] to-[#4a3268]',
        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
      },
    }
  } catch (error) {
    console.error('[Notification movie]', error)
    return {
      ...hydratedNotification,
      movie: fallbackMovie,
    }
  }
}

function getRecommendationNotifications(currentUserId) {
  return getReceivedRecommendations(currentUserId).map(item => ({
    id: item.id,
    type: 'movie_recommend_friend',
    actorName: item.senderName || '친구',
    message: item.message,
    movieTitle: item.movie.title,
    movie: item.movie,
    time: '방금',
    read: item.read || false,
  }))
}

export async function getNotifications(category = 'all', currentUserId) {
  await new Promise(resolve => setTimeout(resolve, 300))
  const [notifications, recommendationNotifications] = await Promise.all([
    Promise.all(mockNotifications.map(attachMovie)),
    Promise.all(getRecommendationNotifications(currentUserId).map(attachMovie)),
  ])
  const result = [...recommendationNotifications, ...notifications]

  if (category === 'all') return result
  return result
}

export async function markNotificationRead(id) {
  void id
  await new Promise(resolve => setTimeout(resolve, 150))
  return { success: true }
}

export async function markAllNotificationsRead() {
  await new Promise(resolve => setTimeout(resolve, 200))
  return { success: true }
}
