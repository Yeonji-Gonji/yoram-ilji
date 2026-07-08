import { Eye } from 'lucide-react';

interface Props {
  /** 표시할 조회수. null/undefined면 아무것도 렌더링하지 않는다(미설정·조회 실패). */
  count: number | null | undefined;
  className?: string;
}

/**
 * 누적 조회수를 눈 아이콘 + 숫자로 보여주는 순수 표시 컴포넌트.
 * 서버/클라이언트 양쪽에서 재사용한다(훅·상태 없음).
 * 데이터를 어디서 가져올지는 호출 측 책임(리스트=맵 prop, 상세=getViewsForPath).
 */
export default function ViewCount({ count, className }: Props) {
  if (count === null || count === undefined) return null;

  return (
    <span
      className={
        'inline-flex items-center gap-1 text-xs text-dark-400/80 ' +
        (className ?? '')
      }
      title={`누적 조회 ${count.toLocaleString('ko-KR')}회`}>
      <Eye className="size-3 opacity-70" strokeWidth={1.75} aria-hidden />
      <span className="tabular-nums leading-none">
        {count.toLocaleString('ko-KR')}
      </span>
    </span>
  );
}
