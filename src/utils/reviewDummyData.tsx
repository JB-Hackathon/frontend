import type { AgentMessage, UserMessage } from '../types/review';
export type { AgentMessage, UserMessage, Message } from '../types/review';

// --- 체크리스트 타입 ---
export interface CheckItem {
  law_list: string[];
  check_description: string;
  check_title: string;
  status: '통과' | '수정권고';
}

export interface ContentTypeCard {
  content_type: 'text' | 'image1' | 'image2' | 'image3';
  content_label: string;
  check_list: CheckItem[];
}

export interface ChecklistVersion {
  overallStatus: 'approved' | 'rejected';
  overallText: string;
  contentCards: ContentTypeCard[];
  summary: string;
}

const baseTextChecks: CheckItem[] = [
  {
    check_title: '우대금리 조건 미명시',
    check_description:
      '"연 최대 7.0% 우대금리" 문구에 우대조건(앱 가입, 자동이체 등) 단서가 명시되지 않았습니다. §4-2에 따라 기본금리와 우대금리를 구분하거나 조건 단서를 병기해야 합니다.',
    law_list: ['광고심의규정 §4-2', '금융소비자보호법 §22'],
    status: '수정권고',
  },
  {
    check_title: '"누구나" 단정적 표현',
    check_description:
      '"누구나 받을 수 있는 혜택" 표현은 우대조건이 있는 상품에서 단정적 표현에 해당합니다. "조건 충족 시 받을 수 있는 혜택"으로 수정을 권고합니다.',
    law_list: ['광고심의규정 §6-1'],
    status: '수정권고',
  },
  {
    check_title: '"놓치면 손해" 소비자 불안 조성',
    check_description:
      '"놓치면 손해입니다" 표현은 소비자에게 즉시 행동하지 않으면 불이익을 받는다는 인식을 유발할 수 있어 §6-1 위반 소지가 있습니다. 삭제 또는 중립 표현으로 교체가 필요합니다.',
    law_list: ['광고심의규정 §6-1'],
    status: '수정권고',
  },
  {
    check_title: 'CTA 문구 적절성',
    check_description:
      '"오늘 바로 시작하세요" CTA 문구는 긴박감을 조성하지 않는 중립적 표현으로 현행 규정상 문제없습니다.',
    law_list: ['광고심의규정 §6-1'],
    status: '통과',
  },
];

const baseImage1Checks: CheckItem[] = [
  {
    check_title: '이미지 내 금리 단서 미표기',
    check_description:
      'Card 1 이미지 내 "7.0%" 수치가 시각적으로 강조되어 있으나 우대조건 단서 문구가 이미지 내에 포함되어 있지 않습니다. 이미지 하단에 소형 텍스트로 조건을 표기해야 합니다.',
    law_list: ['광고심의규정 §4-2', '시각광고 가이드라인 §3'],
    status: '수정권고',
  },
  {
    check_title: '브랜드 CI 준수',
    check_description:
      'JB은행 공식 CI 색상 및 로고가 적절히 사용되었으며, 브랜드 가이드라인을 준수하고 있습니다.',
    law_list: ['내부 브랜드 가이드라인 §2'],
    status: '통과',
  },
];

const baseImage2Checks: CheckItem[] = [
  {
    check_title: '이미지 내 단정적 표현',
    check_description:
      '이미지 내 "누구나 받을 수 있는 혜택!" 텍스트는 §6-1 단정적 표현 위반 소지가 있습니다. "조건 충족 고객 대상" 등으로 수정이 필요합니다.',
    law_list: ['광고심의규정 §6-1'],
    status: '수정권고',
  },
  {
    check_title: '이미지 가독성',
    check_description:
      '배경 색상과 텍스트 색상의 명암 대비가 WCAG AA 기준을 충족하며 가독성에 문제가 없습니다.',
    law_list: ['접근성 가이드라인 WCAG 2.1'],
    status: '통과',
  },
  {
    check_title: '혜택 조건 표기 누락',
    check_description:
      '이미지 내 혜택 수치 옆에 조건 표기 공간이 확보되지 않았습니다. 이미지 하단 여백에 약관 링크 또는 조건 단서를 추가해야 합니다.',
    law_list: ['광고심의규정 §4-2', '금융소비자보호법 §22'],
    status: '수정권고',
  },
];

const baseImage3Checks: CheckItem[] = [
  {
    check_title: '앱 다운로드 경로 표기',
    check_description:
      'CTA 카드에 앱스토어/구글플레이 표기가 포함되어 있으며, 디지털 광고 가이드라인 요구사항을 충족합니다.',
    law_list: ['디지털광고 가이드라인 §5'],
    status: '통과',
  },
  {
    check_title: '우대금리 조건 변경 가능성 고지',
    check_description:
      '마지막 CTA 카드에 "우대금리 조건은 변경될 수 있습니다" 고지가 포함되어 있지 않습니다. 고지 추가를 권장합니다.',
    law_list: ['광고심의규정 §8-1'],
    status: '수정권고',
  },
];

export const checklistVersions: Record<'v1' | 'v2' | 'v3', ChecklistVersion> = {
  v1: {
    overallStatus: 'rejected',
    overallText:
      '본 카드뉴스는 광고심의규정 §4-2(우대금리 표기) 및 §6-1(단정적 표현 금지) 위반 소지가 있어 수정이 권고됩니다.',
    contentCards: [
      { content_type: 'text', content_label: '텍스트', check_list: baseTextChecks },
      { content_type: 'image1', content_label: 'Card 1 · 헤드라인', check_list: baseImage1Checks },
      { content_type: 'image2', content_label: 'Card 2 · 혜택 안내', check_list: baseImage2Checks },
      { content_type: 'image3', content_label: 'Card 3 · CTA', check_list: baseImage3Checks },
    ],
    summary: '우대조건 단서 보강(§4-2)과 단정적 표현 2건 수정(§6-1) 후 재제출 시 승인 예정입니다.',
  },
  v2: {
    overallStatus: 'rejected',
    overallText:
      '§6-1 위반 표현 상세 분석을 추가했습니다. Card 2 "놓치면 손해" 대체 표현이 피드백에 반영되었습니다.',
    contentCards: [
      {
        content_type: 'text',
        content_label: '텍스트 · 카피',
        check_list: baseTextChecks.map((c) =>
          c.check_title === '"놓치면 손해" 소비자 불안 조성'
            ? { ...c, status: '통과' as const, check_description: '대체 표현 "지금 가입 가능한 우대 혜택"으로 수정 예정 — §6-1 위반 소지가 해소됩니다.' }
            : c
        ),
      },
      { content_type: 'image1', content_label: 'Card 1 · 헤드라인', check_list: baseImage1Checks },
      { content_type: 'image2', content_label: 'Card 2 · 혜택 안내', check_list: baseImage2Checks },
      { content_type: 'image3', content_label: 'Card 3 · CTA', check_list: baseImage3Checks },
    ],
    summary: 'Card 2 "놓치면 손해" → "지금 가입 가능한 우대 혜택"으로 변경, 우대조건 단서 추가 후 재제출 권장합니다.',
  },
  v3: {
    overallStatus: 'approved',
    overallText: 'Card 2 표현 수정(§6-1) 및 Card 1 우대조건 단서(§4-2) 반영 시 최종 승인됩니다.',
    contentCards: [
      {
        content_type: 'text',
        content_label: '텍스트 · 카피',
        check_list: baseTextChecks.map((c) => ({
          ...c,
          status: '통과' as const,
          check_description:
            c.status === '수정권고'
              ? `수정 반영됨 — ${c.check_description.split('.')[0]} 조치가 완료되었습니다.`
              : c.check_description,
        })),
      },
      {
        content_type: 'image1',
        content_label: 'Card 1 · 헤드라인',
        check_list: baseImage1Checks.map((c) => ({
          ...c,
          status: '통과' as const,
          check_description: c.status === '수정권고'
            ? '이미지 하단에 "* 앱 가입·자동이체 시 우대조건 충족" 단서가 추가되었습니다. 위반 소지가 해소되었습니다.'
            : c.check_description,
        })),
      },
      {
        content_type: 'image2',
        content_label: 'Card 2 · 혜택 안내',
        check_list: baseImage2Checks.map((c) => ({ ...c, status: '통과' as const })),
      },
      {
        content_type: 'image3',
        content_label: 'Card 3 · CTA',
        check_list: baseImage3Checks.map((c) => ({ ...c, status: '통과' as const })),
      },
    ],
    summary: 'Card 2 표현 수정 및 Card 1 우대조건 단서 반영 후 최종 승인됩니다.',
  },
};

// --- Cards (ContentPanel에서 사용) ---
export const cards = [
  {
    label: 'CARD 1 · 헤드라인',
    lines: ['매월 30만원만 넣어도,', <strong key="bold">연 최대 7.0% 우대금리.</strong>],
  },
  {
    label: 'CARD 2 · 본문',
    lines: [
      <>지금 가입하면 <strong>누구나</strong> 받을 수 있는 혜택,</>,
      '놓치면 손해입니다.',
    ],
  },
  {
    label: 'CARD 3 · CTA',
    lines: ['JB은행 주거래 우대 통장. 오늘 바로 시작하세요.'],
  },
];

// --- 채팅 스크립트 ---
export const chatInitialMessages: (AgentMessage | UserMessage)[] = [
  {
    id: 'init-1',
    role: 'agent',
    content: "'주거래 우대 통장 SNS 카드뉴스 3종' 준법 심의를 완료했습니다.",
  },
  {
    id: 'init-2',
    role: 'agent',
    content:
      'Card 1 우대금리 무조건 표기(§4-2), Card 2 단정적 표현 2건(§6-1) 위반 소지를 발견했습니다. 피드백 초안을 작성했습니다.',
    badge: '✓ 피드백 v1 작성됨',
  },
];

export const chatStep1: [UserMessage, AgentMessage] = [
  {
    id: 'step1-user',
    role: 'user',
    content: "Card 2 '놓치면 손해입니다' 표현이 구체적으로 어떤 규정 위반인지 설명해줘.",
  },
  {
    id: 'step1-agent',
    role: 'agent',
    content:
      '§6-1은 소비자의 불안감이나 긴박감을 조성하는 표현을 금지합니다. \'놓치면 손해\'는 즉시 행동하지 않으면 불이익을 받는다는 인식을 줄 수 있어 위반 소지가 있습니다.\n\n대체 표현을 제안드립니다:',
    alternatives: [
      "① '지금 가입 가능한 우대 혜택'",
      "② '한정 기간만 제공되는 혜택'",
      "③ '기간 내 신규 가입 고객 대상 혜택'",
    ],
    altNote: '①은 §6-1 위반 가능성 없음. 권장합니다.',
    actions: { primary: '①번으로 적용하기', secondary: '닫기' },
  },
];

export const chatStep2: [UserMessage, AgentMessage] = [
  {
    id: 'step2-user',
    role: 'user',
    content: "①번 '지금 가입 가능한 우대 혜택'으로 적용해줘. Card 1 우대금리 단서도 추가해줘.",
  },
  {
    id: 'step2-agent',
    role: 'agent',
    content:
      "두 수정 사항을 피드백에 반영했습니다. Card 2는 '지금 가입 가능한 우대 혜택'으로, Card 1은 '* 앱 가입·자동이체 시 우대조건 충족' 단서를 포함하도록 반영했습니다.",
    badge: '✓ 피드백 v3 반영됨 · 승인',
  },
];

// --- 피드백 버전별 데이터 ---
export type FeedbackStatus = 'rejected' | 'approved';

export interface FeedbackVersion {
  overallStatus: FeedbackStatus;
  overallText: string;
  details: { title: string; body: string }[];
  summary: string;
}

export const feedbackVersions: Record<'v1' | 'v2' | 'v3', FeedbackVersion> = {
  v1: {
    overallStatus: 'rejected',
    overallText:
      '본 카드뉴스 카피는 광고심의규정 제7조(우대금리 표기) 및 제6조(단정적 표현 금지) 위반 소지가 있어 수정이 권고됩니다.',
    details: [
      {
        title: '1. 심의 개요',
        body: '마케팅팀에서 요청한 주거래 우대 통장 SNS 카드뉴스 초안(총 3장)에 대한 준법 심의 결과입니다. \'금융소비자보호법\' 및 \'광고심의규정\'을 기준으로 적법성을 판단했습니다.',
      },
      {
        title: '2. 주요 위반 사항',
        body: '① Card 1 "연 최대 7.0% 우대금리" — §4-2 위반. 기본금리와 우대금리를 동등하게 병기하거나 조건 단서를 명시해야 합니다.\n② Card 2 "누구나 받을 수 있는" — §6-1 위반. 우대조건이 있는 상품에서 단정적 표현으로 분류됩니다.\n③ Card 2 "놓치면 손해입니다" — §6-1 위반. 소비자 불안 조성 표현으로 삭제 또는 교체가 필요합니다.',
      },
      {
        title: '3. 수정 권고',
        body: 'Card 1: "* 우대조건 충족 시(앱 가입·자동이체)" 등의 단서를 명확히 표기하세요.\nCard 2: "조건 충족 시 받을 수 있는"으로 수정하고 "놓치면 손해"는 삭제를 권고합니다.',
      },
      {
        title: '4. 향후 조치',
        body: '수정된 최종본을 재제출해 주시면 최종 승인 번호를 부여할 예정입니다. 문구 수정만으로 법적 리스크의 90% 이상 제거가 가능합니다.',
      },
    ],
    summary: '우대조건 자막 보강(§4-2)과 단정적 표현 2건 삭제(§6-1) 후 재제출 시 승인 예정입니다.',
  },
  v2: {
    overallStatus: 'rejected',
    overallText:
      "§6-1 위반 표현 상세 분석을 추가했습니다. Card 2 '놓치면 손해' 대체 표현이 피드백에 반영되었습니다.",
    details: [
      {
        title: '1. 심의 개요',
        body: '마케팅팀에서 요청한 주거래 우대 통장 SNS 카드뉴스 초안(총 3장)에 대한 준법 심의 결과입니다. \'금융소비자보호법\' 및 \'광고심의규정\'을 기준으로 적법성을 판단했습니다.',
      },
      {
        title: '2. 주요 위반 사항 (업데이트)',
        body: '① Card 1 "연 최대 7.0% 우대금리" — §4-2 위반. 기본금리와 우대금리를 동등하게 병기하거나 조건 단서를 명시해야 합니다.\n② Card 2 "누구나 받을 수 있는" — §6-1 위반. 우대조건이 있는 상품에서 단정적 표현으로 분류됩니다.',
      },
      {
        title: '3. §6-1 상세 분석 · Card 2 "놓치면 손해"',
        body: '§6-1(소비자 불안 조성 금지): 소비자가 즉시 행동하지 않으면 불이익을 받는다는 인식을 유발하는 표현을 금지합니다.\n\n권장 대체 표현:\n① "지금 가입 가능한 우대 혜택" — 권장 (위반 가능성 없음)\n② "한정 기간만 제공되는 혜택" — 사용 가능\n③ "기간 내 신규 가입 고객 대상 혜택" — 사용 가능',
      },
      {
        title: '4. 향후 조치',
        body: '대체 표현 ①번 적용 및 Card 1 우대조건 단서 추가 후 재제출 시 승인이 가능합니다.',
      },
    ],
    summary:
      "Card 2 '놓치면 손해' → '지금 가입 가능한 우대 혜택'으로 변경, Card 1 우대조건 단서 추가 후 재제출 권장합니다.",
  },
  v3: {
    overallStatus: 'approved',
    overallText:
      'Card 2 표현 수정(§6-1) 및 Card 1 우대조건 단서(§4-2) 반영 시 승인됩니다. 수정 후 재제출을 권장합니다.',
    details: [
      {
        title: '1. 심의 개요',
        body: '마케팅팀에서 요청한 주거래 우대 통장 SNS 카드뉴스 초안(총 3장)에 대한 준법 심의 결과입니다. \'금융소비자보호법\' 및 \'광고심의규정\'을 기준으로 적법성을 판단했습니다.',
      },
      {
        title: '2. 수정 적용 사항 ✓',
        body: "① Card 2 '놓치면 손해' → '지금 가입 가능한 우대 혜택' 수정 예정 (§6-1 위반 해소)\n② Card 1 '* 앱 가입·자동이체 시 우대조건 충족' 단서 추가 예정 (§4-2 위반 해소)",
      },
      {
        title: '3. 남은 확인 사항',
        body: "Card 2 '누구나 받을 수 있는' → '조건 충족 시 받을 수 있는'으로의 변경이 실제 시안에 반영되었는지 최종 확인이 필요합니다.",
      },
      {
        title: '4. 최종 승인 조건',
        body: '위 수정 사항이 실제 디자인 시안에 반영되어 재제출되면 최종 승인 번호를 부여합니다. 법적 리스크는 95% 이상 제거될 것으로 판단됩니다.',
      },
    ],
    summary: 'Card 2 표현 수정 완료 예정, Card 1 우대조건 단서 확인 후 최종 승인됩니다.',
  },
};

// 하위 호환 내보내기
export const feedbackDetail = feedbackVersions.v1.details;
export const messages = chatInitialMessages;
export const quickChips = ['+ 규정 §4-2 인용', '+ 대체 표현 3가지', '+ 한 줄 요약 생성', '+ 제작자 톤으로 변환'];

export const DUMMY_AI_RESPONSES = [
  {
    id: 'ai-1',
    content: 'Card 1 우대금리 표기, Card 2 단정 표현 2건을 발견했어요. 피드백 초안에 반영했습니다.',
    badge: '✓ 피드백 v1 반영됨',
  },
  {
    id: 'ai-2',
    content: '대체 표현 3가지:',
    alternatives: [
      "① '지금 가입 가능한 우대 혜택'",
      "② '한정 기간만 제공되는 혜택'",
      "③ '기간 내 신규 가입 고객 대상 혜택'",
    ],
    altNote: '①은 §6-1 위반 가능성 없음, 권장.',
    actions: { primary: '적용하기', secondary: '모두 보기' },
  },
];

export const DUMMY_AI_SUMMARY =
  '제출하신 카드뉴스는 광고심의규정 §4-2 및 §6-1 위반 요소가 모두 해소되었습니다.';

// --- 자유 채팅 데모 (C-0144) ---
export const freeChatInitialMessage: AgentMessage = {
  id: 'free-init',
  role: 'agent',
  content:
    "'JB체크카드 혜택 안내 온라인 배너 2종' 준법 심의 준비가 완료되었습니다. 검토가 필요한 내용을 자유롭게 질문해 주세요.",
};

export const freeChatResponses: AgentMessage[] = [
  {
    id: 'free-ai-1',
    role: 'agent',
    content:
      "배너 Card 1의 '최대 5% 캐시백' 문구는 광고심의규정 §4-2에 따라 캐시백 적용 조건(가맹점, 월 한도 등)을 명시해야 합니다. Card 2의 '누구나 첫 달 혜택 100% 제공'은 §6-1 단정적 표현 위반 소지가 있어 조건부 표현으로 수정을 권고합니다.",
    badge: '✓ 피드백 v2 업데이트됨',
  },
  {
    id: 'free-ai-2',
    role: 'agent',
    content:
      "Card 1에 '* 전월 실적 30만원 이상, 월 최대 1만원 한도' 단서 추가, Card 2는 '신규 발급 고객 대상, 조건 충족 시 첫 달 혜택 제공'으로 수정을 권고합니다. 수정 후 재제출 시 승인이 가능합니다.",
    badge: '✓ 피드백 v3 반영됨 · 승인',
  },
  {
    id: 'free-ai-3',
    role: 'agent',
    content:
      '추가 문의 사항이 있으시면 말씀해 주세요. 현재 피드백 기준으로 수정 완료 후 재제출하시면 최종 승인이 가능합니다.',
  },
];

export const freeChatCards = [
  {
    label: 'CARD 1 · 배너 상단',
    lines: ['JB체크카드 사용하면,', <strong key="bold">매월 최대 5% 캐시백!</strong>],
  },
  {
    label: 'CARD 2 · 배너 하단',
    lines: ['지금 발급하면 누구나 첫 달 혜택 100% 제공'],
  },
];
