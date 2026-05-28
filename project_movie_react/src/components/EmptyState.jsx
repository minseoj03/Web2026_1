/**
 * EmptyState - 데이터가 없을 때 표시하는 공통 컴포넌트
 * 
 * 왜 Empty State가 중요한가?
 * - 빈 화면은 사용자에게 "에러인가?" 혼란을 줌
 * - 명확한 메시지 + 행동 유도(CTA)로 이탈 방지
 * - 필터 결과 없음, 검색 결과 없음, 목록 비어있음 등 다양한 상황에 재사용
 */

export default function EmptyState({ 
  icon = '🎬', 
  title = '표시할 콘텐츠가 없어요', 
  description = '',
  action = null, // { label: '버튼 텍스트', onClick: () => {} }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-base font-bold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-[280px]">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-[#7c5cff] text-white rounded-lg text-sm font-semibold hover:bg-[#5d3ee8] transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
