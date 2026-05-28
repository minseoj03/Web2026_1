/**
 * 알림 API 서비스
 * 서버에서는 type + 데이터만 내려줌
 * 프론트에서 template 기반으로 title/desc 자동 생성
 */

// [API 연결 후 삭제] Mock 데이터 (새 템플릿 구조)
const mockNotifications = [
  { id: 1, type: 'movie_recommend_friend', actorName: '민지', message: '정말 따뜻한 영화예요! 꼭 봐보세요 💜', movie: { title: '라라랜드', genre: '로맨스, 뮤지컬', rating: 4.5, gradient: 'from-[#fef3c7] to-[#fbbf24]' }, time: '10분 전', read: false },
  { id: 2, type: 'movie_recommend_ai', message: '취향 일치 95%! 지금 확인해보세요.', movie: { title: '비포 선라이즈', genre: '로맨스', rating: 4.6, gradient: 'from-[#7c2d12] to-[#b45309]' }, time: '2시간 전', read: false },
  { id: 3, type: 'movie_recommend_friend', actorName: '호준', message: '액션 좋아하면 무조건 봐야 해요! 🔥', movie: { title: '스파이더맨: 노 웨이 홈', genre: '액션, SF', rating: 4.4, gradient: 'from-[#dc2626] to-[#ef4444]' }, time: '5시간 전', read: false },
  { id: 4, type: 'movie_recommend_friend', actorName: '우진', message: '반전이 미쳤어요! 꼭 보세요', movie: { title: '기생충', genre: '스릴러, 드라마', rating: 4.4, gradient: 'from-[#831843] to-[#be185d]' }, time: '어제', read: true },
  { id: 5, type: 'vote_result', roomName: '주말에 뭐 볼까?', movieTitle: '어바웃 타임', time: '25분 전', read: false },
  { id: 6, type: 'vote_invite', actorName: '세영', roomName: '금요일 영화의 밤', time: '1시간 전', read: false },
  { id: 7, type: 'realtime_review', actorName: '우진', movieTitle: '인터스텔라', rating: 4.8, time: '방금', read: false },
  { id: 8, type: 'friend_add', actorName: '호준', time: '2일 전', read: true },
  { id: 9, type: 'vote_result', roomName: '감성 로맨스 모임', movieTitle: '비포 선라이즈', time: '3일 전', read: true },
]

export async function getNotifications(category = 'all') {
  // TODO [API 연결]: GET /api/notifications?category=${category}
  await new Promise(r => setTimeout(r, 400))
  if (category === 'all') return mockNotifications
  // category 기반 필터는 template에서 처리
  return mockNotifications
}

export async function markNotificationRead(id) {
  // TODO [API 연결]: PUT /api/notifications/:id/read
  await new Promise(r => setTimeout(r, 150))
  return { success: true }
}

export async function markAllNotificationsRead() {
  // TODO [API 연결]: PUT /api/notifications/read-all
  await new Promise(r => setTimeout(r, 200))
  return { success: true }
}
