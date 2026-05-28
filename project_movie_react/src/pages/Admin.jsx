import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// [API 연결 후 삭제] 아래 하드코딩된 사용자 데이터 전체 제거
// TODO [API 연결]: GET /api/admin/users?page=1&filter=all&search= 로 사용자 목록 조회
// TODO [API 연결]: PUT /api/admin/users/:id/status 로 정지/해제
// TODO [API 연결]: PUT /api/admin/users/:id/role 로 관리자 부여/해제
// TODO [API 연결]: GET /api/admin/stats 로 통계 데이터 조회
const initialUsers = [
  { name: '송이', email: 'songi@email.com', role: 'user', status: 'active', date: '2024.01.15' },
  { name: '민지', email: 'minji@email.com', role: 'user', status: 'active', date: '2024.02.03' },
  { name: '우진', email: 'woojin@email.com', role: 'user', status: 'active', date: '2024.02.10' },
  { name: '세영', email: 'seyoung@email.com', role: 'user', status: 'active', date: '2024.03.01' },
  { name: '호준', email: 'hojun@email.com', role: 'user', status: 'suspended', date: '2024.03.15' },
  { name: '수현', email: 'suhyun@email.com', role: 'admin', status: 'active', date: '2024.01.01' },
  { name: '다은', email: 'daeun@email.com', role: 'user', status: 'active', date: '2024.04.02' },
  { name: '준서', email: 'junseo@email.com', role: 'user', status: 'active', date: '2024.04.10' },
  { name: '하윤', email: 'hayoon@email.com', role: 'user', status: 'suspended', date: '2024.04.20' },
  { name: '시우', email: 'siwoo@email.com', role: 'user', status: 'active', date: '2024.05.01' },
]

const PAGE_SIZE = 5

export default function Admin() {
  const [users, setUsers] = useState(initialUsers)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' ||
      (filter === 'active' && u.status === 'active' && u.role !== 'admin') ||
      (filter === 'suspended' && u.status === 'suspended') ||
      (filter === 'admin' && u.role === 'admin')
    const matchSearch = !search || u.name.includes(search) || u.email.includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleStatus = (email) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
  }

  const toggleRole = (email) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u))
  }

  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 bg-gradient-to-br from-[#7c5cff] to-[#9b85ff] rounded-lg grid place-items-center text-white font-extrabold text-base">M</span>
          <h1 className="text-xl font-extrabold">Movie Mate</h1>
          <span className="bg-[#7c5cff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 font-semibold">{dateStr}</span>
          <span className="relative text-lg cursor-pointer">🔔<span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full grid place-items-center px-1">3</span></span>
          <div className="flex items-center gap-2 px-3 py-1.5 pl-1.5 bg-white border border-gray-200 rounded-full">
            <span className="w-7 h-7 rounded-full bg-[#7c5cff] grid place-items-center text-white font-bold text-[11px]">A</span>
            <span className="text-xs font-semibold">관리자</span>
            <span className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <button onClick={() => navigate('/login')} className="text-xs text-gray-500 hover:text-[#7c5cff] font-semibold">로그아웃</button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 gap-3.5 mb-7">
        {[
          { label: '전체 가입자 수', value: '1,247', change: '↑ +23 이번 주', up: true },
          { label: '오늘 접속자 수', value: '342', change: '● 실시간 89명', up: true },
          { label: '생성된 투표방 수', value: '56', change: '↑ +4 오늘', up: true },
          { label: '가장 많이 찜한 영화', value: '인터스텔라', change: '❤️ 312회 찜', up: false },
          { label: '가장 많이 투표된 영화', value: '어바웃 타임', change: '🗳️ 189회 투표', up: false },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4.5 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`font-extrabold mb-1 ${s.value.length > 5 ? 'text-base' : 'text-2xl'}`}>{s.value}</p>
            <p className={`text-[11px] font-semibold ${s.up ? 'text-green-500' : 'text-gray-500'}`}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* User Management */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold">사용자 관리</h2>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="닉네임, 이메일 검색"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none w-[240px] focus:border-[#7c5cff]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-50 p-1 rounded-lg w-fit mb-4">
          {[{ id: 'all', label: '전체' }, { id: 'active', label: '정상' }, { id: 'suspended', label: '정지' }, { id: 'admin', label: '관리자' }].map(t => (
            <button
              key={t.id}
              onClick={() => { setFilter(t.id); setPage(1) }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition ${filter === t.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['닉네임', '이메일', '권한', '상태', '가입일', '관리'].map(h => (
                <th key={h} className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide py-2.5 px-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageUsers.map(u => (
              <tr key={u.email} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-3 text-sm font-bold">{u.name}</td>
                <td className="py-3 px-3 text-sm text-gray-500">{u.email}</td>
                <td className="py-3 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{u.role === 'admin' ? '관리자' : '일반'}</span></td>
                <td className="py-3 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{u.status === 'active' ? '정상' : '정지'}</span></td>
                <td className="py-3 px-3 text-xs text-gray-500">{u.date}</td>
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    <button onClick={() => toggleStatus(u.email)} className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition ${u.status === 'active' ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-gray-700 border-gray-200 hover:border-[#7c5cff] hover:text-[#7c5cff]'}`}>
                      {u.status === 'active' ? '정지' : '해제'}
                    </button>
                    <button onClick={() => toggleRole(u.email)} className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-gray-200 text-gray-700 hover:border-[#7c5cff] hover:text-[#7c5cff] transition">
                      {u.role === 'admin' ? '관리자 해제' : '관리자 부여'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} className="w-8 h-8 rounded-lg border border-gray-200 grid place-items-center text-xs font-semibold text-gray-500 hover:border-[#7c5cff] hover:text-[#7c5cff]">‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg grid place-items-center text-xs font-semibold transition ${page === i + 1 ? 'bg-[#7c5cff] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#7c5cff] hover:text-[#7c5cff]'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="w-8 h-8 rounded-lg border border-gray-200 grid place-items-center text-xs font-semibold text-gray-500 hover:border-[#7c5cff] hover:text-[#7c5cff]">›</button>
        </div>
      </section>
    </div>
  )
}
