import { NavLink } from 'react-router-dom'

const menuItems = [
  { path: '/', icon: '🏠', label: '홈' },
  { path: '/vote-room', icon: '🗳️', label: '투표방' },
  { path: '/notifications', icon: '🔔', label: '알림' },
  { path: '/friends', icon: '👥', label: '친구' },
  { path: '/mypage', icon: '👤', label: '내 페이지' },
  { path: '/settings', icon: '⚙️', label: '설정' },
]

export default function LNB({ onMenuClick }) {
  return (
    <aside className="w-[220px] bg-white border-r border-gray-200 h-screen flex flex-col p-6 shrink-0 transition-colors duration-300">
      {/* Logo */}
      <NavLink to="/" onClick={onMenuClick} className="flex items-center gap-2 px-2 pb-6">
        <span className="w-8 h-8 bg-gradient-to-br from-[#7c5cff] to-[#9b85ff] rounded-lg grid place-items-center text-white text-sm font-extrabold">
          M
        </span>
        <span className="text-lg font-extrabold text-[#7c5cff] leading-tight">
          Movie<br/>Mate
        </span>
      </NavLink>

      {/* Menu */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onMenuClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#7c5cff] text-white font-semibold'
                  : 'text-gray-500 hover:bg-[#f3f0ff] hover:text-[#7c5cff]'
              }`
            }
          >
            <span className="text-lg w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
