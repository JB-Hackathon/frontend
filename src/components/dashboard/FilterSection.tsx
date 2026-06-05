import { useState } from 'react';
import type { ContentType, UserRole } from '@/types/dashboard';

const CONTENT_TYPES: { value: ContentType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'homepage', label: '홈페이지' },
  { value: 'sns', label: 'SNS' },
  { value: 'sms', label: '문자' },
  { value: 'kakao', label: '카카오톡' },
  { value: 'other', label: '기타' },
];

type SortOption = 'latest' | 'title' | 'submitted';

interface Props {
  role: UserRole;
  onFilter?: (types: (ContentType | 'all')[], sort: SortOption, myOnly: boolean, query: string) => void;
}

export default function FilterSection({ role, onFilter }: Props) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<(ContentType | 'all')[]>(['all']);
  const [sort, setSort] = useState<SortOption>('latest');
  const [myOnly, setMyOnly] = useState(false);

  const toggleType = (type: ContentType | 'all') => {
    let next: (ContentType | 'all')[];
    if (type === 'all') {
      next = ['all'];
    } else {
      const without = selectedTypes.filter((t) => t !== 'all' && t !== type);
      next = selectedTypes.includes(type) ? (without.length ? without : ['all']) : [...without, type];
    }
    setSelectedTypes(next);
    onFilter?.(next, sort, myOnly, query);
  };

  const handleSort = (s: SortOption) => {
    setSort(s);
    onFilter?.(selectedTypes, s, myOnly, query);
  };

  const handleMyOnly = () => {
    setMyOnly((v) => {
      onFilter?.(selectedTypes, sort, !v, query);
      return !v;
    });
  };

  const handleSearch = () => {
    onFilter?.(selectedTypes, sort, myOnly, query);
  };

  const myOnlyLabel = role === 'advisor' ? '내 담당만 보기' : '내 콘텐츠만 보기';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      {/* Search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="제목, 관리 번호 검색"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-[#1B3A6B] text-white text-sm font-semibold rounded-lg hover:bg-[#152d55] transition-colors"
        >
          검색
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-400">——</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* My only toggle */}
        <label className="flex items-center gap-2 cursor-pointer ml-1">
          <span className="text-sm text-gray-600 whitespace-nowrap">{myOnlyLabel}</span>
          <button
            role="switch"
            aria-checked={myOnly}
            onClick={handleMyOnly}
            className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${
              myOnly ? 'bg-[#1B3A6B]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                myOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Content type filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-500 shrink-0">콘텐츠별 보기:</span>
        <div className="flex items-center gap-2 flex-wrap">
          {CONTENT_TYPES.map(({ value, label }) => {
            const isSelected =
              value === 'all' ? selectedTypes.includes('all') : selectedTypes.includes(value);
            return (
              <label key={value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleType(value)}
                  className="w-3.5 h-3.5 rounded accent-[#1B3A6B]"
                />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort + reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">정렬:</span>
          {(['latest', 'title', 'submitted'] as SortOption[]).map((s) => {
            const labels: Record<SortOption, string> = {
              latest: '최신순',
              title: '목록순',
              submitted: '제출일순',
            };
            return (
              <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={s}
                  checked={sort === s}
                  onChange={() => handleSort(s)}
                  className="w-3.5 h-3.5 accent-[#1B3A6B]"
                />
                <span className="text-sm text-gray-600">{labels[s]}</span>
              </label>
            );
          })}
        </div>
        <button
          onClick={() => {
            setQuery('');
            setSelectedTypes(['all']);
            setSort('latest');
            setMyOnly(false);
            onFilter?.(['all'], 'latest', false, '');
          }}
          className="flex items-center gap-1.5 text-sm text-[#1B3A6B] hover:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          필터 초기화
        </button>
      </div>
    </div>
  );
}
