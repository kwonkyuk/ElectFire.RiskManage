/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRESETS = {
  primaryArc: {
    name: "1차 단락흔 (Primary Arc Mark) 고배율 현미경 조직",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='100%' height='100%' fill='%231e293b'/><circle cx='100' cy='75' r='45' fill='%23e2e8f0'/><circle cx='80' cy='65' r='3' fill='%2364748b'/><circle cx='110' cy='85' r='2.5' fill='%2364748b'/><circle cx='95' cy='95' r='3.5' fill='%2364748b'/><text x='10' y='25' fill='%23ef4444' font-family='sans-serif' font-size='10' font-weight='bold'>PRIMARY ARC (1차 단락흔)</text></svg>",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // minimal pixel
    mime: "image/png",
    recommendedPrompt: "1차 단락흔의 금속 조직학적 구슬 단면을 분석해 주십시오. 기포 공공(Void)이 무척 미세하고 조밀한 형상인데, 발화 원인으로 규명할 수 있는지 설명해주십시오."
  },
  secondaryArc: {
    name: "2차 단락흔 (Secondary Arc Mark) 소손 전선 끝단 현미경",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='100%' height='100%' fill='%230f172a'/><circle cx='100' cy='75' r='50' fill='%2378350f' stroke='%23f59e0b' stroke-width='4'/><circle cx='80' cy='75' r='14' fill='%231e293b'/><circle cx='115' cy='65' r='8' fill='%231e293b'/><circle cx='105' cy='100' r='10' fill='%231e293b'/><text x='10' y='25' fill='%23f97316' font-family='sans-serif' font-size='10' font-weight='bold'>SECONDARY ARC (2차 단락흔)</text></svg>",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8BQDwAEmgGAte150QAAAABJRU5ErkJggg==",
    mime: "image/png",
    recommendedPrompt: "화재 열기류 기화 중 발생한 2차 단락흔 단면입니다. 관찰되는 거대한 동공 공동(Cavity)과 우그러진 거친 결정 표면의 전형적인 연소 하 가압 분위기 특징을 분석해주십시오."
  },
  glowingTerminal: {
    name: "아산화동 (Cu₂O) 생성에 따른 분전 패널 접속부 적열",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='100%' height='100%' fill='%231a0505'/><rect x='85' y='50' width='30' height='80' fill='%23451a03'/><circle cx='100' cy='80' r='20' fill='%23ef4444' filter='blur(3px)'/><circle cx='100' cy='80' r='10' fill='%23facc15'/><text x='10' y='25' fill='%23ea580c' font-family='sans-serif' font-size='10' font-weight='bold'>GLOWING CONTACT (아산화동 적열)</text></svg>",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    mime: "image/png",
    recommendedPrompt: "접촉 단자의 체결 불성실로 아산화동(Cu₂O) 반도체 피치막이 발생하여 쇠구슬처럼 빨갛게 달아오르는 적열(Glowing) 현상입니다. 이로 인한 화재 전이 시나리오를 설명해주십시오."
  },
  carbonTracking: {
    name: "콘센트 플러그 극간 수분 트래킹 (Tracking) 탄화 경로",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='100%' height='100%' fill='%230f172a'/><rect x='60' y='50' width='80' height='60' rx='8' fill='%23475569'/><circle cx='85' cy='80' r='8' fill='%2394a3b8'/><circle cx='115' cy='80' r='8' fill='%2394a3b8'/><path d='M85,80 Q100,70 115,80' stroke='%23facc15' stroke-width='4' fill='none' stroke-dasharray='3 3'/><path d='M85,80 Q100,75 115,80' stroke='%23000000' stroke-width='3' fill='none'/><text x='10' y='25' fill='%2338bdf8' font-family='sans-serif' font-size='10' font-weight='bold'>TRACKING PATH (트래킹 탄화)</text></svg>",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8BQDwAEmgGAte150QAAAABJRU5ErkJggg==",
    mime: "image/png",
    recommendedPrompt: "콘센트 전위 극간 사이에 습기와 도전성 이물질이 고착되어 트래킹(Tracking) 탄화전로가 점진 형성되는 사진입니다. 이 탄화 경로가 유도 단락으로 발전하는 기전을 기술하십시오."
  }
};
