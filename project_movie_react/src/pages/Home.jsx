/**
 * Home.jsx - 메인 홈 페이지
 * 
 * 구조 개선 포인트:
 * 1. 섹션별 컴포넌트 분리 → 유지보수 용이, 각 섹션 독립적 로딩/에러 처리
 * 2. MovieCard 공통 컴포넌트 → 재사용성
 * 3. FilterContext 연동 → OTT 필터 실시간 반영
 * 4. selectedMovie + MovieDetailModal → 영화 클릭 시 상세 모달
 * 5. API 서비스 레이어 분리 → 컴포넌트는 UI만 담당
 * 
 * 현재 구조의 장점:
 * - Context 기반 전역 상태로 GNB 토글이 즉시 반영됨
 * - 컴포넌트 분리로 각 섹션이 독립적으로 로딩/에러 처리 가능
 * - MovieCard 재사용으로 일관된 UI
 * 
 * 추후 개선 방향:
 * - React Query(TanStack Query) 도입 → 캐싱, 자동 리페치, 로딩 상태 자동 관리
 * - Suspense + ErrorBoundary → 선언적 로딩/에러 처리
 * - Intersection Observer → 무한 스크롤 또는 lazy loading
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import MovieDetailModal from '../components/MovieDetailModal'
import HeroSection from '../components/home/HeroSection'
import EmotionSection from '../components/home/EmotionSection'

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null)

  return (
    <>
      <div className="grid grid-cols-[1fr_clamp(260px,22vw,320px)] max-xl:grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] fluid-px pb-8">
        {/* Center Column */}
        <div>
          <HeroSection />
          <EmotionSection onMovieClick={(movie) => setSelectedMovie(movie)} />
        </div>

        {/* Right Sidebar */}
        {/* TODO: 이 부분도 FriendActivity, NotificationPanel, OttRankingPanel로 분리 가능 */}
        <aside className="flex flex-col gap-4 max-xl:flex-row max-xl:flex-wrap max-md:flex-col">
          {/* Friend Activity */}
          {/* TODO [API 연결]: GET /api/friends/activity 로 친구 활동 조회 */}
          {/* [API 연결 후 삭제] 아래 하드코딩된 활동 데이터 제거 */}
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">친구들의 최근 활동</h3>
              <Link to="/friends" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { name: '우진', initial: '우', color: 'from-[#93c5fd] to-[#2563eb]', desc: '"어바웃 타임"에 ⭐ 4.5점 평가', time: '30분 전' },
                { name: '세영', initial: '세', color: 'from-[#d8b4fe] to-[#9333ea]', desc: '"인터스텔라" 시청 완료 🎬', time: '1시간 전' },
                { name: '민지', initial: '민', color: 'from-[#fda4af] to-[#f43f5e]', desc: '"기생충"에 ⭐ 5.0점 평가', time: '5시간 전' },
              ].map(a => (
                <div key={a.name} className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.color} grid place-items-center text-white font-bold text-sm shrink-0`}>{a.initial}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{a.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{a.desc}</p>
                    <p className="text-[10px] text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          {/* TODO [API 연결]: GET /api/notifications?limit=3 으로 최근 알림 조회 */}
          {/* [API 연결 후 삭제] 아래 하드코딩된 알림 데이터 제거 */}
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">알림</h3>
              <Link to="/notifications" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { text: '� 민지님이 "라라랜드"를 추천했어요', time: '10분 전' },
                { text: '🗳️ "주말에 뭐 볼까?" 투표 결과 나왔어요', time: '25분 전' },
                { text: '👥 세영님이 투표방에 초대했어요', time: '1시간 전' },
              ].map((n, i) => (
                <div key={i} className="flex justify-between gap-2 pb-2.5 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="text-xs text-gray-700">{n.text}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* OTT Ranking */}
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold">OTT별 인기 영화 TOP 5</h3>
              <Link to="/ott-ranking" className="text-xs text-gray-500 hover:text-[#7c5cff]">더보기 ›</Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { num: 1, name: '인터스텔라', rating: 4.6 },
                { num: 2, name: '라라랜드', rating: 4.5 },
                { num: 3, name: '어바웃 타임', rating: 4.5 },
                { num: 4, name: '위플래쉬', rating: 4.4 },
                { num: 5, name: '기생충', rating: 4.4 },
              ].map(r => (
                <div key={r.num} className="flex items-center gap-2 cursor-pointer hover:text-[#7c5cff]">
                  <span className="text-sm font-extrabold w-4">{r.num}</span>
                  <span className="text-xs font-semibold flex-1 truncate">{r.name}</span>
                  <span className="text-[11px] text-gray-500">⭐ {r.rating}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  )
}
