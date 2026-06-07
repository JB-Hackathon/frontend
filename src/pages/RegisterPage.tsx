import { useState } from 'react';
import Dropdown from '../components/common/Dropdown';
import { JB_AFFILIATES } from '@/utils/constants/JB';
import { register as registerApi } from '@/services/auth/authService';

type UserType = 'creator' | 'advisor';

function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliate, setAffiliate] = useState('');
  const [department, setDepartment] = useState('');
  const [team, setTeam] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerApi({ userType, name, email, affiliate, department, team, password });
    setSubmitted(true);
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">업권</label>
            <Dropdown
              options={JB_AFFILIATES}
              value={affiliate}
              onChange={setAffiliate}
              placeholder="소속 계열사를 선택하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">사번 / 이메일</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
            />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
            />
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-400">
              관리자 승인 후 1영업일 내 이메일로 안내됩니다.
            </p>
          </div>

          {submitted ? (
            <div className="w-full py-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium text-center">
              신청이 완료되었습니다. 관리자 승인 후 이메일로 안내됩니다.
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-[#1B3A6B] text-white py-4 rounded-lg font-bold text-base hover:bg-[#152d55] transition-colors"
            >
              가입 신청
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;