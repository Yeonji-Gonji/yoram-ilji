'use client';

import CarouselDots from '@/components/common/CarouselDots';
import SectionHeader from '@/components/common/SectionHeader';
import { PortfolioCard } from '@/lib/portfolio-content';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Props {
  cards: PortfolioCard[];
}

/**
 * 홈 Selected Work — 플래그십 개발 케이스를 coverflow 캐러셀로 노출.
 * 드래그·스와이프·가로 휠 스크롤로 이동, 무한 루프, 카드 클릭 시 상세 이동.
 */
export default function DevelopmentSection({ cards }: Props) {
  const [mounted, setMounted] = useState(false);

  const [activeIndex, setActiveIndex] = useState(Math.floor(cards.length / 2));
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (cards.length === 0) return null;

  // coverflow는 한 화면에 여러 장이 보여서, 원본이 적으면 loop가 비활성화된다
  // (Swiper Loop Warning). 8장 이상이 되도록 원본을 복제해 채운다.
  const copies = Math.max(1, Math.ceil(8 / cards.length));
  const loopSlides = Array.from({ length: copies }, () => cards).flat();

  /**
   * 카드 전체가 상세 링크. 단 드래그(스와이프) 끝에 발생하는 클릭은 이동으로
   * 치지 않고(allowClick: v12 타입 정의에서 빠졌지만 런타임엔 존재),
   * 옆의 흐린 카드는 상세 대신 가운데로 데려온다.
   */
  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    const canClick =
      swiperInstance &&
      (swiperInstance as SwiperType & { allowClick: boolean }).allowClick;
    if (!canClick) {
      e.preventDefault();
      return;
    }
    if (index !== activeIndex) {
      e.preventDefault();
      swiperInstance.slideToLoop(index);
    }
  };

  return (
    <div className="relative z-10 w-full px-6 mx-auto pointer-events-auto max-w-7xl">
      <SectionHeader
        title="Development"
        href="/portfolio?category=development"
        subtitle="기획과 개발을 함께 진행한 작업입니다."
      />

      {mounted ? (
        <Swiper
          modules={[EffectCoverflow, Mousewheel]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          mousewheel={{ forceToAxis: true }}
          initialSlide={Math.floor(cards.length / 2)}
          coverflowEffect={{
            rotate: 8,
            stretch: 0,
            depth: 160,
            modifier: 1,
            slideShadows: false,
          }}
          speed={500}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="overflow-visible! py-6">
          {loopSlides.map((card, index) => {
            const isActive = index === activeIndex;

            return (
              <SwiperSlide
                key={`${card.id}-${Math.floor(index / cards.length)}`}
                className="w-[300px]! md:w-[380px]! select-none">
                <div
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-100' : 'scale-95 opacity-60'
                  }`}>
                  <DevelopmentCard
                    card={card}
                    onClick={(e) => handleCardClick(e, index)}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="flex justify-center gap-6 py-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[380px] w-[300px] animate-pulse rounded-2xl bg-light-300 md:w-[380px] dark:bg-dark-700"
            />
          ))}
        </div>
      )}

      {/* 점 인디케이터는 복제본이 아닌 원본 기준 (activeIndex는 복제 포함 인덱스) */}
      <CarouselDots
        count={cards.length}
        activeIndex={activeIndex % cards.length}
        onSelect={(index) => swiperInstance?.slideToLoop(index)}
      />
    </div>
  );
}

/**
 * 플래그십 개발 케이스 카드. 회사 작업은 스크린샷이 없으므로 케이스별
 * 브랜드 컬러 + 핵심 지표(metrics)로 카드를 세운다.
 */
function DevelopmentCard({
  card,
  onClick,
}: {
  card: PortfolioCard;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const metrics = card.metrics?.slice(0, 3) ?? [];

  return (
    <Link
      href={`/portfolio/${card.id}`}
      onClick={onClick}
      draggable={false}
      aria-label={`${card.title} 케이스 자세히 보기`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-light-300 bg-light-100 text-left transition-all duration-300 hover:border-point hover:shadow-[0_18px_40px_-18px_var(--color-point)] dark:border-dark-700 dark:bg-dark-800">
      {/* 상단 악센트 — 썸네일이 있으면 이미지, 없으면 컬러 헤더 */}
      {card.thumbnail ? (
        <div className="relative overflow-hidden aspect-video">
          <Image
            src={card.thumbnail}
            alt={card.title}
            fill
            unoptimized
            draggable={false}
            className="object-cover transition-transform duration-500 pointer-events-none group-hover:scale-105"
            sizes="(max-width: 768px) 300px, 380px"
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
          <h3 className="mt-1 text-lg font-semibold leading-snug transition-colors text-dark-800 group-hover:text-point dark:text-light-100">
            {card.title}
          </h3>
        </div>
      )}

      <div className="flex flex-col flex-1 gap-4 p-5">
        {/* 썸네일이 있을 때만 본문 영역에서 제목 노출 (헤더에 이미 있으면 생략) */}
        {card.thumbnail && (
          <h3 className="text-lg font-semibold leading-snug transition-colors text-dark-800 group-hover:text-point dark:text-light-100">
            {card.title}
          </h3>
        )}

        <p className="text-sm leading-relaxed line-clamp-2 text-dark-500 dark:text-dark-300">
          {card.subtitle}
        </p>

        {/* 핵심 지표 — 스크린샷 대신 카드의 무게중심 */}
        {metrics.length > 0 && (
          <ul className="space-y-1.5 rounded-xl bg-light-300/60 p-3 dark:bg-dark-900/50">
            {metrics.map((m) => (
              <li
                key={m}
                className="flex items-start gap-2 text-xs leading-relaxed text-dark-700 dark:text-light-300">
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
            <span className="text-xs text-dark-400 dark:text-dark-400">
              {card.role}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium transition-colors text-dark-500 group-hover:text-point dark:text-dark-300">
              케이스 보기
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
