import type { ContentDetail, Advisor } from '@/types/api';

export const DUMMY_CONTENT_DETAIL: ContentDetail = {
  id: 'C-0142',
  title: '신규 적금 상품 런칭 SNS 카드뉴스 (3종)',
  status: 'approved',
  type: 'sns',
  typeLabel: 'SNS 카드뉴스',
  subType: '이미지+텍스트',
  submittedAt: '2026-05-16',
  finalAt: '2026-05-18',
  advisor: '박준법',
  creator: '김지원',
  complianceNo: 'JB-111111-111111',
  reviews: [
    {
      version: 3,
      label: '최종 승인',
      status: 'approved',
      date: '2026-05-18 14:22',
      reviewer: '박준법 자문가',
      summary: '광고 수정 사항 반영 완료. 최종 승인',
      hasAISummary: true,
      opinion: {
        general:
          '제출하신 카드뉴스는 광고심의규정 §4-2(우대금리 표기) 및 §6-1(단정적 표현 금지) 위반 요소가 모두 해소되었습니다. 발행하셔도 됩니다.',
        items: [
          '헤드라인의 우대금리 표기 옆에 우대조건(앱 가입·자동이체)이 추가되어 §4-2 요건을 충족합니다.',
          '"누구나"·"놓치면 손해" 등 단정·불안 조성 표현이 모두 수정되어 §6-1 요건을 충족합니다.',
          'CTA에 가입 채널이 명시되어 사내 가이드 G-2024-11도 함께 충족합니다.',
        ],
        regulations: [
          '표시광고심의규정 §4-2 (우대금리 표기)',
          '표시광고심의규정 §6-1 (단정적 표현 금지)',
          '사내 마케팅 가이드 G-2024-11',
        ],
      },
    },
    {
      version: 2,
      label: '반려',
      status: 'rejected',
      date: '2026-05-17 17:05',
      reviewer: '박준법 자문가',
      summary: '카피 4건 수정 권고. 이미지 관련 권고 2건 함께 안내',
      opinion: {
        general:
          '표시광고심의규정 §4-2(우대금리 표기) 및 §6-1(단정적 표현 금지)에 해당하는 위반 요소가 확인되었습니다. 아래 항목을 수정 후 재제출 해주시기 바랍니다.',
        items: [
          '헤드라인 "연 4.5% 우대금리"에 우대조건이 명시되지 않아 §4-2 위반에 해당합니다.',
          '"누구나", "놓치면 손해" 등 단정적·불안 조성 표현은 §6-1에 따라 삭제 또는 완화가 필요합니다.',
          'CTA 버튼에 가입 채널 명시 누락 — 사내 가이드 G-2024-11 기준 미충족.',
          '3번째 카드 이미지 내 우대금리 수치가 본문과 불일치합니다. 통일 필요.',
        ],
        regulations: [
          '표시광고심의규정 §4-2 (우대금리 표기)',
          '표시광고심의규정 §6-1 (단정적 표현 금지)',
          '사내 마케팅 가이드 G-2024-11',
        ],
      },
    },
    {
      version: 1,
      label: '최초 제출',
      status: 'pending',
      date: '2026-05-16 09:30',
      reviewer: '김지원 대리(콘텐츠팀)',
      summary: '초안 제출 · 자문가 배정 대기',
      opinion: null,
    },
  ],
  relatedContents: [
    { id: 'C-0098', title: '동일 캠페인 메인 배너' },
    { id: 'C-0114', title: '동일 상품 푸시 문구' },
  ],
};

export const DUMMY_ADVISORS: Advisor[] = [
  { id: 'park', name: '박준법', team: '준법감시실 1팀' },
  { id: 'lee', name: '이감독', team: '준법감시실 2팀' },
  { id: 'choi', name: '최감리', team: '준법감시실 3팀' },
];
