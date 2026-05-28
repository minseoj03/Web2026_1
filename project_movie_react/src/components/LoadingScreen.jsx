/**
 * LoadingScreen - 전체 화면 로딩 (로그인 후 데이터 불러올 때)
 */
export default function LoadingScreen({ message = '사용자 정보를 불러오는 중입니다…' }) {
  return (
    <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-white">
      {/* Spinner */}
      <div className="w-10 h-10 border-[3px] border-gray-200 border-t-[#7c5cff] rounded-full animate-spin mb-5" />
      {/* Text */}
      <p className="text-sm font-medium text-gray-600 animate-pulse">{message}</p>
    </div>
  )
}
