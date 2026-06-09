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
  caption: `[헤드라인] 연 4.5% 우대금리, 지금 바로 시작하세요!\n[서브 카피] 누구나 가입 가능한 JB 신규 적금 상품\n[본문] 매월 자동이체 설정 시 우대금리 제공. 앱에서 간편하게 가입하고 혜택을 놓치지 마세요.\n[CTA] 지금 가입하기`,
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

export const DUMMY_CONTENT_DETAIL_C0141: ContentDetail = {
  id: 'C-0141',
  title: '개인신용대출 비교 안내 이메일 뉴스레터',
  status: 'rejected',
  type: 'sns',
  typeLabel: '이메일 뉴스레터',
  subType: '텍스트+이미지',
  submittedAt: '2026-06-02',
  finalAt: '2026-06-05',
  advisor: '이감독',
  creator: '최수현',
  complianceNo: 'JB-260602-000941',
  caption: `[제목] 내게 맞는 JB 신용대출, 한눈에 비교해보세요\n[리드] 금리·한도·기간을 한 화면에서 바로 확인하세요.\n[본문] JB 개인신용대출은 연 최저 3.9%부터 시작합니다. 직장인·프리랜서 모두 간편하게 신청 가능. 당일 심사, 당일 실행.\n[CTA] 지금 바로 한도조회`,
  reviews: [
    {
      version: 2,
      label: '반려',
      status: 'rejected',
      date: '2026-06-05 11:40',
      reviewer: '이감독 자문가',
      summary: '금리 표기 방식 미준수, 과장 표현 2건 재확인. 최종 반려',
      hasAISummary: true,
      opinion: {
        general:
          '1차 검토 후 수정본을 재검토하였으나, 핵심 위반 사항이 해소되지 않았습니다. 표시광고심의규정 §3-1(최저금리 표기) 및 §6-2(과장광고 금지)에 해당하는 문구가 여전히 잔존하여 최종 반려합니다. 하기 항목을 전면 수정 후 재제출 바랍니다.',
        items: [
          '"연 최저 3.9%"는 §3-1에 따라 적용 조건(신용등급·소득 요건 등)을 반드시 병기해야 하나, 수정본에서도 누락되어 있습니다.',
          '"당일 심사, 당일 실행" 표현은 모든 고객에게 보장되는 사항이 아니므로 §6-2 과장광고에 해당합니다. "심사 결과에 따라 당일 실행 가능" 수준으로 완화 필요합니다.',
          '이메일 하단 수신거부 링크가 실제 작동하는 URL이 아닌 플레이스홀더("#")로 처리되어 있어 발송 전 반드시 교체가 필요합니다.',
          '"프리랜서 모두 가능" 문구는 실제 심사 기준과 상이할 수 있어 삭제 또는 조건 명시가 필요합니다.',
        ],
        regulations: [
          '표시광고심의규정 §3-1 (최저금리 표기 및 조건 병기)',
          '표시광고심의규정 §6-2 (과장광고 금지)',
          '정보통신망법 제50조 (수신거부 처리)',
        ],
      },
    },
    {
      version: 1,
      label: '반려',
      status: 'rejected',
      date: '2026-06-03 16:15',
      reviewer: '이감독 자문가',
      summary: '금리 조건 미병기, 과장 표현 수정 요청',
      opinion: {
        general:
          '제출하신 이메일 뉴스레터에서 표시광고심의규정 §3-1 및 §6-2 위반 요소가 확인되었습니다. 아래 항목을 수정 후 재제출 바랍니다.',
        items: [
          '"연 최저 3.9%"에 적용 조건(신용등급, 소득 요건 등)이 병기되지 않아 §3-1 위반입니다.',
          '"당일 심사, 당일 실행" 표현은 모든 경우에 해당하지 않으므로 §6-2 과장광고에 해당합니다.',
          '수신거부 링크 플레이스홀더 처리 확인 — 발송 전 실제 URL로 교체 필요.',
        ],
        regulations: [
          '표시광고심의규정 §3-1 (최저금리 표기 및 조건 병기)',
          '표시광고심의규정 §6-2 (과장광고 금지)',
          '정보통신망법 제50조 (수신거부 처리)',
        ],
      },
    },
    {
      version: 0,
      label: '최초 제출',
      status: 'pending',
      date: '2026-06-02 10:05',
      reviewer: '최수현 대리(디지털마케팅팀)',
      summary: '초안 제출 · 자문가 배정 대기',
      opinion: null,
    },
  ],
  relatedContents: [
    { id: 'C-0128', title: '동일 상품 앱 푸시 문구' },
    { id: 'C-0135', title: '개인신용대출 랜딩페이지 배너' },
  ],
};

export const DUMMY_CONTENT_DETAIL_C0143: ContentDetail = {
  id: 'C-0143',
  title: '2026 여름 적금 이벤트 유튜브 광고 스크립트',
  status: 'pending',
  type: 'other',
  typeLabel: '영상 광고',
  subType: '스크립트',
  submittedAt: '2026-06-09',
  finalAt: '',
  advisor: '최감리',
  creator: '이다은',
  complianceNo: '',
  caption: `[장면 1 - 오프닝] "여름엔 역시 JB 적금이죠. 연 5.0% 우대금리!"\n[장면 2 - 혜택 소개] 매달 자동이체 설정만 해도 최고 우대금리 적용. 지금 가입하면 여름 시즌 한정 금리 추가 제공.\n[장면 3 - CTA] "JB뱅크 앱에서 지금 바로 가입하세요!"`,
  reviews: [
    {
      version: 1,
      label: '최초 제출',
      status: 'pending',
      date: '2026-06-09 09:15',
      reviewer: '이다은 주임(브랜드마케팅팀)',
      summary: '초안 제출 · 자문가 배정 대기',
      opinion: null,
    },
  ],
  relatedContents: [
    { id: 'C-0142', title: '신규 적금 상품 런칭 SNS 카드뉴스 (3종)' },
    { id: 'C-0138', title: '여름 이벤트 메인 배너' },
  ],
};

export const DUMMY_ADVISORS: Advisor[] = [
  { id: 'park', name: '박준법', team: '준법감시실 1팀' },
  { id: 'lee', name: '이감독', team: '준법감시실 2팀' },
  { id: 'choi', name: '최감리', team: '준법감시실 3팀' },
];
