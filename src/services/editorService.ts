import { authClient } from '@/services/apiClient';
import type { EditorContent } from '@/types/api';
import { cards as dummyCards } from '@/utils/reviewDummyData';

// ─── 더미 데이터 ─────────────────────────────────────────────────────────────

const DUMMY_INITIAL_HTML = `<h1>준법 자문 검토 보고서 — SNS 카드뉴스 (3종)</h1>
<p><em>담당자: 김준법 대리 &nbsp;&nbsp;심의 번호: JB-11111-11111</em></p>
<h2>1. 종합 심의 결과(심의필 번호 : JB-11111-11111)</h2>
<p><strong>[승인]</strong><br/>
아래 '4. 수정 및 권고사항'에 명시된 지적 사항을 100% 반영하여 수정하는 조건으로 배포를 승인함.</p>
<h2>2. 심의 개요</h2>
<p>본 검토는 마케팅팀에서 요청한 신제품의 인스타그램 게시용 카드뉴스 초안(총 3장)에 대한 준법 심의 결과입니다.</p>
<h2>3. 종합 심의 의견 (조건부 승인)</h2>
<p>제출된 카드뉴스 시안은 전반적으로 브랜드 아이덴티티를 잘 녹여냈으나, 일부 카드의 문구에서 소비자 오인의 소지가 있는 표현이 발견되었습니다.</p>
<h2>4. 검토 및 수정 의견</h2>
<p>해당 항목을 아래 수정 의견에 따라 보완하는 조건으로 최종 승인이 가능합니다.</p>`;

const DUMMY_EDITOR_CONTENT: EditorContent = {
  contentId: 'C-0143',
  title: '주거래 우대 통장 · SNS 카드뉴스 (3종)',
  version: 2,
  sourceImages: ['card_01.png', 'card_02.png', 'card_03.png'],
  sourceCards: dummyCards.map((c) => ({
    label: c.label,
    lines: c.lines.map((l) => (typeof l === 'string' ? l : String(l))),
  })),
  creatorNote:
    'SNS 채널 노출용으로 임팩트 강하게 작성했습니다. 우대조건은 수정 사항 반영하여 Card 3 하단에 작게 표기되어 있습니다.',
  reportHtml: DUMMY_INITIAL_HTML,
  lastSavedAt: '14:06',
};

// ─── 서비스 함수 ──────────────────────────────────────────────────────────────

/**
 * EditorPage: 에디터 진입 시 콘텐츠 + 기존 보고서 초안 로드
 * 좌측 원본 패널(이미지·텍스트·작성자 메모)과 중앙 에디터(보고서 HTML) 초기 데이터
 */
export async function getEditorContent(contentId: string): Promise<EditorContent> {
  if (import.meta.env.DEV) return { ...DUMMY_EDITOR_CONTENT, contentId };
  const { data } = await authClient.get<EditorContent>(`/contents/${contentId}/editor`);
  return data;
}

/**
 * EditorPage: 보고서 자동 저장 (디바운스 1.2s 후 호출)
 * 자문가가 에디터에서 작성 중인 HTML을 임시 저장
 */
export async function saveReport(contentId: string, html: string): Promise<void> {
  if (import.meta.env.DEV) return;
  await authClient.put(`/contents/${contentId}/report`, { html });
}

/**
 * EditorPage: Publish 요청 — 최종 보고서를 확정하고 배포 승인 신청
 * 완료 후 콘텐츠 상태가 approved로 변경됨
 */
export async function requestPublish(contentId: string): Promise<void> {
  if (import.meta.env.DEV) return;
  await authClient.post(`/contents/${contentId}/publish`);
}

/**
 * EditorPage: 원본 보기 — 제작자가 제출한 최신 원본 파일 URL 목록 반환
 */
export async function getSourceFileUrls(contentId: string): Promise<string[]> {
  if (import.meta.env.DEV) {
    return ['card_01.png', 'card_02.png', 'card_03.png'];
  }
  const { data } = await authClient.get<{ urls: string[] }>(
    `/contents/${contentId}/source-files`,
  );
  return data.urls;
}
