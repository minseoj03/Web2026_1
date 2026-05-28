/**
 * LoadingButton - 로딩 상태를 가진 버튼 (회원가입, 로그인 등)
 * loading=true 시 스피너 + 텍스트 표시, 중복 클릭 방지
 */
export default function LoadingButton({
  loading = false,
  loadingText = '처리 중…',
  children,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`relative flex items-center justify-center gap-2 transition-all duration-200 ${
        loading || disabled ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'
      } ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
      )}
      <span>{loading ? loadingText : children}</span>
    </button>
  )
}
