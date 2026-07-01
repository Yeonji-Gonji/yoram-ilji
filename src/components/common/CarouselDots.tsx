import clsx from 'clsx';

interface Props {
  /** 점 개수 */
  count: number;
  /** 현재 활성 인덱스 */
  activeIndex: number;
  /** 점 클릭 시 해당 인덱스로 이동 */
  onSelect: (index: number) => void;
}

/**
 * 캐러셀 하단 페이지 인디케이터. Designs·Blog 섹션이 서로 다른 크기·색을
 * 쓰던 것을 하나로 통일한다.
 */
export default function CarouselDots({ count, activeIndex, onSelect }: Props) {
  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={clsx(
            'h-2 rounded-full transition-all duration-300',
            index === activeIndex
              ? 'w-6 bg-point'
              : 'w-2 bg-dark-300 hover:bg-point/50 dark:bg-dark-500',
          )}
          aria-label={`${index + 1}번으로 이동`}
        />
      ))}
    </div>
  );
}
