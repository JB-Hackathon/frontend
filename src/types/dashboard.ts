export type UserRole = 'creator' | 'advisor';

export type ContentStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export type ContentType = 'sns' | 'banner' | 'video' | 'blog' | 'ebook' | 'other';

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
  reviewing: number;
  approved: number;
  rejected: number;
  total: number;
}
