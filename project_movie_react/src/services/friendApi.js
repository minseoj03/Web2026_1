/**
 * 친구 활동 API 서비스
 */

// [API 연결 후 삭제] Mock 데이터
const mockActivities = [
  { id: 'a1', name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]', type: 'review', desc: '영화 평가를 남겼어요', movie: '어바웃 타임', movieColor: 'from-[#2d1b4e] to-[#4a3268]', genre: '로맨스, 판타지', year: 2013, rating: 4.5, review: '"따뜻하고 잔잔해서 볼 때마다 힐링돼요."', time: '30분 전', likes: 3, comments: [{ name: '민지', text: '나도 좋아하는 영화!' }, { name: '세영', text: '다음에 같이 보자' }] },
  { id: 'a2', name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]', type: 'watched', desc: '영화를 시청 완료했어요 🎬', movie: '인터스텔라', movieColor: 'from-[#1e3a8a] to-[#3b82f6]', genre: 'SF, 드라마', year: 2014, rating: 4.6, time: '1시간 전', likes: 5, comments: [{ name: '우진', text: '어땠어??' }, { name: '호준', text: '명작이지' }, { name: '민지', text: '나도 다시 보고 싶다' }] },
  { id: 'a3', name: '민지', initial: '민', color: 'from-[#fda4af] to-[#f43f5e]', type: 'review', desc: '영화 평가를 남겼어요', movie: '기생충', movieColor: 'from-[#831843] to-[#be185d]', genre: '스릴러, 드라마', year: 2019, rating: 5.0, review: '"봉준호 감독 천재... 반전에 반전!"', time: '5시간 전', likes: 8, comments: [{ name: '호준', text: '완전 동의' }] },
  { id: 'a4', name: '호준', initial: '호', color: 'from-[#fbbf24] to-[#f59e0b]', type: 'watched', desc: '영화를 시청 완료했어요 🎬', movie: '스파이더맨: 노 웨이 홈', movieColor: 'from-[#dc2626] to-[#ef4444]', genre: '액션, SF', year: 2021, rating: 4.4, time: '8시간 전', likes: 2, comments: [] },
  { id: 'a5', name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]', type: 'watched', desc: '영화를 시청 완료했어요 🎬', movie: '비긴 어게인', movieColor: 'from-[#064e3b] to-[#059669]', genre: '음악, 로맨스', year: 2013, rating: 4.3, time: '어제', likes: 4, comments: [{ name: '세영', text: 'OST 좋지!' }] },
  { id: 'a6', name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]', type: 'review', desc: '영화 평가를 남겼어요', movie: '라라랜드', movieColor: 'from-[#fef3c7] to-[#fbbf24]', genre: '로맨스, 뮤지컬', year: 2016, rating: 4.5, review: '"OST 너무 좋고 영상미가 미쳤어요. 인생 영화!"', time: '어제', likes: 12, comments: [{ name: '민지', text: '완전 공감!!' }, { name: '우진', text: '나도 좋아해' }] },
]

export async function getFriendActivities() {
  // TODO [API 연결]: GET /api/friends/feed
  await new Promise(r => setTimeout(r, 400))
  return mockActivities
}

export async function likeActivity(activityId) {
  // TODO [API 연결]: POST /api/friends/feed/:id/like
  await new Promise(r => setTimeout(r, 200))
  return { success: true }
}

export async function commentActivity(activityId, text) {
  // TODO [API 연결]: POST /api/friends/feed/:id/comment
  await new Promise(r => setTimeout(r, 200))
  return { success: true }
}
