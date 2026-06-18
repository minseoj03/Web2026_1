import { searchMovies } from './movieApi'
import { getMockUserById, toPublicUser } from '../data/mockUsers'

const mockActivities = [
  { id: 'a1', actorId: 'user-woojin', type: 'review', desc: '영화 평가를 남겼어요', movieTitle: '어바웃 타임', movieColor: 'from-[#2d1b4e] to-[#4a3268]', genre: '로맨스, 판타지', year: 2013, rating: 4.5, review: '"따뜻하고 잔잔해서 볼 때마다 힐링돼요."', time: '30분 전', likes: 3, comments: [{ userId: 'user-minji', text: '나도 좋아하는 영화!' }, { userId: 'user-seyoung', text: '다음에 같이 보자' }] },
  { id: 'a2', actorId: 'user-seyoung', type: 'watched', desc: '영화를 시청 완료했어요 🎬', movieTitle: '인터스텔라', movieColor: 'from-[#1e3a8a] to-[#3b82f6]', genre: 'SF, 드라마', year: 2014, rating: 4.6, time: '1시간 전', likes: 5, comments: [{ userId: 'user-woojin', text: '어땠어??' }, { userId: 'user-hojun', text: '명작이지' }, { userId: 'user-minji', text: '나도 다시 보고 싶다' }] },
  { id: 'a3', actorId: 'user-minji', type: 'review', desc: '영화 평가를 남겼어요', movieTitle: '기생충', movieColor: 'from-[#831843] to-[#be185d]', genre: '스릴러, 드라마', year: 2019, rating: 5.0, review: '"봉준호 감독 천재... 반전에 반전!"', time: '5시간 전', likes: 8, comments: [{ userId: 'user-hojun', text: '완전 동의' }] },
  { id: 'a4', actorId: 'user-hojun', type: 'watched', desc: '영화를 시청 완료했어요 🎬', movieTitle: '스파이더맨: 노 웨이 홈', movieColor: 'from-[#dc2626] to-[#ef4444]', genre: '액션, SF', year: 2021, rating: 4.4, time: '8시간 전', likes: 2, comments: [] },
  { id: 'a5', actorId: 'user-woojin', type: 'watched', desc: '영화를 시청 완료했어요 🎬', movieTitle: '비긴 어게인', movieColor: 'from-[#064e3b] to-[#059669]', genre: '음악, 로맨스', year: 2013, rating: 4.3, time: '어제', likes: 4, comments: [{ userId: 'user-seyoung', text: 'OST 좋지!' }] },
  { id: 'a6', actorId: 'user-seyoung', type: 'review', desc: '영화 평가를 남겼어요', movieTitle: '라라랜드', movieColor: 'from-[#fef3c7] to-[#fbbf24]', genre: '로맨스, 뮤지컬', year: 2016, rating: 4.5, review: '"OST 너무 좋고 영상미가 미쳤어요. 인생 영화!"', time: '어제', likes: 12, comments: [{ userId: 'user-minji', text: '완전 공감!!' }, { userId: 'user-woojin', text: '나도 좋아해' }] },
]

async function attachMovie(activity) {
  const actor = toPublicUser(getMockUserById(activity.actorId))
  const hydratedActivity = {
    ...activity,
    name: actor?.name || '친구',
    initial: actor?.initial || '?',
    color: actor?.color || 'from-[#a78bfa] to-[#7c3aed]',
    comments: activity.comments.map(comment => ({
      ...comment,
      name: getMockUserById(comment.userId)?.name || '친구',
    })),
  }

  try {
    const results = await searchMovies(activity.movieTitle)
    const movie = results?.[0]

    if (!movie) {
      return {
        ...hydratedActivity,
        movie: activity.movieTitle,
        movieDetail: {
          id: activity.id,
          title: activity.movieTitle,
          genre: activity.genre,
          rating: activity.rating,
          gradient: activity.movieColor,
        },
      }
    }

    return {
      ...hydratedActivity,
      movie: movie.title || activity.movieTitle,
      year: movie.release_date?.slice(0, 4) || activity.year,
      rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : activity.rating,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
      movieDetail: {
        ...movie,
        title: movie.title || activity.movieTitle,
        genre: activity.genre,
        rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : activity.rating,
        gradient: activity.movieColor,
        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      },
    }
  } catch (error) {
    console.error('[Friend activity movie]', error)
    return {
      ...hydratedActivity,
      movie: activity.movieTitle,
      movieDetail: {
        id: activity.id,
        title: activity.movieTitle,
        genre: activity.genre,
        rating: activity.rating,
        gradient: activity.movieColor,
      },
    }
  }
}

export async function getFriendActivities(friendIds = []) {
  await new Promise(resolve => setTimeout(resolve, 300))
  const allowedIds = new Set(friendIds)
  const activities = friendIds.length > 0
    ? mockActivities.filter(activity => allowedIds.has(activity.actorId))
    : mockActivities
  return Promise.all(activities.map(attachMovie))
}

export async function likeActivity(activityId) {
  void activityId
  await new Promise(resolve => setTimeout(resolve, 200))
  return { success: true }
}

export async function commentActivity(activityId, text) {
  void activityId
  void text
  await new Promise(resolve => setTimeout(resolve, 200))
  return { success: true }
}
