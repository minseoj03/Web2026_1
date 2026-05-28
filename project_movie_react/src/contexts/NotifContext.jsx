import { createContext, useContext, useState, useCallback } from 'react'

const NotifContext = createContext()

// TODO [API 연결]: GET /api/notifications 로 알림 목록 조회
// TODO [API 연결]: GET /api/notifications/unread-count 로 미읽음 수 조회
// TODO [API 연결]: PUT /api/notifications/:id/read 로 읽음 처리
// TODO [API 연결]: PUT /api/notifications/read-all 로 전체 읽음 처리

export function NotifProvider({ children }) {
  // [API 연결 후 삭제] 아래 하드코딩된 초기 데이터 제거
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'recommend', title: '민지님이 영화를 추천했어요', desc: '"라라랜드" — 정말 따뜻한 영화예요!', time: '10분 전', read: false },
    { id: 2, type: 'vote', title: '"주말에 뭐 볼까?" 투표 결과가 나왔어요', desc: '어바웃 타임이 42%로 1위!', time: '25분 전', read: false },
    { id: 3, type: 'friend', title: '세영님이 투표방에 초대했어요', desc: '"금요일 영화의 밤" 투표방에 참여해보세요!', time: '1시간 전', read: false },
    { id: 4, type: 'recommend', title: 'AI가 새로운 영화를 추천했어요', desc: '취향 일치 95% "비포 선라이즈"', time: '2시간 전', read: false },
    { id: 5, type: 'recommend', title: '호준님이 영화를 추천했어요', desc: '"스파이더맨: 노 웨이 홈"', time: '5시간 전', read: false },
  ])

  // 미읽음 수
  const unreadCount = notifications.filter(n => !n.read).length

  // 타입별 미읽음 수
  const unreadByType = useCallback((type) => {
    return notifications.filter(n => !n.read && n.type === type).length
  }, [notifications])

  // 개별 읽음 처리
  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  // 전체 읽음 처리
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  // 알림 추가 (실시간 알림 수신 시)
  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ ...notif, id: Date.now(), read: false }, ...prev])
  }, [])

  // 타입별 필터링
  const getByType = useCallback((type) => {
    if (!type || type === 'all') return notifications
    return notifications.filter(n => n.type === type)
  }, [notifications])

  return (
    <NotifContext.Provider value={{
      notifications,
      unreadCount,
      unreadByType,
      markAsRead,
      markAllAsRead,
      addNotification,
      getByType,
    }}>
      {children}
    </NotifContext.Provider>
  )
}

export function useNotif() {
  const context = useContext(NotifContext)
  if (!context) throw new Error('useNotif must be used within NotifProvider')
  return context
}
