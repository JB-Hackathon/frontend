import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChatHistory, getQuickChips, sendAIChat } from '@/services/reviewService';
import type { Message } from '@/types/review';

interface ChatPanelProps {
  onCollapse: () => void;
}

export default function ChatPanel({ onCollapse }: ChatPanelProps) {
  const { id: contentId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickChips, setQuickChips] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 대화 이력 + 빠른 입력 칩 초기 로드
  useEffect(() => {
    if (!contentId) {
      setIsLoadingHistory(false);
      return;
    }
    let cancelled = false;
    setIsLoadingHistory(true);
    Promise.all([getChatHistory(contentId), getQuickChips()]).then(([history, chips]) => {
      if (cancelled) return;
      setMessages(history);
      setQuickChips(chips);
      setIsLoadingHistory(false);
    });
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  // 새 메시지나 스트리밍 토큰이 추가될 때마다 최신 내용으로 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // 패널이 사라지거나 콘텐츠가 바뀌면 진행 중인 요청을 취소
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, [contentId]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !contentId || isStreaming) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    const placeholder: Message = { id: crypto.randomUUID(), role: 'agent', content: '', isTyping: true };
    const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage, placeholder]);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await sendAIChat({ contentId, message: trimmed, history }, controller.signal);
      // TODO(SSE 연동): 응답을 통째로 교체하는 대신, 같은 placeholder.id 메시지를
      // 토큰 단위로 이어붙이며 갱신하는 방식으로 교체
      const agentMessage: Message = { ...response, role: 'agent' };
      setMessages((prev) => prev.map((m) => (m.id === placeholder.id ? agentMessage : m)));
    } catch {
      if (controller.signal.aborted) return;
      const errorMessage: Message = {
        id: placeholder.id,
        role: 'agent',
        content: '응답을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.',
      };
      setMessages((prev) => prev.map((m) => (m.id === placeholder.id ? errorMessage : m)));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleSend = () => {
    void sendMessage(input);
  };

  const handleChipClick = (chip: string) => {
    void sendMessage(chip.replace(/^\+\s*/, ''));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1B3A6B] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">준법 자문 Agent</p>
            <p className="text-[11px] text-gray-400">규정 23건 · 사내 가이드 12건 학습</p>
          </div>
        </div>
        <button
          onClick={onCollapse}
          title="접기"
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors mt-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        aria-live="polite"
        aria-busy={isStreaming}
      >
        {isLoadingHistory && (
          <p className="text-xs text-gray-400 text-center mt-6">대화 내용을 불러오는 중…</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[88%]">
              {msg.role === 'agent' && (
                <p className="text-[10px] text-gray-400 mb-1 ml-1">Agent</p>
              )}
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1B3A6B] text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}
              >
                {msg.content}
                {msg.role === 'agent' && msg.isTyping && (
                  <span className="inline-flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
                {msg.role === 'agent' && msg.alternatives && (
                  <ol className="mt-2 space-y-1 text-sm">
                    {msg.alternatives.map((alt, i) => (
                      <li key={`${msg.id}-${i}`}>{alt}</li>
                    ))}
                    {msg.altNote && (
                      <li className="text-xs text-gray-500 mt-1">{msg.altNote}</li>
                    )}
                  </ol>
                )}
              </div>
              {msg.role === 'agent' && msg.badge && (
                <div className="mt-1.5 ml-1">
                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
                    {msg.badge}
                  </span>
                </div>
              )}
              {msg.role === 'agent' && msg.actions && (
                <div className="flex gap-2 mt-2 ml-1">
                  <button className="px-3 py-1.5 text-xs font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors">
                    {msg.actions.primary}
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    {msg.actions.secondary}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick action chips */}
      <div className="px-4 pt-2 pb-2 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              disabled={isStreaming}
              className="text-xs px-2.5 py-1 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-1.5 shrink-0 border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-gray-400 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="피드백을 어떻게 수정할까요?"
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none disabled:opacity-60"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="w-7 h-7 bg-[#1B3A6B] text-white rounded-lg flex items-center justify-center hover:bg-[#152d55] transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
