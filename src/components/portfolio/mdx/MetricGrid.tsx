interface Metric {
  value: string; // 예: "700+", "3단계"
  label: string; // 예: "커밋", "반응형 브레이크포인트"
}

interface Props {
  items?: Metric[];
}

/** 정량 성과를 카드 그리드로 강조. */
export default function MetricGrid({ items = [] }: Props) {
  if (items.length === 0) return null;
  return (
    <div className="my-10 grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((m, i) => (
        <div
          key={i}
          className="rounded-2xl bg-light-200 p-5 dark:bg-dark-800">
          <p className="text-3xl font-semibold text-point">{m.value}</p>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
}
