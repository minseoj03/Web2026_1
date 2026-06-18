import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationApi'
import { useAuth } from './AuthContext'

const NotifContext = createContext()
const READ_STORAGE_KEY = 'moviemate_read_notifications'

function getStoredReadIds() {
  try {
    return JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveStoredReadIds(ids) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...new Set(ids)]))
}

export function NotifProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getNotifications('all', user?.id)
      const readIds = new Set(getStoredReadIds())
      setNotifications(data.map(notification => ({
        ...notification,
        read: notification.read || readIds.has(notification.id),
      })))
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

  useEffect(() => {
    window.addEventListener('moviemate:recommendations-updated', refreshNotifications)
    return () => window.removeEventListener('moviemate:recommendations-updated', refreshNotifications)
  }, [refreshNotifications])

  const unreadCount = useMemo(
    () => notifications.filter(notification => !notification.read).length,
    [notifications]
  )

  const unreadByType = useCallback((type) => {
    return notifications.filter(notification => !notification.read && notification.type === type).length
  }, [notifications])

  const markAsRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(notification => (
      notification.id === id ? { ...notification, read: true } : notification
    )))
    saveStoredReadIds([...getStoredReadIds(), id])
    await markNotificationRead(id)
  }, [])

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => {
      saveStoredReadIds([...getStoredReadIds(), ...prev.map(notification => notification.id)])
      return prev.map(notification => ({ ...notification, read: true }))
    })
    await markAllNotificationsRead()
  }, [])

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [{ ...notification, id: Date.now(), read: false }, ...prev])
  }, [])

  const getByType = useCallback((type) => {
    if (!type || type === 'all') return notifications
    return notifications.filter(notification => notification.type === type)
  }, [notifications])

  return (
    <NotifContext.Provider value={{
      notifications,
      loading,
      unreadCount,
      unreadByType,
      markAsRead,
      markAllAsRead,
      addNotification,
      getByType,
      refreshNotifications,
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
