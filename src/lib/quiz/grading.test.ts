import { describe, expect, it } from 'vitest';
import type { QuizQuestion } from '@/types/quiz.type';
import {
  gradeQuestion,
  isAutoGradable,
  isBlankCorrect,
  normalizeAnswerText,
  resolveCorrect,
} from './grading';

const q = (over: Partial<QuizQuestion> = {}): QuizQuestion =>
  ({
    id: 't-1',
    number: 1,
    type: 'short',
    question: '테스트',
    answers: [
      { label: '①', answer: 'SELECT', aliases: [] },
      { label: '②', answer: 'GROUP BY', aliases: ['groupby'] },
    ],
    figure: null,
    ...over,
  }) as QuizQuestion;

describe('normalizeAnswerText', () => {
  it('앞뒤 공백·내부 공백을 지우고 소문자로 바꾼다', () => {
    expect(normalizeAnswerText('  Group  By ')).toBe('groupby');
  });

  it('곧은 따옴표와 백틱을 지운다', () => {
    expect(normalizeAnswerText(`"abc" 'd' \`e\``)).toBe('abcde');
  });

  it('둥근 따옴표(맥·iOS 자동 치환)도 지운다', () => {
    expect(normalizeAnswerText('“abc”')).toBe('abc');
    expect(normalizeAnswerText('‘x’')).toBe('x');
  });

  it('문장 끝 세미콜론·마침표만 지운다', () => {
    expect(normalizeAnswerText('a.b;')).toBe('a.b');
    expect(normalizeAnswerText('done.;.')).toBe('done');
  });
});

describe('isBlankCorrect', () => {
  const answer = { label: null, answer: 'GROUP BY', aliases: ['groupby절'] };

  it('표기 편차(대소문자·공백)를 허용한다', () => {
    expect(isBlankCorrect(answer, ' group by ')).toBe(true);
  });

  it('허용 표기(aliases)도 정답이다', () => {
    expect(isBlankCorrect(answer, 'GroupBy절')).toBe(true);
  });

  it('둥근 따옴표로 감싼 입력도 정답이다', () => {
    expect(isBlankCorrect({ label: null, answer: "'A'" }, '‘A’')).toBe(true);
  });

  it('빈 입력은 오답이다', () => {
    expect(isBlankCorrect(answer, '   ')).toBe(false);
  });

  it('다른 답은 오답이다', () => {
    expect(isBlankCorrect(answer, 'ORDER BY')).toBe(false);
  });
});

describe('isAutoGradable', () => {
  it('단답형이고 그림이 없으면 자동 채점', () => {
    expect(isAutoGradable(q())).toBe(true);
  });
  it('서술형은 자가 채점', () => {
    expect(isAutoGradable(q({ type: 'essay' }))).toBe(false);
  });
  it('그림 문제는 자가 채점', () => {
    expect(isAutoGradable(q({ figure: true }))).toBe(false);
  });
});

describe('gradeQuestion', () => {
  it('모든 빈칸이 맞아야 정답(부분점수 없음)', () => {
    expect(gradeQuestion(q(), ['select', 'group by'])).toBe(true);
    expect(gradeQuestion(q(), ['select', 'order by'])).toBe(false);
  });

  it('입력이 모자라면 오답', () => {
    expect(gradeQuestion(q(), ['select'])).toBe(false);
  });

  it('자동 채점 불가 문제는 null', () => {
    expect(gradeQuestion(q({ type: 'essay' }), ['아무거나'])).toBeNull();
  });
});

describe('resolveCorrect', () => {
  it('사용자 판정(override)이 자동 채점보다 우선한다', () => {
    expect(resolveCorrect(q(), ['wrong', 'wrong'], true)).toBe(true);
    expect(resolveCorrect(q(), ['select', 'group by'], false)).toBe(false);
  });

  it('override 가 없으면 자동 채점 결과', () => {
    expect(resolveCorrect(q(), ['select', 'group by'], null)).toBe(true);
    expect(resolveCorrect(q(), ['select', 'group by'], undefined)).toBe(true);
  });
});
