/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Check, HelpCircle, Loader2, Sparkles, Award } from "lucide-react";
import { Chapter, QuizQuestion } from "../types";

interface Props {
  chapters: Chapter[];
  activeChapterId: number;
}

export const PracticeExam: React.FC<Props> = ({ chapters, activeChapterId }) => {
  const currentChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];
  
  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Custom AI Quiz state
  const [aiQuestion, setAiQuestion] = useState<QuizQuestion | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedAIAnswer, setSelectedAIAnswer] = useState<number | null>(null);
  const [isAIAnswered, setIsAIAnswered] = useState(false);

  // Core textbook question
  const textbookQuiz = currentChapter.quiz[0];

  // Request new AI custom question relevant to the active topic
  const generateAIQuiz = async () => {
    setLoadingAI(true);
    setAiQuestion(null);
    setSelectedAIAnswer(null);
    setIsAIAnswered(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: currentChapter.topic })
      });

      let errorMsg = "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!";
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
      if (data.question) {
        setAiQuestion(data as QuizQuestion);
      } else {
        throw new Error(data.error || "출제 오류");
      }
    } catch (e: any) {
      console.error(e);
      const fallbackMsg = "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!";
      const errMsg = e.message || fallbackMsg;
      // Fallback custom mock quiz containing error details
      setAiQuestion({
        id: 999,
        question: `[긴급 대체 예비문] AI 기출 출제 중 지체 상태를 감지했습니다. (${errMsg})`,
        options: ["① 학과 데이터 검정 재촉구", "② 차분히 3초 후 재획득 시도", "③ 예비 기출 해설 정독하기", "④ 누전차단기(ELB) 작동 실태 점검"],
        correctAnswerIndex: 2,
        explanation: `죄송하네 학우 여러분. 현재 API 지연이나 가용량 초과 상태로 실시간 인공지능 기출을 출제하지 못했으나, 아래를 유념해 주게: \n\n${errMsg}`
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIdx);
    setIsAnswered(true);
  };

  const handleSelectAIAnswer = (optionIdx: number) => {
    if (isAIAnswered) return;
    setSelectedAIAnswer(optionIdx);
    setIsAIAnswered(true);
  };

  const resetTextbookQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Cover */}
      <div className="bg-[#0f172a] text-slate-350 border border-slate-700/80 p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-950/25 via-slate-900 to-slate-900 pointer-events-none"></div>
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange-400 bg-[#1e293b] border border-slate-700 px-3 py-1 rounded-full inline-block">
          ACADEMIC EVALUATION
        </span>
        <h3 className="text-xl sm:text-2xl font-serif italic text-white mt-2.5 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-400" />
          자가 진단 실전 객관식 평가실
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          현재 선택 학습 중인 단원: <strong>[{currentChapter.id}단원: {currentChapter.topic}]</strong>의 중요 물리 정격 공식과 준칙이 적용된 객관식 모의 검증을 수행합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Textbook Static Quiz */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b pb-2 flex justify-between items-center border-slate-100">
              <span className="text-xs font-extrabold text-slate-500 uppercase">정규 교육 단원 자가문제</span>
              {isAnswered && (
                <button onClick={resetTextbookQuiz} className="text-xs font-bold text-orange-650 hover:underline cursor-pointer">
                  다시 풀기
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-relaxed text-justify">
                Q1. {textbookQuiz.question}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {textbookQuiz.options.map((option, idx) => {
                  let cardStyle = "border-slate-200 hover:bg-slate-50 text-slate-650";
                  if (isAnswered) {
                    if (idx === textbookQuiz.correctAnswerIndex) {
                      cardStyle = "bg-orange-50/70 border-orange-400 text-orange-900 font-extrabold";
                    } else if (idx === selectedAnswer) {
                      cardStyle = "bg-red-50 border-red-200 text-red-900";
                    } else {
                      cardStyle = "opacity-45 border-slate-100 text-slate-400";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 border rounded-xl text-xs transition duration-150 flex items-center justify-between cursor-pointer ${cardStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === textbookQuiz.correctAnswerIndex && (
                        <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {isAnswered && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-650 leading-relaxed text-justify space-y-1 animate-fadeIn shadow-inner">
              <span className="font-black text-slate-800 block mb-0.5">📝 Prof. YUKWON 해설 소견</span>
              <p>{textbookQuiz.explanation}</p>
            </div>
          )}
        </div>

        {/* Right Side: Dynamic AI Quiz generated via proxy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b pb-2 flex justify-between items-center border-slate-100">
              <span className="text-xs font-bold text-orange-600 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI 실전 무한 예상 기출 출제
              </span>
              <span className="text-[10px] font-mono text-slate-400">UNLIMITED ENGINE</span>
            </div>

            {aiQuestion ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-3.5">
                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-relaxed text-justify">
                    Q. {aiQuestion.question}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {aiQuestion.options.map((option, idx) => {
                      let cardStyle = "border-slate-200 hover:bg-slate-50 text-slate-650";
                      if (isAIAnswered) {
                        if (idx === aiQuestion.correctAnswerIndex) {
                          cardStyle = "bg-orange-50/70 border-orange-400 text-orange-900 font-extrabold";
                        } else if (idx === selectedAIAnswer) {
                          cardStyle = "bg-red-50 border-red-200 text-red-900";
                        } else {
                          cardStyle = "opacity-45 border-slate-100 text-slate-400";
                        }
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAIAnswer(idx)}
                          disabled={isAIAnswered}
                          className={`w-full text-left p-3.5 border rounded-xl text-xs transition duration-150 flex items-center justify-between cursor-pointer ${cardStyle}`}
                        >
                          <span>{option}</span>
                          {isAIAnswered && idx === aiQuestion.correctAnswerIndex && (
                            <Check className="w-4 h-4 text-orange-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAIAnswered && (
                  <div className="bg-orange-50/35 border border-orange-100 rounded-xl p-4 text-xs text-slate-650 leading-relaxed text-justify space-y-1 animate-fadeIn shadow-inner">
                    <span className="font-black text-orange-900 flex items-center gap-1 mb-0.5">
                      <Award className="w-4 h-4 text-orange-600" /> AI 안전공학 감식해설관
                    </span>
                    <p>{aiQuestion.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400 space-y-3">
                <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
                  <Sparkles className="w-6 h-6 text-orange-505 animate-pulse" />
                </div>
                <span className="text-xs font-extrabold text-slate-700">새로운 AI 학업 예상 기출을 형성 가동하십시오</span>
                <span className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  현재 선별하신 '{currentChapter.id}강. {currentChapter.topic.substring(0, 15)}...' 범위를 분석하여 실시간 1문제를 획득합니다.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={generateAIQuiz}
            disabled={loadingAI}
            className="w-full bg-[#0f172a] hover:bg-slate-800 disabled:bg-slate-350 text-white font-extrabold text-xs py-3.5 rounded-xl transition duration-150 shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {loadingAI ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                <span>AI가 문항을 가공 전송 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>AI 기출 문제 새로 획득</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
