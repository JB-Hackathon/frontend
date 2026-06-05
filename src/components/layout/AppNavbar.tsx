import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import jbLogo from '@/assets/JB-mark-B-monogram-reversed.svg';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user?.role === 'advisor' ? '준법자문가' : '콘텐츠 제작자';

  return (
    <header className="h-14 bg-[#1B3A6B] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <img src={jbLogo} alt="JB" className="w-7 h-7" />
        <span className="text-white font-bold text-base tracking-tight">
          Compliance JB
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#a0b4d0] bg-[#152d55] px-3 py-1.5 rounded-full border border-[#2a4a7a] font-medium">
          {roleLabel}
        </span>
        <span className="text-white text-sm font-medium">{user?.name ?? '사용자'}</span>
        <div className="w-8 h-8 rounded-full bg-[#2a4a7a] flex items-center justify-center text-white text-xs font-bold select-none">
          {user?.name?.[0] ?? 'U'}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#a0b4d0] border border-[#2a4a7a] rounded-lg hover:bg-[#2a4a7a] hover:text-white transition-colors font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          로그아웃
        </button>
      </div>
    </header>
  );
}
