export const aiRevisionDummyData = {
  managementNumber: 'CNT-2024-00142',
  statusLabel: '반려',
  flowLabel: 'AI 수정안 생성',
  title: '2024 하반기 금융 투자 상품 프로모션 캠페인',
  feedback: {
    reviewer: '김민준 자문가',
    date: '2024.11.18',
    content:
      '해당 광고 콘텐츠는 금융소비자보호법 제17조 및 자본시장법 시행령 제68조에 따라 투자 원금 손실 가능성에 대한 명시적 고지가 부족합니다. "수익률 보장"이라는 표현은 오해의 소지가 있어 수정이 필요하며, 과거 수익률 예시는 미래 성과를 보장하지 않음을 명확히 안내해야 합니다.',
  },
  revisionNote: 'AI가 규정 위반 표현을 수정하고 고지 문구를 보완했습니다.',
  originalCopy:
    '지금 가입하면 연 8% 수익률 보장! 2023년 동일 상품 평균 수익률 8.3% 달성. 안정적인 수익으로 노후를 준비하세요. 선착순 100명 한정 특별 혜택 제공.',
  revisedCopy: [
    { highlighted: false, text: '지금 가입하면 ' },
    { highlighted: true, text: '연 8% 목표 수익률 추구(원금 손실 위험 있음).' },
    { highlighted: false, text: ' 2023년 동일 상품 평균 수익률 8.3% 달성' },
    { highlighted: true, text: '(과거 수익률은 미래 성과를 보장하지 않습니다).' },
    { highlighted: false, text: ' 장기적 자산 형성을 위한 투자 방법을 안내해 드립니다. 선착순 100명 한정 특별 안내 제공.' },
  ],
};

export const aiTranslateDummyData = {
  managementNumber: 'CNT-2024-00138',
  statusLabel: '승인',
  flowLabel: 'AI 다국어 번역',
  title: '글로벌 디지털 뱅킹 서비스 런칭 캠페인',
  originalCopy:
    '언제 어디서나 스마트한 금융 생활을 시작하세요. JB디지털뱅크와 함께라면 복잡한 금융을 간편하게 관리할 수 있습니다. 지금 바로 앱을 다운로드하고 특별 혜택을 받아보세요.',
  languages: [
    { code: 'en', label: '영어', selected: true },
    { code: 'zh', label: '중국어', selected: true },
    { code: 'ja', label: '일본어', selected: true },
    { code: 'vi', label: '베트남어', selected: false },
    { code: 'th', label: '태국어', selected: false },
  ],
  generateLabel: '번역 생성',
  translations: [
    {
      code: 'en',
      tabLabel: '영어',
      languageName: 'English',
      reviewBadge: '역번역 검증 완료',
      text: 'Start your smart financial life anytime, anywhere. With JB Digital Bank, you can manage complex finances with ease. Download the app now and enjoy exclusive benefits.',
      backTranslationNote: '역번역 의미 일치율 97% · 금융 규제 용어 자동 검토 완료',
    },
    {
      code: 'zh',
      tabLabel: '중국어',
      languageName: '中文 (简体)',
      reviewBadge: '역번역 검증 완료',
      text: '随时随地开启智慧金融生活。借助JB数字银行，您可以轻松管理复杂的金融事务。立即下载应用程序，享受专属优惠。',
      backTranslationNote: '역번역 의미 일치율 95% · 금융 규제 용어 자동 검토 완료',
    },
    {
      code: 'ja',
      tabLabel: '일본어',
      languageName: '日本語',
      reviewBadge: '역번역 검증 완료',
      text: 'いつでもどこでも、スマートな金融生活を始めましょう。JBデジタルバンクなら、複雑な金融管理が簡単になります。今すぐアプリをダウンロードして、特別特典をお受け取りください。',
      backTranslationNote: '역번역 의미 일치율 96% · 금융 규제 용어 자동 검토 완료',
    },
  ],
};

export const channelPublishDummyData = {
  managementNumber: 'JB-014000-014000',
  statusLabel: '승인',
  flowLabel: '채널 게시',
  title: 'JB뱅크 앱 푸시 알림 & 메인 배너 (파킹통장)',
  cards: [] as { id: string; label: string }[],
  cardsNote: '콘텐츠 카드를 클릭하면 크게 볼 수 있습니다.',
  caption:
    '여유 자금, 그냥 두기 아쉬울 때? 💰 하루만 맡겨도 이자가 차곡차곡 쌓이는 JB 파킹통장(세전 연 2.3%, 기본금리 기준)! 지금 JB앱에서 터치 한 번으로 확인해보세요. #JB파킹통장 #여유자금 #JB뱅크 (준법감시인 심의필 제140호)',
  captionTag: 'AI 자동 생성',
  captionNote: '캡션을 직접 수정하려면 클릭하세요.',
  channels: [
    {
      id: 'kakao-jb',
      iconLetter: 'KK',
      name: 'JB금융 카카오톡 채널',
      handle: '@jbfinancial',
      checked: true,
      disabled: false,
      badgeTone: 'connected',
      badgeLabel: '연결됨',
    },
    {
      id: 'instagram-jb',
      iconLetter: 'IG',
      name: 'JB금융 공식 인스타그램',
      handle: '@jbfinancial_official',
      checked: true,
      disabled: false,
      badgeTone: 'connected',
      badgeLabel: '연결됨',
    },
    {
      id: 'facebook-jb',
      iconLetter: 'FB',
      name: 'JB금융 페이스북',
      handle: 'JBFinancialGroup',
      checked: true,
      disabled: false,
      badgeTone: 'connected',
      badgeLabel: '연결됨',
    },
    {
      id: 'blog-jb',
      iconLetter: 'BL',
      name: 'JB금융 네이버 블로그',
      handle: 'jbfinancial',
      checked: false,
      disabled: true,
      badgeTone: 'disconnected',
      badgeLabel: '연결 필요',
    },
  ],
  scheduleOptions: [
    { id: 'now', label: '지금 게시' },
    { id: 'scheduled', label: '예약 · 2024.12.01 10:00' },
  ],
  selectedScheduleId: 'now',
};
