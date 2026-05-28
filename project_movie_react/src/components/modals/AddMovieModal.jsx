import { useState, useEffect, useRef } from 'react'
import { useToast } from '../Toast'
import EmptyState from '../EmptyState'

// [API 연결 후 삭제] Mock 검색 데이터
const mockMovies = [
  { id: 's1', title: '인터스텔라', genre: '영화 · SF', gradient: 'from-[#1e3a8a] to-[#3b82f6]' },
  { id: 's2', title: '라라랜드', genre: '영화 · 로맨스', gradient: 'from-[#fef3c7] to-[#fbbf24]' },
  { id: 's3', title: '어바웃 타임', genre: '영화 · 로맨스', gradient: 'from-[#2d1b4e] to-[#4a3268]' },
  { id: 's4', title: '기생충', genre: '영화 · 스릴러', gradient: 'from-[#831843] to-[#be185d]' },
  { id: 's5', title: '듄: 파트 2', genre: '영화 · SF', gradient: 'from-[#78350f] to-[#b45309]' },
  { id: 's6', title: '오펜하이머', genre: '영화 · 드라마', gradient: 'from-[#18181b] to-[#3f3f46]' },
  { id: 's7', title: '스즈메의 문단속', genre: '영화 · 애니메이션', gradient: 'from-[#312e81] to-[#6366f1]' },
  { id: 's8', title: '위플래쉬', genre: '영화 · 드라마', gradient: 'from-[#7c2d12] to-[#ea580c]' },
  { id: 's9', title: '코코', genre: '영화 · 애니메이션', gradient: 'from-[#f97316] to-[#fbbf24]' },
  { id: 's10', title: '비포 선라이즈', genre: '영화 · 로맨스', gradient: 'from-[#7c2d12] to-[#b45309]' },
]

export default function AddMovieModal({ isOpen, onClose, onAdd, type = 'watched' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(mockMovies)
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const { addToast } = useToast()
  const debounceRef = useRef(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setResults(mockMovies)
        return
      }
      setSearching(true)
      // TODO [API 연결]: GET /api/movies/search?q=${query}
      setTimeout(() => {
        setResults(mockMovies.filter(m => m.title.toLowerCase().includes(query.toLowerCase())))
        setSearching(false)
      }, 200)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  if (!isOpen) return null

  const handleAdd = () => {
    if (!selected) return
    const movie = {
      ...selected,
      rating: rating || 4.0,
      review: review || '',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    }
    onAdd?.(movie)
    addToast(type === 'watched' ? `"${selected.title}" 추가 완료! 🎬` : `"${selected.title}" 찜 완료! ❤️`, { type: 'success' })
    setSelected(null)
    setRating(0)
    setReview('')
    setQuery('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] grid place-items-center" onClick={onClose} role="dialog">
      <div className="bg-white rounded-2xl p-7 w-full max-w-[480px] max-h-[85vh] overflow-y-auto shadow-xl animate-[modalIn_0.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">영화 추가</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm text-gray-500 hover:text-[#7c5cff]" aria-label="닫기">✕</button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
            placeholder="영화 제목을 검색하세요"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c5cff] transition"
          />
        </div>

        <p className="text-xs font-bold text-gray-500 mb-2.5">
          {query ? `"${query}" 검색 결과 ${results.length}` : '인기 영화'}
        </p>

        {/* Results */}
        <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto mb-4">
          {searching ? (
            <div className="py-8 text-center text-sm text-gray-400">검색 중...</div>
          ) : results.length > 0 ? (
            results.map(m => (
              <div key={m.id}>
                <div
                  onClick={() => setSelected(selected?.id === m.id ? null : m)}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${selected?.id === m.id ? 'border-[#7c5cff] bg-[#faf8ff]' : 'border-gray-200 hover:border-[#9b85ff]'}`}
                >
                  <div className={`w-12 h-[66px] rounded-lg bg-gradient-to-br ${m.gradient} grid place-items-center text-white text-[10px] font-bold shrink-0`}>{m.title.slice(0, 2)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{m.title}</p>
                    <p className="text-[11px] text-gray-500">{m.genre}</p>
                  </div>
                  <span className={`w-8 h-8 rounded-full border grid place-items-center text-base shrink-0 transition ${selected?.id === m.id ? 'bg-[#7c5cff] text-white border-[#7c5cff]' : 'border-gray-200 text-gray-400 hover:bg-[#7c5cff] hover:text-white hover:border-[#7c5cff]'}`}>
                    {selected?.id === m.id ? '✓' : '+'}
                  </span>
                </div>

                {/* Rating/Review (watched only) */}
                {selected?.id === m.id && type === 'watched' && (
                  <div className="ml-4 mt-2 mb-2 p-3 bg-gray-50 rounded-xl border border-[#9b85ff]/30 animate-[fadeIn_0.2s_ease]">
                    <p className="text-[11px] font-bold text-gray-500 mb-2">별점</p>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} onClick={() => setRating(s)} className={`text-xl transition ${s <= rating ? 'text-[#fbbf24]' : 'text-gray-300 hover:text-[#fbbf24]'}`}>
                          {s <= rating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 mb-1.5">한줄평 (선택)</p>
                    <input
                      value={review}
                      onChange={e => setReview(e.target.value)}
                      placeholder="이 영화에 대한 한줄평"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#7c5cff]"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <EmptyState icon="🔍" title="검색 결과가 없어요" description="다른 키워드로 검색해보세요." />
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleAdd}
          disabled={!selected}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition ${selected ? 'bg-[#7c5cff] text-white hover:bg-[#5d3ee8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {selected ? '추가 완료' : '영화를 선택하세요'}
        </button>
      </div>
    </div>
  )
}
