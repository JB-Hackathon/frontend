import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/common/Dropdown';
import { JB_AFFILIATES } from '@/utils/constants/JB';
import { register as registerApi, toApiRole } from '@/services/auth/authService';

type UserType = 'creator' | 'advisor';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliate, setAffiliate] = useState('');
  const [department, setDepartment] = useState('');
  const [team, setTeam] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = '이름을 입력해주세요.';
    if (!affiliate) next.affiliate = '소속 계열사를 선택해주세요.';
    if (!email.trim()) next.email = '사번 / 이메일을 입력해주세요.';
    else if (!EMAIL_PATTERN.test(email)) next.email = '올바른 이메일 형식이 아닙니다.';
    if (!password) next.password = '비밀번호를 입력해주세요.';
    else if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await registerApi({
      email,
      password,
      name,
      role: toApiRole(userType),
      // TODO: 팀 목록 API 연동 후 affiliate/department/team 입력값으로 teamId 매핑
      teamId: 1,
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md px-10 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">회원가입 신청</h1>
          <p className="text-gray-500 text-sm">관리자 승인 후 사용할 수 있습니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이용 유형 선택
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  userType === 'creator' ? 'border-[#1B3A6B] bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="userType"
                    value="creator"
                    checked={userType === 'creator'}
                    onChange={() => setUserType('creator')}
                    className="accent-[#1B3A6B]"
                  />
                  <span className="font-bold text-sm text-gray-900">콘텐츠 제작자</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  마케팅·홍보 콘텐츠를 업로드하고 심의 결과를 확인
                </p>
              </label>

              <label
                className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  userType === 'advisor' ? 'border-[#1B3A6B] bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="userType"
                    value="advisor"
                    checked={userType === 'advisor'}
                    onChange={() => setUserType('advisor')}
                    className="accent-[#1B3A6B]"
                  />
                  <span className="font-bold text-sm text-gray-900">준법자문가</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  업로드된 콘텐츠를 검토하고 피드백 작성
                </p>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">업권</label>
            <Dropdown
              options={JB_AFFILIATES}
              value={affiliate}
              onChange={setAffiliate}
              placeholder="소속 계열사를 선택하세요"
            />
            {errors.affiliate && <p className="text-xs text-red-500 mt-1">{errors.affiliate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">사번 / 이메일</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">소속 본부</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="마케팅본부"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">팀</label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="브랜드팀"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-400">
              관리자 승인 후 1영업일 내 이메일로 안내됩니다.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B3A6B] text-white py-4 rounded-lg font-bold text-base hover:bg-[#152d55] transition-colors"
          >
            가입 신청
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;