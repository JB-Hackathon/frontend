import type { AIChatResponse } from '../types/api';
import type { Message } from '../types/review';
export type { AgentMessage, UserMessage, Message } from '../types/review';

export const messages: Message[] = [
  {
    id: '1',
    role: 'agent',
    content: '이 카드뉴스 카피의 광고심의규정 위반 소지를 검토해 드릴까요?',
  },
  { id: '2', role: 'user', content: '응. Card 1·2 중심으로.' },
  {
    id: '3',
    role: 'agent',
    content: 'Card 1 우대금리 표기, Card 2 단정 표현 2건을 발견했어요. 피드백 초안에 반영했습니다. (3건 적용)',
    badge: '✓ 피드백 v1 반영됨',
  },
  {
    id: '4',
    role: 'user',
    content: 'Card 2 "놓치면 손해" 부분만 다른 표현 제안 줘봐.',
  },
  {
    id: '5',
    role: 'agent',
    content: '대체 표현 3가지:',
    alternatives: [
      '① "혜택은 한정 기간만 제공됩니다"',
      '② "조기 마감될 수 있습니다"',
      '③ "지금 가입 가능한 우대 혜택"',
    ],
    altNote: '①·②는 §6-1 위반 가능성 낮음, ③ 권장.',
    actions: { primary: '적용하기', secondary: '모두 보기' },
  },
  {
    id: '6',
    role: 'user',
    content: 'Card 3 CTA에 앱 가입 채널 추가하는 문구로 다시 제안 줘',
  },
  {
    id: '7',
    role: 'agent',
    content: 'Card 3 CTA에 가입 채널 추가하는 문구로 다시',
    isTyping: true,
  },
];

export const quickChips = [
  '+ 규정 §4-2 인용',
  '+ 대체 표현 3가지',
  '+ 한 줄 요약 생성',
  '+ 제작자 톤으로 변환',
];

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
    lines: ['○○은행 주거래 우대 통장. 오늘 바로 시작하세요.'],
  },
];

export const DUMMY_AI_RESPONSES: AIChatResponse[] = [
  {
    id: 'ai-1',
    content: 'Card 1 우대금리 표기, Card 2 단정 표현 2건을 발견했어요. 피드백 초안에 반영했습니다. (3건 적용)',
    badge: '✓ 피드백 v1 반영됨',
  },
  {
    id: 'ai-2',
    content: '대체 표현 3가지:',
    alternatives: [
      '① "혜택은 한정 기간만 제공됩니다"',
      '② "조기 마감될 수 있습니다"',
      '③ "지금 가입 가능한 우대 혜택"',
    ],
    altNote: '①·②는 §6-1 위반 가능성 낮음, ③ 권장.',
    actions: { primary: '적용하기', secondary: '모두 보기' },
  },
];

export const DUMMY_AI_SUMMARY =
  '제출하신 카드뉴스는 광고심의규정 §4-2 및 §6-1 위반 요소가 모두 해소되었습니다.';

export const feedbackDetail = [
  {
    title: '1. 심의 개요',
    body: '본 검토는 마케팅팀에서 요청한 주거래 우대 통장 SNS 카드뉴스 초안(총 3장)에 대한 준법 심의 결과입니다. 관련 법령인 \'금융소비자보호법\' 및 \'광고심의규정\'을 기준으로 적법성을 판단했습니다.',
  },
  {
    title: '2. 종합 심의 의견 (조건부 승인)',
    body: '제출된 카드뉴스 시안은 전반적으로 상품의 핵심 혜택을 잘 전달하고 있으나, Card 1과 Card 2의 문구에서 소비자 오인의 소지가 있는 \'우대금리 무조건 표기\' 및 \'단정적 표현\'이 발견되었습니다. 해당 항목을 아래 수정 의견에 따라 보완하는 조건으로 최종 승인이 가능합니다.',
  },
  {
    title: '3. 검토 및 수정 의견',
    body: '먼저 Card 1의 "연 최대 7.0% 우대금리"라는 문구는 광고심의규정 §4-2에 따라 기본금리와 우대금리를 동등하게 병기하거나, "* 우대조건 충족 시 (앱 가입·자동이체)" 등의 단서를 명확히 표기해야 합니다. 현재 카피는 우대조건이 Card 3 하단에만 작게 언급되어 분리 표기에 해당합니다.\n다음으로 Card 2의 "누구나 받을 수 있는"은 우대조건이 있는 상품에서 단정적 표현으로 분류됩니다(광고심의규정 §6-1). "조건 충족 시 받을 수 있는"으로 수정을 권고합니다. 또한 "놓치면 손해입니다"는 소비자 불안을 조성하는 표현으로, 삭제 또는 중립적 표현으로 교체를 권고합니다.',
  },
  {
    title: '4. 향후 조치 제안 수정',
    body: '수정된 최종본을 재제출해 주시면 최종 승인 번호를 부여할 예정입니다. AI 심의 결과 분석에 따르면 본 건은 문구 수정만으로 법적 리스크를 90% 이상 제거할 수 있는 사안이므로 마케팅팀과의 빠른 조율을 권장합니다.',
  },
];
