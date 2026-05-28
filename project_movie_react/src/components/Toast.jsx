import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, { type = 'default', duration = 3000, loading = false } = {}) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, loading }])
    if (!loading) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateToast = useCallback((id, updates) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    if (!updates.loading) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 2000)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, updateToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold animate-[slideIn_0.3s_ease] ${
              toast.type === 'success' ? 'bg-green-600 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-gray-900/90 text-white backdrop-blur-sm'
            }`}
          >
            {toast.loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            )}
            <span>{toast.message}</span>
            {!toast.loading && (
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-white/60 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
