/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { chapters } from "./data/chapters";
import { Dashboard } from "./components/Dashboard";
import { ChapterViewer } from "./components/ChapterViewer";
import { AITutor } from "./components/AITutor";
import { JouleSimulator } from "./components/JouleSimulator";
import { VisionForensics } from "./components/VisionForensics";
import { PracticeExam } from "./components/PracticeExam";
import { FloatingAITutor } from "./components/FloatingAITutor";
import { Flame, BookOpen, Bot, Zap, Camera, CheckSquare, Home, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

type ActiveTab = "home" | "viewer" | "tutor" | "simulator" | "forensics" | "exam";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("viewer");
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [showAITutor, setShowAITutor] = useState<boolean>(true);
  const [completedChapters, setCompletedChapters] = useState<number[]>([1, 2, 4]);

  const selectedChapter = chapters.find((ch) => ch.id === selectedChapterId) || chapters[0];

  const handleSelectChapter = (id: number) => {
    setSelectedChapterId(id);
    setActiveTab("viewer");
    if (!completedChapters.includes(id)) {
      setCompletedChapters((prev) => [...prev, id]);
    }
  };

  const handleSelectChapterFromDashboard = (id: number) => {
    handleSelectChapter(id);
  };

  const handleNavigateToExam = () => {
    setActiveTab("exam");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans">
      {/* DST Header */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 text-white p-2 rounded-xl shadow-lg shadow-orange-600/15 flex items-center justify-center">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 font-serif italic">
                전기화재 위험관리 (1-15주차 통합본)
              </h1>
              <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Dongwon Institute of Science and Technology • DST • 산업안전관리과
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats / contact */}
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-800">강의자 : Prof.YUKWON</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                <Mail className="w-3 h-3 text-orange-500" /> labkyu@naver.com
              </p>
            </div>

            {/* AI Tutor Toggle Switch */}
            <div 
              onClick={() => setShowAITutor(!showAITutor)}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-inner cursor-pointer select-none active:scale-95 transition-transform"
            >
              <Bot className={`w-4 h-4 ${showAITutor ? "text-red-650 animate-pulse font-extrabold" : "text-slate-400"}`} />
              <span className="text-xs font-black text-slate-700 hidden sm:inline">AI 튜터</span>
              <div className="relative inline-flex items-center">
                <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${showAITutor ? 'bg-red-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform duration-200 ${showAITutor ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-full py-1.5 px-3.5 flex items-center gap-1 text-[10px] font-black text-orange-850">
              <ShieldCheck className="w-3 h-3 text-orange-600" /> KEC 준칙 필기 교육용
            </div>
          </div>
        </div>
      </header>

      {/* Classroom body grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-3.5 print:hidden bg-[#0f172a] text-slate-300 p-4 rounded-3xl border border-slate-700/80 shadow-xl h-fit">
          <div className="p-4 bg-[#1e293b] border-b border-slate-700 rounded-2xl shadow-sm">
            <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-1">Industrial Safety</h1>
            <h2 className="text-base font-serif italic text-white leading-tight">Electrical Fire Risk</h2>
          </div>

          <div className="text-[10px] uppercase font-bold text-slate-500 px-1 pt-1">
            원격 학습 코너 Curriculum
          </div>

          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === "home"
                ? "bg-orange-600 text-white shadow-md"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === "home" ? "text-white" : "text-slate-500"}`} />
            강의 포털 홈board
          </button>

          {/* Chapter study */}
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveTab("viewer")}
              className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === "viewer"
                  ? "bg-orange-600 text-white shadow-md font-extrabold"
                  : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${activeTab === "viewer" ? "text-white" : "text-slate-500"}`} />
                <span className="truncate max-w-[80px] sm:max-w-none">교안 학습</span>
              </span>
              
              <div className="flex items-center gap-2 shrink-0 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                {/* ① Current Chapter badge */}
                <span className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-md font-black select-none tracking-tight shrink-0 shadow-sm border ${
                  activeTab === "viewer" ? "bg-orange-850 text-white border-orange-750/50" : "bg-slate-800 text-slate-200 border-slate-700"
                }`} title="현재 학습 단원">
                  {selectedChapterId}강
                </span>

                {/* ③ Next chapter action button and ② next chapter symbol */}
                <motion.button
                  title={`다음 단원(${selectedChapterId === chapters.length ? 1 : selectedChapterId + 1}강)으로 이동`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextId = (selectedChapterId % chapters.length) + 1;
                    handleSelectChapter(nextId);
                  }}
                  animate={{
                    backgroundColor: ["#fbbf24", "#f59e0b", "#f97316", "#f59e0b", "#fbbf24"], // slowly transitions amber-400 -> amber-500 -> orange-500 -> amber-500 -> amber-400
                    scale: [1, 1.05, 1], // gentle pulse breathing effect
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md text-slate-950 text-[11px] sm:text-xs font-black shadow-md border border-amber-500/30 transition-shadow hover:shadow-lg active:scale-95 duration-100 cursor-pointer shrink-0"
                >
                  <span className="text-[12px] sm:text-[13px] font-bold">➔</span>
                  <span className="font-extrabold tracking-tight">{(selectedChapterId % chapters.length) + 1}강</span>
                </motion.button>
              </div>
            </button>

            {/* Expanded Entire Unit Grid (UNIT 1-15) */}
            {activeTab === "viewer" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-2.5 bg-[#141b2d] border border-slate-800 rounded-2xl space-y-2.5 shadow-inner overflow-hidden"
              >
                <div className="flex items-center justify-between px-0.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    전체 학습 단원 (UNIT 1-15)
                  </label>
                  <span className="text-[8px] font-black text-orange-400 px-1 py-0.5 rounded bg-orange-950/40 select-none animate-pulse">
                    SCROLL ↕
                  </span>
                </div>

                {/* Grid items */}
                <div className="grid grid-cols-2 gap-1.5 max-h-[290px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {chapters.map((ch) => {
                    const isSelected = selectedChapterId === ch.id;
                    const isCompleted = completedChapters.includes(ch.id);
                    const chNumber = ch.id < 10 ? `0${ch.id}` : `${ch.id}`;
                    
                    return (
                      <div
                        key={ch.id}
                        onClick={() => handleSelectChapter(ch.id)}
                        className={`p-1.5 rounded-xl text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[58px] relative group border ${
                          isSelected
                            ? "bg-slate-900 border-emerald-500/90 shadow-md shadow-emerald-500/5 text-white"
                            : "bg-[#1e293b]/30 hover:bg-[#1e293b]/70 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {/* Header of unit badge and checkmark */}
                        <div className="flex items-center justify-between gap-1 w-full">
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-black border ${
                            isSelected 
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/20" 
                              : "bg-[#0b1120] text-slate-400 border-slate-800"
                          }`}>
                            {chNumber}
                          </span>

                          {isCompleted ? (
                            <span className="w-4 h-4 bg-emerald-550 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm shrink-0" title="학습 완료">
                              ✓
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 border border-slate-750 rounded-full flex items-center justify-center text-[7px] text-slate-700 shrink-0 group-hover:border-slate-600">
                            </span>
                          )}
                        </div>

                        {/* Title truncation */}
                        <p className={`text-[10px] font-bold mt-1 leading-snug line-clamp-2 transition-colors ${
                          isSelected ? "text-emerald-300" : "text-slate-300 group-hover:text-white"
                        }`} title={ch.topic}>
                          {ch.topic}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 대학 관제 상태 Control State */}
                <div className="p-2 bg-[#090d16] border border-slate-900 rounded-xl flex items-center justify-between text-[9.5px]">
                  <span className="font-extrabold text-slate-400">대학 관제 상태</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-black">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    AI Core Engine Active
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Real-time AI Tutor */}
          <button
            onClick={() => setActiveTab("tutor")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === "tutor"
                ? "bg-orange-600 text-white shadow-md"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Bot className={`w-4 h-4 ${activeTab === "tutor" ? "text-white" : "text-slate-500"}`} />
            실시간 AI 교수 튜터
          </button>

          {/* Joule Simulator */}
          <button
            onClick={() => setActiveTab("simulator")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === "simulator"
                ? "bg-orange-600 text-white shadow-md"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === "simulator" ? "text-white" : "text-slate-500"}`} />
            Joule의 법칙 시뮬레이터
          </button>

          {/* Forensic Image detector */}
          <button
            onClick={() => setActiveTab("forensics")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === "forensics"
                ? "bg-orange-600 text-white shadow-md"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Camera className={`w-4 h-4 ${activeTab === "forensics" ? "text-white" : "text-slate-500"}`} />
            AI 화재패턴 징후 분석
          </button>

          {/* Self testing exam */}
          <button
            onClick={() => setActiveTab("exam")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeTab === "exam"
                ? "bg-orange-600 text-white shadow-md"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <CheckSquare className={`w-4 h-4 ${activeTab === "exam" ? "text-white" : "text-slate-500"}`} />
            실전 자가 진단 평가
          </button>

          {/* Chapter Selector Dropdown (Shown in exam/tutor modes to change target chapters) */}
          {activeTab !== "home" && activeTab !== "simulator" && activeTab !== "viewer" && (
            <div className="mt-2 bg-[#1e293b] border border-slate-800 rounded-2xl p-3 space-y-2 shadow-inner">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">단원 제어 Selector</label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(parseInt(e.target.value))}
                className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl p-2 text-[11px] font-bold text-slate-200 focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer hover:bg-slate-800 transition"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.id}강. {ch.topic.substring(0, 14)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Instructor profile block */}
          <div className="p-3.5 bg-[#0b1120] rounded-2xl border border-slate-850 mt-auto space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-[10px] font-black text-slate-200 shrink-0">
                PROF
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] text-orange-400 leading-none uppercase font-extrabold tracking-wider">교수 연구원 프로필</p>
                <p className="text-xs text-white font-extrabold truncate mt-0.5 leading-normal">Prof.YUKWON</p>
                <p className="text-[9.5px] text-slate-400 truncate leading-none mt-0.5">배전 및 방재 지능형 관제 연구실</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-850 text-[10px] text-slate-405 space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="text-orange-500 font-extrabold">•</span> 
                <span><strong>오피스 시간:</strong> 목요일 14:00 - 17:00</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-orange-500 font-extrabold">•</span> 
                <span><strong>수업 장소:</strong> 창조관 307호 멀티미디어실</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-orange-500 font-extrabold">•</span> 
                <span><strong>연락 이메일:</strong> labkyu@naver.com</span>
              </p>
            </div>
          </div>
        </aside>

        {/* Content Pane container */}
        <section className="flex-1 min-w-0">
          <motion.div
            key={activeTab + "_" + selectedChapterId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "home" && (
              <Dashboard
                onSelectChapter={handleSelectChapterFromDashboard}
                onNavigateToTutor={() => setActiveTab("tutor")}
                onNavigateToSimulator={() => setActiveTab("simulator")}
                onNavigateToForensics={() => setActiveTab("forensics")}
              />
            )}

            {activeTab === "viewer" && (
              <ChapterViewer 
                chapter={selectedChapter} 
                onNavigateToQuiz={handleNavigateToExam} 
              />
            )}

            {activeTab === "tutor" && (
              <AITutor activeTopic={`${selectedChapter.id}단원: ${selectedChapter.topic}`} />
            )}

            {activeTab === "simulator" && (
              <JouleSimulator />
            )}

            {activeTab === "forensics" && (
              <VisionForensics />
            )}

            {activeTab === "exam" && (
              <PracticeExam chapters={chapters} activeChapterId={selectedChapterId} />
            )}
          </motion.div>
        </section>
      </div>

      {/* Corporate DST footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">동원과학기술대학교 산업안전관리과</h4>
          <p className="text-xs text-slate-400">Classroom Space: 동원과학기술대학교 전기화재 위험관리 교안 원격 학습 포털 • Ver 1.6</p>
          <div className="text-[10px] text-slate-400 max-w-sm mx-auto leading-normal">
            본 학과 교육 플랫폼은 불법 분제를 금하며 수업 관리 전용 도구입니다.<br />
            Lab Contact: labkyu@naver.com (Prof.YUKWON)
          </div>
        </div>
      </footer>

      {/* Persistent & Resizable Floatable AI Chatbot */}
      {showAITutor && (
        <FloatingAITutor 
          selectedChapterId={selectedChapterId} 
          onSelectChapter={(id) => setSelectedChapterId(id)} 
        />
      )}
    </div>
  );
}
