export type UserRole = 'creator' | 'advisor';

export type ContentStatus = 'pending' | 'approved' | 'rejected';

export type ContentType = 'homepage' | 'sns' | 'sms' | 'kakao' | 'other';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  typeLabel: string;
  advisor: string | null;
  creator: string;
  submittedAt: string;
  status: ContentStatus;
}

export interface StatusSummary {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
