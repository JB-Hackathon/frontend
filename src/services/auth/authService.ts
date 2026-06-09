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
export async function login(_data: LoginRequest): Promise<LoginResponse> {
  setTokens(DUMMY_LOGIN.accessToken, DUMMY_LOGIN.refreshToken);
  return DUMMY_LOGIN;
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
