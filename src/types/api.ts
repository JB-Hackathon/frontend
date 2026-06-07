import type { ContentItem, ContentStatus, ContentType, StatusSummary, UserRole } from './dashboard';

export type { StatusSummary };

// ─── Auth ────────────────────────────────────────────────────────────────────

export type ApiUserRole = 'content_creator' | 'compliance_advisor';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface AuthUserData {
  userId: number;
  email: string;
  name: string;
  role: ApiUserRole;
  teamId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = AuthUserData;

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: ApiUserRole;
  teamId: number;
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

// POST /boards 요청 바디
export interface CreateBoardRequest {
  contentCreatorId: number;
  complianceAdvisorId: number;
  managementNumber: string;
  reviewApprovalNumber: string | null;
  title: string;
  businessSector: 'bank' | 'credit_finance' | 'savings_bank' | 'financial_investment' | 'other';
  channelType: 'homepage' | 'messenger' | 'sns' | 'other';
  contentType: 'text' | 'file' | 'file_with_text';
  contentCategory: 'product_ad' | 'brand_service_ad' | 'information' | 'other';
  productCategory: 'deposit' | 'loan' | 'card_benefit' | 'auto_finance' | 'investment' | 'other';
  languageCode: 'ko' | 'en' | 'fil' | 'km' | 'zh' | 'vi';
  contentFilePath: string | null;
  contentText: string;
  contentDescription: string;
}

// GET /boards/all 응답 항목
export interface BoardItem {
  reviewId: number;
  contentCreatorId: number;
  complianceAdvisorId: number;
  managementNumber: string;
  reviewApprovalNumber: string | null;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// GET /reviews/board/{boardId}/all 응답 항목
export interface ReviewVersionItem {
  reviewId: number;
  boardId: number;
  versionNo: number;
  businessSector: CreateBoardRequest['businessSector'];
  channelType: CreateBoardRequest['channelType'];
  contentType: CreateBoardRequest['contentType'];
  contentCategory: CreateBoardRequest['contentCategory'];
  productCategory: CreateBoardRequest['productCategory'];
  languageCode: CreateBoardRequest['languageCode'];
  contentFilePath: string | null;
  contentText: string;
  contentDescription: string;
  reviewStatus: ContentStatus;
  reviewComments: string | null;
  reviewReports: string | null;
  createdAt: string;
  updatedAt: string;
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
  relatedContents: { id: string; title: string }[];
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
