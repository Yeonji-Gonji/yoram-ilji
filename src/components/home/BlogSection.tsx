'use client';

import CarouselDots from '@/components/common/CarouselDots';
import SectionHeader from '@/components/common/SectionHeader';
import { NotionPage } from '@/types/notion.type';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BlogCard from '../common/BlogCard';

interface Props {
  posts: NotionPage[];
}

export default function BlogSection({ posts }: Props) {
  const [mounted, setMounted] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const displayPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) =>
          dayjs(
            b.properties.날짜?.date?.start ?? b.properties.생성일.created_time,
          ).diff(
            dayjs(
              a.properties.날짜?.date?.start ?? a.properties.생성일.created_time,
            ),
          ),
        )
        .slice(0, 6),
    [posts],
  );

  const [activeIndex, setActiveIndex] = useState(
    Math.floor(displayPosts.length / 2),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pointer-events-auto relative z-10 mx-auto w-full max-w-7xl px-6">
      <SectionHeader
        title="Blog"
        href="/blog"
        subtitle="공부하며 정리한 글을 기록합니다."
      />

      {mounted ? (
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={Math.floor(displayPosts.length / 2)}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          speed={500}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="overflow-visible! py-4">
          {displayPosts.map((post, index) => {
            const isActive = index === activeIndex;
            return (
              <SwiperSlide
                key={post.id}
                className="w-[280px]! sm:w-[320px]! md:w-[380px]! select-none">
                <div
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-100' : 'scale-95 opacity-70'
                  }`}>
                  <BlogCard post={post} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="flex justify-center gap-6 py-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[320px] md:w-[380px] aspect-4/3 rounded-2xl bg-light-300 dark:bg-dark-700 animate-pulse"
            />
          ))}
        </div>
      )}

      <CarouselDots
        count={displayPosts.length}
        activeIndex={activeIndex}
        onSelect={(index) => swiperInstance?.slideTo(index)}
      />
    </div>
  );
}
