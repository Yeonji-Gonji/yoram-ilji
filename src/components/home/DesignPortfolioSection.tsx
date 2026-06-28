'use client';

import { PortfolioCard } from '@/lib/portfolio-content';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
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

  return (
    <div className="relative z-10 w-full px-6 py-16 mx-auto pointer-events-auto">
      <div className="mb-8">
        <Link
          href="/portfolio?category=design"
          className="inline-flex items-center gap-2 group">
          <h2 className="text-3xl font-medium transition-all duration-300 md:text-4xl group-hover:text-point">
            Designs
          </h2>
          <svg
            className="w-6 h-6 transition-all duration-300 text-dark-400 group-hover:text-point group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
        <p className="mt-2 text-dark-300 dark:text-dark-500">
          개발로 전향하기 전, 디자이너로 일하던 시절의 작업입니다.
        </p>
      </div>

      {mounted ? (
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
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
          {designPortfolios.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <SwiperSlide
                key={project.id}
                className="w-[280px]! md:w-[350px]! select-none">
                <div
                  className={`aspect-3/4 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    isActive ? 'ring-4 ring-point/50' : ''
                  }`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
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

                      <Link
                        href={`/portfolio/${project.id}`}
                        className={`mt-4 inline-flex items-center gap-1 text-white text-sm font-medium hover:text-point transition-all duration-300 ${
                          isActive
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}>
                        <span>자세히 보기</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
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

      <div className="flex justify-center gap-2 mt-8">
        {designPortfolios.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperInstance?.slideTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-point w-6'
                : 'bg-dark-300 dark:bg-dark-500 hover:bg-point/50 w-2'
            }`}
            aria-label={`카드 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
