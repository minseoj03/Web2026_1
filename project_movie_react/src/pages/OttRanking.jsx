import { useState } from 'react'

const ottTabs = [
  { id: 'netflix', label: '넷플릭스', icon: 'N', color: 'bg-[#e50914]' },
  { id: 'disney', label: '디즈니+', icon: 'D+', color: 'bg-[#113cff]' },
  { id: 'wavve', label: '웨이브', icon: 'W', color: 'bg-[#1a73e8]' },
  { id: 'tving', label: '티빙', icon: 'T', color: 'bg-[#ff153c]' },
  { id: 'coupang', label: '쿠팡플레이', icon: 'C', color: 'bg-[#00b8e6]' },
  { id: 'all', label: '전체', icon: '', color: '' },
]

// TODO: TMDB API에서 OTT별 인기 영화 데이터를 받아올 예정
// const fetchOttMovies = async (ottId) => {
//   const response = await fetch(`/api/movies/ott/${ottId}`)
//   return response.json()
// }
// useEffect(() => { fetchOttMovies(selectedOtt).then(setMovies) }, [selectedOtt])

// 임시 데이터 (TMDB API 연동 시 제거)
const tempMovies = {
  netflix: [
    { rank: 1, title: '인터스텔라', genre: 'SF', rating: 4.6, gradient: 'from-[#1e3a8a] to-[#3b82f6]' },
    { rank: 2, title: '라라랜드', genre: '로맨스', rating: 4.5, gradient: 'from-[#fef3c7] to-[#fbbf24]' },
    { rank: 3, title: '어바웃 타임', genre: '로맨스', rating: 4.5, gradient: 'from-[#2d1b4e] to-[#4a3268]' },
    { rank: 4, title: '위플래쉬', genre: '드라마', rating: 4.4, gradient: 'from-[#7c2d12] to-[#ea580c]' },
    { rank: 5, title: '기생충', genre: '스릴러', rating: 4.4, gradient: 'from-[#831843] to-[#be185d]' },
    { rank: 6, title: '비긴 어게인', genre: '음악', rating: 4.3, gradient: 'from-[#064e3b] to-[#059669]' },
    { rank: 7, title: '스즈메의 문단속', genre: '애니메이션', rating: 4.5, gradient: 'from-[#312e81] to-[#6366f1]' },
    { rank: 8, title: '그랜드 부다페스트 호텔', genre: '코미디', rating: 4.4, gradient: 'from-[#9d174d] to-[#db2777]' },
    { rank: 9, title: '올드보이', genre: '스릴러', rating: 4.3, gradient: 'from-[#1e293b] to-[#475569]' },
    { rank: 10, title: '아바타: 물의 길', genre: 'SF', rating: 4.2, gradient: 'from-[#581c87] to-[#a855f7]' },
  ],
  disney: [
    { rank: 1, title: '코코', genre: '애니메이션', rating: 4.7, gradient: 'from-[#f97316] to-[#fbbf24]' },
    { rank: 2, title: '소울', genre: '애니메이션', rating: 4.6, gradient: 'from-[#312e81] to-[#6366f1]' },
    { rank: 3, title: '겨울왕국', genre: '애니메이션', rating: 4.5, gradient: 'from-[#cffafe] to-[#06b6d4]' },
    { rank: 4, title: '인사이드 아웃', genre: '애니메이션', rating: 4.6, gradient: 'from-[#fb923c] to-[#fbbf24]' },
    { rank: 5, title: '엘리멘탈', genre: '애니메이션', rating: 4.3, gradient: 'from-[#0c4a6e] to-[#0ea5e9]' },
  ],
  wavve: [
    { rank: 1, title: '클래식', genre: '로맨스', rating: 4.4, gradient: 'from-[#475569] to-[#94a3b8]' },
    { rank: 2, title: '비포 선라이즈', genre: '로맨스', rating: 4.6, gradient: 'from-[#7c2d12] to-[#b45309]' },
    { rank: 3, title: '날씨의 아이', genre: '애니메이션', rating: 4.4, gradient: 'from-[#0c4a6e] to-[#0ea5e9]' },
    { rank: 4, title: '미드소마', genre: '스릴러', rating: 4.0, gradient: 'from-[#fef3c7] to-[#fbbf24]' },
    { rank: 5, title: '러브레터', genre: '로맨스', rating: 4.5, gradient: 'from-[#e0f2fe] to-[#38bdf8]' },
  ],
  tving: [
    { rank: 1, title: '극한직업', genre: '코미디', rating: 4.4, gradient: 'from-[#fbbf24] to-[#f59e0b]' },
    { rank: 2, title: '범죄도시', genre: '액션', rating: 4.3, gradient: 'from-[#1e293b] to-[#475569]' },
    { rank: 3, title: '서울의 봄', genre: '드라마', rating: 4.5, gradient: 'from-[#18181b] to-[#3f3f46]' },
    { rank: 4, title: '파묘', genre: '미스터리', rating: 4.2, gradient: 'from-[#064e3b] to-[#059669]' },
    { rank: 5, title: '탈출', genre: '스릴러', rating: 4.1, gradient: 'from-[#7c2d12] to-[#ea580c]' },
  ],
  coupang: [
    { rank: 1, title: '스파이더맨: 노 웨이 홈', genre: '액션', rating: 4.4, gradient: 'from-[#dc2626] to-[#ef4444]' },
    { rank: 2, title: '탑건: 매버릭', genre: '액션', rating: 4.5, gradient: 'from-[#1e3a8a] to-[#0ea5e9]' },
    { rank: 3, title: '존 윅 4', genre: '액션', rating: 4.3, gradient: 'from-[#18181b] to-[#3f3f46]' },
    { rank: 4, title: '미션 임파서블', genre: '액션', rating: 4.4, gradient: 'from-[#0f172a] to-[#334155]' },
    { rank: 5, title: '듄: 파트 2', genre: 'SF', rating: 4.5, gradient: 'from-[#78350f] to-[#b45309]' },
  ],
}

// 전체 = 모든 OTT 합쳐서 rating 순 정렬
tempMovies.all = Object.values(tempMovies).flat()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 10)
  .map((m, i) => ({ ...m, rank: i + 1 }))

export default function OttRanking() {
  const [selectedOtt, setSelectedOtt] = useState('netflix')

  // TODO: TMDB API 연동 시 아래 임시 데이터를 API 호출로 교체
  const movies = tempMovies[selectedOtt] || []

  return (
    <div className="px-8 pb-8">
      <h1 className="text-2xl font-extrabold mb-1">🔥 OTT별 인기 영화 TOP</h1>
      <p className="text-sm text-gray-500 mb-6">실시간으로 가장 많이 시청되는 영화를 OTT별로 확인해보세요.</p>

      {/* OTT Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {ottTabs.map(ott => (
          <button
            key={ott.id}
            onClick={() => setSelectedOtt(ott.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${
              selectedOtt === ott.id
                ? 'bg-[#7c5cff] text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-[#9b85ff] hover:text-[#7c5cff]'
            }`}
          >
            {ott.icon && (
              <span className={`w-5 h-5 rounded text-[10px] ${ott.color} grid place-items-center text-white font-extrabold`}>{ott.icon}</span>
            )}
            {ott.label}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 gap-4">
        {movies.map(movie => (
          <div key={`${movie.title}-${movie.rank}`} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-md transition relative">
            {/* Rank Badge */}
            <div className={`absolute top-0 left-3.5 w-8 h-9 grid place-items-center text-white font-extrabold text-base rounded-b-lg z-10 ${
              movie.rank === 1 ? 'bg-gradient-to-b from-[#fbbf24] to-[#f59e0b]' :
              movie.rank === 2 ? 'bg-gradient-to-b from-[#d1d5db] to-[#9ca3af]' :
              movie.rank === 3 ? 'bg-gradient-to-b from-[#fb923c] to-[#ea580c]' :
              'bg-[#7c5cff]'
            }`}>
              {movie.rank}
            </div>

            {/* Poster */}
            {/* TODO: TMDB poster_path로 실제 이미지 표시 */}
            {/* <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} /> */}
            <div className={`aspect-[2/3] rounded-xl bg-gradient-to-br ${movie.gradient} grid place-items-end text-white font-extrabold text-sm p-3 text-center mb-2.5`}>
              {movie.title}
            </div>

            <p className="text-sm font-bold truncate">{movie.title}</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
              <span className="font-semibold">⭐ {movie.rating}</span>
              <span>·</span>
              <span>{movie.genre}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
