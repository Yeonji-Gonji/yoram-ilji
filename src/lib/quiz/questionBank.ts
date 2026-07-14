import type {
  QuizCategoryFileDTO,
  QuizCategorySummary,
  QuizQuestion,
} from '@/types/quiz.type';
import controlJson from '@/data/quiz/control.json';
import funcJson from '@/data/quiz/func.json';
import javaJson from '@/data/quiz/java.json';
import keywordAJson from '@/data/quiz/keyword-a.json';
import keywordBJson from '@/data/quiz/keyword-b.json';
import pastJson from '@/data/quiz/past.json';
import pointerJson from '@/data/quiz/pointer.json';
import pythonJson from '@/data/quiz/python.json';
import sqlJson from '@/data/quiz/sql.json';

/** 카테고리 파일에 카테고리 메타를 병합해 런타임 문제 목록으로 변환 */
function toQuestions(file: QuizCategoryFileDTO): QuizQuestion[] {
  return file.questions.map((question) => ({
    ...question,
    category: file.category,
    categoryLabel: file.categoryLabel,
    sourcePdf: file.sourcePdf,
  }));
}

const keywordA = keywordAJson as unknown as QuizCategoryFileDTO;
const keywordB = keywordBJson as unknown as QuizCategoryFileDTO;

/** 키워드 130문제는 분할 추출된 두 파일(a: 1~65, b: 66~130)을 병합 */
const keywordFile: QuizCategoryFileDTO = {
  ...keywordA,
  questions: [...keywordA.questions, ...keywordB.questions],
};

const pastFile = pastJson as unknown as QuizCategoryFileDTO;

/**
 * 기출복원은 단일 분류 대신 연도·회차별 카테고리로 분리한다.
 * (examRound "2023년 1회" → category "past-2023-1", label "기출 2023년 1회")
 */
const pastRoundFiles: QuizCategoryFileDTO[] = [
  ...new Set(pastFile.questions.map((q) => q.examRound).filter(Boolean)),
]
  .map((round) => round as string)
  .sort((a, b) => {
    const parse = (r: string) => {
      const m = r.match(/(\d{4})년\s*(\d)회/);
      return m ? Number(m[1]) * 10 + Number(m[2]) : 0;
    };
    return parse(a) - parse(b);
  })
  .map((round) => ({
    category: `past-${round.replace(/(\d{4})년\s*(\d)회/, '$1-$2')}`,
    categoryLabel: `기출 ${round}`,
    sourcePdf: null,
    questions: pastFile.questions.filter((q) => q.examRound === round),
  }));

const CATEGORY_FILES: QuizCategoryFileDTO[] = [
  keywordFile,
  sqlJson as unknown as QuizCategoryFileDTO,
  controlJson as unknown as QuizCategoryFileDTO,
  pointerJson as unknown as QuizCategoryFileDTO,
  funcJson as unknown as QuizCategoryFileDTO,
  javaJson as unknown as QuizCategoryFileDTO,
  pythonJson as unknown as QuizCategoryFileDTO,
  ...pastRoundFiles,
];

export const questionsByCategory: Record<string, QuizQuestion[]> =
  Object.fromEntries(
    CATEGORY_FILES.map((file) => [file.category, toQuestions(file)]),
  );

export const allQuestions: QuizQuestion[] = CATEGORY_FILES.flatMap((file) =>
  toQuestions(file),
);

/** 문제가 있는 카테고리만 노출 (수집 전 빈 카테고리 숨김) */
export const categories: QuizCategorySummary[] = CATEGORY_FILES.map(
  (file) => ({
    id: file.category,
    label: file.categoryLabel,
    count: file.questions.length,
  }),
).filter((category) => category.count > 0);

const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

export function getQuestionById(id: string): QuizQuestion | undefined {
  return questionMap.get(id);
}

export function getQuestions(categoryIds: string[]): QuizQuestion[] {
  if (categoryIds.length === 0) return allQuestions;
  return categoryIds.flatMap((id) => questionsByCategory[id] ?? []);
}

/** Fisher-Yates 셔플 (원본 불변) */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 모의고사 세트 생성: 선택 범위에서 카테고리 비율을 유지하며 무작위 추출.
 * 실제 실기 구성(이론 키워드 + 코드 비중)이 자연히 반영되도록 비례 배분한다.
 */
export function buildExam(
  categoryIds: string[],
  size: number,
): QuizQuestion[] {
  const pools = (
    categoryIds.length === 0 ? categories.map((c) => c.id) : categoryIds
  )
    .map((id) => questionsByCategory[id] ?? [])
    .filter((pool) => pool.length > 0);

  const totalCount = pools.reduce((sum, pool) => sum + pool.length, 0);
  if (totalCount <= size) {
    return shuffle(pools.flat());
  }

  // 카테고리별 비례 배분 (최소 1문제 보장 후 나머지는 큰 풀 우선)
  const picked: QuizQuestion[] = [];
  const quotas = pools.map((pool) =>
    Math.max(1, Math.floor((pool.length / totalCount) * size)),
  );
  let remaining = size - quotas.reduce((a, b) => a + b, 0);
  const order = pools
    .map((pool, idx) => idx)
    .sort((a, b) => pools[b].length - pools[a].length);
  for (const idx of order) {
    if (remaining === 0) break;
    const delta = remaining > 0 ? 1 : -1;
    if (quotas[idx] + delta >= 1 && quotas[idx] + delta <= pools[idx].length) {
      quotas[idx] += delta;
      remaining -= delta;
    }
  }
  pools.forEach((pool, idx) => {
    picked.push(...shuffle(pool).slice(0, Math.min(quotas[idx], pool.length)));
  });
  return shuffle(picked).slice(0, size);
}
