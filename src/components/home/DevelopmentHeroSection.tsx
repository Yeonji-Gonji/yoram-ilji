import { PortfolioCard } from '@/lib/portfolio-content';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  cards: PortfolioCard[];
}

/**
 * 홈 Selected Work — 플래그십 개발 케이스 카드.
 * 회사 작업은 스크린샷이 없으므로 브랜드 컬러 + 핵심 한 줄로 카드를 세운다.
 */
export default function DevelopmentHeroSection({ cards }: Props) {
  if (cards.length === 0) return null;

  return (
    <div className="w-full max-w-7xl px-6">
      <div className="mb-8 text-left">
        <Link
          href="/portfolio?category=development"
          className="group inline-flex items-center gap-2">
          <h2 className="text-3xl font-medium transition-colors duration-300 group-hover:text-point md:text-4xl">
            Selected Work
          </h2>
          <ArrowRight className="h-6 w-6 text-dark-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-point" />
        </Link>
        <p className="mt-2 text-dark-300 dark:text-dark-500">
          기획과 개발 사이의 빈틈을 메운 대표 작업들
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/portfolio/${card.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-light-200 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-dark-800">
            <div
              className="relative aspect-video overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${card.color}40 0%, ${card.color}10 100%)`,
              }}>
              {card.thumbnail ? (
                <Image
                  src={card.thumbnail}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-5">
                  <span className="text-lg font-medium text-dark-700 dark:text-light-200">
                    {card.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-medium transition-colors group-hover:text-point">
                {card.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-dark-500 dark:text-dark-400">
                {card.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.skills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-light-400 px-2 py-0.5 text-xs text-dark-600 dark:bg-dark-700 dark:text-dark-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
