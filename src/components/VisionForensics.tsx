/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Camera, Image, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import { PRESETS } from "./forensic_presets";

export const VisionForensics: React.FC = () => {
  const [fileData, setFileData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [analysisPrompt, setAnalysisPrompt] = useState("용융단면 조직을 정밀 판독하여 1차 단락흔(원인) 또는 2차 단락흔(결과)인지 소거법 소견을 내주세요.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Handle uploaded image
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const urlPart = e.target?.result as string;
        const commaIdx = urlPart.indexOf(",");
        setMimeType(urlPart.substring(5, commaIdx).split(";")[0]);
        setFileData(urlPart.substring(commaIdx + 1));
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select preloaded forensic sample preset
  const selectPreset = (presetKey: keyof typeof PRESETS) => {
    const data = PRESETS[presetKey];
    setFileName(data.name);
    setPreviewUrl(data.url);
    setFileData(data.base64);
    setMimeType(data.mime);
    setAnalysisPrompt(data.recommendedPrompt);
    setResult(null);
  };

  // Run Gemini analysis via secure proxy
  const handleAnalyze = async () => {
    if (!fileData || !mimeType || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/vision-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: fileData,
          mimeType: mimeType,
          description: analysisPrompt
        })
      });

      const data = await response.json();
      if (data.analysis) {
        setResult(data.analysis);
      } else {
        throw new Error(data.error || "분석 실패");
      }
    } catch (e: any) {
      console.error(e);
      setResult(`포렌식 진단 분석 중 오류가 발생했습니다: ${e.message || "연결 유실"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFileData(null);
    setMimeType(null);
    setFileName("");
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="bg-[#0f172a] text-slate-350 border border-slate-700/80 p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-950/25 via-slate-900 to-slate-900 pointer-events-none"></div>
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange-400 bg-[#1e293b] border border-slate-700 px-3 py-1 rounded-full inline-block">
          FORENSIC METALLURGICAL ANALYSER
        </span>
        <h3 className="text-xl sm:text-2xl font-serif italic text-white mt-2.5 flex items-center gap-2">
          <Camera className="w-5 h-5 text-orange-400" />
          AI 전기화재 포렌식 비전(Vision) 분석 전정감식 시스템
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl text-justify">
          현장에서 보존 채취된 금속 구선, 용융흔, 탄화 단자부, 혹은 아산화동(Cu₂O) 증적 광학 매개 이미지를 분석하여 화재 기인성(1차 vs 2차 단락흔) 감정을 고도 포착해 냅니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Upload & Presets Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b pb-2 flex justify-between items-center border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                <Image className="w-4 h-4 text-orange-600" /> 감정 증거물 입고
              </h4>
              {previewUrl && (
                <button onClick={handleClear} className="text-[10px] font-bold text-orange-655 hover:underline cursor-pointer">
                  다시 입고
                </button>
              )}
            </div>

            {/* Upload Area */}
            {!previewUrl ? (
              <div className="border-2 border-dashed border-slate-205 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition relative min-h-[160px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-750">증적 사진 투입하기</span>
                <span className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                  현장 고화배율 광학 확대경 조직 사진 (PNG, JPG) 기계 연동
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-955 relative">
                  <img src={previewUrl} alt="Forensic Preview" className="w-full h-full object-contain" />
                </div>
                <div className="text-[11px] text-slate-500 truncate text-center font-bold">
                  {fileName}
                </div>
              </div>
            )}

            {/* Presets Grid */}
            <div className="space-y-2 border-t pt-4 border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-1">실습용 고배율 감정 프리셋</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => selectPreset("primaryArc")}
                  className="px-2.5 py-2 border border-slate-200 rounded-xl text-center text-[11px] font-bold hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  🔬 1차 단락흔 (기포수렴)
                </button>
                <button
                  onClick={() => selectPreset("secondaryArc")}
                  className="px-2.5 py-2 border border-slate-200 rounded-xl text-center text-[11px] font-bold hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  🔬 2차 단락흔 (거친해면)
                </button>
                <button
                  onClick={() => selectPreset("glowingTerminal")}
                  className="px-2.5 py-2 border border-slate-200 rounded-xl text-center text-[11px] font-bold hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  🔥 아산화동 적열 부재
                </button>
                <button
                  onClick={() => selectPreset("carbonTracking")}
                  className="px-2.5 py-2 border border-slate-200 rounded-xl text-center text-[11px] font-bold hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  ⚡ 트래킹 법정 탄화
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Side: Forensic Intent Settings Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="border-b pb-2 border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                📍 감정 심문 기준 명세
              </h4>
            </div>

            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-600 block">AI 판독 세부 지시 명령: </label>
              <textarea
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
                disabled={loading}
                className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-orange-500 outline-none resize-none shadow-inner min-h-[140px]"
                placeholder="조직의 경계면 상태 및 공공 형태 분석 요청 등을 기술하시오..."
              />
            </div>

            <div className="bg-slate-50 border border-slate-205 rounded-xl p-3.5 space-y-1 block max-h-[140px] overflow-y-auto">
              <span className="text-[9px] font-black text-orange-755 tracking-wider flex items-center gap-0.5 uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-600" /> 금속 기하학적 감정 법정 한계
              </span>
              <p className="text-[10.5px] text-slate-500 leading-normal text-justify font-medium">
                AI 모의 감식 소견 교차 평가는 광학 수상을 기초로 하여 추정 보조하는 수단입니다. 형사 책임 등 완벽한 공학 증명력 확보를 위해서는 질산 에칭 및 전자주사현미경(SEM) 공동 기포 분석이 요구됩니다.
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!fileData || loading}
            className="w-full bg-[#0f172a] hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold text-xs py-3.5 rounded-xl transition duration-150 shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                <span>금속 고용체 결정 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>AI 포렌식 분석 의뢰</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Deep AI Forensic Report Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
          <div className="border-b pb-2 border-slate-100">
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              📜 감식 판단 서록 (Forensic Certificate)
            </h4>
          </div>

          <div className="flex-1 bg-slate-905 border border-slate-800 text-slate-200 rounded-xl p-4 overflow-y-auto font-mono text-xs leading-relaxed text-justify shadow-inner h-[290px] min-h-[290px]">
            {result ? (
              <div 
                dangerouslySetInnerHTML={{
                  __html: result
                    .replace(/\n/g, "<br>")
                    .replace(/\*\*(.*?)\*\*/g, "<span class='text-orange-400 font-extrabold'>$1</span>")
                }} 
              />
            ) : (
              <div className="text-slate-500 text-center py-20 flex flex-col items-center justify-center h-full">
                <p className="font-black tracking-wider text-slate-400">=== AI FORENSICS ARCHIVE ===</p>
                <p className="mt-2 text-[10px] text-slate-500 max-w-[180px] mx-auto leading-relaxed">
                  금속 단면 증적 사진을 투입 후 분석 의뢰를 요청하십시오.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
