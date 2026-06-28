'use client';

import { NotionPage } from '@/types/notion.type';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BlogCard from '../common/BlogCard';

interface Props {
  posts: NotionPage[];
  viewCounts: Record<string, number>;
}

export default function BlogSection({ posts, viewCounts }: Props) {
  const [mounted, setMounted] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const displayPosts = useMemo(
    () =>
      posts
        .sort((a, b) =>
          dayjs(b.properties.생성일.created_time).diff(
            dayjs(a.properties.생성일.created_time),
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
    <div className="relative z-10 w-full px-6 py-16 mx-auto pointer-events-auto">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center gap-2 group">
          <h2 className="text-3xl font-bold transition-all duration-300 md:text-4xl group-hover:text-point">
            Blog
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
          공부하며 정리한 글을 기록합니다.
        </p>
      </div>

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
                  <BlogCard post={post} viewCount={viewCounts[post.id]} />
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

      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mt-8">
        {displayPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperInstance?.slideTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'w-6 bg-point'
                : 'w-1.5 bg-light-400 dark:bg-dark-600 hover:bg-point/50'
            }`}
            aria-label={`${index + 1}번 포스트로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
