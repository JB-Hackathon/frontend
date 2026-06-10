import { setTokens, clearTokens } from '@/utils/storage';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';
import type { UserRole } from '@/types/dashboard';

const DUMMY_USERS: Record<UserRole, LoginResponse['user']> = {
  creator: {
    id: 'u-001',
    name: '이종철',
    role: 'creator',
    team: '마케팅본부 브랜드팀',
    affiliate: 'jeonbuk-bank',
  },
  advisor: {
    id: 'u-002',
    name: '백승효',
    role: 'advisor',
    team: '준법감시실 1팀',
    affiliate: 'jeonbuk-bank',
  },
};

const DUMMY_TOKENS = {
  accessToken: 'dev-access-token',
  refreshToken: 'dev-refresh-token',
};

/**
 * LoginPage: 이메일/사번 + 비밀번호로 로그인
 * 성공 시 토큰을 localStorage에 저장하고 사용자 정보 반환
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  setTokens(DUMMY_TOKENS.accessToken, DUMMY_TOKENS.refreshToken);
  return {
    ...DUMMY_TOKENS,
    user: DUMMY_USERS[data.role ?? 'creator'],
  };
}

/**
 * RegisterPage: 신규 회원가입 신청
 * 관리자 승인 후 계정 활성화 (즉시 로그인 불가)
 */
export async function register(_data: RegisterRequest): Promise<void> {
  return;
}

/**
 * AppNavbar: 로그아웃 — 서버 세션 만료 + 로컬 토큰 제거
 */
export async function logout(): Promise<void> {
  clearTokens();
}
