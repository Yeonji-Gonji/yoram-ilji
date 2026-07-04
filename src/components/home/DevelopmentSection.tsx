'use client';

import CarouselDots from '@/components/common/CarouselDots';
import SectionHeader from '@/components/common/SectionHeader';
import { PortfolioCard } from '@/lib/portfolio-content';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface Props {
  cards: PortfolioCard[];
}

/** 카드 사이 부채꼴 간격(도). 커질수록 부채가 활짝 펴진다 */
const STEP_DEG = 17;
/** 부채꼴 회전축까지의 거리(px). 커질수록 호가 완만해진다 */
const RADIUS = 980;
/** 중심 기준 양옆으로 보여줄 카드 수 (그 밖은 숨김) */
const VISIBLE_RANGE = 2;

/**
 * 홈 Selected Work — 개발 케이스를 부채꼴(fan)로 펼친 갤러리.
 * 카드들이 호를 따라 기울어져 늘어서고, 가운데 카드만 똑바로 서서
 * 확대되며 설명이 펼쳐진다. 드래그·스와이프·가로 휠로 회전, 무한 루프,
 * 옆 카드 클릭은 가운데로, 가운데 카드 클릭은 상세로 이동.
 */
export default function DevelopmentSection({ cards }: Props) {
  const [active, setActive] = useState(0);
  const drag = useRef({ startX: 0, moved: false, dragging: false });
  const wheelLock = useRef(0);

  const n = cards.length;
  if (n === 0) return null;

  const move = (dir: 1 | -1) => setActive((a) => (a + dir + n) % n);

  /** i번 카드의 중심(active) 기준 순환 오프셋: -n/2 ~ n/2 범위로 접는다 */
  const offsetOf = (i: number) => {
    let o = (i - active) % n;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, moved: false, dragging: true };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    if (Math.abs(e.clientX - drag.current.startX) > 10) {
      drag.current.moved = true;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
  };
  /** 가로 휠(트랙패드)만 반응, 세로 스크롤은 페이지에 그대로 둔다 */
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20)
      return;
    const now = Date.now();
    if (now - wheelLock.current < 450) return;
    wheelLock.current = now;
    move(e.deltaX > 0 ? 1 : -1);
  };

  return (
    <div className="relative z-10 w-full px-6 mx-auto pointer-events-auto max-w-7xl">
      <SectionHeader
        title="Development"
        href="/portfolio?category=development"
        subtitle="기획과 개발을 함께 진행한 작업입니다."
      />

      {/* 부채꼴 스테이지: 컨테이너를 벗어나 화면 전체 폭으로. 양끝 카드는
          레퍼런스처럼 화면 가장자리에서 잘리는 연출이 된다.
          세로 스크롤은 통과시키고 가로 제스처만 받는다 */}
      <div
        className="relative left-1/2 h-[560px] w-screen -translate-x-1/2 cursor-grab overflow-hidden select-none active:cursor-grabbing md:h-[600px]"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}>
        {cards.map((card, i) => {
          const o = offsetOf(i);
          const isActive = o === 0;
          const hidden = Math.abs(o) > VISIBLE_RANGE;

          return (
            <div
              key={card.id}
              className={`absolute top-10 left-1/2 -ml-[130px] w-[260px] transition-all duration-500 ease-out motion-reduce:transition-none md:-ml-[145px] md:w-[290px] ${
                hidden ? 'pointer-events-none opacity-0' : ''
              }`}
              style={{
                // 회전만 부채꼴 축 기준. 확대는 안쪽에서 카드 중심 기준으로
                // (여기에 scale을 함께 넣으면 먼 축 기준으로 커져 카드가 위로 밀린다)
                transform: `rotate(${o * STEP_DEG}deg)`,
                transformOrigin: `50% ${RADIUS}px`,
                zIndex: 10 - Math.abs(o),
              }}>
              <div
                className="transition-transform duration-500 ease-out motion-reduce:transition-none"
                style={{
                  transform: isActive ? 'translateY(-6px) scale(1.05)' : 'none',
                }}>
                <FanCard
                  card={card}
                  isActive={isActive}
                  onClick={(e) => {
                    // 드래그 끝에 발생한 클릭은 무시, 옆 카드는 가운데로
                    if (drag.current.moved) {
                      e.preventDefault();
                      return;
                    }
                    if (!isActive) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <CarouselDots
        count={n}
        activeIndex={active}
        onSelect={(index) => setActive(index)}
      />
    </div>
  );
}

/**
 * 부채꼴 카드. 옆 카드는 이미지+제목만, 가운데 카드는 요약·스킬·CTA가
 * 아래로 펼쳐진다 (max-height 트랜지션).
 */
function FanCard({
  card,
  isActive,
  onClick,
}: {
  card: PortfolioCard;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={`/portfolio/${card.id}`}
      onClick={onClick}
      draggable={false}
      aria-label={`${card.title} 케이스 자세히 보기`}
      className={`block rounded-3xl border bg-light-100 p-3 text-left shadow-xl transition-all duration-500 dark:bg-dark-800 ${
        isActive
          ? 'cursor-pointer border-point/60 shadow-[0_24px_60px_-20px_var(--color-point)]'
          : 'border-light-300 dark:border-dark-700'
      }`}>
      {/* 상단 비주얼: 썸네일 또는 케이스 컬러 헤더 */}
      <div className="relative overflow-hidden aspect-4/3 rounded-2xl">
        {card.thumbnail ? (
          <Image
            src={card.thumbnail}
            alt={card.title}
            fill
            unoptimized
            draggable={false}
            className="object-cover pointer-events-none"
            sizes="290px"
          />
        ) : (
          <div
            className="flex flex-col justify-between w-full h-full p-4"
            style={{
              background: `linear-gradient(150deg, ${card.color}33 0%, ${card.color}0d 100%)`,
            }}>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: card.color }}>
              {card.period}
            </span>
            <span
              className="h-1.5 w-10 rounded-full"
              style={{ backgroundColor: card.color }}
            />
          </div>
        )}
      </div>

      <h3
        className={`mt-3 px-1 font-semibold leading-snug transition-colors ${
          isActive
            ? 'text-dark-900 dark:text-light-100'
            : 'text-dark-600 dark:text-dark-300'
        }`}>
        {card.title}
      </h3>

      {/* 가운데 카드에서만 펼쳐지는 상세 */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isActive ? 'max-h-44 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <p className="mt-1.5 px-1 text-sm leading-relaxed line-clamp-2 text-dark-500 dark:text-dark-300">
          {card.subtitle}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5 px-1">
          {card.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full bg-light-400 px-2 py-0.5 text-xs text-dark-600 dark:bg-dark-700 dark:text-dark-300">
              {s}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 px-1 mt-3 mb-1 text-xs font-medium text-point">
          케이스 보기
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
