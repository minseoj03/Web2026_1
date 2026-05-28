import { useState, useEffect } from 'react'
import { MovieDetailSkeleton } from './Skeleton'
import { useWishlist } from '../contexts/WishlistContext'

// [API 연결 후 삭제] 아래 하드코딩된 영화 상세 데이터 전체 제거
// TODO [API 연결]: GET /api/movies/:id 로 영화 상세 정보 조회
// 또는 TMDB API: GET https://api.themoviedb.org/3/movie/:id
const movieDetails = {
  '극한직업': { genre: '코미디', year: 2019, runtime: '111분', rating: 4.4, desc: '마약반 형사들이 치킨집을 위장 창업하면서 벌어지는 유쾌한 이야기. 한국 코미디 영화의 정수를 보여주는 작품이에요.', ott: '넷플릭스', tags: ['코미디', '한국영화', '범죄'], cast: ['류승룡', '이하늬', '진선규', '이동휘'], gradient: 'from-[#fbbf24] to-[#f59e0b]' },
  '인터스텔라': { genre: 'SF', year: 2014, runtime: '169분', rating: 4.6, desc: '지구의 종말을 앞두고 새로운 행성을 찾아 떠나는 우주 탐험. 크리스토퍼 놀란 감독의 걸작이에요.', ott: '넷플릭스', tags: ['SF', '드라마', '우주'], cast: ['매튜 맥커너히', '앤 해서웨이', '제시카 차스테인'], gradient: 'from-[#1e3a8a] to-[#3b82f6]' },
  '라라랜드': { genre: '뮤지컬', year: 2016, runtime: '128분', rating: 4.5, desc: 'LA를 배경으로 꿈을 쫓는 두 남녀의 사랑과 이별. 아름다운 영상미와 OST가 인상적이에요.', ott: '넷플릭스', tags: ['뮤지컬', '로맨스', '꿈'], cast: ['라이언 고슬링', '엠마 스톤'], gradient: 'from-[#fef3c7] to-[#fbbf24]' },
  '어바웃 타임': { genre: '로맨스', year: 2013, runtime: '123분', rating: 4.5, desc: '시간 여행 능력을 가진 남자의 사랑과 가족 이야기. 따뜻하고 잔잔한 감동을 주는 영화에요.', ott: '넷플릭스', tags: ['로맨스', '판타지', '가족'], cast: ['도널 글리슨', '레이첼 맥아담스', '빌 나이'], gradient: 'from-[#2d1b4e] to-[#4a3268]' },
  '기생충': { genre: '스릴러', year: 2019, runtime: '132분', rating: 4.4, desc: '봉준호 감독의 걸작. 두 가족의 계급 갈등을 블랙코미디로 풀어낸 칸 황금종려상 수상작이에요.', ott: '넷플릭스', tags: ['스릴러', '드라마', '한국영화'], cast: ['송강호', '이선균', '조여정', '최우식'], gradient: 'from-[#831843] to-[#be185d]' },
  '비포 선라이즈': { genre: '로맨스', year: 1995, runtime: '101분', rating: 4.6, desc: '비엔나에서 하룻밤 동안 대화를 나누는 두 남녀. 대화만으로 설렘을 전하는 로맨스의 정석이에요.', ott: '웨이브', tags: ['로맨스', '대화', '유럽'], cast: ['에단 호크', '줄리 델피'], gradient: 'from-[#7c2d12] to-[#b45309]' },
  '스즈메의 문단속': { genre: '애니메이션', year: 2022, runtime: '121분', rating: 4.5, desc: '신카이 마코토 감독의 판타지 애니메이션. 일본 각지의 폐허에 있는 문을 닫아가는 소녀의 여정.', ott: '웨이브', tags: ['애니메이션', '판타지', '일본'], cast: ['하라 나노카', '마츠무라 호쿠토'], gradient: 'from-[#312e81] to-[#6366f1]' },
  '베이비 드라이버': { genre: '액션', year: 2017, runtime: '113분', rating: 4.3, desc: '음악에 맞춰 운전하는 천재 드라이버의 이야기. 에드가 라이트 감독의 스타일리시한 연출이 압권.', ott: '넷플릭스', tags: ['액션', '음악', '범죄'], cast: ['안셀 엘고트', '릴리 제임스', '케빈 스페이시'], gradient: 'from-[#7c2d12] to-[#ea580c]' },
  '셔터 아일랜드': { genre: '미스터리', year: 2010, runtime: '138분', rating: 4.5, desc: '정신병원 섬에서 벌어지는 미스터리. 마틴 스코세이지 감독과 디카프리오의 명작.', ott: '넷플릭스', tags: ['미스터리', '스릴러', '반전'], cast: ['레오나르도 디카프리오', '마크 러팔로'], gradient: 'from-[#1e3a8a] to-[#1e40af]' },
  '엑스트랙션': { genre: '액션', year: 2020, runtime: '116분', rating: 4.2, desc: '용병이 납치된 소년을 구출하는 과정을 그린 액션 블록버스터.', ott: '넷플릭스', tags: ['액션', '스릴러'], cast: ['크리스 헴스워스'], gradient: 'from-[#1e293b] to-[#475569]' },
  '인사이드 아웃': { genre: '애니메이션', year: 2015, runtime: '95분', rating: 4.6, desc: '소녀의 머릿속 감정들이 펼치는 모험. 픽사의 창의력이 빛나는 감동적인 작품.', ott: '디즈니+', tags: ['애니메이션', '가족', '감동'], cast: ['에이미 포엘러', '필리스 스미스'], gradient: 'from-[#fb923c] to-[#fbbf24]' },
  '클래식': { genre: '로맨스', year: 2003, runtime: '127분', rating: 4.4, desc: '엄마와 딸, 두 세대의 사랑 이야기. 비 오는 날 보기 좋은 한국 로맨스의 클래식.', ott: '웨이브', tags: ['로맨스', '한국영화', '감동'], cast: ['손예진', '조승우', '조인성'], gradient: 'from-[#475569] to-[#94a3b8]' },
  '날씨의 아이': { genre: '애니메이션', year: 2019, runtime: '112분', rating: 4.4, desc: '날씨를 맑게 할 수 있는 소녀와 소년의 이야기. 신카이 마코토의 아름다운 영상미.', ott: '넷플릭스', tags: ['애니메이션', '로맨스', '판타지'], cast: ['다이고 코타로', '모리 나나'], gradient: 'from-[#0c4a6e] to-[#0ea5e9]' },
  '컨저링': { genre: '공포', year: 2013, runtime: '112분', rating: 4.2, desc: '실화를 바탕으로 한 공포 영화. 워렌 부부의 초자연적 사건 조사.', ott: '넷플릭스', tags: ['공포', '실화', '초자연'], cast: ['베라 파미가', '패트릭 윌슨'], gradient: 'from-[#18181b] to-[#3f3f46]' },
  '미드소마': { genre: '스릴러', year: 2019, runtime: '148분', rating: 4.0, desc: '스웨덴 한여름 축제에서 벌어지는 기이한 사건들.', ott: '웨이브', tags: ['스릴러', '공포', '아트하우스'], cast: ['플로렌스 퓨', '잭 레이너'], gradient: 'from-[#fef3c7] to-[#fbbf24]' },
  '레인 맨': { genre: '드라마', year: 1988, runtime: '133분', rating: 4.5, desc: '자폐증을 가진 형과 동생의 로드 무비. 더스틴 호프만의 명연기.', ott: '웨이브', tags: ['드라마', '가족', '로드무비'], cast: ['더스틴 호프만', '톰 크루즈'], gradient: 'from-[#1e293b] to-[#64748b]' },
}

export default function MovieDetailModal({ movie, onClose }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { isWishlisted, toggleWishlist } = useWishlist()

  const wishlisted = movie ? isWishlisted(movie.id) : false

  useEffect(() => {
    if (!movie) return
    setLoading(true)
    setData(null)

    // TODO [API 연결]: 실제 서비스에서는 API 호출로 교체
    // const response = await fetch(`/api/movies/${movie.id}`)
    // const detail = await response.json()
    // setData(detail)
    // [API 연결 후 삭제] 아래 setTimeout 시뮬레이션 제거
    const timer = setTimeout(() => {
      const detail = movieDetails[movie.title]
      setData(detail || {
        genre: movie.genre || '영화',
        year: 2023,
        runtime: '120분',
        rating: movie.rating || 4.0,
        desc: '영화 상세 정보를 불러오는 중입니다.',
        ott: '넷플릭스',
        tags: [movie.genre || '영화'],
        cast: [],
        gradient: movie.gradient || 'from-gray-600 to-gray-800',
      })
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [movie])

  if (!movie) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] grid place-items-center backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl animate-[modalIn_0.25s_ease]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white grid place-items-center text-sm z-10 hover:bg-black/80 transition"
          style={{ position: 'sticky', top: 16, float: 'right', marginRight: 16, marginTop: 16 }}
        >
          ✕
        </button>

        {loading ? (
          <MovieDetailSkeleton />
        ) : (
          <>
            {/* Poster */}
            <div className={`w-full h-[240px] rounded-t-2xl bg-gradient-to-br ${data.gradient} grid place-items-center text-white text-3xl font-extrabold text-center p-6`}>
              {movie.title}
            </div>

            {/* Body */}
            <div className="p-7">
              <h2 className="text-xl font-extrabold mb-3">{movie.title}</h2>

              {/* Meta */}
              <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
                <span className="text-sm font-semibold">⭐ {data.rating}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500 font-semibold">{data.genre}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500 font-semibold">{data.year}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500 font-semibold">{data.runtime}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{data.desc}</p>

              {/* Cast */}
              {data.cast && data.cast.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-500 mb-2.5">출연진</p>
                  <div className="flex gap-3">
                    {data.cast.map(name => (
                      <div key={name} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 grid place-items-center text-xs font-bold text-gray-600">
                          {name[0]}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold text-center w-14 truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex gap-1.5 flex-wrap mb-5">
                {data.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[#f3f0ff] rounded-full text-[11px] font-semibold text-[#7c5cff]">{tag}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-gray-800 transition">
                  ▶ {data.ott}에서 보기
                </button>
                <button
                  onClick={() => toggleWishlist({ id: movie.id, title: movie.title, genre: data.genre, rating: data.rating, gradient: data.gradient })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    wishlisted
                      ? 'bg-[#7c5cff] text-white'
                      : 'bg-white border border-gray-200 hover:border-[#7c5cff] hover:text-[#7c5cff]'
                  }`}
                >
                  {wishlisted ? '💜 찜 완료' : '❤️ 찜하기'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
