import { useState } from 'react'

const BADGE_STYLES = {
  review: 'bg-[#dbeafe] text-[#2563eb]',
  watched: 'bg-[#dcfce7] text-[#16a34a]',
}

const BADGE_LABELS = {
  review: '평가',
  watched: '시청',
}

export default function FriendActivityCard({ activity, onMovieClick }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(activity.likes || 0)
  const [showComments, setShowComments] = useState(false)

  const handleLike = (e) => {
    e.stopPropagation()
    // Optimistic UI
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    // TODO [API 연결]: likeActivity(activity.id)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.color} grid place-items-center text-white font-bold text-sm shrink-0 cursor-pointer hover:ring-2 hover:ring-[#7c5cff]/30 hover:scale-105 transition`}>
          {activity.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{activity.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[activity.type]}`}>
              {BADGE_LABELS[activity.type]}
            </span>
          </div>
          <p className="text-[11px] text-gray-400">{activity.time}</p>
        </div>
      </div>

      {/* Movie Card */}
      <div
        className="mx-5 mb-3 flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
        onClick={() => onMovieClick?.(activity)}
      >
        <div className={`w-14 h-[76px] rounded-lg bg-gradient-to-br ${activity.movieColor} grid place-items-center text-white text-[10px] font-bold shrink-0 text-center p-1`}>
          {activity.movie.slice(0, 4)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold mb-0.5">{activity.movie}</p>
          <p className="text-[11px] text-gray-500">⭐ {activity.rating} · {activity.genre} · {activity.year}</p>
          {activity.review && (
            <p className="text-[11px] text-gray-600 italic mt-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 line-clamp-2">
              {activity.review}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-5 pb-4 pt-1">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold transition ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        >
          <span className={`transition-transform ${liked ? 'scale-110' : ''}`}>{liked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#7c5cff] transition"
        >
          💬 <span>{activity.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && activity.comments?.length > 0 && (
        <div className="px-5 pb-4 border-t border-gray-100 pt-3 animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col gap-2">
            {activity.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs font-bold text-gray-700 shrink-0">{c.name}</span>
                <span className="text-xs text-gray-500">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function FriendActivitySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-20 mb-1.5" />
          <div className="h-3 bg-gray-200 rounded w-14" />
        </div>
      </div>
      <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
        <div className="w-14 h-[76px] rounded-lg bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="flex gap-4 mt-3">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-10" />
      </div>
    </div>
  )
}
