import type { ContentItem, ContentStatus, ContentType, StatusSummary, UserRole } from './dashboard';

export type { StatusSummary };

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: UserRole;
    team: string;
    affiliate: string;
  };
}

export interface RegisterRequest {
  userType: UserRole;
  name: string;
  email: string;
  affiliate: string;
  department: string;
  team: string;
  password: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface AdvisorSummary {
  pending: number;
  todayDone: number;
  todayApproved: number;
  todayRejected: number;
  avgDays: number;
  resubmit: number;
}

export interface ContentListParams {
  page?: number;
  pageSize?: number;
  statuses?: ContentStatus[];
  types?: ContentType[];
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  myOnly?: boolean;
  sortBy?: 'latest' | 'oldest' | 'title' | 'submitted';
  role?: UserRole;
  userName?: string;
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Content Detail ──────────────────────────────────────────────────────────

export interface ReviewOpinion {
  general: string;
  items: string[];
  regulations: string[];
}

export interface ReviewVersion {
  version: number;
  label: string;
  status: ContentStatus;
  date: string;
  reviewer: string;
  summary: string;
  opinion: ReviewOpinion | null;
  hasAISummary?: boolean;
}

export interface ContentDetail {
  id: string;
  title: string;
  status: ContentStatus;
  type: ContentType;
  typeLabel: string;
  subType: string;
  submittedAt: string;
  finalAt: string;
  advisor: string;
  creator: string;
  complianceNo: string;
  caption?: string;
  reviews: ReviewVersion[];
  relatedContents: { id: string; title: string }[];
  canPublishToChannel?: boolean;
}

// ─── Upload ──────────────────────────────────────────────────────────────────

export type ContentComposition = 'image' | 'text' | 'both';

export interface UploadContentRequest {
  affiliate: string;
  language: string;
  category: string;
  financialSub?: string;
  channel: ContentType;
  advisorId?: string;
  composition: ContentComposition;
  title: string;
  publishDate?: string;
  campaign?: string;
  caption?: string;
  note?: string;
  images?: File[];
}

export interface Advisor {
  id: string;
  name: string;
  team: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface ReviewSubmitRequest {
  status: 'approved' | 'rejected';
  generalOpinion: string;
  items: string[];
  regulations: string[];
}

export interface AIChatMessage {
  role: 'user' | 'agent';
  content: string;
}

export interface AIChatRequest {
  contentId: string;
  message: string;
  history: AIChatMessage[];
}

export interface AIChatResponse {
  id: string;
  content: string;
  badge?: string;
  alternatives?: string[];
  altNote?: string;
  actions?: { primary: string; secondary: string };
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export interface SourceCard {
  label: string;
  lines: string[];
}

export interface EditorContent {
  contentId: string;
  title: string;
  version: number;
  sourceImages: string[];
  sourceCards: SourceCard[];
  creatorNote: string;
  reportHtml: string;
  lastSavedAt: string;
}
