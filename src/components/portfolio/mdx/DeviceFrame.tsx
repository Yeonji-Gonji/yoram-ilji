import Image from 'next/image';

interface FrameProps {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption?: string;
}

/** 브라우저 크롬 안에 PC 화면 목업. */
export function BrowserFrame({ src, alt, w, h, caption }: FrameProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-xl border border-light-400 shadow-xl dark:border-dark-700">
        <div className="flex items-center gap-1.5 bg-light-300 px-3 py-2 dark:bg-dark-700">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f0625b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5bf4f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#5fc777]" />
          <span className="ml-2 flex-1 rounded bg-light-100 px-3 py-0.5 font-mono text-[10px] text-dark-400 dark:bg-dark-800">
            ottogimall.co.kr
          </span>
        </div>
        <Image src={src} alt={alt} width={w} height={h} className="block w-full" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-dark-500 dark:text-dark-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** 폰 베젤 안에 모바일 화면 목업. 여러 개를 가로로 늘어놓을 때 사용. */
export function PhoneFrame({ src, alt, w, h, caption }: FrameProps) {
  return (
    <figure className="my-2 flex flex-col items-center">
      <div className="w-full max-w-[220px] rounded-[26px] bg-[#16181c] p-2 shadow-xl">
        <div className="overflow-hidden rounded-[20px] bg-white">
          <Image src={src} alt={alt} width={w} height={h} className="block w-full" />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-dark-500 dark:text-dark-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** 폰 목업 여러 개를 반응형 그리드로. */
export function PhoneRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 grid grid-cols-2 gap-5 sm:grid-cols-3">{children}</div>
  );
}
