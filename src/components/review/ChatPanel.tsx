import { useState, useRef, useEffect } from 'react';
import {
  chatInitialMessages,
  chatStep1,
  chatStep2,
  freeChatInitialMessage,
  freeChatResponses,
} from '../../utils/reviewDummyData';
import type { AgentMessage, UserMessage } from '../../utils/reviewDummyData';

type Message = AgentMessage | UserMessage;

interface ChatPanelProps {
  onCollapse: () => void;
  onAdvanceStep: () => void;
  mode?: 'scripted' | 'free';
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%]">
        <p className="text-[10px] text-gray-400 mb-1 ml-1">Agent</p>
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  msg: Message;
  canApply: boolean;
  onApply: () => void;
}

function MessageBubble({ msg, canApply, onApply }: MessageBubbleProps) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%]">
          <div className="bg-[#1B3A6B] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed">
            {msg.content}
          </div>
        </div>
      </div>
    );
  }

  const agent = msg as AgentMessage;
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%]">
        <p className="text-[10px] text-gray-400 mb-1 ml-1">Agent</p>
        <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed">
          {agent.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
          ))}
          {agent.alternatives && (
            <ol className="mt-2 space-y-1 text-sm">
              {agent.alternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
              {agent.altNote && (
                <li className="text-xs text-gray-500 mt-1">{agent.altNote}</li>
              )}
            </ol>
          )}
        </div>

        {agent.badge && (
          <div className="mt-1.5 ml-1">
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
              {agent.badge}
            </span>
          </div>
        )}

        {agent.actions && (
          <div className="flex gap-2 mt-2 ml-1">
            <button
              onClick={canApply ? onApply : undefined}
              disabled={!canApply}
              className="px-3 py-1.5 text-xs font-semibold bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152d55] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {agent.actions.primary}
            </button>
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              {agent.actions.secondary}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScriptedChat({ onAdvanceStep }: { onAdvanceStep: () => void }) {
  const [chatStep, setChatStep] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>(chatInitialMessages);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, isAgentTyping]);

  const advance = () => {
    if (chatStep >= 2 || isAgentTyping) return;
    const nextStep = chatStep + 1;
    const [userMsg, agentMsg] = nextStep === 1 ? chatStep1 : chatStep2;

    setVisibleMessages(prev => [...prev, userMsg]);
    setIsAgentTyping(true);
    onAdvanceStep();

    setTimeout(() => {
      setIsAgentTyping(false);
      setVisibleMessages(prev => [...prev, agentMsg]);
      setChatStep(nextStep);
    }, 1800);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {visibleMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            canApply={chatStep === 1 && !isAgentTyping}
            onApply={advance}
          />
        ))}
        {isAgentTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {chatStep === 0 && !isAgentTyping && (
        <div className="px-4 pt-2 pb-2 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={advance}
              className="text-xs px-2.5 py-1 border border-[#1B3A6B] text-[#1B3A6B] bg-blue-50 rounded-full hover:bg-blue-100 transition-colors font-medium"
            >
              Card 2 표현 더 설명해줘
            </button>
            {['+ §4-2 인용', '+ 대체 표현 3가지', '+ 한 줄 요약 생성'].map((chip) => (
              <button key={chip} className="text-xs px-2.5 py-1 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 transition-colors">
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {chatStep === 1 && !isAgentTyping && (
        <div className="px-4 pt-2 pb-2 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {['+ Card 1 수정 방향 제안', '+ 규정 §4-2 인용', '+ 한 줄 요약 생성'].map((chip) => (
              <button key={chip} className="text-xs px-2.5 py-1 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 transition-colors">
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-4 pt-1.5 shrink-0 border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
          <textarea
            placeholder={chatStep >= 2 ? '심의가 완료되었습니다.' : '피드백을 어떻게 수정할까요?'}
            rows={1}
            disabled={chatStep >= 2}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none disabled:cursor-not-allowed"
          />
          <button disabled className="w-7 h-7 bg-[#1B3A6B] text-white rounded-lg flex items-center justify-center opacity-30 cursor-not-allowed shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function FreeChat({ onAdvanceStep }: { onAdvanceStep: () => void }) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([freeChatInitialMessage]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [input, setInput] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, isAgentTyping]);

  const send = () => {
    const text = input.trim();
    if (!text || isAgentTyping) return;

    const userMsg: UserMessage = { id: `user-${Date.now()}`, role: 'user', content: text };
    setVisibleMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsAgentTyping(true);

    // ReviewPanel 업데이트는 첫 2번만
    if (responseIndex < 2) onAdvanceStep();

    setTimeout(() => {
      const agentMsg = freeChatResponses[Math.min(responseIndex, freeChatResponses.length - 1)];
      setIsAgentTyping(false);
      setVisibleMessages(prev => [...prev, { ...agentMsg, id: `${agentMsg.id}-${Date.now()}` }]);
      setResponseIndex(prev => prev + 1);
    }, 1800);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {visibleMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} canApply={false} onApply={() => {}} />
        ))}
        {isAgentTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 pt-2 pb-2 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {['§4-2 캐시백 조건 확인', '단정 표현 수정 제안', '+ 한 줄 요약 생성'].map((chip) => (
            <button
              key={chip}
              onClick={() => { setInput(chip); }}
              className="text-xs px-2.5 py-1 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 pt-1.5 shrink-0 border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-gray-400 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="궁금한 사항을 질문해 주세요."
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isAgentTyping}
            className="w-7 h-7 bg-[#1B3A6B] text-white rounded-lg flex items-center justify-center hover:bg-[#152d55] transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function ChatPanel({ onCollapse, onAdvanceStep, mode = 'scripted' }: ChatPanelProps) {
  return (
    <div className="flex flex-col h-full">
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

      {mode === 'free'
        ? <FreeChat onAdvanceStep={onAdvanceStep} />
        : <ScriptedChat onAdvanceStep={onAdvanceStep} />
      }
    </div>
  );
}
