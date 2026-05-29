/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Zap, Play, Thermometer, ShieldAlert, Sparkles, Scale } from "lucide-react";
import { SimState, SimResult } from "../types";

export const JouleSimulator: React.FC = () => {
  const [params, setParams] = useState<SimState>({
    current: 10,       // A
    resistance: 0.5,   // Ohm
    time: 120,         // seconds (2 mins)
    ambientTemp: 25    // °C
  });

  const [result, setResult] = useState<SimResult | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Perform physical simulations locally
  const runLocalSimulation = () => {
    const I = params.current;
    const R = params.resistance;
    const t = params.time;
    const Tamb = params.ambientTemp;

    // Joule's law equations
    const heatJoule = I * I * R * t;            // H = I^2 * R * t (Joule)
    const heatCal = 0.24 * heatJoule;           // caloric conversion

    // Estimating conductor core temperature change simply for simulator visuals
    // Copper cross-section thermal coefficient approximation
    const massConductor = 0.05; // 50g assumption
    const specificHeatCopper = 0.092; // cal/g°C
    const deltaTemp = heatCal / (massConductor * specificHeatCopper * 1000); // division
    const finalTemp = Tamb + Math.min(1050, deltaTemp); // Caps near melting point of copper (1083°C)

    let insulationState = "정상 상태 (Normal)";
    let charringRatio = 0;

    if (finalTemp > 400) {
      insulationState = "인화 및 자발화 발화 (Ignition / 전면 화재 발생)";
      charringRatio = 100;
    } else if (finalTemp > 250) {
      insulationState = "탄화 생성 및 탄화도전로 천이 (Carbonized 트래킹)";
      charringRatio = 85;
    } else if (finalTemp > 180) {
      insulationState = "수지 외피 용융 및 구리 도체 노출 (Melting 단락 위험)";
      charringRatio = 50;
    } else if (finalTemp > 75) {
      insulationState = "온도 과부하 및 외피 연화 (Softened 열적 열화 진행)";
      charringRatio = 20;
    }

    setResult({
      heatJoule,
      heatCal,
      conductorTemp: Math.round(finalTemp),
      insulationState,
      charringRatio,
      description: `전자기 인가 전류량의 승수가 제곱 배율로 작용하여 접속점 단락 온도에 도달하였습니다. 현재 계산된 도선 예상 중심 온도는 ${Math.round(finalTemp)}°C 이며, 주변 피복 가연물의 임계 연화 한도를 완벽히 극복하였습니다.`
    });
  };

  useEffect(() => {
    runLocalSimulation();
  }, [params]);

  const fetchAIReport = async () => {
    if (loadingAI) return;
    setLoadingAI(true);
    setAiReport(null);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current: params.current,
          resistance: params.resistance,
          time: params.time
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error);
      }

      const data = await response.json();
      if (data.explanation) {
        setAiReport(data.explanation);
      } else {
        throw new Error("리포트 설명 데이터가 비어 있습니다.");
      }
    } catch (e: any) {
      console.error(e);
      const fallbackMsg = "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!";
      setAiReport(e.message || fallbackMsg);
    } finally {
      setLoadingAI(false);
    }
  };

  const setScenario = (current: number, resistance: number, time: number) => {
    setParams({ ...params, current, resistance, time });
    setAiReport(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Cover */}
      <div className="bg-[#0f172a] text-slate-350 border border-slate-700/80 p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-950/25 via-slate-900 to-slate-900 pointer-events-none"></div>
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange-400 bg-[#1e293b] border border-slate-700 px-3 py-1 rounded-full inline-block">
          DONGWON INSTITUTE OF SCIENCE AND TECHNOLOGY
        </span>
        <h3 className="text-lg sm:text-2xl font-serif italic text-white mt-2.5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-505 animate-pulse" />
          AI 주울의 법칙 (Joule's Law) 화재 재해 시뮬레이터
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl text-justify">
          전류(I), 저항(R), 시간(t)을 정규 조절하여 주울열 에너지 배율을 시뮬레이팅합니다. 야금학적 단선의 열 파쇄 상태 및 탄화도전로 전이를 입증하고 AI 지도 소견서를 자동 도출합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input sliders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="border-b pb-2 flex justify-between items-center border-slate-100">
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-orange-600" /> 부하 매개변수 설정
            </h4>
            <span className="text-[9px] font-bold text-slate-400 font-mono">LIVE CONNECTED</span>
          </div>

          <div className="space-y-4">
            {/* Current */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-750 font-mono">
                <span>회로 인가 전류 (I)</span>
                <span className="text-orange-600 font-extrabold">{params.current} A</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={params.current}
                onChange={(e) => setParams({ ...params, current: parseFloat(e.target.value) })}
                className="w-full accent-orange-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>1 A</span>
                <span>정상 가정 15A</span>
                <span>공업 최고 50A</span>
              </div>
            </div>

            {/* Resistance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-755 font-mono">
                <span>접촉 아크 국소 저항 (R)</span>
                <span className="text-orange-600 font-extrabold">{params.resistance} Ω</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={params.resistance}
                onChange={(e) => setParams({ ...params, resistance: parseFloat(e.target.value) })}
                className="w-full accent-orange-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0.1 Ω (정상)</span>
                <span>접촉 불량 1.0Ω</span>
                <span>단락 적열 10.0Ω</span>
              </div>
            </div>

            {/* Time */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-750 font-mono">
                <span>지속 통전 시간 (t)</span>
                <span className="text-orange-600 font-extrabold">{params.time} 초</span>
              </div>
              <input
                type="range"
                min="5"
                max="1800"
                step="5"
                value={params.time}
                onChange={(e) => setParams({ ...params, time: parseInt(e.target.value) })}
                className="w-full accent-orange-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>5초</span>
                <span>10분 (600초)</span>
                <span>30분 (1,800초)</span>
              </div>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="space-y-2 border-t pt-4 border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-1">실증 대비 원터치 시나리오</span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setScenario(15, 0.1, 120)}
                className="w-full text-left px-3 py-2 border border-slate-200 hover:border-orange-500 rounded-xl text-xs hover:bg-slate-50 font-bold text-slate-600 transition duration-150 cursor-pointer"
              >
                🟢 정상 전열 기기 가부하 (15A, 0.1Ω, 2분)
              </button>
              <button
                onClick={() => setScenario(18, 2.5, 300)}
                className="w-full text-left px-3 py-2 border border-orange-100 bg-orange-50/20 rounded-xl text-xs hover:bg-orange-50 font-bold text-orange-950 transition duration-150 cursor-pointer"
              >
                🟡 접속부 나사 조임 불량 상태 (18A, 2.5Ω, 5분)
              </button>
              <button
                onClick={() => setScenario(35, 6.0, 90)}
                className="w-full text-left px-3 py-2 border border-red-155 bg-red-50/25 rounded-xl text-xs hover:bg-red-50 font-bold text-red-950 transition duration-150 cursor-pointer"
              >
                🔴 아산화동(Cu₂O) 침착 적열 열폭주 (35A, 6.0Ω, 1.5분)
              </button>
            </div>
          </div>
        </div>

        {/* Center: Analytics & visual representation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-5">
          <div className="border-b pb-2 border-slate-100">
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-600" /> 실시간 물리 수치 계측
            </h4>
          </div>

          {result && (
            <div className="flex-1 flex flex-col justify-around gap-4 py-1.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2.5 border-dashed border-slate-100">
                  <span className="text-xs font-bold text-slate-500 leading-none">방출 주울 에너지 (Heat Output)</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {result.heatJoule.toLocaleString()} J
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-2.5 border-dashed border-slate-100">
                  <span className="text-xs font-bold text-slate-500 leading-none">열량 변환 값 (Calories)</span>
                  <span className="font-mono font-black text-slate-850 text-sm">
                    {result.heatCal.toLocaleString()} cal
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-2.5 border-dashed border-slate-100">
                  <span className="text-xs font-bold text-slate-500 leading-none">도체 내부 코어 온도 (estimated)</span>
                  <span className={`font-mono font-extrabold text-lg flex items-center gap-1 ${result.conductorTemp > 300 ? "text-orange-700 animate-pulse" : "text-slate-800"}`}>
                    {result.conductorTemp} °C
                  </span>
                </div>
              </div>

              {/* Progress bar state of charring */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>피복 수지 탄화 생성 및 열분해진척률</span>
                  <span className="text-orange-600 font-extrabold font-mono">{result.charringRatio}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${result.charringRatio}%` }}
                  ></div>
                </div>
              </div>

              {/* Overload status helper */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1 block shadow-inner">
                <span className="text-[9px] font-black text-orange-755 tracking-wider flex items-center gap-0.5 uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-600" /> 피복 수지 외류 붕괴 위험 한계지수
                </span>
                <p className="text-xs font-extrabold text-slate-800">{result.insulationState}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Guidance Analysis Report */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-5">
          <div className="border-b pb-2 flex justify-between items-center border-slate-100">
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" /> AI 교수 정밀 위험 소견
            </h4>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto text-xs text-slate-700 leading-relaxed text-justify shadow-inner custom-scrollbar min-h-[220px]">
            {aiReport ? (
              <div 
                dangerouslySetInnerHTML={{
                  __html: aiReport
                    .replace(/\n/g, "<br>")
                    .replace(/\*\*(.*?)\*\*/g, "<span class='text-orange-600 font-extrabold'>$1</span>")
                }} 
              />
            ) : (
              <div className="text-slate-400 text-center py-12 flex flex-col items-center justify-center h-full">
                <p className="font-bold mb-1.5 text-slate-500">감식 레포트 미출력</p>
                <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto text-slate-400">
                  하단의 'AI 시나리오 소견 도출' 버튼을 탭하면 전공 실증 이론에 입각한 정량적 화재 진단서가 기록됩니다.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={fetchAIReport}
            disabled={loadingAI}
            className="w-full bg-[#0f172a] hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150"
          >
            <Play className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            {loadingAI ? "소견 분석 구성 중..." : "AI 시나리오 소견 도출"}
          </button>
        </div>
      </div>
    </div>
  );
};
