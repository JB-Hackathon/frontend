// 콘텐츠 상세 "추가 기능" 3종(AI 수정안 / 채널 게시 / AI 다국어 변환) 페이지 프로토타입용 더미 데이터
// 실제 API 연동 전까지 화면 구성을 검증하기 위한 정적 데이터입니다.

// ── AI 수정안 만들기 ────────────────────────────────────────────────────────────

export interface RevisionTextSegment {
  text: string;
  highlighted?: boolean;
}

export interface AIRevisionPrototypeData {
  managementNumber: string;
  statusLabel: string;
  flowLabel: string;
  title: string;
  feedback: {
    reviewer: string;
    date: string;
    content: string;
  };
  originalCopy: string;
  revisionNote: string;
  revisedCopy: RevisionTextSegment[];
}

export const aiRevisionDummyData: AIRevisionPrototypeData = {
  managementNumber: 'C-0141',
  statusLabel: '조건부 승인',
  flowLabel: '조건부 승인 → 수정 필요',
  title: '5월 적금 이벤트 배너 · AI 수정안',
  feedback: {
    reviewer: '박준법 자문가',
    date: '2026-05-17',
    content:
      '본 카드뉴스는 광고심의규정 §4-2·§6-1 및 사내 가이드 G-2024-11 위반 소지가 있어 조건부 승인합니다. 우대금리 옆에 우대조건(앱 가입·자동이체)을 동등하게 표기하고, "누구나"·"놓치면 손해" 등 단정적·불안 조성 표현을 수정하며, CTA에 가입 채널(앱·지점)을 명시해 주세요. 위 사항 반영 후 재제출 시 승인 가능합니다.',
  },
  originalCopy:
    '매월 30만원만 넣어도, 연 최대 7.0% 우대금리. 지금 가입하면 누구나 받을 수 있는 혜택, 놓치면 손해입니다. 〇〇은행 주거래 우대 통장. 오늘 바로 시작하세요.',
  revisionNote: '피드백을 반영해 전체 카피를 한 번에 다시 작성했습니다',
  revisedCopy: [
    { text: '매월 30만원만 넣어도, 연 최대 7.0% 우대금리. ' },
    { text: '※ 우대조건 충족 시(앱 가입·자동이체 등록). ', highlighted: true },
    { text: '조건 충족 시 받을 수 있는 우대 혜택, ', highlighted: true },
    { text: '지금 ' },
    { text: '가입 가능합니다.', highlighted: true },
    { text: ' 〇〇은행 주거래 우대 통장. ' },
    { text: '앱·가까운 지점에서', highlighted: true },
    { text: ' 오늘 시작하세요.' },
  ],
};

// ── 채널 게시 ──────────────────────────────────────────────────────────────────

export interface PublishCard {
  id: string;
  label: string;
}

export interface PublishChannel {
  id: string;
  iconLetter: string;
  name: string;
  handle: string;
  checked: boolean;
  disabled: boolean;
  badgeLabel: string;
  badgeTone: 'connected' | 'unavailable';
}

export interface ChannelPublishPrototypeData {
  managementNumber: string;
  statusLabel: string;
  flowLabel: string;
  title: string;
  cards: PublishCard[];
  cardsNote: string;
  captionTag: string;
  caption: string;
  captionNote: string;
  channels: PublishChannel[];
  scheduleOptions: { id: 'now' | 'scheduled'; label: string }[];
  selectedScheduleId: 'now' | 'scheduled';
}

export const channelPublishDummyData: ChannelPublishPrototypeData = {
  managementNumber: 'C-0142',
  statusLabel: '승인',
  flowLabel: '이미지 콘텐츠',
  title: '신규 적금 카드뉴스 · 채널 게시',
  cards: [
    { id: 'card_01', label: 'card_01' },
    { id: 'card_02', label: 'card_02' },
    { id: 'card_03', label: 'card_03' },
  ],
  cardsNote: '이미지 3종 · 채널 규격에 맞춰 자동 리사이즈됩니다.',
  captionTag: '모든 채널 공통',
  caption:
    '신규 적금 출시 🎉 매월 30만원으로 시작하는 우대 적금. 우대조건 충족 시 연 최대 7.0% (앱 가입·자동이체). #적금 #JB금융 #재테크',
  captionNote: '하나의 캡션이 선택한 모든 채널에 동일하게 게시됩니다.',
  channels: [
    {
      id: 'facebook',
      iconLetter: 'F',
      name: 'Facebook 페이지',
      handle: '@JB금융그룹 공식',
      checked: true,
      disabled: false,
      badgeLabel: '연결됨',
      badgeTone: 'connected',
    },
    {
      id: 'instagram',
      iconLetter: 'I',
      name: 'Instagram 비즈니스',
      handle: '@jb_finance_official',
      checked: true,
      disabled: false,
      badgeLabel: '연결됨',
      badgeTone: 'connected',
    },
    {
      id: 'youtube',
      iconLetter: 'Y',
      name: 'YouTube 채널',
      handle: 'JB Finance',
      checked: false,
      disabled: true,
      badgeLabel: '영상 전용 · 이미지 게시 불가',
      badgeTone: 'unavailable',
    },
  ],
  scheduleOptions: [
    { id: 'now', label: '지금 게시' },
    { id: 'scheduled', label: '예약 · 2026-05-25 09:00' },
  ],
  selectedScheduleId: 'now',
};

// ── AI 다국어 변환 ──────────────────────────────────────────────────────────────

export interface TranslateLanguageOption {
  code: string;
  label: string;
  selected: boolean;
}

export interface TranslateResult {
  code: string;
  tabLabel: string;
  languageName: string;
  reviewBadge: string;
  text: string;
  backTranslationNote: string;
}

export interface AITranslatePrototypeData {
  managementNumber: string;
  statusLabel: string;
  flowLabel: string;
  title: string;
  originalCopy: string;
  languages: TranslateLanguageOption[];
  generateLabel: string;
  translations: TranslateResult[];
}

export const aiTranslateDummyData: AITranslatePrototypeData = {
  managementNumber: 'C-0142',
  statusLabel: '승인',
  flowLabel: '원본 한국어 (KO)',
  title: '신규 적금 카드뉴스 · AI 다국어 변환',
  originalCopy:
    '매월 30만원만 넣어도, 연 최대 7.0% 우대금리. ※ 우대조건 충족 시(앱 가입·자동이체 등록). 전북은행 주거래 우대 통장. 앱·가까운 지점에서 오늘 시작하세요.',
  languages: [
    { code: 'en', label: '영어', selected: true },
    { code: 'ja', label: '일본어', selected: true },
    { code: 'zh', label: '중국어(간체)', selected: true },
    { code: 'vi', label: '베트남어', selected: false },
    { code: 'id', label: '인도네시아어', selected: false },
  ],
  generateLabel: '3개 언어로 변환 생성',
  translations: [
    {
      code: 'en',
      tabLabel: '영어 EN',
      languageName: 'English',
      reviewBadge: '검수 통과',
      text: 'Save just ₩300,000 a month and earn up to 7.0% p.a. *Preferential rate applies when conditions are met (app sign-up · auto-transfer). JB Primary Account — start today on the app or at your nearest branch.',
      backTranslationNote: '역번역 검수 통과 · 우대조건 고지문 유지됨',
    },
    {
      code: 'ja',
      tabLabel: '일본어 JA',
      languageName: '日本語',
      reviewBadge: '검수 대기',
      text: '毎月30万ウォンだけでも、年最大7.0%の優待金利。※優待条件を満たす場合（アプリ登録・自動振替登録）。銀行メイン優待通帳。アプリまたは最寄り店舗で今すぐ始めましょう。',
      backTranslationNote: '역번역 검수 대기 중',
    },
    {
      code: 'zh',
      tabLabel: '중국어(간체) ZH',
      languageName: '简体中文',
      reviewBadge: '검수 대기',
      text: '每月仅存30万韩元，最高可享7.0%的优惠利率。※需满足优惠条件（注册App・自动转账）。银行主交易优惠存折。立即通过App或就近网点开始吧。',
      backTranslationNote: '역번역 검수 대기 중',
    },
  ],
};
