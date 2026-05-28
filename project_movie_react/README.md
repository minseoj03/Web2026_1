# 🎬 Movie Mate

> 친구와 함께 고르는 오늘의 영화 — AI 맞춤 추천 + 감정 기반 추천 + 투표 기반 영화 선택 서비스

## 📋 프로젝트 개요

Movie Mate는 OTT 영화 추천 서비스로, AI 감정 기반 추천, 친구와의 투표 시스템, 소셜 활동 피드를 통해 영화 선택을 즐겁게 만드는 웹 애플리케이션입니다.

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Context API (Auth, Filter, Notif, Wishlist, Friend) |
| Backend (예정) | Node.js + Express |
| Database (예정) | MongoDB + Mongoose |
| Auth (예정) | Firebase Authentication |
| 영화 데이터 (예정) | TMDB API |

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── home/
│   │   ├── HeroSection.jsx        # 메인 추천 영화
│   │   └── EmotionSection.jsx     # AI 감정 기반 추천
│   ├── mypage/
│   │   ├── ProfileSection.jsx     # 프로필 카드
│   │   └── MovieScrollSection.jsx # 영화 가로 스크롤
│   ├── friends/
│   │   └── FriendActivityCard.jsx # 친구 활동 카드
│   ├── modals/
│   │   ├── AddMovieModal.jsx      # 영화 추가
│   │   ├── ProfileEditModal.jsx   # 프로필 편집
│   │   └── RecommendToFriendModal.jsx # 친구 추천
│   ├── AILoading.jsx              # AI 추천 생성 로딩
│   ├── EmptyState.jsx             # 빈 상태 UI
│   ├── GNB.jsx                    # 상단 네비게이션
│   ├── HomeSkeleton.jsx           # 홈 스켈레톤
│   ├── Layout.jsx                 # 공통 레이아웃
│   ├── LNB.jsx                    # 좌측 사이드바
│   ├── LoadingButton.jsx          # 로딩 버튼
│   ├── LoadingScreen.jsx          # 전체 로딩 화면
│   ├── MovieCard.jsx              # 영화 카드 (공용)
│   ├── MovieDetailModal.jsx       # 영화 상세 모달
│   ├── MoviePosterCard.jsx        # 포스터 카드 (내 페이지)
│   ├── ProtectedRoute.jsx         # 인증 라우트 가드
│   ├── Skeleton.jsx               # 스켈레톤 컴포넌트
│   └── Toast.jsx                  # 토스트 알림 시스템
├── contexts/
│   ├── AuthContext.jsx            # 인증 + 사용자 정보
│   ├── FilterContext.jsx          # OTT 필터 + 장르 필터
│   ├── FriendContext.jsx          # 친구 목록 관리
│   ├── NotifContext.jsx           # 알림 상태
│   └── WishlistContext.jsx        # 찜 목록 관리
├── notifications/
│   └── template.js                # 알림 템플릿 시스템
├── pages/
│   ├── Admin.jsx                  # 관리자 페이지
│   ├── Friends.jsx                # 친구 (활동 + 목록)
│   ├── Home.jsx                   # 홈
│   ├── Login.jsx                  # 로그인
│   ├── MyPage.jsx                 # 내 페이지
│   ├── Notifications.jsx          # 알림
│   ├── OttRanking.jsx             # OTT별 인기 영화
│   ├── Settings.jsx               # 설정
│   ├── Signup.jsx                 # 회원가입 (2스텝)
│   └── VoteRoom.jsx              # 투표방
├── services/
│   ├── authApi.js                 # 인증 API
│   ├── friendApi.js               # 친구 활동 API
│   ├── movieApi.js                # 영화 API
│   ├── mypageApi.js               # 내 페이지 API
│   ├── notificationApi.js         # 알림 API
│   └── recommendApi.js            # 추천 API
├── App.jsx                        # 라우터 설정
├── index.css                      # Tailwind + 다크모드 + 애니메이션
└── main.jsx                       # 엔트리포인트 (Providers)
```

## 🚀 실행 방법

```bash
cd project_movie_react
npm install
npm run dev
```

## 🔑 데모 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@moviemate.com | admin123 |
| 일반 사용자 | 아무 이메일 | 4자 이상 |

## 📱 주요 기능

### 홈
- AI 맞춤 추천 (Hero Section)
- AI 감정 기반 추천 (9개 감정 태그)
- 친구 활동 피드
- 알림 미리보기
- OTT별 인기 영화 TOP 5

### 투표방
- 투표방 생성 (이름 + 친구 초대 + 종료 시간)
- 영화 추천 + 추천 이유 작성
- 단일 투표 (1인 1표, 변경 가능)
- 실시간 투표 현황
- 방장: 삭제 / 일반: 나가기
- 친구 초대

### 내 페이지
- 프로필 편집
- 내가 본 영화 (정렬 + 검색 + 추가)
- 찜한 목록 (WishlistContext 연동)
- 영화 포스터 hover → 친구 추천 / 편집 / 삭제
- 영화 상세 모달 (Skeleton → 데이터)

### 알림
- 템플릿 기반 알림 시스템
- 추천 알림 / 일반 알림 탭
- 읽음 처리 (개별 + 전체)
- 영화 정보 카드 포함

### 친구
- 활동 피드 (평가 / 시청)
- 친구 목록 + 검색 + 삭제
- GNB에서 친구 추가 (이메일 검색 → 즉시 추가)

### 설정
- 성인인증
- 언어 (한국어 / English)
- 국가 (대한민국 / 미국)
- 구독 OTT 선택
- 다크모드

### 관리자
- 통계 대시보드 (가입자, 접속자, 투표방, 인기 영화)
- 사용자 관리 (검색 + 필터 + 정지/해제 + 관리자 부여)
- 페이지네이션

## 🌙 다크모드

- `document.documentElement.classList` 기반
- `index.css`에서 전역 오버라이드 (컴포넌트 수정 불필요)
- 보라색 테두리 + glow 효과
- 부드러운 transition (300ms)

## 📐 반응형

- **Desktop (>795px)**: LNB 고정 + 2컬럼 레이아웃
- **Mobile (≤795px)**: LNB 숨김 + 햄버거 메뉴 + 슬라이드 사이드바
- `clamp()` 기반 adaptive scaling
- 레이아웃 급변 최소화

## 🔌 API 연결 가이드

모든 API 연결 포인트는 주석으로 표시되어 있습니다:

```javascript
// TODO [API 연결]: 설명
// [API 연결 후 삭제]: 임시 데이터/로직
```

### 필요한 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/signup | 회원가입 |
| GET | /api/users/me | 내 정보 조회 |
| PUT | /api/users/:id | 사용자 정보 수정 |
| GET | /api/movies/emotion/:id | 감정별 영화 조회 |
| GET | /api/movies/:id | 영화 상세 |
| GET | /api/movies/search?q= | 영화 검색 |
| GET | /api/users/:id/watched | 본 영화 목록 |
| POST | /api/users/:id/watched | 본 영화 추가 |
| DELETE | /api/users/:id/watched/:movieId | 본 영화 삭제 |
| GET | /api/users/:id/wishlist | 찜 목록 |
| POST | /api/users/:id/wishlist | 찜 추가 |
| DELETE | /api/users/:id/wishlist/:movieId | 찜 해제 |
| GET | /api/rooms | 투표방 목록 |
| POST | /api/rooms | 투표방 생성 |
| POST | /api/rooms/:id/movies | 영화 추천 |
| POST | /api/rooms/:id/vote | 투표 |
| DELETE | /api/rooms/:id | 투표방 삭제 |
| GET | /api/friends/feed | 친구 활동 |
| POST | /api/friends | 친구 추가 |
| DELETE | /api/friends/:id | 친구 삭제 |
| GET | /api/notifications | 알림 목록 |
| PUT | /api/notifications/:id/read | 읽음 처리 |
| PUT | /api/notifications/read-all | 전체 읽음 |
| GET | /api/admin/users | 관리자: 사용자 목록 |
| PUT | /api/admin/users/:id/status | 관리자: 정지/해제 |
| PUT | /api/admin/users/:id/role | 관리자: 권한 변경 |

## 🗂 Context 구조

```
AuthProvider        → 인증, 사용자 정보, 테마
  FilterProvider    → OTT 필터, 장르 필터
    NotifProvider   → 알림 상태, 미읽음 수
      WishlistProvider → 찜 목록
        FriendProvider → 친구 목록
          ToastProvider → 토스트 알림
            App
```

## 📝 라이선스

학교 프로젝트용
