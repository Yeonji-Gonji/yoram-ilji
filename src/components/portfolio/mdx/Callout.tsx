import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  // 'point'(코랄, 기본) | 'sky'(보조 강조)
  tone?: 'point' | 'sky';
}

/** 본문 중 "이 케이스의 한 방"을 강조하는 인용 블록. */
export default function Callout({ children, tone = 'point' }: Props) {
  const accent =
    tone === 'sky'
      ? 'border-sky-500 bg-sky-500/5'
      : 'border-point bg-point/5';
  return (
    <aside
      className={`my-8 rounded-2xl border-l-4 ${accent} px-6 py-5 text-base leading-relaxed text-dark-700 dark:text-light-200`}>
      {children}
    </aside>
  );
}
