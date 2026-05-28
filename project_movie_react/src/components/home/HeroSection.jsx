import { useWishlist } from '../../contexts/WishlistContext'

export default function HeroSection() {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const heroMovie = { id: 'hero-1', title: '어바웃 타임', genre: '로맨스', rating: 4.5, gradient: 'from-[#2d1b4e] to-[#4a3268]' }
  const wishlisted = isWishlisted(heroMovie.id)

  return (
    <section className="bg-white rounded-2xl p-7 shadow-sm">
      <p className="text-sm text-gray-500 mb-1.5">안녕하세요, 송이님! 👋</p>
      <h1 className="text-2xl font-extrabold mb-2">회원님을 위한 맞춤 추천 <span className="text-[#7c5cff]">💜</span></h1>
      <p className="text-sm text-gray-500 mb-5">시청 기록, 평점, 취향, 구독 OTT, 친구 반응을 종합 분석했어요.</p>

      {/* Featured Movie */}
      <div className="grid grid-cols-[clamp(180px,20vw,280px)_1fr] max-md:grid-cols-1 gap-[clamp(1rem,2vw,1.75rem)]">
        <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#2d1b4e] to-[#4a3268] grid place-items-center text-white cursor-pointer hover:-translate-y-0.5 transition">
          <span className="absolute top-3 left-3 bg-[#7c5cff] text-white px-2.5 py-1 rounded-full text-[11px] font-bold">오늘의 추천</span>
          <div className="w-14 h-14 bg-white/95 rounded-full grid place-items-center text-[#7c5cff] text-lg mb-16">▶</div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-extrabold mb-1">어바웃 타임</h3>
            <p className="text-[11px] opacity-80">About Time</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold mb-3">어바웃 타임</h2>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-[#f3f0ff] text-[#7c5cff] px-3 py-1.5 rounded-full text-xs font-bold">취향 일치 91%</span>
            <span className="text-sm font-semibold">⭐ 4.5 <span className="text-gray-400 font-normal">(12,345명)</span></span>
          </div>
          <p className="text-xs text-gray-500 mb-3.5">로맨스, 판타지 · 2013 · 123분</p>
          <p className="text-sm text-[#7c5cff] font-bold mb-2.5">추천 이유</p>
          <ul className="flex flex-col gap-2 mb-5 text-sm">
            {['최근 본 "라라랜드"와 비슷한 감성의 로맨스 영화예요', '따뜻하고 잔잔한 분위기를 좋아하는 취향과 잘 맞아요', '넷플릭스에서 시청 가능해요 (구독 중)'].map(r => (
              <li key={r} className="flex items-center gap-2"><span className="text-[#7c5cff] font-bold">✓</span>{r}</li>
            ))}
          </ul>
          <div className="flex gap-2 mt-auto flex-wrap">
            <button className="px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold flex items-center gap-1.5">
              <span className="w-[18px] h-[18px] bg-[#e50914] rounded text-[9px] grid place-items-center font-extrabold">N</span>
              넷플릭스에서 보기 ↗
            </button>
            <button onClick={() => toggleWishlist(heroMovie)} className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${wishlisted ? "bg-[#7c5cff] text-white" : "bg-white border border-gray-200 hover:border-[#7c5cff] hover:text-[#7c5cff]"}`}>{wishlisted ? "💜 찜 완료" : "❤️ 찜하기"}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
