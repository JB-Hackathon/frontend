import { useState } from 'react';
import { Link } from 'react-router-dom';
import jbLogo from '@/assets/JB-mark-B-monogram.svg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md px-10 py-10">
        <div className="flex items-center gap-3 mb-8">
          <img src={jbLogo} alt="JB 준법자문" className="w-12 h-12 shrink-0" />
          <span className="text-[#1B3A6B] font-bold text-xl">JB 준법자문 워크스페이스</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">로그인</h1>
          <p className="text-gray-500 text-sm">회사 계정으로 접속하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              사번 / 이메일
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#1B3A6B]"
              />
              <span className="text-sm text-gray-600">로그인 유지</span>
            </label>
            <a href="#" className="text-sm text-gray-500 hover:underline">
              비밀번호 찾기
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B3A6B] text-white py-4 rounded-lg font-bold text-base hover:bg-[#152d55] transition-colors mt-2"
          >
            로그인
          </button>
        </form>

        <div className="border-t border-gray-200 my-6" />

        <p className="text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <Link to="/register" className="font-bold text-gray-900 hover:underline">
            회원가입 신청
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
