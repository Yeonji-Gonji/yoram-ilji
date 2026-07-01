'use client';

import { categoryLabels, PortfolioCategory } from '@/data/portfolio';
import { PortfolioCard } from '@/lib/portfolio-content';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  cards: PortfolioCard[];
  initialCategory?: PortfolioCategory | 'all';
}

export default function PortfolioListClient({
  cards,
  initialCategory = 'all',
}: Props) {
  const [activeCategory, setActiveCategory] = useState<
    PortfolioCategory | 'all'
  >(initialCategory);

  const filteredProjects =
    activeCategory === 'all'
      ? cards
      : cards.filter((project) => project.category === activeCategory);

  const categories: (PortfolioCategory | 'all')[] = [
    'all',
    'development',
    'design',
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-point text-white'
                : 'bg-light-300 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-light-400 dark:hover:bg-dark-600'
            }`}>
            {category === 'all' ? '전체' : categoryLabels[category]}
          </button>
        ))}
      </div>
      <p className="text-sm text-dark-600 pb-6 border-b border-dark-400/30">
        {filteredProjects.length}개의 프로젝트
      </p>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}>
            <Link href={`/portfolio/${project.id}`} className="group block">
              <article className="rounded-2xl overflow-hidden bg-light-200 dark:bg-dark-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* 썸네일 (없으면 브랜드 컬러 그라데이션) */}
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}30 0%, ${project.color}10 100%)`,
                  }}>
                  {project.thumbnail ? (
                    <>
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center px-6">
                      <span className="text-center text-lg font-medium text-dark-600 dark:text-dark-300">
                        {project.title}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-medium bg-white/90 dark:bg-black/70 text-gray-800 dark:text-gray-200 rounded-full backdrop-blur-sm">
                      {categoryLabels[project.category]}
                    </span>
                  </div>
                </div>

                {/* 정보 */}
                <div className="p-5">
                  <div className="mb-4">
                    <h2 className="font-medium text-lg group-hover:text-point transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-sm text-dark-400 dark:text-dark-500">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* 기술/도구 미리보기 */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 text-xs rounded-full bg-light-400 dark:bg-dark-700 text-dark-600 dark:text-dark-300">
                        {item}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-dark-400">
                        +{project.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-dark-400 dark:text-dark-500 text-lg">
            해당 카테고리의 프로젝트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
