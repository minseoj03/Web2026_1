import { useState, useEffect, useRef } from 'react'
import { useFilter } from '../../contexts/FilterContext'
import MovieCard, { MovieCardSkeleton } from '../MovieCard'
import EmptyState from '../EmptyState'

/**
 * EmotionSection - AI 감정 기반 추천 영역
 * 
 * 구조:
 * - 감정 태그 선택 → 해당 감정의 영화 리스트 표시
 * - OTT 필터 적용 시 구독 OTT 영화만 표시
 * - 로딩 시 Skeleton, 결과 없으면 EmptyState
 * 
 * API 연결 시:
 * - useEffect에서 getEmotionMovies(selectedEmotion, ottFilter) 호출
 * - 현재는 로컬 데이터 사용
 */

const emotionTags = [
  { id: 'bored', icon: '🍿', label: '무료할 때' },
  { id: 'sleepless', icon: '🌙', label: '잠 안 올 때' },
  { id: 'alone-drink', icon: '🍺', label: '혼술할 때' },
  { id: 'bed', icon: '🛏', label: '침대에 누웠을 때' },
  { id: 'commute', icon: '🚇', label: '이동 중일 때' },
  { id: 'rainy', icon: '☔', label: '비 오는 날' },
  { id: 'winter', icon: '❄️', label: '겨울 감성' },
  { id: 'dawn', icon: '🌅', label: '새벽 감성' },
  { id: 'weekend', icon: '☀️', label: '주말 아침' },
]

// [API 연결 후 삭제] 임시 데이터
// 실제 서비스에서는 각 영화에 ott 필드가 포함됨
// 예: { id: 1, title: '극한직업', ott: ['netflix', 'tving'], ... }
const emotionMovieData = {
  bored: [
    { id: 1, title: '극한직업', genre: '코미디', rating: 4.4, gradient: 'from-[#fbbf24] to-[#f59e0b]', ott: ['netflix', 'tving'] },
    { id: 2, title: '엑스트랙션', genre: '액션', rating: 4.2, gradient: 'from-[#1e293b] to-[#475569]', ott: ['netflix'] },
    { id: 3, title: '스즈메의 문단속', genre: '애니', rating: 4.5, gradient: 'from-[#312e81] to-[#6366f1]', ott: ['wavve'] },
    { id: 4, title: '베이비 드라이버', genre: '액션', rating: 4.3, gradient: 'from-[#7c2d12] to-[#ea580c]', ott: ['netflix'] },
    { id: 5, title: '인사이드 아웃', genre: '애니', rating: 4.6, gradient: 'from-[#fb923c] to-[#fbbf24]', ott: ['disney'] },
  ],
  sleepless: [
    { id: 6, title: '컨저링', genre: '공포', rating: 4.2, gradient: 'from-[#18181b] to-[#3f3f46]', ott: ['netflix'] },
    { id: 7, title: '기생충', genre: '스릴러', rating: 4.4, gradient: 'from-[#831843] to-[#be185d]', ott: ['netflix', 'wavve'] },
    { id: 8, title: '셔터 아일랜드', genre: '미스터리', rating: 4.5, gradient: 'from-[#1e3a8a] to-[#1e40af]', ott: ['netflix'] },
    { id: 9, title: '미드소마', genre: '스릴러', rating: 4.0, gradient: 'from-[#fef3c7] to-[#fbbf24]', ott: ['wavve'] },
    { id: 10, title: '유전', genre: '공포', rating: 4.1, gradient: 'from-[#450a0a] to-[#7f1d1d]', ott: ['wavve'] },
  ],
  'alone-drink': [
    { id: 11, title: '심야식당', genre: '드라마', rating: 4.5, gradient: 'from-[#422006] to-[#78350f]', ott: ['netflix'] },
    { id: 12, title: '리틀 포레스트', genre: '드라마', rating: 4.4, gradient: 'from-[#064e3b] to-[#059669]', ott: ['netflix', 'wavve'] },
    { id: 13, title: '카모메 식당', genre: '드라마', rating: 4.3, gradient: 'from-[#fef3c7] to-[#d97706]', ott: ['wavve'] },
    { id: 14, title: '비긴 어게인', genre: '음악', rating: 4.3, gradient: 'from-[#064e3b] to-[#059669]', ott: ['netflix'] },
    { id: 15, title: '500일의 썸머', genre: '로맨스', rating: 4.4, gradient: 'from-[#1e3a8a] to-[#3b82f6]', ott: ['disney'] },
  ],
  bed: [
    { id: 16, title: '코코', genre: '애니', rating: 4.7, gradient: 'from-[#f97316] to-[#fbbf24]', ott: ['disney'] },
    { id: 17, title: '소울', genre: '애니', rating: 4.6, gradient: 'from-[#312e81] to-[#6366f1]', ott: ['disney'] },
    { id: 18, title: '하울의 움직이는 성', genre: '애니', rating: 4.6, gradient: 'from-[#0c4a6e] to-[#0284c7]', ott: ['netflix'] },
    { id: 19, title: '센과 치히로', genre: '애니', rating: 4.7, gradient: 'from-[#7c2d12] to-[#c2410c]', ott: ['netflix'] },
    { id: 20, title: '월-E', genre: '애니', rating: 4.6, gradient: 'from-[#fbbf24] to-[#fef3c7]', ott: ['disney'] },
  ],
  commute: [
    { id: 4, title: '베이비 드라이버', genre: '액션', rating: 4.3, gradient: 'from-[#7c2d12] to-[#ea580c]', ott: ['netflix'] },
    { id: 1, title: '극한직업', genre: '코미디', rating: 4.4, gradient: 'from-[#fbbf24] to-[#f59e0b]', ott: ['netflix', 'tving'] },
    { id: 15, title: '500일의 썸머', genre: '로맨스', rating: 4.4, gradient: 'from-[#1e3a8a] to-[#3b82f6]', ott: ['disney'] },
    { id: 21, title: '미드나잇 인 파리', genre: '로맨스', rating: 4.5, gradient: 'from-[#422006] to-[#ca8a04]', ott: ['wavve'] },
    { id: 5, title: '인사이드 아웃', genre: '애니', rating: 4.6, gradient: 'from-[#fb923c] to-[#fbbf24]', ott: ['disney'] },
  ],
  rainy: [
    { id: 22, title: '클래식', genre: '로맨스', rating: 4.4, gradient: 'from-[#475569] to-[#94a3b8]', ott: ['wavve'] },
    { id: 23, title: '날씨의 아이', genre: '애니', rating: 4.4, gradient: 'from-[#0c4a6e] to-[#0ea5e9]', ott: ['netflix'] },
    { id: 24, title: '비포 선라이즈', genre: '로맨스', rating: 4.6, gradient: 'from-[#7c2d12] to-[#b45309]', ott: ['wavve'] },
    { id: 25, title: '레인 맨', genre: '드라마', rating: 4.5, gradient: 'from-[#1e293b] to-[#64748b]', ott: ['wavve'] },
    { id: 26, title: '어바웃 타임', genre: '로맨스', rating: 4.5, gradient: 'from-[#2d1b4e] to-[#4a3268]', ott: ['netflix'] },
  ],
  winter: [
    { id: 27, title: '러브레터', genre: '로맨스', rating: 4.5, gradient: 'from-[#e0f2fe] to-[#38bdf8]', ott: ['wavve'] },
    { id: 28, title: '겨울왕국', genre: '애니', rating: 4.5, gradient: 'from-[#cffafe] to-[#06b6d4]', ott: ['disney'] },
    { id: 29, title: '러브 액츄얼리', genre: '로맨스', rating: 4.6, gradient: 'from-[#fee2e2] to-[#ef4444]', ott: ['netflix'] },
    { id: 30, title: '나우 이즈 굿', genre: '드라마', rating: 4.3, gradient: 'from-[#ddd6fe] to-[#8b5cf6]', ott: ['wavve'] },
    { id: 31, title: '냉정과 열정 사이', genre: '로맨스', rating: 4.4, gradient: 'from-[#f1f5f9] to-[#94a3b8]', ott: ['wavve'] },
  ],
  dawn: [
    { id: 24, title: '비포 선라이즈', genre: '로맨스', rating: 4.6, gradient: 'from-[#7c2d12] to-[#b45309]', ott: ['wavve'] },
    { id: 21, title: '미드나잇 인 파리', genre: '로맨스', rating: 4.5, gradient: 'from-[#422006] to-[#ca8a04]', ott: ['wavve'] },
    { id: 32, title: '라라랜드', genre: '뮤지컬', rating: 4.5, gradient: 'from-[#fef3c7] to-[#fbbf24]', ott: ['netflix'] },
    { id: 33, title: '월플라워', genre: '드라마', rating: 4.4, gradient: 'from-[#134e4a] to-[#14b8a6]', ott: ['netflix'] },
    { id: 34, title: '해리포터', genre: '판타지', rating: 4.6, gradient: 'from-[#1e293b] to-[#475569]', ott: ['wavve', 'coupang'] },
  ],
  weekend: [
    { id: 26, title: '어바웃 타임', genre: '로맨스', rating: 4.5, gradient: 'from-[#2d1b4e] to-[#4a3268]', ott: ['netflix'] },
    { id: 14, title: '비긴 어게인', genre: '음악', rating: 4.3, gradient: 'from-[#064e3b] to-[#059669]', ott: ['netflix'] },
    { id: 12, title: '리틀 포레스트', genre: '드라마', rating: 4.4, gradient: 'from-[#84cc16] to-[#65a30d]', ott: ['netflix', 'wavve'] },
    { id: 13, title: '카모메 식당', genre: '드라마', rating: 4.3, gradient: 'from-[#fef3c7] to-[#d97706]', ott: ['wavve'] },
    { id: 35, title: '월터의 상상은 현실이 된다', genre: '드라마', rating: 4.5, gradient: 'from-[#0c4a6e] to-[#0ea5e9]', ott: ['disney'] },
  ],
}

export default function EmotionSection({ onMovieClick }) {
  const [selectedEmotion, setSelectedEmotion] = useState('bored')
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState(emotionMovieData['bored'])
  const { ottOnly, filterByOtt } = useFilter()
  const scrollRef = useRef(null)

  // 감정 변경 시 영화 로드
  useEffect(() => {
    setLoading(true)

    // TODO [API 연결]: getEmotionMovies(selectedEmotion, ottFilter) 호출로 교체
    // [API 연결 후 삭제] 아래 setTimeout 시뮬레이션 제거
    const timer = setTimeout(() => {
      const rawMovies = emotionMovieData[selectedEmotion] || []
      setMovies(rawMovies)
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [selectedEmotion])

  // OTT 필터 적용
  const filteredMovies = filterByOtt(movies)

  return (
    <section className="bg-gradient-to-br from-[#faf8ff] to-white rounded-2xl p-6 shadow-sm mt-6">
      <h2 className="text-base font-extrabold mb-1">
        AI 감정 기반 추천
        <span className="text-[10px] bg-[#7c5cff] text-white px-1.5 py-0.5 rounded ml-1 font-bold align-middle">BETA</span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">지금 기분에 딱 맞는 영화를 추천해드릴게요</p>

      {/* 감정 태그 - horizontal snap scroll */}
      <div className="relative mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pr-10 snap-x snap-mandatory scroll-smooth">
          {emotionTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedEmotion(tag.id)}
              className={`flex items-center gap-1.5 px-[clamp(0.75rem,1.2vw,0.875rem)] py-[clamp(0.5rem,0.8vw,0.625rem)] rounded-full text-[clamp(12px,0.9vw,14px)] font-semibold transition shrink-0 snap-start whitespace-nowrap ${
                selectedEmotion === tag.id
                  ? 'bg-[#7c5cff] text-white shadow-lg shadow-[#7c5cff]/30'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-[#f3f0ff] hover:border-[#9b85ff] hover:text-[#7c5cff]'
              }`}
            >
              <span>{tag.icon}</span>{tag.label}
            </button>
          ))}
        </div>
        {/* Fade */}
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#faf8ff] via-[#faf8ff]/80 to-transparent pointer-events-none rounded-r-xl" />
      </div>

      {/* 영화 리스트 */}
      <div className="relative">
        {!loading && filteredMovies.length > 0 && (
          <button onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition text-sm">‹</button>
        )}
        <div ref={scrollRef} className="flex gap-[clamp(0.75rem,1.2vw,0.875rem)] overflow-x-auto pb-2 scrollbar-hide">
          {loading ? (
            <MovieCardSkeleton count={5} />
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map(m => (
              <MovieCard key={m.id} movie={m} onClick={onMovieClick} />
            ))
          ) : (
            <div className="flex-1 min-w-full">
              <EmptyState
                icon="🔍"
                title="추천 가능한 영화가 없어요"
                description={ottOnly ? '현재 구독 OTT에서 이 감정에 맞는 영화를 찾지 못했어요. OTT 필터를 끄면 더 많은 영화를 볼 수 있어요.' : '이 감정에 맞는 영화를 준비 중이에요.'}
              />
            </div>
          )}
        </div>
        {!loading && filteredMovies.length > 0 && (
          <button onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 bg-white border border-gray-200 rounded-full grid place-items-center shadow-sm z-10 hover:border-[#7c5cff] hover:text-[#7c5cff] transition text-sm">›</button>
        )}
      </div>
    </section>
  )
}
