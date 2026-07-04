import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

/**
 * 홈 최상단 히어로. 사이트에서 유일한 h1을 가지는 SEO 앵커 섹션.
 * 노출할 실사 이미지가 없어 우측 비주얼은 브랜드 모티프(요람+구체) SVG로 대신한다.
 * 배경의 3D 파티클(BubbleModelScene)과 겹치므로 일러스트는 선 위주로 가볍게 유지.
 */
export default function HomeHeroSection() {
  return (
    <>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center md:text-left">
          <p className="animate-hero-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-point motion-reduce:animate-none">
            Frontend Developer &middot; Portfolio &amp; Tech Blog
          </p>

          <h1 className="animate-hero-fade-up hero-delay-1 mt-4 text-4xl font-semibold leading-tight text-dark-900 motion-reduce:animate-none md:text-5xl lg:text-6xl dark:text-light-100">
            디자인에서 출발한
            <br />
            프론트엔드 개발 기록,
            <br />
            <span className="text-point">요람일지</span>
          </h1>

          <p className="animate-hero-fade-up hero-delay-2 mx-auto mt-6 max-w-xl text-base leading-relaxed text-dark-500 motion-reduce:animate-none md:mx-0 md:text-lg dark:text-dark-400">
            시각디자인을 전공하고 프론트엔드 개발자로 전향했습니다. React,
            Next.js, TypeScript로 만든 프로젝트와 그 과정에서 배운 것들을
            이곳에 기록합니다.
          </p>

          <div className="animate-hero-fade-up hero-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3 motion-reduce:animate-none md:justify-start">
            <Link
              href="/portfolio"
              className="rounded-full bg-point px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-point-dark">
              포트폴리오 보기
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-light-500 px-6 py-3 text-sm font-medium text-dark-700 transition-colors hover:border-point hover:text-point dark:border-dark-600 dark:text-dark-300 dark:hover:border-point dark:hover:text-point">
              블로그 읽기
            </Link>
          </div>

          <p className="animate-hero-fade-up hero-delay-4 mt-10 text-xs tracking-wide text-dark-400 motion-reduce:animate-none dark:text-dark-500">
            React &middot; Next.js &middot; TypeScript &middot; Three.js
          </p>
        </div>

        {/* 모바일에서는 히어로가 한 화면을 넘지 않도록 일러스트 생략 (3D 배경이 비주얼 역할) */}
        <HeroIllustration className="hidden w-full max-w-md justify-self-center md:block" />
      </div>

      {/* 스크롤 유도 */}
      <div
        className="absolute inset-x-0 bottom-8 flex flex-col items-center"
        aria-hidden="true">
        <ChevronDown className="h-5 w-5 animate-scroll-chevron-1 text-dark-400" />
        <ChevronDown className="-mt-2.5 h-5 w-5 animate-scroll-chevron-2 text-dark-400" />
        <ChevronDown className="-mt-2.5 h-5 w-5 animate-scroll-chevron-3 text-dark-400" />
      </div>
    </>
  );
}

/**
 * 요람(흔들리는 아치) + 그 위에 뜬 구체. "요람에서 자라나는 기록"의 모티프.
 * 구체는 배경 3D 파티클 구와 형태를 맞춰 브랜드 연속성을 준다. 장식용이므로 aria-hidden.
 */
function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 420"
      fill="none"
      aria-hidden="true"
      className={className}>
      <defs>
        <linearGradient id="hero-cradle" x1="120" y1="260" x2="360" y2="310">
          <stop offset="0%" stopColor="#f56a33" />
          <stop offset="100%" stopColor="#d4521f" />
        </linearGradient>
        <radialGradient id="hero-sphere" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffb08a" />
          <stop offset="60%" stopColor="#f56a33" />
          <stop offset="100%" stopColor="#d4521f" />
        </radialGradient>
      </defs>

      {/* 궤도: 점선 원이 아주 천천히 회전 */}
      <g
        className="animate-hero-orbit motion-reduce:animate-none"
        style={{ transformOrigin: '240px 230px' }}>
        <circle
          cx="240"
          cy="230"
          r="185"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
          className="text-light-500 dark:text-dark-600"
        />
        <circle cx="240" cy="45" r="4" fill="#f56a33" />
        <circle cx="425" cy="230" r="3" className="fill-sky-500" />
      </g>

      {/* 요람 + 구체: 원호 중심(240,140)을 축으로 부드럽게 흔들림 */}
      <g
        className="animate-cradle-rock motion-reduce:animate-none"
        style={{ transformOrigin: '240px 140px' }}>
        <path
          d="M120 260 A170 170 0 0 0 360 260"
          stroke="url(#hero-cradle)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M146 268 A140 140 0 0 0 334 268"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-point/30"
        />
        <g className="animate-hero-float motion-reduce:animate-none">
          <circle cx="240" cy="252" r="48" fill="url(#hero-sphere)" />
          <circle cx="224" cy="236" r="12" fill="#ffffff" opacity="0.35" />
        </g>
      </g>

      {/* 떠 있는 입자들: 배경 파티클의 잔향 */}
      <g className="animate-hero-float motion-reduce:animate-none">
        <circle cx="72" cy="150" r="6" fill="#f56a33" opacity="0.8" />
        <circle cx="404" cy="128" r="5" className="fill-sky-500" opacity="0.8" />
      </g>
      <g
        className="animate-hero-float hero-delay-2 motion-reduce:animate-none">
        <circle
          cx="92"
          cy="322"
          r="4"
          className="fill-light-500 dark:fill-dark-500"
        />
        <circle cx="396" cy="310" r="7" fill="#f56a33" opacity="0.5" />
      </g>

      {/* 반짝임 */}
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-light-500 dark:text-dark-500">
        <path d="M150 76 v16 M142 84 h16" />
        <path d="M352 58 v12 M346 64 h12" />
      </g>
    </svg>
  );
}
