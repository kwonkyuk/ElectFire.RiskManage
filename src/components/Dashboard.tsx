/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { chapters } from "../data/chapters";
import { Chapter } from "../types";
import { BookOpen, AlertOctagon, Bot, Compass, ShieldAlert, Award, ArrowRight, BarChart2 } from "lucide-react";

interface Props {
  onSelectChapter: (id: number) => void;
  onNavigateToTutor: () => void;
  onNavigateToSimulator: () => void;
  onNavigateToForensics: () => void;
}

export const Dashboard: React.FC<Props> = ({
  onSelectChapter,
  onNavigateToTutor,
  onNavigateToSimulator,
  onNavigateToForensics
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* College Branding Banner */}
      <div className="bg-[#0f172a] text-slate-300 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-700/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-950/30 via-slate-900 to-slate-900 pointer-events-none"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-3.5 max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 bg-[#1e293b] border border-slate-700 px-3 py-1.5 rounded-full inline-block">
            College of Industrial Safety Management
          </span>
          <h2 className="text-xl sm:text-3xl font-serif italic text-white leading-tight">
            전기화재 위험관리 원격 교육 전용 강의실
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed text-justify">
            동원과학기술대학교 산업안전관리과 수강생 여러분을 환영합니다. 본 학업 공간은 수소 가열 주울열량 법칙 및 고장 전자기 임피던스 임계점 거동을 1~15단원의 전 범위 통합 교안을 통해 실습형 교육 체계로 완비하였습니다.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold pt-2 text-slate-500">
            <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-orange-500" /> 교수자: Prof.YUKWON</span>
            <span className="flex items-center gap-1">• email: labkyu@naver.com</span>
            <span className="flex items-center gap-1">• 전공 부문: 전기화재 원인 감식학</span>
          </div>
        </div>
      </div>

      {/* Quick shortcuts to AI engines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Tutor Card */}
        <div onClick={onNavigateToTutor} className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-2xl p-5 shadow-sm hover:shadow transition duration-200 cursor-pointer flex items-start gap-4">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shadow ring-1 ring-orange-150">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-800 text-sm">실시간 AI 교수 면담 튜터</h4>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">교안 범위의 난해한 야금학, KEC 접지 계통을 24시간 실시간 교수의 지도로 마스터합니다.</p>
          </div>
        </div>

        {/* AI Joule Simulator Card */}
        <div onClick={onNavigateToSimulator} className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-2xl p-5 shadow-sm hover:shadow transition duration-200 cursor-pointer flex items-start gap-4">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shadow ring-1 ring-orange-150">
            <AlertOctagon className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-800 text-sm">Joule's Law 화재 시뮬레이터</h4>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">과부하 전류(I)와 미세 저항(R) 변화에 기인한 도선 온도 및 피복의 파쇄 소각을 가늠합니다.</p>
          </div>
        </div>

        {/* AI Forensics Card */}
        <div onClick={onNavigateToForensics} className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-2xl p-5 shadow-sm hover:shadow transition duration-200 cursor-pointer flex items-start gap-4">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shadow ring-1 ring-orange-150">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-800 text-sm">AI 화재 증거 비전 감식실</h4>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">포렌식 사진 또는 1차/2차 단락흔 구슬 가열 사진을 업로드하여 금속 조직을 정밀 감정합니다.</p>
          </div>
        </div>
      </div>

      {/* Statistics Section (Beautiful Custom SVG rendering for React 19 safety) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b pb-3 flex items-center justify-between border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">전국 화재 발생학 정량 통계 (National Fire Logs)</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider bg-slate-50 border border-slate-200 p-1 px-2.5 rounded-md">소스: 소방청</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart 1: Fire Causes Vector Chart */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">주요 발화 요인별 점유율 (%)</h4>
            <div className="border border-slate-105 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-3.5">
              {/* Bar 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>① 부주의 (보통 담배, 불씨 방전 등)</span>
                  <span>49.6%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: "49.6%" }}></div>
                </div>
              </div>
              {/* Bar 2: TARGET CORE */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-orange-700">
                  <span>② 전기적 요인 (전선 하얼, 기기 아크 소손)</span>
                  <span>21.1%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-600 h-full rounded-full animate-pulse" style={{ width: "21.1%" }}></div>
                </div>
              </div>
              {/* Bar 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>③ 기계적 요인 (마모 구속 등)</span>
                  <span>10.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-450 h-full rounded-full" style={{ width: "10.5%" }}></div>
                </div>
              </div>
              {/* Bar 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>④ 기타 및 방화</span>
                  <span>18.8%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full rounded-full" style={{ width: "18.8%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Fault Types within Electrical Fires */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">전기식 발화 세부 형태 점유 (%)</h4>
            <div className="border border-slate-105 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-3.5">
              {/* Bar 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>① 미확인 단락 (수열/가속 접합 합선)</span>
                  <span>28.1%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: "28.1%" }}></div>
                </div>
              </div>
              {/* Bar 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>② 절연 열화 단락 (피복 노화 갈라짐)</span>
                  <span>21.2%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "21.2%" }}></div>
                </div>
              </div>
              {/* Bar 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>③ 트래킹 단락 (습기 먼지 분탈 흔적)</span>
                  <span>13.8%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: "13.8%" }}></div>
                </div>
              </div>
              {/* Bar 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>④ 과부하 / 접촉 불량 합산</span>
                  <span>36.9%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full rounded-full" style={{ width: "36.9%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Lesson Directory Grid (1 to 15 chapters) */}
      <div className="space-y-5">
        <div className="border-b pb-3 flex items-center justify-between border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">제1학기 강의 커리큘럼 디렉터리 (Chapters 1~15)</h3>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-100">DST 학업성취</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-500 rounded-3xl p-5 shadow-sm hover:shadow transition duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-orange-600 transition"></div>
              <div className="space-y-2 pl-2">
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {ch.title}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm truncate group-hover:text-orange-700 transition">
                  {ch.topic}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed text-justify line-clamp-3">
                  {ch.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pl-2 pt-2 group-hover:text-orange-600 transition">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> 자가 검증 및 교안 확인</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
