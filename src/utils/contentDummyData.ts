import type { ContentDetail, Advisor } from '@/types/api';

const C0144_REVIEWS: ContentDetail['reviews'] = [
    {
      version: 4,
      label: '최종 승인',
      status: 'approved',
      date: '2026-05-18 14:22',
      reviewer: '백승효 자문가',
      summary: '권고 사항 반영 완료. 최종 승인',
      hasAISummary: true,
      opinion: {
        general:
          '제출하신 텍스트 및 이미지는 금융소비자보호법 및 표시·광고의 공정화 법률 위반 요소가 모두 해소되었습니다. 발행하셔도 됩니다.',
        items: [
          '헤드라인의 우대금리 표기 옆에 우대조건(앱 가입·자동이체)이 추가되어 금융소비자보호법을 충족합니다.',
          '"누구나""놓치면 손해" 등 단정·불안 조성 표현이 모두 수정되어 표시 요건을 충족합니다.',
          '우대조건 충족 시 적용되는 텍스트가 최고이율과 대비되지 않아 오인을 유발할 소지가 수정되어 표시 요건을 충족합니다.',
        ],
        regulations: [
          '표시·광고의 공정화에 관한 법률 제3조 제1항 제3호',
          '표시·광고의 공정화에 관한 법률 제3조 제1항 제1호 (단정적 표현 금지)',
          '금융소비자보호법 제32조 제1항',
        ],
      },
    },
    {
      version: 3,
      label: '재제출',
      status: 'pending',
      date: '2026-05-18 09:10',
      reviewer: '이종철 대리(콘텐츠팀)',
      summary: '반려 권고 사항 반영하여 재제출 · 자문가 재검토 대기',
      opinion: null,
    },
    {
      version: 2,
      label: '반려',
      status: 'rejected',
      date: '2026-05-17 17:05',
      reviewer: '백승효 자문가',
      summary: '카피 4건 수정 권고. 이미지 관련 권고 2건 함께 안내',
      opinion: {
        general:
          '금융소비자 보호에 관한 법률 제22조 제3항(우대금리 표기) 및 표시·광고의 공정화에 관한 법률 제3조 제1항 제1호(단정적 표현 금지)에 해당하는 위반 요소가 확인되었습니다. 아래 항목을 수정 후 재제출 해주시기 바랍니다.',
        items: [
          '헤드라인 "연 4.5% 우대금리"에 우대조건이 명시되지 않아 위반에 해당합니다.',
          '"누구나", "놓치면 손해" 등 단정적·불안 조성 표현은 표시·광고의 공정화에 관한 법률 제3조 제1항 제1호에 따라 삭제 또는 완화가 필요합니다.',
          'CTA 버튼에 가입 채널 명시 누락 — 사내 가이드 G-2024-11 기준 미충족.',
          '3번째 카드 이미지 내 우대금리 수치가 본문과 불일치합니다. 통일 필요.',
        ],
        regulations: [
          '금융소비자 보호에 관한 법률 제22조 제3항 (우대금리 표기)',
          '표시·광고의 공정화에 관한 법률 제3조 제1항 제1호 (단정적 표현 금지)',
          '사내 마케팅 가이드 G-2024-11',
        ],
      },
    },
    {
      version: 1,
      label: '최초 제출',
      status: 'pending',
      date: '2026-05-16 09:30',
      reviewer: '이종철 대리(콘텐츠팀)',
      summary: '초안 제출 · 자문가 배정 대기',
      opinion: null,
    },
];

const C0144_BASE = {
  title: 'JB은행 도전 루틴적금 온라인 배너',
  type: 'sns' as const,
  typeLabel: 'SNS 카드뉴스',
  subType: '이미지+텍스트',
  submittedAt: '2026-05-16',
  advisor: '백승효',
  creator: '이종철',
  caption: `[헤드라인] 연 4.5% 우대금리, 지금 바로 시작하세요!\n[서브 카피] 누구나 가입 가능한 JB 신규 적금 상품\n[본문] 매월 자동이체 설정 시 우대금리 제공. 앱에서 간편하게 가입하고 혜택을 놓치지 마세요.\n[CTA] 지금 가입하기`,
  relatedContents: [
    { id: 'C-0098', title: '동일 캠페인 메인 배너' },
    { id: 'C-0114', title: '동일 상품 푸시 문구' },
  ],
};

export const DUMMY_CONTENT_DETAIL_C0144: ContentDetail = {
  ...C0144_BASE,
  id: 'C-0144',
  status: 'approved',
  finalAt: '2026-05-18',
  complianceNo: 'JB-111111-111111',
  reviews: C0144_REVIEWS,
};

// C-0143: 최초 제출 → 반려 → 재제출까지만 진행된 상태 (자문가 재검토 대기)
export const DUMMY_CONTENT_DETAIL_C0143: ContentDetail = {
  ...C0144_BASE,
  id: 'C-0144',
  status: 'pending',
  finalAt: '',
  complianceNo: '',
  reviews: C0144_REVIEWS.filter((r) => r.version <= 3),
};

// C-0142: 최초 제출만 진행된 상태 (자문가 배정 대기)
export const DUMMY_CONTENT_DETAIL_C0142: ContentDetail = {
  ...C0144_BASE,
  id: 'C-0144',
  status: 'pending',
  finalAt: '',
  complianceNo: '',
  reviews: C0144_REVIEWS.filter((r) => r.version === 1),
};


// C-0141: 최초 제출 → 반려까지만 진행된 상태 (재제출 전 최종 반려)
export const DUMMY_CONTENT_DETAIL_C0141: ContentDetail = {
  ...C0144_BASE,
  id: 'C-0141',
  status: 'rejected',
  finalAt: '2026-05-17',
  complianceNo: '',
  reviews: C0144_REVIEWS.filter((r) => r.version <= 2),
};

export const DUMMY_ADVISORS: Advisor[] = [
  { id: 'park', name: '백승효', team: '준법감시실 1팀' },
  { id: 'lee', name: '이지원', team: '준법감시실 2팀' },
  { id: 'choi', name: '손수호', team: '준법감시실 3팀' },
];
