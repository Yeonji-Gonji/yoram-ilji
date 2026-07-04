'use client';

import SectionHeader from '@/components/common/SectionHeader';
import { PortfolioCard } from '@/lib/portfolio-content';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Props {
  designPortfolios: PortfolioCard[];
}

/**
 * 디자인 포트폴리오 쇼케이스 배너. 좌우 여백 없이 화면을 꽉 채우는 풀블리드 배너에
 * 작품을 한 점씩 크게 보여준다(블러 배경 + 기기 프레임 목업). 스와이프·자동재생과
 * 우하단 Prev/Next로 넘기고, 프레임·좌하단 타이틀이 상세로 가는 링크다.
 * 홈의 카드 리스트 흐름을 끊는 브레이크 섹션으로, 화면 높이를 넘지 않는다.
 */
export default function DesignBannerSection({ designPortfolios }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const works = designPortfolios.filter((p) => p.thumbnail);

  if (works.length === 0) return null;

  /** 드래그(스와이프) 끝에 발생하는 클릭은 상세 이동으로 치지 않는다 */
  const guardDragClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const canClick =
      !swiperInstance ||
      (swiperInstance as SwiperType & { allowClick: boolean }).allowClick;
    if (!canClick) e.preventDefault();
  };

  return (
    <div className="relative z-10 w-full pointer-events-auto">
      <div className="w-full px-6 mx-auto max-w-7xl">
        <SectionHeader
          title="Design"
          href="/portfolio?category=design"
          subtitle="개발로 전향하기 전, 디자이너로 일하던 시절의 작업입니다."
        />
      </div>

      <Swiper
        modules={[Autoplay, Mousewheel]}
        slidesPerView={1}
        loop={works.length > 1}
        speed={700}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        mousewheel={{ forceToAxis: true }}
        grabCursor={true}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full">
        {works.map((work) => (
          <SwiperSlide key={work.id} className="select-none">
            <div className="relative h-[70vh] max-h-[800px] min-h-[600px] w-full overflow-hidden">
              {/* 작품에서 이어지는 앰비언트 배경 (블러 확대) */}
              <Image
                src={work.thumbnail}
                alt=""
                aria-hidden
                fill
                unoptimized
                draggable={false}
                className="object-cover scale-110 pointer-events-none blur-2xl"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-light-100/50 dark:bg-dark-950/60" />

              {/* 기기 프레임 목업 안의 작품 본체 */}
              <Link
                href={`/portfolio/${work.id}`}
                onClick={guardDragClick}
                draggable={false}
                aria-label={`${work.title} 디자인 작업 자세히 보기`}
                className="absolute inset-0 flex items-center justify-center px-6 pt-6 pb-20 md:px-16 md:pt-10 md:pb-24">
                <span className="relative block h-full w-full max-w-4xl overflow-hidden rounded-2xl bg-light-50 shadow-2xl transition-transform duration-500 hover:scale-[1.01] md:rounded-3xl ">
                  <Image
                    src={work.thumbnail}
                    alt={`${work.title} 디자인 작업`}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover object-top pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                </span>
              </Link>

              {/* 좌하단: 프로젝트 타이틀 (상세 링크) */}
              <Link
                href={`/portfolio/${work.id}`}
                onClick={guardDragClick}
                draggable={false}
                className="group absolute bottom-5 left-6 inline-flex items-center gap-1.5 md:bottom-7 md:left-10">
                <span className="text-lg font-light tracking-wide uppercase transition-colors text-dark-900 group-hover:text-point md:text-xl dark:text-light-100">
                  {work.title}
                </span>
                <ArrowUpRight className="h-5 w-5 text-dark-900 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-point dark:text-light-100" />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 우하단: Prev / Next + 인덱스 (Swiper 밖에 두면 슬라이드와 함께 밀리지 않는다) */}
      <div className="absolute z-10 flex items-center gap-3 right-6 bottom-5 md:right-10 md:bottom-7">
        <span className="text-xs tabular-nums text-dark-700 dark:text-dark-300">
          {activeIndex + 1} / {works.length}
        </span>
        <button
          type="button"
          aria-label="이전 디자인 작업"
          onClick={() => swiperInstance?.slidePrev()}
          className="p-2 transition-colors border rounded-full border-dark-900/20 text-dark-900 hover:border-point hover:text-point dark:border-light-100/20 dark:text-light-100">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="다음 디자인 작업"
          onClick={() => swiperInstance?.slideNext()}
          className="p-2 transition-colors border rounded-full border-dark-900/20 text-dark-900 hover:border-point hover:text-point dark:border-light-100/20 dark:text-light-100">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
