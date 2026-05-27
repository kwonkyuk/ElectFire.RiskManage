/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: number;
  title: string;
  topic: string;
  description: string;
  sections: Section[];
  quiz: QuizQuestion[];
}

export interface Section {
  title: string;
  content: string;
  formulas?: string[];
  tables?: {
    headers: string[];
    rows: string[][];
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface SimState {
  current: number;       // A (Ampere)
  resistance: number;    // Ohm
  time: number;          // seconds
  ambientTemp: number;   // °C
}

export interface SimResult {
  heatCal: number;       // Calories
  heatJoule: number;     // Joules
  conductorTemp: number; // calculated °C
  insulationState: string; // Normal, Softened, Melting, Carbonized, Ignition
  charringRatio: number; // 0 to 100%
  description: string;
}
