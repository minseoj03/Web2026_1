/**
 * MovieCard - 재사용 가능한 영화 카드 컴포넌트
 * 
 * 왜 분리하는가?
 * - Home, OttRanking, MyPage, 검색 결과, 추천 결과 등 여러 곳에서 동일한 카드 UI 사용
 * - 카드 디자인 변경 시 한 곳만 수정하면 전체 반영
 * - props로 크기/스타일 변형 가능 (compact, full 등)
 * - onClick 핸들러로 상세 모달 연결 통일
 */

export default function MovieCard({ movie, onClick, size = 'default' }) {
  const { title, genre, rating, gradient, poster } = movie

  const sizeClasses = {
    default: 'w-[clamp(120px,12vw,150px)]',
    compact: 'w-[clamp(100px,10vw,130px)]',
    full: 'w-full',
  }

  return (
    <div
      onClick={() => onClick?.(movie)}
      className={`shrink-0 ${sizeClasses[size]} cursor-pointer hover:-translate-y-1 transition group`}
    >
      {/* Poster */}
      {poster ? (
        // TODO [API 연결]: TMDB poster 이미지 사용
        <img
          src={poster}
          alt={title}
          className="aspect-[2/3] rounded-lg object-cover shadow-sm mb-2 w-full"
          loading="lazy"
        />
      ) : (
        // 포스터 없을 때 그라데이션 fallback
        <div className={`aspect-[2/3] rounded-lg bg-gradient-to-br ${gradient || 'from-gray-400 to-gray-600'} grid place-items-center text-white font-extrabold text-sm p-3 text-center shadow-sm mb-2`}>
          {title}
        </div>
      )}

      {/* Info */}
      <p className="text-sm font-bold truncate">{title}</p>
      <p className="text-[11px] text-gray-500">
        {rating && <span>⭐ {rating}</span>}
        {genre && <span> · {genre}</span>}
      </p>
    </div>
  )
}

/**
 * MovieCardSkeleton - 로딩 시 표시할 스켈레톤
 * 
 * 왜 Skeleton UI가 중요한가?
 * - 빈 화면보다 "곧 콘텐츠가 올 것"이라는 시각적 힌트 제공
 * - 사용자가 로딩을 기다리는 체감 시간 감소
 * - 레이아웃 시프트(CLS) 방지 → Core Web Vitals 개선
 */
export function MovieCardSkeleton({ count = 5, size = 'default' }) {
  const sizeClasses = {
    default: 'w-[clamp(120px,12vw,150px)]',
    compact: 'w-[clamp(100px,10vw,130px)]',
    full: 'w-full',
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`shrink-0 ${sizeClasses[size]} animate-pulse`}>
          <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </>
  )
}
