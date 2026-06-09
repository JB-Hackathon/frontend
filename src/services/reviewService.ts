import type { ContentDetail, ReviewSubmitRequest, AIChatRequest, AIChatResponse } from '@/types/api';
import type { ContentStatus } from '@/types/dashboard';
import {
  messages as dummyMessages,
  quickChips as dummyChips,
  DUMMY_AI_RESPONSES,
  DUMMY_AI_SUMMARY,
} from '@/utils/reviewDummyData';
import type { Message } from '@/types/review';
import { getContentDetail } from '@/services/contentService';

export async function submitReview(
  contentId: string,
  payload: ReviewSubmitRequest,
): Promise<ContentDetail> {
  const detail = await getContentDetail(contentId);
  return { ...detail, status: payload.status };
}

export async function updateContentStatus(contentId: string, status: ContentStatus): Promise<void> {
  void contentId;
  void status;
}

export async function sendAIChat(payload: AIChatRequest): Promise<AIChatResponse> {
  void payload;
  const idx = Math.floor(Math.random() * DUMMY_AI_RESPONSES.length);
  return { ...DUMMY_AI_RESPONSES[idx], id: `ai-${Date.now()}` };
}

export async function getChatHistory(contentId: string): Promise<Message[]> {
  void contentId;
  return dummyMessages;
}

export async function getQuickChips(): Promise<string[]> {
  return dummyChips;
}

export async function getAISummary(contentId: string, version: number): Promise<string> {
  void contentId;
  void version;
  return DUMMY_AI_SUMMARY;
}
