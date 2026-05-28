import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import LNB from './LNB'
import GNB from './GNB'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  // 모바일 감지: width <= 795px OR height <= 395px
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 795)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 페이지 이동 시 사이드바 닫기
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // 사이드바 열렸을 때 body scroll 방지
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen bg-gray-100 transition-colors duration-300">
      {/* Desktop LNB */}
      {!isMobile && (
        <div className="sticky top-0 h-screen shrink-0">
          <LNB />
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile LNB (slide) */}
      {isMobile && (
        <div className={`fixed top-0 left-0 h-full z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <LNB onMenuClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <GNB isMobile={isMobile} onHamburgerClick={() => setSidebarOpen(true)} />
        <div className="pt-6 max-md:pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
