import SectionHeader from '@/components/common/SectionHeader';
import { PortfolioCard } from '@/lib/portfolio-content';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties } from 'react';

interface Props {
  cards: PortfolioCard[];
}

/**
 * 홈 Selected Work — 플래그십 개발 케이스 카드.
 * 회사 작업은 스크린샷이 없으므로 케이스별 브랜드 컬러 + 핵심 지표(metrics)로
 * 카드를 세운다. 각 카드는 컬러 토큰(--card)으로 호버·악센트를 통일한다.
 */
export default function DevelopmentHeroSection({ cards }: Props) {
  if (cards.length === 0) return null;

  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
      <SectionHeader
        title="Development"
        href="/portfolio?category=development"
        subtitle="기획과 개발을 함께 진행한 작업입니다."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <DevelopmentCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

function DevelopmentCard({ card }: { card: PortfolioCard }) {
  const metrics = card.metrics?.slice(0, 3) ?? [];

  return (
    <Link
      href={`/portfolio/${card.id}`}
      aria-label={`${card.title} 케이스 자세히 보기`}
      style={{ '--card': card.color } as CSSProperties}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-light-300 bg-light-100 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--card)] hover:shadow-[0_18px_40px_-18px_var(--card)] dark:border-dark-700 dark:bg-dark-800">
      {/* 상단 악센트 — 썸네일이 있으면 이미지, 없으면 컬러 헤더 */}
      {card.thumbnail ? (
        <div className="relative overflow-hidden aspect-video">
          <Image
            src={card.thumbnail}
            alt={card.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div
          className="relative px-5 pt-6 pb-5 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${card.color}1f 0%, ${card.color}08 60%, transparent 100%)`,
          }}>
          <span
            className="absolute inset-y-0 left-0 w-1"
            style={{ backgroundColor: card.color }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: card.color }}>
            {card.period}
          </span>
          <h3 className="mt-1 text-lg font-semibold leading-snug text-dark-800 transition-colors group-hover:text-[var(--card)] dark:text-light-100">
            {card.title}
          </h3>
        </div>
      )}

      <div className="flex flex-col flex-1 gap-4 p-5">
        {/* 썸네일이 있을 때만 본문 영역에서 제목 노출 (헤더에 이미 있으면 생략) */}
        {card.thumbnail && (
          <h3 className="text-lg font-semibold leading-snug text-dark-800 transition-colors group-hover:text-[var(--card)] dark:text-light-100">
            {card.title}
          </h3>
        )}

        <p className="text-sm leading-relaxed line-clamp-2 text-dark-500 dark:text-dark-400">
          {card.subtitle}
        </p>

        {/* 핵심 지표 — 스크린샷 대신 카드의 무게중심 */}
        {metrics.length > 0 && (
          <ul className="space-y-1.5 rounded-xl bg-light-300/60 p-3 dark:bg-dark-900/50">
            {metrics.map((m) => (
              <li
                key={m}
                className="flex items-start gap-2 text-xs leading-relaxed text-dark-700 dark:text-dark-200">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {card.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full bg-light-400 px-2 py-0.5 text-xs text-dark-600 dark:bg-dark-700 dark:text-dark-300">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-light-300 dark:border-dark-700">
            <span className="text-xs text-dark-400 dark:text-dark-500">
              {card.role}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-dark-500 transition-colors group-hover:text-[var(--card)] dark:text-dark-300">
              케이스 보기
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
