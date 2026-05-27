/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, ShieldAlert } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

interface Props {
  activeTopic: string;
}

export const AITutor: React.FC<Props> = ({ activeTopic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "반갑네! 동원과학기술대학교 산업안전관리과 '전기화재 위험관리' 수강생 여러분. YUKWON 교수라네. 1~15단원 통합 교안 범위 내에서 어려운 물리 공식, KEC 접지 규정, 아산화동(Cu₂O) 적열화 메커니즘, 1차 및 2차 단락흔의 금속 조직학적 차이점 등 무엇이든 질문해 주게. 심화 보강 지도를 선도하겠네."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          contextTopic: activeTopic
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages([...updatedMessages, { role: "model" as const, content: data.text }]);
      } else {
        throw new Error(data.error || "응답이 부실합니다.");
      }
    } catch (e: any) {
      console.error(e);
      setMessages([
        ...updatedMessages,
        {
          role: "model" as const,
          content: `미안하지만 통신 장애가 발생했네. 잠시 후 서버가 재기조정되면 다시 정식 질문해 주게. (오류: ${e.message || "네트워크 연결 부재"})`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if(window.confirm("이전 보강대화 기록을 전부 초기화하겠는가?")) {
      setMessages([
        {
          role: "model",
          content: `새로운 탐구 면담을 시작하지. 현재 우리의 메인 탐구 범위는 [${activeTopic}] 이라네. 질의할 전공 부문이 있다면 교수에게 신속히 타진해 주게.`
        }
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-sm">
      {/* Bot Header */}
      <div className="bg-[#0f172a] px-5 py-4 text-white flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-600 p-2 rounded-xl text-white shadow shadow-orange-650/20">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
              실시간 1:1 AI 교수 튜터링
            </h4>
            <p className="text-xs text-slate-400 font-mono">Prof.YUKWON(학과보안 Ver.1.1)</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-350 hover:text-orange-500 cursor-pointer"
          title="대화 지우기"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Classroom Status Bar */}
      <div className="bg-orange-50/55 border-b border-orange-100 px-5 py-2 text-xs flex items-center justify-between font-semibold text-orange-900">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-orange-600" /> 대화방 활선 유도 상태
        </span>
        <span className="bg-white px-2 py-0.5 rounded border border-orange-100 text-slate-700 font-mono text-[10px]">심화 범위: {activeTopic}</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Avatar Column */}
            {msg.role === "model" && (
              <div className="bg-slate-800 text-white p-1.5 rounded-lg shrink-0">
                <Bot className="w-4 h-4 text-orange-500" />
              </div>
            )}

            {/* Bubble Column */}
            <div className={`flex flex-col max-w-[82%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed text-justify shadow-sm border ${
                  msg.role === "user"
                    ? "bg-orange-600 border-orange-700 text-white rounded-tr-none font-medium"
                    : "bg-white border-slate-200 text-slate-800 rounded-tl-none font-medium"
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\n/g, "<br>")
                    .replace(/\*\*(.*?)\*\*/g, "<span class='text-orange-500 font-extrabold'>$1</span>")
                }}
              />
              <span className="text-[9px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                {msg.role === "user" ? "학부생" : "YUKWON 교수 소견"}
              </span>
            </div>

            {msg.role === "user" && (
              <div className="bg-orange-600 text-white p-1.5 rounded-lg shrink-0 shadow shadow-orange-600/10">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="bg-slate-800 text-white p-1.5 rounded-lg shrink-0">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex flex-col items-start">
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">답변 작성 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 아산화동이 생성되면 왜 마찰열이 늘어나나요?"
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-none transition disabled:bg-slate-50 text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 rounded-xl transition shadow disabled:bg-slate-300 active:scale-95 duration-100 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
