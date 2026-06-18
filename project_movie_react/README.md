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
| 영화 데이터 | TMDB API (실제 연동) |
| Backend (예정) | Node.js + Express |
| Database (예정) | MongoDB + Mongoose |
| Auth (예정) | Firebase Authentication |

## 🚀 실행 방법

```bash
cd project_movie_react
npm install
npm run dev
```

### 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 후 아래 내용 추가:

```
VITE_TMDB_TOKEN=your_tmdb_bearer_token
```

TMDB API 토큰은 [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) 에서 발급받을 수 있습니다.

## 🔑 데모 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@moviemate.com | admin123 |
| 일반 사용자 | 아무 이메일 | 4자 이상 |

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── home/
│   │   ├── HeroSection.jsx        # 메인 추천 영화 (TMDB 실제 데이터)
│   │   └── EmotionSection.jsx     # 감정 기반 추천 (TMDB 실제 데이터)
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
│   ├── Skeleton.jsx               # 스켈레톤 컴포넌트 모음
│   └── Toast.jsx                  # 토스트 알림 시스템
├── contexts/
│   ├── AuthContext.jsx            # 인증 + 사용자 정보
│   ├── FilterContext.jsx          # OTT 필터 + 장르 필터
│   ├── FriendContext.jsx          # 친구 목록 관리
│   ├── NotifContext.jsx           # 알림 상태 (API 연동)
│   └── WishlistContext.jsx        # 찜 목록 (API fetch + TMDB 보강 포함)
├── data/
│   └── mockUsers.js               # 목 유저 데이터
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
│   └── VoteRoom.jsx               # 투표방
├── services/
│   ├── authApi.js                 # 인증 API (mock, Firebase 연결 예정)
│   ├── friendApi.js               # 친구 활동 API (mock + TMDB 포스터)
│   ├── movieApi.js                # 영화 API (TMDB 실제 연동)
│   ├── mypageApi.js               # 내 페이지 API (mock + TMDB 포스터)
│   ├── notificationApi.js         # 알림 API (mock + TMDB 포스터)
│   └── recommendApi.js            # 추천 전송 API (localStorage 기반)
├── App.jsx                        # 라우터 설정
├── index.css                      # Tailwind + 다크모드 + 애니메이션
└── main.jsx                       # 엔트리포인트 (Providers)
```

## 📱 주요 기능

### 홈
- AI 맞춤 추천 Hero Section (TMDB 실제 데이터 기반 점수화)
- 감정 기반 영화 추천 (9개 감정 태그 → 장르 매핑)
- 친구 활동 피드 미리보기
- 알림 미리보기
- OTT별 인기 영화 TOP 5

### 투표방
- 투표방 생성 (이름 + 친구 초대 + 종료 시간)
- 영화 추천 + 추천 이유 작성
- 영화 삭제 (카드 × 버튼)
- 단일 투표 (1인 1표, 변경 가능)
- 실시간 투표 현황
- 방장: 투표방 삭제 / 일반: 나가기
- 친구 초대

### 내 페이지
- 프로필 편집
- 내가 본 영화 (정렬 + 추가 + 편집 + 삭제)
- 찜한 목록 (WishlistContext 단일 관리, TMDB 포스터 자동 보강)
- 영화 상세 모달 (Skeleton → 데이터)
- 친구에게 영화 추천

### 알림
- 템플릿 기반 알림 시스템
- 추천 알림 / 일반 알림 탭
- 읽음 처리 (개별 + 전체, localStorage 영속)
- 영화 정보 카드 포함

### 친구
- 활동 피드 (평가 / 시청 완료)
- 친구 목록 + 검색 + 삭제
- GNB에서 친구 추가 (이메일 검색 → 즉시 추가)

### 설정
- 구독 OTT 선택 (다중)
- 다크모드 토글
- 성인인증
- 언어 / 국가 설정
- 로그아웃

### 관리자
- 통계 대시보드
- 사용자 관리 (검색 + 필터 + 정지/해제 + 관리자 권한 부여)
- 페이지네이션

## 🦴 스켈레톤 UI 적용 현황

| 위치 | 컴포넌트 |
|------|---------|
| HeroSection | `HeroSkeleton` |
| 영화 카드 목록 | `MovieCardSkeleton` |
| 영화 상세 모달 | `MovieDetailSkeleton` |
| 알림 목록 | `NotificationSkeleton` |
| 친구 활동 | `FriendActivitySkeleton` |
| OTT 랭킹 | 인라인 animate-pulse |
| Home TOP5 | 인라인 animate-pulse |
| 영화 검색 모달 | `MovieSearchRowSkeleton` |

## 🌙 다크모드

- `document.documentElement.classList` 기반 (`html.dark` 클래스)
- `index.css`에서 전역 오버라이드
- 보라색 테두리 + glow 효과
- 부드러운 transition (300ms)
- 토글 knob 색상 조건부 적용 (JSX)

## 📐 반응형

- **Desktop (>795px)**: LNB 고정 + 2컬럼 레이아웃
- **Mobile (≤795px)**: LNB 숨김 + 햄버거 메뉴 + 슬라이드 사이드바
- `clamp()` 기반 adaptive scaling

## 🗂 Context 구조

```
AuthProvider          → 인증, 사용자 정보, 테마
  FilterProvider      → OTT 필터
    NotifProvider     → 알림 상태, 미읽음 수 (API 연동)
      WishlistProvider → 찜 목록 (API fetch + TMDB 보강 통합)
        FriendProvider → 친구 목록
          ToastProvider → 토스트 알림
            App
```

## 🔌 API 연결 가이드

모든 API 연결 포인트는 주석으로 표시되어 있습니다:

```javascript
// TODO [API 연결]: 실제 API 호출로 교체
// [API 연결 후 삭제]: 임시 데이터/로직
```

### 백엔드 엔드포인트 목록

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/signup | 회원가입 |
| GET | /api/auth/verify | 토큰 검증 |
| PUT | /api/users/:id | 사용자 정보 수정 |
| PUT | /api/users/:id/ott | OTT 목록 업데이트 |
| GET | /api/users/:id/watched | 본 영화 목록 |
| POST | /api/users/:id/watched | 본 영화 추가 |
| PUT | /api/users/:id/watched/:movieId | 본 영화 수정 |
| DELETE | /api/users/:id/watched/:movieId | 본 영화 삭제 |
| GET | /api/users/:id/wishlist | 찜 목록 |
| POST | /api/users/:id/wishlist | 찜 추가 |
| DELETE | /api/users/:id/wishlist/:movieId | 찜 삭제 |
| GET | /api/notifications | 알림 목록 |
| GET | /api/notifications/unread-count | 미읽음 수 |
| PUT | /api/notifications/:id/read | 읽음 처리 |
| PUT | /api/notifications/read-all | 전체 읽음 |
| POST | /api/recommendations | 친구에게 영화 추천 |
| GET | /api/recommendations/sent | 보낸 추천 목록 |
| GET | /api/recommendations/received | 받은 추천 목록 |
| PUT | /api/recommendations/received/:id | 추천 상태 업데이트 |
| GET | /api/friends/activities | 친구 활동 피드 |
| POST | /api/friends/activities/:id/like | 활동 좋아요 |
| POST | /api/friends/activities/:id/comments | 활동 댓글 |
| GET | /api/admin/users | 관리자: 사용자 목록 |
| PUT | /api/admin/users/:id/status | 관리자: 정지/해제 |
| PUT | /api/admin/users/:id/role | 관리자: 권한 변경 |

## 📝 라이선스

학교 프로젝트용
