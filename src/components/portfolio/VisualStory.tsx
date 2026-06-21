'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  title: string;
  images: string[];
}

/**
 * 디자인 케이스용 비주얼 스토리 — 이미지를 크게 세로로 흐르듯 쌓아 보여준다.
 * (개발 케이스의 작은 스크린샷 그리드 Gallery와 대비되는, "이미지가 주인공"인 레이아웃)
 */
export default function VisualStory({ title, images }: Props) {
  if (images.length === 0) return null;
  return (
    <section className="px-6 py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {images.map((src, i) => (
          <motion.figure
            key={src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl bg-light-300 dark:bg-dark-800">
            <Image
              src={src}
              alt={`${title} 비주얼 ${i + 1}`}
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
