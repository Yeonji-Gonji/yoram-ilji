import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  /** 섹션 제목 (예: Development, Design, Blog) */
  title: string;
  /** 제목 클릭 시 이동할 경로 */
  href: string;
  /** 제목 아래 설명 문구 (선택) */
  subtitle?: string;
  /** 정렬. 기본은 좌측, Contact 등은 center */
  align?: 'left' | 'center';
}

/**
 * 홈 각 섹션의 상단 헤더. 제목 + 화살표 링크 + 서브타이틀을 공통으로 통일한다.
 * 섹션마다 폰트 굵기·화살표 아이콘·여백이 제각각이던 것을 하나로 묶기 위한 컴포넌트.
 */
export default function SectionHeader({
  title,
  href,
  subtitle,
  align = 'left',
}: Props) {
  return (
    <div className={clsx('mb-8', align === 'center' && 'text-center')}>
      <Link href={href} className="inline-flex items-center gap-2 group">
        <h2 className="text-3xl font-bold transition-colors duration-300 group-hover:text-point md:text-4xl">
          {title}
        </h2>
        <ArrowRight className="w-6 h-6 transition-all duration-300 text-dark-400 group-hover:translate-x-1 group-hover:text-point" />
      </Link>
      {subtitle && (
        <p className="mt-2 text-dark-300 dark:text-dark-500">{subtitle}</p>
      )}
    </div>
  );
}
