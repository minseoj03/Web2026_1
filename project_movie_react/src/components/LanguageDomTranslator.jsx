import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const koToEn = {
  홈: 'Home',
  투표방: 'Vote Room',
  알림: 'Notifications',
  친구: 'Friends',
  '내 페이지': 'My Page',
  설정: 'Settings',
  '내 구독 OTT만 추천': 'My OTT only',
  '친구들의 최근 활동': 'Recent Friend Activity',
  '더보기 ›': 'View more ›',
  'OTT별 인기 영화 TOP 5': 'Popular Movies by OTT TOP 5',
  '내가 본 영화와 취향을 관리해보세요.': 'Manage movies you watched and your taste.',
  '내가 본 영화': 'Watched Movies',
  '찜한 목록': 'Wishlist',
  '찜한 영화': 'Wishlisted Movies',
  '영화 추가': 'Add Movie',
  최신순: 'Newest',
  가나다순: 'A-Z',
  '내가 본 영화 검색': 'Search watched movies',
  '찜한 영화 검색': 'Search wishlist',
  시청: 'Watched',
  찜: 'Saved',
  삭제: 'Delete',
  '찜 해제': 'Remove',
  편집: 'Edit',
  '프로필 편집': 'Edit Profile',
  '서비스 이용 환경을 설정해보세요.': 'Set up your service preferences.',
  계정: 'Account',
  성인인증: 'Adult Verification',
  '본인 인증 상태': 'Verification Status',
  '성인 콘텐츠를 이용하려면 본인 인증이 필요해요.': 'Adult content requires verification.',
  '성인인증 진행': 'Start Adult Verification',
  '생년월일 기준 만 19세 이상인지 확인해요.': 'Check whether you are 19 or older by birth date.',
  '✅ 인증 완료': '✅ Verified',
  '⚠️ 미인증': '⚠️ Not verified',
  인증하기: 'Verify',
  '다시 인증': 'Verify again',
  언어: 'Language',
  '서비스 언어': 'Service Language',
  '인터페이스에 사용하는 언어를 선택해요.': 'Choose the language used in the interface.',
  한국어: 'Korean',
  English: 'English',
  '국가/지역': 'Country/Region',
  '국가/지역 설정': 'Country/Region',
  'OTT 콘텐츠 제공 범위와 추천에 영향을 줘요.': 'This affects OTT availability and recommendations.',
  대한민국: 'South Korea',
  미국: 'United States',
  콘텐츠: 'Content',
  '구독 OTT': 'Subscribed OTT',
  다크모드: 'Dark Mode',
  '어두운 테마로 전환해요.': 'Switch to a dark theme.',
  생년월일: 'Birth Date',
  취소: 'Cancel',
  '인증 완료': 'Complete Verification',
  '알림': 'Notifications',
  '추천 알림': 'Recommendations',
  일반: 'General',
  '모두 읽음': 'Mark all as read',
  읽음: 'Read',
  '추천 알림과 일반 알림을 확인하세요.': 'Check recommendation and general notifications.',
  '표시할 알림이 없어요.': 'No notifications to show.',
  'AI 감정 기반 추천': 'AI Emotion Recommendations',
  '인기, 평점, 평가 수, 구독 OTT, 최신성을 함께 계산해 지금 기분에 맞는 영화를 추천해요.': 'We calculate popularity, ratings, vote count, subscribed OTT, and recency to recommend movies for your mood.',
  '무료할 때': 'When bored',
  '잠이 안 올 때': 'When sleepless',
  '혼술할 때': 'Drinking alone',
  '침대에 누워서': 'In bed',
  '이동 중일 때': 'On the move',
  '비 오는 날': 'Rainy day',
  '겨울 감성': 'Winter mood',
  '새벽 감성': 'Dawn mood',
  '주말 아침': 'Weekend morning',
  '추천 가능한 영화가 없어요.': 'No recommendations available.',
  '오늘의 추천': "Today's Pick",
  '회원님을 위한 맞춤 추천': 'Personalized Picks for You',
  '시청 기록, 평점, 취향, 구독 OTT, 친구 반응을 종합 분석했어요.': 'We analyzed your watch history, ratings, taste, OTT subscriptions, and friend reactions.',
  '추천 이유': 'Why this movie',
  '넷플릭스에서 보기 ↗': 'Watch on Netflix ↗',
  '찜하기': 'Add to Wishlist',
  '찜 완료': 'Wishlisted',
  줄거리: 'Overview',
}

const enToKo = Object.fromEntries(Object.entries(koToEn).map(([ko, en]) => [en, ko]))

function translateText(text, lang) {
  const trimmed = text.trim()
  if (!trimmed) return text

  const dictionary = lang === 'en' ? koToEn : enToKo
  if (dictionary[trimmed]) return text.replace(trimmed, dictionary[trimmed])

  if (lang === 'en') {
    return text
      .replace(/안녕하세요,\s*(.+?)님!\s*👋/g, 'Hello, $1! 👋')
      .replace(/(.+?)편/g, '$1 movies')
      .replace(/(.+?)분 전/g, '$1 min ago')
      .replace(/(.+?)시간 전/g, '$1 hr ago')
      .replace(/(.+?)님이/g, '$1')
  }

  return text
}

function translateNodeTree(root, lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach(node => {
    const nextValue = translateText(node.nodeValue, lang)
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue
  })

  root.querySelectorAll?.('input[placeholder]').forEach(input => {
    const nextPlaceholder = translateText(input.placeholder, lang)
    if (input.placeholder !== nextPlaceholder) input.placeholder = nextPlaceholder
  })
}

export default function LanguageDomTranslator() {
  const { user } = useAuth()
  const lang = user?.lang || 'ko'

  useEffect(() => {
    const run = () => translateNodeTree(document.body, lang)
    run()

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(run)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [lang])

  return null
}
