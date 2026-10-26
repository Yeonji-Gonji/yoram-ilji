import { describe, expect, it } from 'vitest';
import { normalizeAnswerText } from './grading';
import {
  allQuestions,
  buildExam,
  categories,
  getQuestionById,
  questionsByCategory,
} from './questionBank';

describe('문제 은행 데이터 무결성', () => {
  it('문제 ID 가 겹치지 않는다(오답 노트·풀이 기록이 ID 로 저장된다)', () => {
    const ids = allQuestions.map((x) => x.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dup).toEqual([]);
  });

  it('자동 채점 문제는 빈칸마다 정규화 후에도 비어 있지 않은 정답이 있다', () => {
    const broken = allQuestions
      .filter((x) => x.type === 'short' && !x.figure)
      .filter(
        (x) =>
          x.answers.length === 0 ||
          x.answers.some((a) => normalizeAnswerText(a.answer) === ''),
      )
      .map((x) => x.id);
    expect(broken).toEqual([]);
  });

  it('모든 카테고리에 문제가 있다', () => {
    for (const c of categories) {
      expect(questionsByCategory[c.id]?.length, c.id).toBeGreaterThan(0);
    }
  });

  it('ID 로 문제를 찾을 수 있다', () => {
    const first = allQuestions[0];
    expect(getQuestionById(first.id)).toBe(first);
    expect(getQuestionById('no-such-id')).toBeUndefined();
  });
});

describe('buildExam', () => {
  it('요청한 문항 수만큼, 중복 없이 뽑는다', () => {
    const exam = buildExam([], 20);
    expect(exam).toHaveLength(20);
    expect(new Set(exam.map((x) => x.id)).size).toBe(20);
  });

  it('선택한 카테고리 안에서만 뽑는다', () => {
    const [a, b] = categories.map((c) => c.id);
    const allowed = new Set([...questionsByCategory[a], ...questionsByCategory[b]].map((x) => x.id));
    const exam = buildExam([a, b], 10);
    expect(exam.every((x) => allowed.has(x.id))).toBe(true);
  });

  it('카테고리 수가 문항 수 이하이면 각 카테고리에서 최소 1문제씩 나온다(무작위라 50회 반복)', () => {
    const ids = categories.map((c) => c.id);
    const size = Math.max(20, ids.length);
    for (let run = 0; run < 50; run += 1) {
      const exam = buildExam(ids, size);
      expect(exam).toHaveLength(size);
      for (const id of ids) {
        const pool = new Set(questionsByCategory[id].map((x) => x.id));
        expect(exam.some((x) => pool.has(x.id)), `${id} (run ${run})`).toBe(true);
      }
    }
  });

  it('풀이 요청 수보다 작으면 전부 섞어 돌려준다', () => {
    const smallest = [...categories].sort(
      (x, y) => questionsByCategory[x.id].length - questionsByCategory[y.id].length,
    )[0];
    const pool = questionsByCategory[smallest.id];
    const exam = buildExam([smallest.id], pool.length + 5);
    expect(exam).toHaveLength(pool.length);
  });
});
