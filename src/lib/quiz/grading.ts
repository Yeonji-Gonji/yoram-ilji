import type { QuizAnswerDTO, QuizQuestion } from '@/types/quiz.type';

/**
 * 채점용 정규화: 앞뒤 공백 제거, 소문자화, 모든 공백·따옴표 통일 제거,
 * 문장 끝 세미콜론·마침표 제거. 실기 단답 채점의 표기 편차를 흡수한다.
 */
export function normalizeAnswerText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[""'''`]/g, '')
    .replace(/\s+/g, '')
    .replace(/[;.]+$/, '');
}

/** 빈칸 하나에 대한 자동 채점 (정답·허용 표기 비교) */
export function isBlankCorrect(answer: QuizAnswerDTO, input: string): boolean {
  const normalized = normalizeAnswerText(input);
  if (!normalized) return false;
  const candidates = [answer.answer, ...(answer.aliases ?? [])];
  return candidates.some(
    (candidate) => normalizeAnswerText(candidate) === normalized,
  );
}

/** 자동 채점 가능 여부 (서술형·그림 문제는 자가 채점) */
export function isAutoGradable(question: QuizQuestion): boolean {
  return question.type === 'short' && !question.figure;
}

/**
 * 문제 전체 자동 채점. 모든 빈칸이 맞아야 정답(실기 기준 부분점수 없음).
 * 자동 채점 불가 문제는 null 반환 → 자가 채점 필요.
 */
export function gradeQuestion(
  question: QuizQuestion,
  inputs: string[],
): boolean | null {
  if (!isAutoGradable(question)) return null;
  return question.answers.every((answer, idx) =>
    isBlankCorrect(answer, inputs[idx] ?? ''),
  );
}

/** 자동 채점 + 사용자 수동 판정(override)을 합친 최종 정오 판정 */
export function resolveCorrect(
  question: QuizQuestion,
  inputs: string[],
  override: boolean | null | undefined,
): boolean | null {
  if (override !== null && override !== undefined) return override;
  return gradeQuestion(question, inputs);
}
