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
  complianceNo: 'JB-2026-0121',
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

// C-0140: JB뱅크 앱 푸시 알림 + 메인 배너 (파킹통장) — 최종 승인
const C0140_REVIEWS: ContentDetail['reviews'] = [
  {
    version: 4,
    label: '최종 승인',
    status: 'approved',
    date: '2026-06-10 11:40',
    reviewer: '이지원 자문가',
    summary: '권고 사항 반영 완료. 최종 승인',
    hasAISummary: true,
    opinion: {
      general:
        '수정하신 푸시 알림 및 메인 배너 문구는 금융소비자보호법 및 표시·광고의 공정화 법률 위반 요소가 모두 해소되었습니다. 발행하셔도 됩니다.',
      items: [
        'CTA 버튼 하단에 \'준법감시인 심의필 제140호\' 문구가 추가되어 표시 의무 사항을 충족합니다.',
        '서브 카피에 \'세전 연 2.3% (기본금리 기준, 시장 상황에 따라 변동될 수 있음)\' 안내가 병기되어 금리 오인 소지가 해소되었습니다.',
        '푸시 알림 제목의 이모지가 절제된 형태로 수정되어 이벤트성 과장 표현 우려가 해소되었습니다.',
      ],
      regulations: [
        '금융소비자 보호에 관한 법률 제22조 제3항 (금리 등 중요사항 표기)',
        '표시·광고의 공정화에 관한 법률 제4조 (표시·광고 사항의 공시)',
        '사내 마케팅 가이드 G-2024-11',
      ],
    },
  },
  {
    version: 3,
    label: '재제출',
    status: 'pending',
    date: '2026-06-09 16:20',
    reviewer: '이종철 대리(콘텐츠팀)',
    summary: '반려 권고 사항 반영하여 재제출 · 자문가 재검토 대기',
    opinion: null,
  },
  {
    version: 2,
    label: '반려',
    status: 'rejected',
    date: '2026-06-09 10:05',
    reviewer: '이지원 자문가',
    summary: 'CTA 심의필 문구 누락 및 금리 표기 보완 권고',
    opinion: {
      general:
        '제출하신 푸시 알림 및 메인 배너 문구 중 일부가 금융소비자보호법 및 표시·광고의 공정화에 관한 법률 기준에 부합하지 않아 수정 후 재제출이 필요합니다.',
      items: [
        'CTA 버튼 하단에 \'준법감시인 심의필\' 문구가 누락되어 표시·광고 의무 표기 사항을 위반합니다. 버튼 하단에 심의필 번호를 명시해 주세요.',
        '서브 카피 \'하루만 맡겨도 이자가 차곡차곡 쌓이는\'은 적용 금리 수준을 특정하지 않아 소비자 오인 소지가 있습니다. 현재 적용 금리와 변동 가능성 안내 문구 추가가 필요합니다.',
        '푸시 알림 제목의 이모지(💰)는 금융상품 광고에서 과도한 이벤트성 표현으로 오인될 수 있어 자제를 권고드립니다.',
      ],
      regulations: [
        '금융소비자 보호에 관한 법률 제22조 제3항 (금리 등 중요사항 표기)',
        '표시·광고의 공정화에 관한 법률 제4조 (표시·광고 사항의 공시)',
        '사내 마케팅 가이드 G-2024-11',
      ],
    },
  },
  {
    version: 1,
    label: '최초 제출',
    status: 'pending',
    date: '2026-06-08 14:50',
    reviewer: '이종철 대리(콘텐츠팀)',
    summary: '초안 제출 · 자문가 배정 대기',
    opinion: null,
  },
];

export const DUMMY_CONTENT_DETAIL_C0140: ContentDetail = {
  id: 'C-0140',
  title: 'JB뱅크 앱 푸시 알림 & 메인 배너 (파킹통장)',
  status: 'approved',
  type: 'other',
  typeLabel: '카카오톡',
  subType: '푸시 알림 + 메인 배너',
  submittedAt: '2026-06-08',
  finalAt: '2026-06-10',
  advisor: '이지원',
  creator: '이종철',
  complianceNo: 'JB-2026-0135',
  canPublishToChannel: true,
  caption: `[타겟] JB뱅크 앱 접속 및 푸시 알림 동의 고객

[푸시 알림 텍스트]
제목: 여유 자금, 그냥 두기 아쉬울 때?
내용: 매일매일 이자가 쌓이는 파킹통장, 지금 JB앱에서 터치 한 번으로 확인해보세요!

[앱 메인 배너 텍스트]
메인 카피: 내 지갑 속 든든한 예비 자금
서브 카피: 하루만 맡겨도 이자가 차곡차곡 쌓이는 JB 파킹통장 (세전 연 2.3%, 기본금리 기준)
CTA 버튼: 자세히 보기 (하단 '준법감시인 심의필 제140호' 문구 기재)

[이미지 및 디자인 디렉션]
- 인간의 시선 흐름(Human Visual Flow)을 고려하여 좌측 상단에 핵심 카피를, 우측 하단에 부드러운 3D 그래픽 객체(동전이 쌓여가는 깔끔한 모션 이미지)를 배치
- CTA 버튼 등에는 심미적 인터랙션이 돋보이는 애니메이션 효과를 적용하고, 여백을 충분히 활용하여 시각적 피로감 없이 심리적 안정감을 느끼며 클릭을 유도`,
  reviews: C0140_REVIEWS,
  relatedContents: [
    { id: 'C-0139', title: 'JB 파킹통장 출시 안내 카카오톡 메시지' },
    { id: 'C-0135', title: 'JB뱅크 앱 메인 배너 (이전 캠페인)' },
  ],
};

export const DUMMY_ADVISORS: Advisor[] = [
  { id: 'park', name: '백승효', team: '준법감시실 1팀' },
  { id: 'lee', name: '이지원', team: '준법감시실 2팀' },
  { id: 'choi', name: '손수호', team: '준법감시실 3팀' },
];
