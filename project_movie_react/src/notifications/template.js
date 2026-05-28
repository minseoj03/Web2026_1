/**
 * 알림 템플릿 시스템
 * 
 * 서버에서는 type + 데이터만 내려주고,
 * 프론트에서 type에 맞는 title/desc를 자동 생성
 */

export const NOTIFICATION_TEMPLATE = {
  movie_recommend_friend: {
    category: 'recommend',
    icon: '💜',
    label: '추천 알림',
    labelColor: 'text-[#db2777]',
    bgColor: 'bg-[#fce7f3]',
    title: ({ actorName }) => `${actorName}님이 영화를 추천했어요`,
    desc: ({ message }) => message || '추천 영화를 확인해보세요!',
    hasMovie: true,
  },
  movie_recommend_ai: {
    category: 'recommend',
    icon: '🤖',
    label: 'AI 추천',
    labelColor: 'text-[#7c3aed]',
    bgColor: 'bg-[#ede9fe]',
    title: () => 'AI가 새로운 영화를 추천했어요',
    desc: ({ message }) => message || '취향에 맞는 영화를 확인해보세요!',
    hasMovie: true,
  },
  vote_invite: {
    category: 'general',
    icon: '🗳️',
    label: '투표 알림',
    labelColor: 'text-[#7c3aed]',
    bgColor: 'bg-[#ede9fe]',
    title: ({ actorName }) => `${actorName}님이 투표방에 초대했어요`,
    desc: ({ roomName }) => `"${roomName}" 투표방에 참여해보세요!`,
    hasMovie: false,
  },
  vote_result: {
    category: 'general',
    icon: '🏆',
    label: '투표 결과',
    labelColor: 'text-[#7c3aed]',
    bgColor: 'bg-[#ede9fe]',
    title: ({ roomName }) => `"${roomName}" 투표 결과가 나왔어요`,
    desc: ({ movieTitle }) => `${movieTitle}이(가) 최종 선정되었어요!`,
    hasMovie: false,
  },
  realtime_review: {
    category: 'general',
    icon: '⚡',
    label: '실시간 알림',
    labelColor: 'text-[#ca8a04]',
    bgColor: 'bg-[#fef9c3]',
    title: ({ actorName }) => `${actorName}님이 방금 영화를 평가했어요`,
    desc: ({ movieTitle, rating }) => `"${movieTitle}"에 ⭐ ${rating}점을 줬어요`,
    hasMovie: false,
  },
  friend_add: {
    category: 'general',
    icon: '👥',
    label: '친구 알림',
    labelColor: 'text-[#2563eb]',
    bgColor: 'bg-[#dbeafe]',
    title: ({ actorName }) => `${actorName}님과 친구가 되었어요!`,
    desc: () => '이제 영화 활동을 함께 공유할 수 있어요.',
    hasMovie: false,
  },
}

/**
 * 알림 데이터에서 렌더링용 객체 생성
 */
export function resolveNotification(notif) {
  const template = NOTIFICATION_TEMPLATE[notif.type]
  if (!template) return { icon: '🔔', label: '알림', labelColor: 'text-gray-500', bgColor: 'bg-gray-100', title: '알림', desc: '', category: 'general', hasMovie: false }

  return {
    ...template,
    title: template.title(notif),
    desc: template.desc(notif),
    category: template.category,
    hasMovie: template.hasMovie,
  }
}
