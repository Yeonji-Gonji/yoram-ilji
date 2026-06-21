import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  caption?: string;
  // 'wide' = 본문 폭 넘어 풀폭에 가깝게
  wide?: boolean;
}

/** 본문 인라인 이미지 + 캡션. 디자인 케이스 비주얼 스토리에 사용. */
export default function Figure({ src, alt, caption, wide }: Props) {
  return (
    <figure className={`my-10 ${wide ? 'lg:-mx-16' : ''}`}>
      <div className="relative overflow-hidden rounded-2xl bg-light-300 dark:bg-dark-800">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-dark-500 dark:text-dark-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
