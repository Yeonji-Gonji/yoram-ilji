'use client';

import CarouselDots from '@/components/common/CarouselDots';
import SectionHeader from '@/components/common/SectionHeader';
import { PortfolioCard } from '@/lib/portfolio-content';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function DesignPortfolioSection({
  designPortfolios,
}: {
  designPortfolios: PortfolioCard[];
}) {
  const [mounted, setMounted] = useState(false);

  const [activeIndex, setActiveIndex] = useState(
    Math.floor(designPortfolios.length / 2),
  );
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (designPortfolios.length === 0) {
    return null;
  }

  // coverflow는 한 화면에 여러 장이 보여서, 원본이 적으면 loop가 비활성화된다
  // (Swiper Loop Warning). 8장 이상이 되도록 원본을 복제해 채운다.
  const copies = Math.max(1, Math.ceil(8 / designPortfolios.length));
  const loopSlides = Array.from({ length: copies }, () => designPortfolios)
    .flat();

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
        title="Design"
        href="/portfolio?category=design"
        subtitle="개발로 전향하기 전, 디자이너로 일하던 시절의 작업입니다."
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
          initialSlide={Math.floor(designPortfolios.length / 2)}
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          speed={500}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="overflow-visible! py-10">
          {loopSlides.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <SwiperSlide
                key={`${project.id}-${Math.floor(index / designPortfolios.length)}`}
                className="w-[280px]! md:w-[350px]! select-none">
                <Link
                  href={`/portfolio/${project.id}`}
                  onClick={(e) => handleCardClick(e, index)}
                  draggable={false}
                  aria-label={`${project.title} 상세 보기`}
                  className={`block aspect-3/4 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    isActive ? 'ring-4 ring-point/50' : ''
                  }`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      unoptimized
                      draggable={false}
                      className={`object-cover pointer-events-none transition-all duration-500 ${
                        isActive ? 'blur-0 scale-100' : 'blur-[2px] scale-105'
                      }`}
                      sizes="(max-width: 768px) 280px, 350px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-start">
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        {project.type}
                      </span>
                      <h3 className="mb-1 text-xl font-medium text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/70 line-clamp-2">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="flex justify-center gap-6 py-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] md:w-[350px] aspect-3/4 rounded-2xl bg-light-300 dark:bg-dark-700 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 점 인디케이터는 복제본이 아닌 원본 기준 (activeIndex는 복제 포함 인덱스) */}
      <CarouselDots
        count={designPortfolios.length}
        activeIndex={activeIndex % designPortfolios.length}
        onSelect={(index) => swiperInstance?.slideToLoop(index)}
      />
    </div>
  );
}
