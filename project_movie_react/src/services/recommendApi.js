/**
 * 추천 API 서비스
 */

export async function sendMovieRecommendation(movieId, friendIds, message = '') {
  // TODO [API 연결]: POST /api/recommendations
  // body: { movieId, friendIds, message }
  await new Promise(r => setTimeout(r, 500))
  return { success: true, sentTo: friendIds.length }
}
