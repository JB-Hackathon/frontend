import type { EditorContent } from '@/types/api';

export const DUMMY_REPORT_HTML = `<h1>준법 자문 검토 보고서 — JB은행 도전 루틴적금 온라인 배너</h1>
<p><em>담당자: 백승효 자문가 &nbsp;&nbsp;검토일: 2026-05-17</em></p>
<h2>1. 종합 심의 결과</h2>
<p><strong>[반려]</strong><br/>
카피 4건 수정 권고. 이미지 관련 권고 2건 함께 안내드립니다. 아래 '4. 수정 권고 사항'을 모두 반영하여 재제출 바랍니다.</p>
<h2>2. 심의 개요</h2>
<p>본 검토는 콘텐츠팀에서 제출한 'JB은행 도전 루틴적금 온라인 배너'(SNS 카드뉴스, 이미지+텍스트)에 대한 준법 심의 결과입니다. 관련 법령인 '금융소비자 보호에 관한 법률' 및 '표시·광고의 공정화에 관한 법률'을 기준으로 적법성을 판단했습니다.</p>
<h2>3. 종합 심의 의견</h2>
<p>금융소비자 보호에 관한 법률 제22조 제3항(우대금리 표기) 및 표시·광고의 공정화에 관한 법률 제3조 제1항 제1호(단정적 표현 금지)에 해당하는 위반 요소가 확인되었습니다. 아래 항목을 수정 후 재제출 해주시기 바랍니다.</p>
<h2>4. 수정 권고 사항</h2>
<ul>
<li>헤드라인 "연 4.5% 우대금리"에 우대조건이 명시되지 않아 위반에 해당합니다.</li>
<li>"누구나", "놓치면 손해" 등 단정적·불안 조성 표현은 표시·광고의 공정화에 관한 법률 제3조 제1항 제1호에 따라 삭제 또는 완화가 필요합니다.</li>
<li>CTA 버튼에 가입 채널 명시 누락 — 사내 가이드 G-2024-11 기준 미충족.</li>
<li>3번째 카드 이미지 내 우대금리 수치가 본문과 불일치합니다. 통일 필요.</li>
</ul>
<h2>5. 관련 법령</h2>
<ul>
<li>금융소비자 보호에 관한 법률 제22조 제3항 (우대금리 표기)</li>
<li>표시·광고의 공정화에 관한 법률 제3조 제1항 제1호 (단정적 표현 금지)</li>
<li>사내 마케팅 가이드 G-2024-11</li>
</ul>`;

export const C0144_TIPTAP_HTML = `
<div style="max-width: 800px; margin: 0 auto; font-family: sans-serif;">
  <h2 style="text-align: center; margin-bottom: 24px;">표시·광고 심의 결과 통보서</h2>
  
  <table border="1" style="width: 100%; border-collapse: collapse; border: 2px solid #000;">
    <tbody>
      <tr>
        <th style="border: 1px solid #000; padding: 12px; width: 20%; background-color: #fbfbfb;">회사명</th>
        <td style="border: 1px solid #000; padding: 12px; width: 30%; text-align: center;">JB은행</td>
        <th style="border: 1px solid #000; padding: 12px; width: 20%; background-color: #fbfbfb;">제작자</th>
        <td style="border: 1px solid #000; padding: 12px; width: 30%; text-align: center;">마케팅팀</td>
      </tr>
      
      <tr>
        <th style="border: 1px solid #000; padding: 12px; background-color: #fbfbfb;">제품명</th>
        <td style="border: 1px solid #000; padding: 12px; text-align: center;">신규 금융상품</td>
        <th style="border: 1px solid #000; padding: 12px; background-color: #fbfbfb;">심의번호</th>
        <td style="border: 1px solid #000; padding: 12px; text-align: center;">C-0144</td>
      </tr>
      
      <tr>
        <th style="border: 1px solid #000; padding: 12px; background-color: #fbfbfb;">표시·광고 매체</th>
        <td style="border: 1px solid #000; padding: 12px; text-align: center;">인스타그램 (텍스트, 이미지)</td>
        <th rowspan="2" style="border: 1px solid #000; padding: 12px; background-color: #fbfbfb;">심의필여부</th>
        <td rowspan="2" style="border: 1px solid #000; padding: 12px; text-align: center; vertical-align: middle;">
          <strong>승인 완료</strong><br>
          <span style="font-size: 0.85em; color: #555;">(조건부 시정 100% 반영)</span>
        </td>
      </tr>
      
      <tr>
        <th style="border: 1px solid #000; padding: 12px; background-color: #fbfbfb;">심의 결과</th>
        <td style="border: 1px solid #000; padding: 12px; text-align: center;"><strong>백승효 자문가 승인</strong></td>
      </tr>
      
      <tr>
        <th style="border: 1px solid #000; padding: 16px; background-color: #fbfbfb;">시정 사항</th>
        <td colspan="3" style="border: 1px solid #000; padding: 16px; line-height: 1.6;">
          <p><strong>[텍스트·카피 영역]</strong><br>
          변경 전) 국내 최고, 무조건 유리<br>
          변경 후) 비교 출처 및 산출 기준 명시, 단정적 표현 삭제</p>
          
          <p><strong>[혜택 안내 영역]</strong><br>
          변경 전) 최고 11.0% 고정 금리, 무조건 보장<br>
          변경 후) '100일간 100회 납입 시' 우대조건을 동등한 크기로 병기</p>

          <p><strong>[가입 절차 영역]</strong><br>
          변경 전) 복잡한 본인인증 없이 10초 안에 즉시 가입 가능<br>
          변경 후) 필수 본인확인 및 전자금융거래 안전성 확보 절차 안내 추가</p>

          <p><strong>[예금자보호 안내 영역]</strong><br>
          변경 전) 정부가 원금과 이자를 전액 보장<br>
          변경 후) 예금보험공사에 의한 법정 한도(1인당 5천만 원) 내 보호로 수정</p>
        </td>
      </tr>
      
      <tr>
        <th style="border: 1px solid #000; padding: 12px; background-color: #fbfbfb;">시정 사유</th>
        <td colspan="3" style="border: 1px solid #000; padding: 16px; line-height: 1.6;">
          광고 전반에 걸쳐 객관적 근거 없는 비교 우위 주장, 우대조건 누락으로 인한 금리 오인, 필수 가입절차 생략 오인, 예금자보호 범위 과장 표시가 확인되어 금융소비자의 오인을 유발할 우려가 있으므로 관련 문구 및 표시 방식에 대한 시정이 필요했음.
        </td>
      </tr>
    </tbody>
  </table>

  <div style="border: 2px solid #000; border-top: none; padding: 20px; line-height: 1.8;">
    <p style="margin-top: 0;"><strong>근거 법령</strong></p>
    <ul style="margin: 0; padding-left: 20px;">
      <li>
        <strong>금융소비자보호법</strong>
        <ul>
          <li>제32조 제1항 (부당광고행위 금지)</li>
        </ul>
      </li>
      <li>
        <strong>표시·광고의 공정화에 관한 법률</strong>
        <ul>
          <li>제3조 제1항 제1호 (거짓·과장의 표시·광고)</li>
          <li>제3조 제1항 제3호 (부당하게 비교하는 표시·광고)</li>
        </ul>
      </li>
    </ul>
  </div>
</div>
`;

export const DUMMY_EDITOR_CONTENT: EditorContent = {
  contentId: 'C-0143',
  title: 'JB은행 도전 루틴적금 온라인 배너',
  version: 2,
  sourceImages: ['card_01.png', 'card_02.png', 'card_03.png'],
  sourceCards: [
    { label: 'CARD 1 · 헤드라인', lines: ['연 4.5% 우대금리, 지금 바로 시작하세요!'] },
    {
      label: 'CARD 2 · 본문',
      lines: [
        '누구나 가입 가능한 JB 신규 적금 상품',
        '매월 자동이체 설정 시 우대금리 제공. 앱에서 간편하게 가입하고 혜택을 놓치지 마세요.',
      ],
    },
    { label: 'CARD 3 · CTA', lines: ['지금 가입하기'] },
  ],
  creatorNote:
    '반려 권고 사항을 반영하여 헤드라인에 우대조건을 병기하고, 단정적 표현을 완화할 예정입니다. CTA 가입 채널 및 카드 이미지 우대금리 수치도 함께 수정하겠습니다.',
  reportHtml: DUMMY_REPORT_HTML,
  lastSavedAt: '14:06',
};
