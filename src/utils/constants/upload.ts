import type { ContentType } from '@/types/dashboard';

export const CHANNELS: { value: ContentType; label: string }[] = [
  { value: 'homepage', label: '홈페이지' },
  { value: 'sns', label: 'SNS' },
  { value: 'sms', label: '문자' },
  { value: 'kakao', label: '카카오톡' },
  { value: 'other', label: '기타' },
];

export const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ph', label: '필리핀어' },
  { value: 'km', label: '캄보디아어' },
  { value: 'zh', label: '중국어' },
  { value: 'vi', label: '베트남어' },
];

export const CONTENT_CATEGORIES = [
  { value: 'financial', label: '금융 상품 광고', desc: '' },
  { value: 'business', label: '업무 광고', desc: '브랜드, 서비스광고 등' },
  { value: 'info', label: '정보제공', desc: '상품 안내 등' },
  { value: 'other', label: '기타', desc: '' },
];

export const FINANCIAL_SUBCATEGORIES = [
  { value: 'deposit', label: '예금성' },
  { value: 'loan', label: '대출성' },
  { value: 'card', label: '카드/혜택' },
  { value: 'auto', label: '자동차금융' },
  { value: 'investment', label: '투자성' },
  { value: 'protection', label: '예금자보호' },
  { value: 'other', label: '기타' },
];

export const ADVISORS = [
  { value: 'auto', label: '자동 배정' },
  { value: 'park', label: '박준법' },
  { value: 'lee', label: '이감독' },
  { value: 'choi', label: '최감리' },
];
