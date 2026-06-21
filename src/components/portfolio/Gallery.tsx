'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  title: string;
  images: string[];
  heading?: string;
}

/** 스크린샷 그리드 + 풀스크린 라이트박스. 개발/디자인 상세 공용. */
export default function Gallery({ title, images, heading = 'Screenshots' }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selected]);

  if (images.length === 0) return null;

  return (
    <section className="bg-light-200 px-6 py-16 dark:bg-dark-900">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-2xl font-medium">
          {heading}
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="group relative aspect-9/16 cursor-pointer overflow-hidden rounded-2xl bg-dark-800"
              onClick={() => setSelected(index)}>
              <Image
                src={image}
                alt={`${title} 스크린샷 ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/95">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent px-6 py-4">
              <p className="text-sm text-white/70">
                {title} — {selected + 1} / {images.length}
              </p>
              <button
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="-mt-8 px-6 pb-16 md:px-16 lg:px-32">
              <div className="mx-auto max-w-3xl">
                <Image
                  src={images[selected]}
                  alt={`${title} 스크린샷 ${selected + 1}`}
                  width={1080}
                  height={1920}
                  className="h-auto w-full rounded-2xl"
                  priority
                />
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent py-4">
              <div className="flex justify-center gap-2 overflow-x-auto px-6">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-12 shrink-0 overflow-hidden rounded-lg transition-all ${
                      selected === index
                        ? 'scale-105 ring-2 ring-white'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                    onClick={() => setSelected(index)}>
                    <Image
                      src={image}
                      alt={`썸네일 ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
