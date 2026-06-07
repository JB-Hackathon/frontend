import { client, authClient } from '@/services/apiClient';
import { setTokens, clearTokens } from '@/utils/storage';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';

const DUMMY_LOGIN: LoginResponse = {
  accessToken: 'dev-access-token',
  refreshToken: 'dev-refresh-token',
  user: {
    id: 'u-001',
    name: '김지원',
    role: 'creator',
    team: '마케팅본부 브랜드팀',
    affiliate: 'jeonbuk-bank',
  },
};

/**
 * LoginPage: 이메일/사번 + 비밀번호로 로그인
 * 성공 시 토큰을 localStorage에 저장하고 사용자 정보 반환
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (import.meta.env.DEV) {
    setTokens(DUMMY_LOGIN.accessToken, DUMMY_LOGIN.refreshToken);
    return DUMMY_LOGIN;
  }
  const { data: res } = await client.post<LoginResponse>('/auth/login', data);
  setTokens(res.accessToken, res.refreshToken);
  return res;
}

/**
 * RegisterPage: 신규 회원가입 신청
 * 관리자 승인 후 계정 활성화 (즉시 로그인 불가)
 */
export async function register(data: RegisterRequest): Promise<void> {
  if (import.meta.env.DEV) return;
  await client.post('/auth/register', data);
}

/**
 * AppNavbar: 로그아웃 — 서버 세션 만료 + 로컬 토큰 제거
 */
export async function logout(): Promise<void> {
  if (!import.meta.env.DEV) {
    await authClient.post('/auth/logout').catch(() => {});
  }
  clearTokens();
}
