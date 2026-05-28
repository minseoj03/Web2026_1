/**
 * 영화 API 서비스 레이어
 * 
 * 왜 분리하는가?
 * - 컴포넌트에서 fetch 로직을 직접 작성하면 재사용 불가, 테스트 어려움
 * - API 엔드포인트 변경 시 한 곳만 수정하면 됨
 * - 에러 핸들링, 토큰 첨부 등 공통 로직을 한 곳에서 관리
 * - 컴포넌트는 "데이터를 어떻게 보여줄지"만 담당
 */

const API_BASE = '/api' // TODO: 환경변수로 분리 (import.meta.env.VITE_API_URL)

// 공통 fetch 래퍼
async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO [API 연결]: Firebase Auth 토큰 첨부
      // 'Authorization': `Bearer ${await getFirebaseToken()}`
      ...options.headers,
    },
    ...options,
  })
  if (!response.ok) throw new Error(`API Error: ${response.status}`)
  return response.json()
}

/**
 * 감정 기반 영화 추천 조회
 * @param {string} emotionId - 감정 태그 ID (bored, sleepless, rainy 등)
 * @param {string[]|null} ottFilter - OTT 필터 배열 (null이면 전체)
 */
export async function getEmotionMovies(emotionId, ottFilter = null) {
  // TODO [API 연결]: 실제 API 호출로 교체
  // const params = new URLSearchParams({ emotion: emotionId })
  // if (ottFilter) params.append('ott', ottFilter.join(','))
  // return fetchApi(`/movies/emotion?${params}`)

  // [API 연결 후 삭제] 임시 딜레이 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 300))
  return null // Home에서 로컬 데이터 사용
}

/**
 * 영화 상세 정보 조회
 * @param {string} movieId - 영화 ID 또는 TMDB ID
 */
export async function getMovieDetail(movieId) {
  // TODO [API 연결]: 실제 API 호출로 교체
  // return fetchApi(`/movies/${movieId}`)
  // 또는 TMDB: `https://api.themoviedb.org/3/movie/${movieId}?api_key=...&language=ko-KR`

  await new Promise(resolve => setTimeout(resolve, 500))
  return null
}

/**
 * OTT별 인기 영화 조회
 * @param {string} ottId - OTT ID (netflix, disney 등)
 */
export async function getOttRankingMovies(ottId) {
  // TODO [API 연결]: 실제 API 호출로 교체
  // return fetchApi(`/movies/ott/${ottId}`)

  await new Promise(resolve => setTimeout(resolve, 300))
  return null
}

/**
 * 친구 활동 피드 조회
 * @param {number} limit - 가져올 개수
 */
export async function getFriendActivity(limit = 3) {
  // TODO [API 연결]: return fetchApi(`/friends/activity?limit=${limit}`)
  await new Promise(resolve => setTimeout(resolve, 200))
  return null
}

/**
 * AI 맞춤 추천 영화 조회 (Hero Section용)
 */
export async function getPersonalRecommendation() {
  // TODO [API 연결]: return fetchApi('/recommendations/personal')
  await new Promise(resolve => setTimeout(resolve, 400))
  return null
}

/**
 * 영화 검색
 * @param {string} query - 검색어
 */
export async function searchMovies(query) {
  // TODO [API 연결]: return fetchApi(`/movies/search?q=${encodeURIComponent(query)}`)
  // 또는 TMDB: `https://api.themoviedb.org/3/search/movie?query=${query}&language=ko-KR`
  await new Promise(resolve => setTimeout(resolve, 300))
  return []
}
