/** 정보처리기사 실기 CBT 문제 은행 타입 정의 */

export type QuizLanguage = 'c' | 'java' | 'python' | 'sql';

/** 문제의 개별 정답(빈칸 단위). label은 ①②③ 등 하위 번호, 단일 답이면 null */
export type QuizAnswerDTO = {
  label: string | null;
  answer: string;
  aliases?: string[];
};

/** JSON 문제 원본 (src/data/quiz/*.json) */
export type QuizQuestionDTO = {
  id: string;
  number: number;
  /** short: 단답·실행결과·빈칸(자동 채점 시도), essay: 서술형(자가 채점) */
  type: 'short' | 'essay';
  question: string;
  passage?: string | null;
  code?: string | null;
  language?: QuizLanguage | null;
  choices?: string[] | null;
  answers: QuizAnswerDTO[];
  explanation?: string | null;
  /** 그림 없이 풀 수 없는 문제 */
  figure?: boolean;
  figureDesc?: string | null;
  /** 그림을 재현한 인라인 SVG (원본 PDF 삭제 대비, currentColor 기반 테마 대응) */
  figureSvg?: string | null;
  /** 기출복원 전용: 출제 회차 (예: "2025년 2회") */
  examRound?: string;
  /** 기출복원 전용: 수집 출처 */
  sourceUrl?: string;
};

/** 카테고리 JSON 파일 스키마 */
export type QuizCategoryFileDTO = {
  category: string;
  categoryLabel: string;
  sourcePdf: string | null;
  questions: QuizQuestionDTO[];
};

/** 카테고리 메타가 병합된 런타임 문제 */
export type QuizQuestion = QuizQuestionDTO & {
  category: string;
  categoryLabel: string;
  sourcePdf: string | null;
};

export type QuizCategorySummary = {
  id: string;
  label: string;
  count: number;
};

/** 모의고사 응시 기록 (localStorage) */
export type ExamRecord = {
  id: string;
  at: string;
  total: number;
  correct: number;
  score: number;
  elapsedSec: number;
  categories: string[];
  wrongIds: string[];
};

/** 오답노트 항목 (localStorage) */
export type WrongNote = {
  id: string;
  wrongCount: number;
  lastWrongAt: string;
};
