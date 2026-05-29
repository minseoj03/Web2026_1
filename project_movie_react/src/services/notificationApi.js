import { searchMovies } from './movieApi'

const mockNotifications = [
  {
    id: 1,
    type: 'movie_recommend_friend',
    actorName: '민지',
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
    actorName: '호준',
    message: '액션 좋아하면 무조건 봐야 해요! 🔥',
    movieTitle: '스파이더맨: 노 웨이 홈',
    fallbackMovie: { title: '스파이더맨: 노 웨이 홈', genre: '액션, SF', rating: 4.4, gradient: 'from-[#dc2626] to-[#ef4444]' },
    time: '5시간 전',
    read: false,
  },
  {
    id: 4,
    type: 'movie_recommend_friend',
    actorName: '우진',
    message: '반전이 미쳤어요! 꼭 보세요',
    movieTitle: '기생충',
    fallbackMovie: { title: '기생충', genre: '스릴러, 드라마', rating: 4.4, gradient: 'from-[#831843] to-[#be185d]' },
    time: '어제',
    read: true,
  },
  { id: 5, type: 'vote_result', roomName: '주말에 뭐 볼까?', movieTitle: '어바웃 타임', time: '25분 전', read: false },
  { id: 6, type: 'vote_invite', actorName: '세영', roomName: '금요일 영화의 밤', time: '1시간 전', read: false },
  { id: 7, type: 'realtime_review', actorName: '우진', movieTitle: '인터스텔라', rating: 4.8, time: '방금', read: false },
  { id: 8, type: 'friend_add', actorName: '호준', time: '2일 전', read: true },
  { id: 9, type: 'vote_result', roomName: '감성 로맨스 모임', movieTitle: '비포 선라이즈', time: '3일 전', read: true },
]

async function attachMovie(notification) {
  if (!notification.movieTitle) return notification

  try {
    const results = await searchMovies(notification.movieTitle)
    const movie = results?.[0]

    if (!movie) {
      return {
        ...notification,
        movie: notification.fallbackMovie,
      }
    }

    return {
      ...notification,
      movie: {
        ...movie,
        title: movie.title || notification.movieTitle,
        genre: notification.fallbackMovie?.genre || '영화',
        rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : notification.fallbackMovie?.rating,
        gradient: notification.fallbackMovie?.gradient || 'from-[#2d1b4e] to-[#4a3268]',
        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
      },
    }
  } catch (error) {
    console.error('[Notification movie]', error)
    return {
      ...notification,
      movie: notification.fallbackMovie,
    }
  }
}

export async function getNotifications(category = 'all') {
  await new Promise(resolve => setTimeout(resolve, 300))
  const notifications = await Promise.all(mockNotifications.map(attachMovie))

  if (category === 'all') return notifications
  return notifications
}

export async function markNotificationRead(id) {
  await new Promise(resolve => setTimeout(resolve, 150))
  return { success: true }
}

export async function markAllNotificationsRead() {
  await new Promise(resolve => setTimeout(resolve, 200))
  return { success: true }
}
