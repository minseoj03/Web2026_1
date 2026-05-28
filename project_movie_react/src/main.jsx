import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FilterProvider } from './contexts/FilterContext'
import { NotifProvider } from './contexts/NotifContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { FriendProvider } from './contexts/FriendContext'
import { ToastProvider } from './components/Toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <NotifProvider>
            <WishlistProvider>
              <FriendProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </FriendProvider>
            </WishlistProvider>
          </NotifProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
