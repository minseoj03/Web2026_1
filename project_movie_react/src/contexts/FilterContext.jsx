import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const FilterContext = createContext()

export function FilterProvider({ children }) {
  // OTT 필터 토글 상태 (ON = 구독 OTT만 추천)
  const [ottOnly, setOttOnly] = useState(() => {
    return localStorage.getItem('moviemate_ottOnly') === 'true'
  })

  // 장르 필터 (확장용)
  const [genreFilter, setGenreFilter] = useState([]) // 빈 배열 = 전체

  const { user } = useAuth()

  // ottOnly 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('moviemate_ottOnly', String(ottOnly))
  }, [ottOnly])

  // OTT 필터 토글
  const toggleOttOnly = useCallback(() => {
    setOttOnly(prev => !prev)
  }, [])

  // 현재 필터링에 사용할 OTT 목록 반환
  // ottOnly가 true면 user.ott만, false면 null (전체)
  const getActiveOttFilter = useCallback(() => {
    if (!ottOnly || !user) return null // null = 필터 없음 (전체 표시)
    return user.ott
  }, [ottOnly, user])

  // 영화 필터링 헬퍼 함수
  // movie 객체에 ott 필드가 있다고 가정
  const filterByOtt = useCallback((movies) => {
    const filter = getActiveOttFilter()
    if (!filter) return movies // 필터 없으면 전체 반환
    return movies.filter(m =>
      Array.isArray(m.ott) &&
      m.ott.some(ott => filter.includes(ott))
    )
  }, [getActiveOttFilter])

  // 장르 필터링 헬퍼
  const filterByGenre = useCallback((movies) => {
    if (genreFilter.length === 0) return movies
    return movies.filter(m => m.genre && genreFilter.some(g => m.genre.includes(g)))
  }, [genreFilter])

  // 복합 필터 (OTT + 장르)
  const applyFilters = useCallback((movies) => {
    let result = filterByOtt(movies)
    result = filterByGenre(result)
    return result
  }, [filterByOtt, filterByGenre])

  return (
    <FilterContext.Provider value={{
      ottOnly,
      setOttOnly,
      toggleOttOnly,
      getActiveOttFilter,
      filterByOtt,
      genreFilter,
      setGenreFilter,
      filterByGenre,
      applyFilters,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) throw new Error('useFilter must be used within FilterProvider')
  return context
}
