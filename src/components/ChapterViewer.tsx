/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Chapter } from "../types";
import { FileText, Download, CheckSquare, Sparkles, BookOpen } from "lucide-react";

// Helper to find symbol descriptions inside each formula dynamically
const getSymbolExplanations = (formula: string): string[] => {
  const result: string[] = [];
  const normalized = formula.replace(/\\\\/g, "\\");
  
  // Custom definitions for matching specific symbols present in textbooks
  if (normalized.includes("Q") || normalized.includes("H")) {
    if (normalized.includes("I") || normalized.includes("R") || normalized.includes("t")) {
      result.push("Q (또는 H): 발열량 [J 또는 cal]");
    } else if (normalized.includes("t") || normalized.includes("I")) {
      result.push("Q: 전하량 [C]");
    }
  }
  if (normalized.includes("I") && !normalized.includes("I_{allow}") && !normalized.includes("I_{lock}") && !normalized.includes("I_{short}") && !normalized.includes("I_{fault}") && !normalized.includes("I_g") && !normalized.includes("I_{phase}") && !normalized.includes("I_{nominal}") && !normalized.includes("I_{leakage}")) {
    result.push("I: 부하 전류 [A]");
  }
  if (normalized.includes("R") && !normalized.includes("R_{E}") && !normalized.includes("R_{Cu_2O}") && !normalized.includes("R_{contact}") && !normalized.includes("R_{insulation}") && !normalized.includes("R_{tester}")) {
    result.push("R: 전기 저항 [Ω]");
  }
  if (normalized.includes("t") && !normalized.includes("t_{arc}")) {
    result.push("t: 통전 시간 [초 또는 분]");
  }
  if (normalized.includes("A") && normalized.includes("B")) {
    result.push("A, B: 반응 물질(가연물 및 산소) | C, D: 최종 생성 물질");
  }
  if (normalized.includes("\\Delta H") || normalized.includes("ΔH")) {
    result.push("ΔH: 반응열 (엔탈피 변화량) [kcal/mol]");
  }
  if (normalized.includes("V") && !normalized.includes("V_{touch}") && !normalized.includes("V_{phase}") && !normalized.includes("V_{ep}") && !normalized.includes("V_{test}") && !normalized.includes("V_{arc}") && !normalized.includes("V(t)")) {
    result.push("V: 인가 전압 [V]");
  }
  if (normalized.includes("P") && !normalized.includes("P_{coil}")) {
    result.push("P: 소비 전력 (순간 일률) [W]");
  }
  if (normalized.includes("W") && !normalized.includes("W = P")) {
    result.push("W: 누적 전력량 [Wh]");
  }
  if (normalized.includes("\\rho") || normalized.includes("ρ")) {
    result.push("ρ (로): 도체의 고유 저항 [Ω·m]");
  }
  if (normalized.includes("l") && !normalized.includes("l_{collapsed}") && !normalized.includes("l_{nominal}") && !normalized.includes("Z_{loop}") && !normalized.includes("allow")) {
    result.push("l: 전선 도체의 길이 [m]");
  }
  if (normalized.includes("A") && (normalized.includes("\\rho") || normalized.includes("ρ"))) {
    result.push("A: 도체의 단면적 [㎡]");
  }
  if (normalized.includes("R_{E}") || normalized.includes("R_E") || normalized.includes("R_{e}")) {
    result.push("R_E: 설비 접지 저항 값 [Ω]");
  }
  if (normalized.includes("V_{touch}")) {
    result.push("V_touch: 인체 안전 허용 한계 접촉전압 [V]");
  }
  if (normalized.includes("I_{fault}") || normalized.includes("I_{g}") || normalized.includes("I_g")) {
    result.push("I_g (또는 I_fault): 대지 지락 고장전류 [A]");
  }
  if (normalized.includes("V_{phase}")) {
    result.push("V_phase: 선로 대지 상전압 [V]");
  }
  if (normalized.includes("Z_{loop}")) {
    result.push("Z_loop: 지락 고장 전류 폐회로 루프 임피던스 [Ω]");
  }
  if (normalized.includes("I_{short}")) {
    result.push("I_short: 전극 단락 대전류 [A]");
  }
  if (normalized.includes("Z_{line}")) {
    result.push("Z_line: 선로 임피던스 [Ω]");
  }
  if (normalized.includes("Q_{arc}")) {
    result.push("Q_arc: 아크 순간 전체 방열 에너지 [J]");
  }
  if (normalized.includes("V_{arc}")) {
    result.push("V_arc: 기화 전극 아크 강하 전압 [V]");
  }
  if (normalized.includes("t_{arc}")) {
    result.push("t_arc: 고온 아크 방전 지속 시간 [초]");
  }
  if (normalized.includes("R_{contact}")) {
    result.push("R_contact: 전선 완화·이완 접속부 접촉저항 [Ω]");
  }
  if (normalized.includes("R_{Cu_2O}") || normalized.includes("Cu_2O")) {
    result.push("R_Cu2O: 접촉 단면적 수축 시 구리가 공기와 반응해 늘어난 아산화동 반도체의 고유저항 [Ω]");
  }
  if (normalized.includes("T") && (normalized.includes("R_{Cu_2O}") || normalized.includes("R_Cu_2O"))) {
    result.push("T: 절대 온도 [K] | B: NTC 활성화 열적 상수");
  }
  if (normalized.includes("Q") && normalized.includes("C") && normalized.includes("V")) {
    result.push("Q: 대전 정전하량 [C] | C: 커패시턴스 (정전용량) [F] | V: 대전 전위 전압 [V]");
  }
  if (normalized.includes("E_{spark}")) {
    result.push("E_spark: 정전기 방전 불꽃 점화 방전에너지 [J]");
  }
  if (normalized.includes("MIE")) {
    result.push("MIE: 가연성 분위기 최소 가스 착화에너지 [J]");
  }
  if (normalized.includes("I_{lock}")) {
    result.push("I_lock: 전동기 회전 로터 구속 대기 대전류 [A]");
  }
  if (normalized.includes("Z_{stop}")) {
    result.push("Z_stop: 로터 정지/구속 상황 고장 권선의 임피던스 [Ω]");
  }
  if (normalized.includes("I_{rated}")) {
    result.push("I_rated: 전동기 가동 평시 정격 전류 [A]");
  }
  if (normalized.includes("I_{phase}")) {
    result.push("I_phase: 3상 결상 운전 중 영구 운전 잔여 단선 상 전류 [A]");
  }
  if (normalized.includes("I_{nominal}")) {
    result.push("I_nominal: 평시 안정 공칭 부하 전류 [A]");
  }
  if (normalized.includes("\\theta_{V}")) {
    result.push("θ_V: 벽면 탄화 흔적 V자 패턴의 융진 확산 각도 [°] | Q_source: 발열원 연소 열방출률 [kW]");
  }
  if (normalized.includes("q''")) {
    result.push("q\"_net: 가연물 순수 수열 속도 [kW/㎡] | q\"_external: 화재 점화 외부 복사용 복사열속 | q\"_critical: 인하 유도가 시작되는 한계 열속");
  }
  if (normalized.includes("I_{allow}")) {
    result.push("I_allow: 케이블 주변 안전 보정 허용전류 [A] | I_0: 상온 단독 부설 기준 공칭전류 | F_temp: 주변 온도 보정 계수 | F_group: 다발 밀집 포설 감소 계수");
  }
  if (normalized.includes("V_{clamping}")) {
    result.push("V_clamping: 서지 보호기 억제 과도전압 | V_ref: 기준 작동 방호 전압 | I_surge: 유입 뇌격 임팩트 서지 전류");
  }
  if (normalized.includes("V(t)") && normalized.includes("e^{-\\frac{t}{R \\cdot C}}")) {
    result.push("V(t): 방전 중 과류 잔류 전압 [V] | V_0: 인가 충전 초기 충전합선 전압 | R·C (τ): 전하 방전 시정수 (소요 시간)");
  }
  if (normalized.includes("I_{displacement}") || normalized.includes("C_o")) {
    result.push("I_displacement: 정전 결합을 관통하는 고주파 변위 전류 [A] | f: 교류 시변 주파수 [Hz] | C_o: 검저 센서와 활선 도체 간 시변 정전용량 [F] | V_line: 활선 인하 대지 교류 전압 [V]");
  }
  if (normalized.includes("R_{tester}")) {
    result.push("R_tester: 회로 시험기 내부 총 선간 저항 [Ω]");
  }

  return result;
};

// Standard mathematical character and equation typeset parser
interface ASTNode {
  type: "text" | "frac" | "sup" | "sub" | "sqrt";
  content?: ASTNode[];
  numerator?: ASTNode[];
  denominator?: ASTNode[];
  text?: string;
}

const findMatchingBrace = (str: string, openIndex: number): number => {
  let braceCount = 1;
  for (let j = openIndex + 1; j < str.length; j++) {
    if (str[j] === "{") braceCount++;
    else if (str[j] === "}") braceCount--;
    if (braceCount === 0) {
      return j;
    }
  }
  return -1;
};

const parseToAST = (str: string): ASTNode[] => {
  const nodes: ASTNode[] = [];
  let i = 0;

  while (i < str.length) {
    // 1. \text{...} 감지 - 내부 콘텐츠는 수식 파싱을 완전히 스킵하여 평문 보장
    if (str.startsWith("\\text{", i)) {
      const open = i + 5;
      const close = findMatchingBrace(str, open);
      if (close !== -1) {
        let textVal = str.substring(open + 1, close);
        textVal = textVal.replace(/\\_/g, "_"); // 이스케이프 제거
        nodes.push({ type: "text", text: textVal });
        i = close + 1;
        continue;
      }
    }

    // 2. 개별 이스케이프 기호 \% 나 \_ 처리
    if (str.startsWith("\\%", i)) {
      nodes.push({ type: "text", text: "%" });
      i += 2;
      continue;
    }
    if (str.startsWith("\\_", i)) {
      nodes.push({ type: "text", text: "_" });
      i += 2;
      continue;
    }

    // 3. \frac{num}{denom} 분수 복수 탐색
    if (str.startsWith("\\frac", i)) {
      const open1 = str.indexOf("{", i + 5);
      if (open1 !== -1) {
        const close1 = findMatchingBrace(str, open1);
        if (close1 !== -1) {
          let open2 = -1;
          for (let j = close1 + 1; j < str.length; j++) {
            if (str[j] === "{") {
              open2 = j;
              break;
            } else if (str[j].trim() === "") {
              continue;
            } else {
              break;
            }
          }
          if (open2 !== -1) {
            const close2 = findMatchingBrace(str, open2);
            if (close2 !== -1) {
              const numStr = str.substring(open1 + 1, close1);
              const denomStr = str.substring(open2 + 1, close2);
              nodes.push({
                type: "frac",
                numerator: parseToAST(numStr),
                denominator: parseToAST(denomStr)
              });
              i = close2 + 1;
              continue;
            }
          }
        }
      }
    }

    // 4. \sqrt{...} 처리 (루트 기호용)
    if (str.startsWith("\\sqrt{", i)) {
      const open = i + 5;
      const close = findMatchingBrace(str, open);
      if (close !== -1) {
        const inside = str.substring(open + 1, close);
        nodes.push({
          type: "sqrt",
          content: parseToAST(inside)
        });
        i = close + 1;
        continue;
      }
    }

    // 5. \dot{...} 처리 (위첨자 점 기호 등)
    if (str.startsWith("\\dot{", i)) {
      const open = i + 4;
      const close = findMatchingBrace(str, open);
      if (close !== -1) {
        const inside = str.substring(open + 1, close);
        nodes.push({
          type: "text",
          text: inside + "\u0307"
        });
        i = close + 1;
        continue;
      }
    }

    // 6. 위첨자 ^ 기호 처리
    if (str[i] === "^") {
      i++;
      if (str[i] === "{") {
        const close = findMatchingBrace(str, i);
        if (close !== -1) {
          const contentStr = str.substring(i + 1, close);
          nodes.push({
            type: "sup",
            content: parseToAST(contentStr)
          });
          i = close + 1;
          continue;
        }
      } else {
        let endIdx = i;
        if (str[i] === "\\") {
          endIdx++;
          while (endIdx < str.length && /[a-zA-Z]/.test(str[endIdx])) {
            endIdx++;
          }
        } else {
          while (endIdx < str.length && /[a-zA-Z0-9]/.test(str[endIdx])) {
            endIdx++;
          }
        }
        if (endIdx === i) {
          endIdx = i + 1;
        }
        const token = str.substring(i, endIdx);
        nodes.push({
          type: "sup",
          content: parseToAST(token)
        });
        i = endIdx;
        continue;
      }
    }

    // 7. 아래첨자 _ 기호 처리
    if (str[i] === "_") {
      i++;
      if (str[i] === "{") {
        const close = findMatchingBrace(str, i);
        if (close !== -1) {
          const contentStr = str.substring(i + 1, close);
          nodes.push({
            type: "sub",
            content: parseToAST(contentStr)
          });
          i = close + 1;
          continue;
        }
      } else {
        let endIdx = i;
        if (str[i] === "\\") {
          endIdx++;
          while (endIdx < str.length && /[a-zA-Z]/.test(str[endIdx])) {
            endIdx++;
          }
        } else {
          while (endIdx < str.length && /[a-zA-Z0-9]/.test(str[endIdx])) {
            endIdx++;
          }
        }
        if (endIdx === i) {
          endIdx = i + 1;
        }
        const token = str.substring(i, endIdx);
        nodes.push({
          type: "sub",
          content: parseToAST(token)
        });
        i = endIdx;
        continue;
      }
    }

    // 일반 텍스트 구간 분리 수용
    let nextSpecial = -1;
    for (let j = i; j < str.length; j++) {
      if (
        str.startsWith("\\text{", j) ||
        str.startsWith("\\%", j) ||
        str.startsWith("\\_", j) ||
        str.startsWith("\\frac", j) ||
        str.startsWith("\\sqrt{", j) ||
        str.startsWith("\\dot{", j) ||
        str[j] === "^" ||
        str[j] === "_"
      ) {
        nextSpecial = j;
        break;
      }
    }
    const end = nextSpecial !== -1 ? nextSpecial : str.length;
    const textChunk = str.substring(i, end);
    if (textChunk) {
      nodes.push({ type: "text", text: textChunk });
    }
    i = end;
  }

  return nodes;
};

const renderTextNode = (text: string, key: any): React.ReactNode => {
  const cleaned = text
    .replace(/\\left\(/g, "(")
    .replace(/\\right\)/g, ")")
    .replace(/\\left\[/g, "[")
    .replace(/\\right\]/g, "]")
    .replace(/\\log/g, "log")
    .replace(/\\int/g, "∫ ")
    .replace(/\\cdot/g, " · ")
    .replace(/\\times/g, " × ")
    .replace(/\\approx/g, " ≈ ")
    .replace(/\\ge/g, " ≥ ")
    .replace(/\\le/g, " ≤ ")
    .replace(/\\gg/g, " ≫ ")
    .replace(/\\propto/g, " ∝ ")
    .replace(/\\rightarrow/g, " → ")
    .replace(/\\implies/g, " ⇒ ")
    .replace(/\\downarrow/g, " ↓ ")
    .replace(/\\uparrow/g, " ↑ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/\\infty/g, "∞")
    .replace(/\\partial/g, "∂")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\delta/g, "δ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\eta/g, "η")
    .replace(/\\tau/g, "τ")
    .replace(/\\phi/g, "φ")
    .replace(/\\sim/g, " ~ ")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\Sigma/g, "Σ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\Phi/g, "Φ")
    .replace(/\\Omega/g, "Ω")
    .replace(/\\mu/g, "μ")
    .replace(/\\rho/g, "ρ")
    .replace(/\\epsilon/g, "ε")
    .replace(/\\omega/g, "ω")
    .replace(/\\theta/g, "θ")
    .replace(/\\pi/g, "π")
    .replace(/\\vec/g, "")
    .replace(/\\text/g, "")
    .replace(/\s*\*/g, " · ");
  
  const parts = cleaned.split(/(\s+|=|\+|-|·|×|≈|≥|≤|≫|∝|→|⇒|↓|↑|≠|Δ|Σ|σ|Φ|Ω|μ|ρ|ε|ω|θ|π|∞|∂|α|β|γ|δ|λ|η|τ|φ|∫|~|\(|\)|\[|\]|j)/g);
  
  const chunkNode = parts.map((pt, pIdx) => {
    if (!pt) return null;
    const isOperator = pt.match(/(=|\+|-|·|×|≈|≥|≤|≫|∝|→|⇒|↓|↑|≠|Δ|Σ|σ|Φ|Ω|μ|ρ|ε|ω|θ|π|∞|∂|α|β|γ|δ|λ|η|τ|φ|∫|~|\(|\)|\[|\]|j)/);
    const isNumber = pt.match(/^\d+$/);
    const isWhitespace = pt.trim() === "";
    
    if (isOperator || isNumber || isWhitespace) {
      return (
        <span key={pIdx} className="text-slate-900 font-extrabold font-sans">
          {pt}
        </span>
      );
    }
    
    return (
      <span key={pIdx} className="font-sans not-italic text-slate-950 font-black mx-0.5 tracking-tight select-all">
        {pt}
      </span>
    );
  });

  return <span key={`text-${key}`}>{chunkNode}</span>;
};

const renderAST = (nodes: ASTNode[]): React.ReactNode => {
  return (
    <>
      {nodes.map((node, idx) => {
        if (node.type === "text" && node.text) {
          return renderTextNode(node.text, idx);
        } else if (node.type === "frac") {
          return (
            <span key={`frac-${idx}`} className="inline-flex items-center gap-1 flex-wrap justify-center font-sans font-extrabold text-slate-950 align-middle">
              <span className="inline-flex flex-col items-center justify-center mx-1 font-sans align-middle font-extrabold">
                <span className="border-b-2 border-slate-300 px-1.5 pb-0.5 text-center leading-none text-slate-950 font-extrabold not-italic">
                  {renderAST(node.numerator || [])}
                </span>
                <span className="pt-0.5 text-center leading-none text-slate-950 font-extrabold not-italic font-sans">
                  {renderAST(node.denominator || [])}
                </span>
              </span>
            </span>
          );
        } else if (node.type === "sup") {
          return (
            <sup key={`sup-${idx}`} className="text-[11px] text-orange-600 font-extrabold ml-0.5 select-all font-sans align-super">
              {renderAST(node.content || [])}
            </sup>
          );
        } else if (node.type === "sub") {
          return (
            <sub key={`sub-${idx}`} className="text-[11px] text-slate-500 font-bold ml-0.5 select-all font-sans align-sub">
              {renderAST(node.content || [])}
            </sub>
          );
        } else if (node.type === "sqrt") {
          return (
            <span key={`sqrt-${idx}`} className="inline-flex items-center align-middle font-sans">
              <span className="text-slate-950 font-extrabold text-base md:text-lg mr-0.5 select-all">√</span>
              <span className="border-t-2 border-slate-900 pt-0.5 px-0.5 leading-none font-extrabold text-slate-950 not-italic align-middle">
                {renderAST(node.content || [])}
              </span>
            </span>
          );
        }
        return null;
      })}
    </>
  );
};

const parseMathFormula = (str: string): React.ReactNode => {
  const ast = parseToAST(str);
  return renderAST(ast);
};

export const TextbookFormula: React.FC<{ formula: string }> = ({ formula }) => {
  const cleaned = formula.replace(/\\\\/g, "\\");
  
  let equationText = cleaned;
  let explanationText = "";
  
  if (cleaned.includes("\\quad")) {
    const parts = cleaned.split("\\quad");
    equationText = parts[0];
    explanationText = parts.slice(1).join(" ").trim();
  } else if (cleaned.includes("  ")) {
    const parts = cleaned.split("  ");
    equationText = parts[0];
    explanationText = parts.slice(1).join(" ").trim();
  }
  
  let parsedExplanation = explanationText
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\text/g, "")
    .trim();

  if (!parsedExplanation) {
    const unitMatch = equationText.match(/\[([^\]]+)\]$/);
    if (unitMatch) {
      parsedExplanation = `[${unitMatch[1]}]`;
      equationText = equationText.substring(0, equationText.length - unitMatch[0].length).trim();
    }
  }

  const cleanLabelSymbols = (text: string) => {
    return text
      .replace(/\\Omega/g, "Ω")
      .replace(/\\Sigma/g, "Σ")
      .replace(/\\sigma/g, "σ")
      .replace(/\\mu/g, "μ")
      .replace(/\\rho/g, "ρ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\omega/g, "ω")
      .replace(/\\theta/g, "θ")
      .replace(/\\pi/g, "π")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\int/g, "∫")
      .replace(/\\log/g, "log")
      .replace(/\\downarrow/g, "↓")
      .replace(/\\uparrow/g, "↑")
      .replace(/\\cdot/g, "·")
      .replace(/\\approx/g, "≈")
      .replace(/\\ge/g, "≥")
      .replace(/\\le/g, "≤")
      .replace(/\\neq/g, "≠")
      .trim();
  };

  const displayExplanation = parsedExplanation ? cleanLabelSymbols(parsedExplanation) : "";
  const explanations = getSymbolExplanations(cleaned);

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-white via-slate-50/50 to-orange-50/10 border-2 border-slate-200 hover:border-orange-300 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Centered Formula Row */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <div className="text-sm sm:text-base md:text-lg font-extrabold tracking-normal flex items-center justify-center gap-1.5 flex-wrap text-slate-950 font-sans">
          {parseMathFormula(equationText)}
        </div>
        
        {displayExplanation && (
          <span className="shrink-0 inline-flex items-center justify-center bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-1 text-[11px] font-black text-orange-950 shadow-sm leading-none select-all transition-transform hover:scale-105">
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-orange-600 select-none shrink-0" />
            <span className="font-sans leading-none">{displayExplanation}</span>
          </span>
        )}
      </div>

      {/* Dynamic Key Symbol Explanations */}
      {explanations.length > 0 && (
        <div className="w-full border-t border-slate-100 pt-3.5 mt-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {explanations.map((exp, expIdx) => (
              <span 
                key={expIdx} 
                className="inline-flex items-center gap-1.5 bg-slate-100/80 hover:bg-orange-50 hover:text-orange-950 text-[11px] font-bold text-slate-600 px-3 py-1 rounded-full transition-colors duration-150 shadow-sm"
              >
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span className="font-sans leading-none">{exp}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const renderStyledContent = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split by $$ first for potential block/double math symbols
  const doubleParts = text.split("$$");
  const parsedNodes: React.ReactNode[] = [];

  doubleParts.forEach((dPart, dIdx) => {
    if (dIdx % 2 === 1) {
      parsedNodes.push(
        <span 
          key={`disp-${dIdx}`} 
          className="inline-flex items-center mx-1 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 hover:border-orange-300 px-1.5 py-0.5 rounded-lg text-slate-950 font-extrabold tracking-tight font-sans shadow-sm select-all transition-colors duration-150"
        >
          {parseMathFormula(dPart)}
        </span>
      );
    } else {
      // Split by $ for inline math symbols
      const singleParts = dPart.split("$");
      singleParts.forEach((sPart, sIdx) => {
        if (sIdx % 2 === 1) {
          parsedNodes.push(
            <span 
              key={`math-${dIdx}-${sIdx}`} 
              className="inline-flex items-center mx-1 bg-gradient-to-r from-orange-50/50 to-orange-100/30 border border-orange-200/60 hover:border-orange-300/80 px-1.5 py-0.5 rounded-lg text-slate-950 font-extrabold tracking-tight font-sans shadow-sm select-all transition-colors duration-150"
            >
              {parseMathFormula(sPart)}
            </span>
          );
        } else {
          // Regular text and bold markdown/HTML symbols
          const boldParts = sPart.split("**");
          boldParts.forEach((bPart, bIdx) => {
            if (bIdx % 2 === 1) {
              parsedNodes.push(
                <strong key={`bold-${dIdx}-${sIdx}-${bIdx}`} className="font-extrabold text-orange-950">
                  {bPart}
                </strong>
              );
            } else {
              // Parse simple <strong> element if present in some database content strings
              const htmlStrongParts = bPart.split(/<\/?strong>/g);
              htmlStrongParts.forEach((piece, pIdx) => {
                if (pIdx % 2 === 1) {
                  parsedNodes.push(
                    <strong key={`strong-${dIdx}-${sIdx}-${bIdx}-${pIdx}`} className="font-extrabold text-rose-955">
                      {piece}
                    </strong>
                  );
                } else {
                  parsedNodes.push(piece);
                }
              });
            }
          });
        }
      });
    }
  });

  return <>{parsedNodes}</>;
};

interface Props {
  chapter: Chapter;
  onNavigateToQuiz: () => void;
}

export const ChapterViewer: React.FC<Props> = ({ chapter, onNavigateToQuiz }) => {
  const [aiSummary, setAiSummary] = useState<string[] | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Generate dynamic AI teaching summary
  const handleGenerateSummary = async () => {
    if (loadingSummary) return;
    setLoadingSummary(true);
    try {
      const summaryContext = chapter.sections.map(s => `${s.title}: ${s.content}`).join("\n");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `현재 학습중인 '${chapter.topic}' 교안 자료의 핵심 개념 3가지를 화재 공학 및 산업안전 시험 출제 빈도가 높은 핵심 요점 위주로 요약하고 번호를 매겨서 설명해 주라.`
            }
          ],
          contextTopic: chapter.topic
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error);
      }

      const data = await response.json();
      if (data.text) {
        // Split by lines and filter out empty / clean up
        const lines = data.text
          .split("\n")
          .map((l: string) => l.trim())
          .filter((l: string) => l.length > 3);
        setAiSummary(lines);
      }
    } catch (e: any) {
      console.error(e);
      const fallbackMsg = "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!";
      setAiSummary([e.message || fallbackMsg]);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Plain Text/Word format exporter
  const downloadDoc = () => {
    const title = `${chapter.id}단원_${chapter.topic}`;
    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; }
          h1 { color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 8px; }
          h2 { color: #1e293b; margin-top: 24px; border-left: 4px solid #ef4444; padding-left: 8px; }
          p { text-align: justify; margin-bottom: 12px; }
          .formula { font-family: 'Courier New', monospace; background-color: #f1f5f9; padding: 8px; border-radius: 4px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background-color: #fef2f2; color: #991b1b; border: 1px solid #cbd5e1; padding: 8px; }
          td { border: 1px solid #cbd5e1; padding: 8px; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>${chapter.id}단원: ${chapter.topic}</h1>
        <p><strong>과목명:</strong> 전기화재 위험관리 (동원과학기술대학교 산업안전관리과)</p>
        <p><strong>단원 목표:</strong> ${chapter.description}</p>
    `;

    chapter.sections.forEach((sec) => {
      htmlContent += `<h2>${sec.title}</h2>`;
      htmlContent += `<p>${sec.content}</p>`;
      if (sec.formulas && sec.formulas.length > 0) {
        htmlContent += `<p><strong>주요 공식:</strong></p>`;
        sec.formulas.forEach((form) => {
          htmlContent += `<div class="formula">${form}</div>`;
        });
      }
      if (sec.tables) {
        htmlContent += `<table><thead><tr>`;
        sec.tables.headers.forEach((h) => {
          htmlContent += `<th>${h}</th>`;
        });
        htmlContent += `</tr></thead><tbody>`;
        sec.tables.rows.forEach((row) => {
          htmlContent += `<tr>`;
          row.forEach((cell) => {
            htmlContent += `<td>${cell}</td>`;
          });
          htmlContent += `</tr>`;
        });
        htmlContent += `</tbody></table>`;
      }
    });

    htmlContent += `
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* Chapter Cover */}
      <div 
        id={`chapter-cover-${chapter.id}`}
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden print:border-none print:shadow-none"
      >
        <div className="absolute top-0 left-0 w-2.5 h-full bg-orange-600"></div>
        <div className="space-y-2 max-w-2xl pl-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
            {chapter.title}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {chapter.topic}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify pt-1">
            {chapter.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            onClick={downloadDoc}
            className="px-4 py-2.5 text-xs font-bold text-slate-705 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            Word 다운로드
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-orange-500/10 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            인쇄 / PDF 저장
          </button>
        </div>
      </div>

      {/* Chapters Core Sections */}
      <div className="space-y-8">
        {chapter.sections.map((section, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 break-inside-avoid print:border-none print:shadow-none"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 w-2 h-6 bg-orange-600 rounded"></div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {section.title}
              </h3>
            </div>

            <div className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify space-y-4">
              <p>{renderStyledContent(section.content)}</p>
            </div>

            {/* Render equations or formulas if specified */}
            {section.formulas && section.formulas.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> 주요 물리 공식 / 가용 관계식
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {section.formulas.map((formula, fIdx) => (
                    <TextbookFormula key={fIdx} formula={formula} />
                  ))}
                </div>
              </div>
            )}

            {/* Render tables if specified */}
            {section.tables && (
              <div className="overflow-hidden border border-slate-200 rounded-xl shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-orange-50/70 text-orange-950 border-b border-slate-200">
                      {section.tables.headers.map((hdr, hIdx) => (
                        <th key={hIdx} className="px-4 py-3.5 font-bold text-center border-r last:border-r-0 border-slate-200">
                          {hdr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {section.tables.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 border-r last:border-r-0 border-slate-200 font-medium text-slate-600 text-center">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Lecture Summary Board */}
      <div className="bg-gradient-to-br from-orange-50/40 to-white border border-orange-100/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 break-inside-avoid print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 text-white p-2 rounded-xl shadow">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">AI 교수 요점정리 서비스</h4>
              <p className="text-xs text-slate-500">본 단원의 핵심 출제 포인트를 AI 교수가 선별 분석합니다.</p>
            </div>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
            className="sm:self-center px-5 py-2.5 text-xs font-black text-white bg-orange-600 hover:bg-orange-700 disabled:bg-slate-450 rounded-xl shadow-lg shadow-orange-600/10 hover:shadow-orange-650/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingSummary ? "요약 구성 중..." : "핵심 3대 포인트 요약"}
          </button>
        </div>

        {aiSummary && (
          <div className="bg-white border border-orange-100/60 rounded-xl p-5 space-y-3.5 shadow-inner transition-all duration-300">
            <h5 className="font-bold text-orange-850 text-xs sm:text-sm flex items-center gap-1">📍 Professor YUKWON의 강의 핵심</h5>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 text-justify font-medium">
              {aiSummary.map((sum, sumIdx) => (
                <li key={sumIdx} className="flex gap-2.5 pb-2.5 last:pb-0 border-b last:border-b-0 border-slate-100">
                  <span className="text-orange-500 font-extrabold pt-0.5">•</span>
                  <span className="leading-relaxed hover:text-slate-900">{sum}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 shadow-sm print:hidden">
        <p className="text-xs font-medium text-slate-500">본 단원 내용을 모두 학습하셨나요?</p>
        <button
          onClick={onNavigateToQuiz}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
        >
          <CheckSquare className="w-4 h-4 text-orange-500" />
          실전 자가 평가 풀기
        </button>
      </div>
    </div>
  );
};
