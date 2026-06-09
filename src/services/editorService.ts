import type { EditorContent } from '@/types/api';
import { DUMMY_EDITOR_CONTENT } from '@/utils/editorDummyData';

export async function getEditorContent(contentId: string): Promise<EditorContent> {
  return { ...DUMMY_EDITOR_CONTENT, contentId };
}

export async function saveReport(contentId: string, html: string): Promise<void> {
  void contentId;
  void html;
}

export async function requestPublish(contentId: string): Promise<void> {
  void contentId;
}

export async function getSourceFileUrls(contentId: string): Promise<string[]> {
  void contentId;
  return ['card_01.png', 'card_02.png', 'card_03.png'];
}
