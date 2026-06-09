import { client, authClient } from '@/services/apiClient';
import { clearTokens } from '@/utils/storage';
import type { UserRole } from '@/types/dashboard';
import type {
  ApiResponse,
  ApiUserRole,
  AuthUserData,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types/api';

/** 서버 role 문자열 ↔ 앱 내부 UserRole 간 변환 */
export function toUserRole(role: ApiUserRole): UserRole {
  return role === 'compliance_advisor' ? 'advisor' : 'creator';
}

export function toApiRole(role: UserRole): ApiUserRole {
  return role === 'advisor' ? 'compliance_advisor' : 'content_creator';
}

/**
 * LoginPage: 이메일/사번 + 비밀번호로 로그인
 * 인증은 서버 세션 쿠키로 처리되므로 응답에는 사용자 정보만 포함
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: res } = await client.post<ApiResponse<AuthUserData>>('/auth/login', data);
  return res.data;
}

/**
 * RegisterPage: 신규 회원가입 신청
 * 관리자 승인 후 계정 활성화 (즉시 로그인 불가)
 */
export async function register(data: RegisterRequest): Promise<void> {
  await client.post<ApiResponse<AuthUserData>>('/auth/register', data);
}

/**
 * AppNavbar: 로그아웃 — 서버 세션 만료
 */
export async function logout(): Promise<void> {
  await authClient.post('/auth/logout').catch(() => {});
  clearTokens();
}
