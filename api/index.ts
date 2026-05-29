import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Set up JSON parsers with high limit for image base64 throughput
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google Gen AI to prevent start-up crash if env is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Robust Exponential Backoff retry helper
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      
      const errorMessage = String(error.message || "").toLowerCase();
      const errorStatus = error.status ? Number(error.status) : 0;
      
      const isRetryable =
        errorStatus === 503 ||
        errorStatus === 429 ||
        errorStatus >= 500 ||
        errorMessage.includes("503") ||
        errorMessage.includes("429") ||
        errorMessage.includes("unavailable") ||
        errorMessage.includes("demand") ||
        errorMessage.includes("limit") ||
        errorMessage.includes("exhausted") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("temporary") ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("fetch");

      if (!isRetryable) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
      console.warn(`[Gemini API] Request failed (Attempt ${attempt}). Retrying in ${Math.round(delay)}ms... Error: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Maximum retry attempts exceeded.");
}

// 2. Professor YUKWON AI Chatbot proxy
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contextTopic } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getAI();
    
    // Build context system instruction
    const systemInstruction = `너는 동원과학기술대학교 산업안전관리과의 '전기화재 위험관리' 전공 주임교수이자, 30년 현장 경력 of 화재 감식학 권위자 'YUKWON' 교수이다. 
학생의 질문에 대해 한결같고 친근하며 위엄 있는 대학교수 어조로 답변하라. 존댓말을 사용하고, 전기공학 및 연소기학 이론을 명시하고 정량적(Joule의 법칙 등)으로 설명하라. 
지락전류, 아산화동(Cu₂O) 증식에 의한 적열폭주, 비접촉식 검전기의 전자기적 결합, 1차 및 2차 단락흔의 야금학적 내부 기포공공 차이 등의 전공 지식을 자연스럽게 인용하라.
${contextTopic ? `현재 학생은 다음 주차 내용을 심화 학습하고 있으니 참고하여 답하라: ${contextTopic}` : ""}`;

    // Format chat contents
    const promptParts = msgHistoryToPrompt(messages, systemInstruction);

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptParts,
      })
    );

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat Proxy Error:", error);
    res.status(503).json({ error: "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!" });
  }
});

// 3. AI Custom Practice Quiz Generator
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required to generate quiz." });
    }

    const ai = getAI();

    const prompt = `전기화재 위험관리 과목의 다음 내용에 관련한 대학 시험 및 소방설비/산업안전기사 필기 수준의 고급 4지선다형 객관식 문제 1개를 생성하라.
각 항목(보지)은 반드시 원문자 '①, ②, ③, ④'를 접두사로 사용하라.

주제 범위: ${topic}

JSON Schema 형식에 맞추어 다음 구조로만 정확하게 응답하라. 다른 부가 설명 텍스트는 절대 허용하지 않는다.`;

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["question", "options", "correctAnswerIndex", "explanation"],
            properties: {
              question: {
                type: Type.STRING,
                description: "문제 지문 데이터 (예: 'TT 접지 계통에서 과전류 차단기로 보호하기 어려운 이유는?')",
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4개의 보기 배열. 원문자 ①, ②, ③, ④로 시작해야 함.",
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "0부터 3까지의 정답 인덱스 번호",
              },
              explanation: {
                type: Type.STRING,
                description: "정답 및 각 오답지에 대한 야금학적/전기공학적 상세 해설",
              },
            },
          },
        },
      })
    );

    const quizText = response.text;
    res.json(JSON.parse(quizText || "{}"));
  } catch (error: any) {
    console.error("Quiz Generator Error:", error);
    res.status(503).json({ error: "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!" });
  }
});

// 4. AI Joule's Law Safety Scenario Simulator
app.post("/api/simulate", async (req, res) => {
  try {
    const { current, resistance, time } = req.body;
    if (current == null || resistance == null || time == null) {
      return res.status(400).json({ error: "Current(I), Resistance(R), and Time(t) parameters are required." });
    }

    const ai = getAI();

    const prompt = `전기안전공학 및 화재 감식 분석관으로서 다음 실무 매개변수 하에서 발생하는 붕괴 거동 시나리오를 예측 및 평가하라.
전류: ${current} A
접촉부 국소 저항: ${resistance} Ω
통전 지속 시간: ${time} 초

Joule의 열량 수식을 활용하여 실 열량을 정량 계산하라 ($H = 0.24 I^2 R t$ [cal]). 
온도 과부하에 따른 피복재 Softening(연화), Melting(융융), Carbonization(탄화도전로 트래킹), 발화(Ignition) 천이 과정을 설명하고, 전류의 '제곱'에 비례하여 위험성이 지극히 확장된다는 점을 설명하라.
한국어로 친근하고 전문적인 소견 보고서 형식으로 작성해 주라.`;

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      })
    );

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Simulation Proxy Error:", error);
    res.status(503).json({ error: "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!" });
  }
});

// 5. AI Forensics Optical & Metallurgical Image Analyser (Vision)
app.post("/api/vision-detect", async (req, res) => {
  try {
    const { fileData, mimeType, description } = req.body;
    if (!fileData || !mimeType) {
      return res.status(400).json({ error: "Base64 fileData and standard mimeType is required." });
    }

    const ai = getAI();

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: fileData,
      },
    };

    const textPart = {
      text: `너는 전기화재 사고 조사 및 금속 야금학 감식관(Forensic Investigator)이다. 
제공된 전기 파손 관련 이미지를 정밀 분석하라. (구리 배선의 단락흔, 누전 흔적, 접촉 단자부 탄화 등)

${description || "자세히 분석해 주세요."}

분석할 때 다음 사항을 전문적으로 수록하라:
1. 구리 구슬의 표면 상태, 광택 및 기포 형태를 관찰하여 1차 단락흔(화재의 직접적 원인)인지 2차 단락흔(화재 결과로 피복 소실 후 합선)인지 판별 소견 기재.
2. 금속 내벽에 Cavity(공동)나 미세 기포(Void)의 특징적 분포 구조를 정량 추적 기술.
3. 아산화동(Cu₂O) 등의 적열화 유무 및 전원 차단 전로 통전 유무 추정.
4. 화재 안전 법적 보존 측면의 추가 감정 진단 솔루션 제시.
우아하고 격식 있는 한국어로 단락을 나누어 친절히 설명하라.`
    };

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, textPart] },
      })
    );

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Vision Proxy Error:", error);
    res.status(503).json({ error: "AI 튜터 통신 서버가 붐비고 있네요. 잠시(2~3초) 후에 다시 시도해 주세요!" });
  }
});

// Helper function to format Chat history for single consolidated prompt turn
function msgHistoryToPrompt(messages: any[], systemInstruction: string): string {
  let textOutput = `${systemInstruction}\n\n`;
  textOutput += "===대화 기록===\n";
  messages.forEach((msg) => {
    const roleLabel = msg.role === "user" ? "학생" : "YUKWON 교수";
    textOutput += `${roleLabel}: ${msg.content}\n`;
  });
  textOutput += "\nYUKWON 교수: ";
  return textOutput;
}

export default app;
