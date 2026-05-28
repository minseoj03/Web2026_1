/**
 * MyPage API 서비스 레이어
 */

// [API 연결 후 삭제] Mock 데이터
const watchedMock = [
  { id: 'w1', title: '인터스텔라', genre: 'SF', rating: 5.0, date: '2024.05.18', review: '인생 영화. 매번 볼 때마다 새로운 감동.', gradient: 'from-[#1e3a8a] to-[#3b82f6]', ott: ['netflix'] },
  { id: 'w2', title: '라라랜드', genre: '로맨스', rating: 4.5, date: '2024.05.02', review: 'OST가 너무 좋고 영상미가 아름다워요.', gradient: 'from-[#fef3c7] to-[#fbbf24]', ott: ['netflix'] },
  { id: 'w3', title: '어바웃 타임', genre: '로맨스', rating: 4.5, date: '2024.04.15', review: '따뜻하고 잔잔한 영화.', gradient: 'from-[#2d1b4e] to-[#4a3268]', ott: ['netflix'] },
  { id: 'w4', title: '기생충', genre: '드라마', rating: 5.0, date: '2024.03.20', review: '봉준호 감독 천재... 반전에 반전.', gradient: 'from-[#831843] to-[#be185d]', ott: ['netflix', 'wavve'] },
  { id: 'w5', title: '비긴 어게인', genre: '음악', rating: 4.0, date: '2024.02.22', review: '음악이 좋고 뉴욕 분위기 최고.', gradient: 'from-[#064e3b] to-[#059669]', ott: ['netflix'] },
]

const wishlistMock = [
  { id: 'wl1', title: '듄: 파트 2', genre: 'SF', gradient: 'from-[#78350f] to-[#b45309]', addedDate: '2024.05.15' },
  { id: 'wl2', title: '오펜하이머', genre: '드라마', gradient: 'from-[#18181b] to-[#3f3f46]', addedDate: '2024.05.10' },
  { id: 'wl3', title: '위시', genre: '애니메이션', gradient: 'from-[#312e81] to-[#6366f1]', addedDate: '2024.04.28' },
  { id: 'wl4', title: '킬러스 오브 더 플라워 문', genre: '드라마', gradient: 'from-[#7c2d12] to-[#ea580c]', addedDate: '2024.04.20' },
  { id: 'wl5', title: '엘리멘탈', genre: '애니메이션', gradient: 'from-[#0c4a6e] to-[#0ea5e9]', addedDate: '2024.03.30' },
]

export async function getWatchedMovies(userId) {
  // TODO [API 연결]: return fetch(`/api/users/${userId}/watched`).then(r => r.json())
  await new Promise(r => setTimeout(r, 400))
  return watchedMock
}

export async function getWishlistMovies(userId) {
  // TODO [API 연결]: return fetch(`/api/users/${userId}/wishlist`).then(r => r.json())
  await new Promise(r => setTimeout(r, 300))
  return wishlistMock
}

export async function addWatchedMovie(userId, movie) {
  // TODO [API 연결]: POST /api/users/${userId}/watched
  await new Promise(r => setTimeout(r, 200))
  return { ...movie, id: `w-${Date.now()}`, date: new Date().toISOString().slice(0, 10).replace(/-/g, '.') }
}

export async function deleteWatchedMovie(userId, movieId) {
  // TODO [API 연결]: DELETE /api/users/${userId}/watched/${movieId}
  await new Promise(r => setTimeout(r, 200))
  return { success: true }
}

export async function addWishlistMovie(userId, movie) {
  // TODO [API 연결]: POST /api/users/${userId}/wishlist
  await new Promise(r => setTimeout(r, 200))
  return { ...movie, id: `wl-${Date.now()}`, addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.') }
}

export async function deleteWishlistMovie(userId, movieId) {
  // TODO [API 연결]: DELETE /api/users/${userId}/wishlist/${movieId}
  await new Promise(r => setTimeout(r, 200))
  return { success: true }
}
