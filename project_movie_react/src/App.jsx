import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import VoteRoom from './pages/VoteRoom'
import Notifications from './pages/Notifications'
import Friends from './pages/Friends'
import MyPage from './pages/MyPage'
import Settings from './pages/Settings'
import OttRanking from './pages/OttRanking'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/vote-room" element={<VoteRoom />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ott-ranking" element={<OttRanking />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
