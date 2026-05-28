import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute - 로그인하지 않은 사용자 접근 제한
 * 
 * 사용법:
 * <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
 *   <Route path="/" element={<Home />} />
 * </Route>
 * 
 * adminOnly: true로 설정하면 관리자만 접근 가능
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children || <Outlet />
}
