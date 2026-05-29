/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";
import { Send, Bot, X, MessageSquare, Trash2, ShieldAlert, Sparkles, Move, Minimize2 } from "lucide-react";
import { chapters } from "../data/chapters";

interface Message {
  role: "user" | "model";
  content: string;
}

interface Props {
  selectedChapterId: number;
  onSelectChapter: (id: number) => void;
}

export const FloatingAITutor: React.FC<Props> = ({ selectedChapterId, onSelectChapter }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "안녕하세요! 전기화재 위험관리 과목입니다. 1~15단원 전체 범위 내에서 궁금한 화재 기성 원인 감식, 예방 준칙, 아산화동(Cu₂O) 침적, KEC 접지공법 등 궁금한 점을 언제고 편하게 학구적으로 질문하세요."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [localChapterId, setLocalChapterId] = useState(selectedChapterId);

  // Position & Size state for draggable / resizable window
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [size, setSize] = useState({ width: 380, height: 520 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // Resize states
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 380, height: 525 });

  useEffect(() => {
    setLocalChapterId(selectedChapterId);
  }, [selectedChapterId]);

  // Handle auto centering position on mount / open
  useEffect(() => {
    if (isOpen && position.x === -9999) {
      const defaultX = Math.max(20, window.innerWidth - size.width - 24);
      const defaultY = Math.max(20, window.innerHeight - size.height - 100);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Adjust positioning on window resize to keep it on-screen
  useEffect(() => {
    const handleWindowResize = () => {
      if (position.x !== -9999) {
        setPosition((prev) => {
          const clampedX = Math.min(window.innerWidth - size.width - 10, Math.max(10, prev.x));
          const clampedY = Math.min(window.innerHeight - size.height - 10, Math.max(10, prev.y));
          return { x: clampedX, y: clampedY };
        });
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [position, size]);

  // Draggable Header logic
  const handleDragDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Only drag with left click and avoid interactable elements
    const target = e.target as HTMLElement;
    if (e.button !== 0 || target.closest("button") || target.closest("select")) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: position.x, y: position.y });
    e.preventDefault();
  };

  // Resizable Corner logic
  const handleResizeDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: size.width, height: size.height });
    setInitialPos({ 
      x: position.x === -9999 ? Math.max(20, window.innerWidth - size.width - 24) : position.x, 
      y: position.y === -9999 ? Math.max(20, window.innerHeight - size.height - 100) : position.y 
    });
    e.preventDefault();
    e.stopPropagation();
  };

  // Unified global mouse movement listeners when dragging / resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const newX = Math.min(window.innerWidth - size.width - 5, Math.max(5, initialPos.x + deltaX));
        const newY = Math.min(window.innerHeight - size.height - 5, Math.max(5, initialPos.y + deltaY));
        
        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        // Resize works from bottom-left towards the inside/outside
        const newWidth = Math.min(650, Math.max(300, initialSize.width - deltaX));
        const newHeight = Math.min(800, Math.max(380, initialSize.height + deltaY));

        setSize({ width: newWidth, height: newHeight });

        const widthDifference = newWidth - initialSize.width;
        const newX = initialPos.x - widthDifference;
        setPosition((prev) => ({ ...prev, x: newX }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, initialPos, initialSize, size]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    const activeChapter = chapters.find(ch => ch.id === localChapterId) || chapters[0];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          contextTopic: `${activeChapter.id}단원: ${activeChapter.topic}`
        })
      });

      let errorMsg = "통신 오류가 발생했습니다.";
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } else {
          errorMsg = "AI 튜터 서버가 일시적으로 점검 중이거나 재부팅 중입니다. 잠시(3~5초) 후 다시 시도해 주세요!";
        }
        throw new Error(errorMsg);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("AI 튜터 서버가 일시적으로 점검 중이거나 재부팅 중입니다. 잠시(3~5초) 후 다시 시도해 주세요!");
      }

      const data = await response.json();
      if (data.text) {
        setMessages([...updatedMessages, { role: "model" as const, content: data.text }]);
      } else {
        throw new Error(data.error || "답변 전송에 공백이 리턴되었습니다.");
      }
    } catch (e: any) {
      console.error(e);
      const isCustomError = e.message && (e.message.includes("통신 서버") || e.message.includes("AI 튜터"));
      const errorText = isCustomError 
        ? e.message 
        : `이런! 실시간 학사망 통신 상태가 고르지 못하구나. 한 번 더 차분히 물어봐 주겠니? (오류: ${e.message || "연결 불가"})`;
      setMessages([
        ...updatedMessages,
        {
          role: "model" as const,
          content: errorText
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("그간의 대화 기록을 지우고 교수와의 질의를 초기화하시겠습니까?")) {
      const activeChapter = chapters.find(ch => ch.id === localChapterId) || chapters[0];
      setMessages([
        {
          role: "model",
          content: `새 마음으로 보강 튜터방을 개설합니다. 1~15단원 중 현재 중심 범위는 [${activeChapter.id}강. ${activeChapter.topic}] 입니다. 편하게 타진하세요.`
        }
      ]);
    }
  };

  const handleChapterDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = parseInt(e.target.value);
    setLocalChapterId(nextId);
    onSelectChapter(nextId);
    
    // Quick system message notifying chapter context shift
    const matchedCh = chapters.find(ch => ch.id === nextId);
    if (matchedCh) {
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          content: `수업 토픽을 [${matchedCh.id}단원: ${matchedCh.topic}]으로 즉시 재설정 변경하였습니다. 이 영역에 연계된 핵심 의문을 제시해 보세요.`
        }
      ]);
    }
  };

  return (
    <>
      {/* Floating Messenger Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#ef4444] hover:bg-red-700 active:scale-95 text-white p-4 rounded-full shadow-2xl shadow-red-500/35 transition duration-150 flex items-center justify-center cursor-pointer group hover:rotate-6 border border-red-500"
        title="전기화재위험관리 AI 튜터 열기"
        id="btn-floating-tutor"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-scaleIn" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6.5 h-6.5" />
            <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 font-extrabold text-[8px] px-1 py-0.5 rounded-full animate-pulse border border-red-650">
              AI
            </span>
          </div>
        )}
      </button>

      {/* Floating Draggable Resizable Chat Popup Container */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            left: position.x !== -9999 ? `${position.x}px` : "auto",
            top: position.y !== -9999 ? `${position.y}px` : "auto",
            right: position.x === -9999 ? "24px" : "auto",
            bottom: position.y === -9999 ? "100px" : "auto",
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
          className="z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-slideUp select-text"
        >
          {/* Draggable Red Header */}
          <div
            onMouseDown={handleDragDown}
            className="bg-[#ef4444] p-4 text-white flex justify-between items-center draggable-header cursor-move shrink-0 border-b border-red-500 select-none"
            title="마우스로 잡고 드래그하여 창을 이동하세요"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-1.5 rounded-xl">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm flex items-center gap-1.5 tracking-tight">
                  전기화재위험관리 AI 튜터
                  <span className="text-[8.5px] font-black bg-yellow-400 text-red-950 px-1 py-0.5 rounded uppercase font-mono">
                    PRO
                  </span>
                </h4>
                <p className="text-[10.5px] opacity-90 font-medium">Prof.YUKWON(AI Ver.1.1)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="hover:bg-white/20 p-1.5 rounded-lg transition text-white/90 cursor-pointer"
                title="대화 지우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition text-white/90 cursor-pointer"
                title="창 닫기"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Draggable Indicator & 1-15 Unit Switching Bar */}
          <div className="bg-slate-900 shrink-0 px-4 py-2 flex items-center justify-between gap-1 border-b border-slate-800 text-[10px] text-slate-400 select-none font-bold">
            <span className="flex items-center gap-1 text-red-400 truncate max-w-[140px]">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 select-none" />
              1~15단원 자율 보강방
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <label className="text-[8px] text-slate-500 uppercase tracking-widest block font-mono">단원수정</label>
              <select
                value={localChapterId}
                onChange={handleChapterDropdownChange}
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-red-500 max-w-[125px] font-semibold"
              >
                {chapters.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.id}단원. {ch.topic.substring(0, 10)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scrollable messages panel */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#fafafa] space-y-3.5 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="bg-[#ef4444]/10 p-1.5 rounded-lg text-[#ef4444] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3 rounded-2xl text-[11.5px] leading-relaxed text-justify shadow-sm border ${
                      msg.role === "user"
                        ? "bg-[#ef4444] border-red-500 text-white rounded-tr-none font-medium"
                        : "bg-white border-slate-200 text-slate-800 rounded-tl-none font-medium"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\n/g, "<br>")
                        .replace(/\*\*(.*?)\*\*/g, "<span class='text-[#ef4444] font-black'>$1</span>")
                    }}
                  />
                  <span className="text-[8.5px] text-slate-400 mt-1 font-bold uppercase tracking-wider pl-1 pr-1">
                    {msg.role === "user" ? "수강 학부생" : "Prof. YUKWON"}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2 justify-start">
                <div className="bg-[#ef4444]/10 p-1.5 rounded-lg text-[#ef4444] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-bounce" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="질문을 입력하세요..."
                disabled={loading}
                className="flex-1 bg-slate-55 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-red-500 outline-none transition disabled:bg-slate-50 text-slate-800 placeholder-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-[#ef4444] hover:bg-red-700 text-white p-2.5 rounded-xl transition disabled:bg-slate-300 disabled:shadow-none shadow-md shadow-red-500/20 active:scale-90 flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drag Resize Handle (Bottom Left Corner) */}
          <div
            onMouseDown={handleResizeDown}
            className="absolute bottom-0 left-0 w-4 h-4 bg-slate-100 hover:bg-red-200 transition border-t border-r border-slate-200 cursor-sw-resize flex items-center justify-center select-none"
            title="마우스 드래그로 크기를 조절하세요"
          >
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      )}
    </>
  );
};
