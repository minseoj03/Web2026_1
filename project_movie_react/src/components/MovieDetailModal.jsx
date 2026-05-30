import { useEffect, useState } from 'react'
import { MovieDetailSkeleton } from './Skeleton'
import { useWishlist } from '../contexts/WishlistContext'
import { getMovieDetail } from '../services/movieApi'

const getWatchLinks = (title) => {
  const query = encodeURIComponent(title)

  return [
    {
      id: 'netflix',
      label: '넷플릭스',
      icon: 'N',
      color: 'bg-[#e50914]',
      url: `https://www.netflix.com/search?q=${query}`,
    },
    {
      id: 'disney',
      label: '디즈니+',
      icon: 'D+',
      color: 'bg-[#113cff]',
      url: `https://www.disneyplus.com/search?q=${query}`,
    },
    {
      id: 'wavve',
      label: '웨이브',
      icon: 'W',
      color: 'bg-[#1a73e8]',
      url: `https://www.wavve.com/search?searchWord=${query}`,
    },
  ]
}

export default function MovieDetailModal({ movie, onClose, hideWishlist = false }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = movie ? isWishlisted(movie.id) : false
  const watchLinks = movie ? getWatchLinks(movie.title) : []

  useEffect(() => {
    if (!movie) return

    let ignore = false
    setLoading(true)
    setData(null)

    getMovieDetail(movie.id)
      .then((detail) => {
        if (!detail || ignore) return

        setData({
          genre: detail.genres?.map(g => g.name).join(', ') || '영화',
          year: detail.release_date?.slice(0, 4) || '',
          runtime: detail.runtime ? `${detail.runtime}분` : '',
          rating: (detail.vote_average / 2).toFixed(1),
          desc: detail.overview || '상세 설명이 없습니다.',
          tags: detail.genres?.map(g => g.name) || [],
          cast: [],
          gradient: movie.gradient || 'from-[#2d1b4e] to-[#4a3268]',
          posterPath: detail.poster_path,
          backdropPath: detail.backdrop_path,
        })
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [movie])

  if (!movie) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[1000] grid place-items-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-[modalIn_0.25s_ease]"
        onClick={e => e.stopPropagation()}
      >
        {loading || !data ? (
          <MovieDetailSkeleton />
        ) : (
          <>
            <div className="relative h-[200px] shrink-0 overflow-hidden">
              {data.backdropPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w780${data.backdropPath}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${data.gradient}`} />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white grid place-items-center text-sm z-10 hover:bg-black/80 transition"
                aria-label="닫기"
              >
                ×
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
                {data.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${data.posterPath}`}
                    alt={movie.title}
                    className="w-[70px] h-[105px] rounded-lg object-cover shadow-lg shrink-0 border-2 border-white/20"
                  />
                ) : (
                  <div className={`w-[70px] h-[105px] rounded-lg shrink-0 bg-gradient-to-br ${data.gradient} grid place-items-center text-2xl`}>
                    🎬
                  </div>
                )}

                <div className="text-white min-w-0">
                  <h2 className="text-2xl font-extrabold mb-1 leading-tight">{movie.title}</h2>
                  <div className="flex items-center gap-1.5 flex-wrap text-xs text-white/80">
                    <span className="text-yellow-400 font-bold">★ {data.rating}</span>
                    {data.year && <><span>·</span><span>{data.year}</span></>}
                    {data.runtime && <><span>·</span><span>{data.runtime}</span></>}
                  </div>
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {data.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-semibold backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {data.desc && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">줄거리</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{data.desc}</p>
                </div>
              )}

              {data.cast?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 mb-2.5 uppercase tracking-wide">출연진</p>
                  <div className="flex gap-3 flex-wrap">
                    {data.cast.map(name => (
                      <div key={name} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 grid place-items-center text-sm font-bold text-gray-600">
                          {name[0]}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold text-center w-14 truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-1">
                {watchLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-3 bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-800 transition"
                  >
                    <span className={`w-4 h-4 ${link.color} rounded text-[9px] grid place-items-center font-extrabold shrink-0`}>
                      {link.icon}
                    </span>
                    <span className="truncate">{link.label}</span>
                    <span className="shrink-0">↗</span>
                  </a>
                ))}
              </div>

              {!hideWishlist && (
              <button
                onClick={() => toggleWishlist({
                  id: movie.id,
                  title: movie.title,
                  genre: data.genre,
                  rating: data.rating,
                  gradient: data.gradient,
                  posterPath: data.posterPath ? `https://image.tmdb.org/t/p/w500${data.posterPath}` : null,
                })}
                className={`mt-2 w-full px-4 py-3 rounded-xl text-sm font-semibold transition border ${
                  wishlisted
                    ? 'bg-[#7c5cff] text-white border-[#7c5cff]'
                    : 'bg-white border-gray-200 hover:border-[#7c5cff] hover:text-[#7c5cff]'
                }`}
              >
                {wishlisted ? '찜 완료' : '찜하기'}
              </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
