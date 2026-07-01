'use client';

import { motion } from 'framer-motion';

interface Stage {
  period: string;
  role: string;
  detail: string;
}

// 디자인 → 개발 전향 서사 (사실 기반, 슬로건 없이)
const STAGES: Stage[] = [
  {
    period: '대학',
    role: '시각디자인 전공',
    detail:
      '타이포그래피·레이아웃·시지각의 기본기를 쌓으며, 화면이 읽히고 쓰이는 방식을 고민하기 시작했습니다.',
  },
  {
    period: '2020 - 2022',
    role: 'UI/UX·GUI 디자이너',
    detail:
      '커머스·패션뷰티 브랜드 웹·모바일을 기획·디자인했습니다(오뚜기몰·동원몰·V12·YOUANDUS·앤드백 등). 검색·장바구니·주문서 같은 화면을 상태(state) 단위까지 설계했습니다.',
  },
  {
    period: '전향',
    role: '프론트엔드로 전환',
    detail:
      '디자인을 전달하고 끝내기보다 제품을 끝까지 직접 구현하고 싶어 개발로 방향을 틀었습니다.',
  },
  {
    period: '2023.12 - 2024.07',
    role: '프론트엔드 · ARESA Korea',
    detail:
      '부동산 진단·계산 서비스에서 지도·대출 계산기·관리자처럼 데이터가 많은 화면을 다뤘습니다. React로 배웠지만 사내 스택 Angular에 빠르게 적응했습니다.',
  },
  {
    period: '2025.02 - 현재',
    role: 'AI 프로덕트 PM + 프론트엔드 · 주식회사 업폴(Upfall)',
    detail:
      '1년 가까이 정체됐던 신규 AI 챗봇 서비스의 PM을 맡아 3개월 만에 출시 준비까지 끌어냈고, 임베드형 AI SDK의 배포 방식을 NPM에서 CDN으로 전환했습니다. 기획과 개발 사이의 간극을 좁혀 제품의 완성도를 높이는 일을 합니다.',
  },
];

export default function ProfileTimeline() {
  return (
    <section className="w-full py-20">
      <h2 className="mb-12 text-2xl font-medium md:text-3xl">
        디자인에서 개발까지
      </h2>

      <div className="relative pl-8 border-l-2 border-light-400 dark:border-dark-700">
        {STAGES.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative pb-12 last:pb-0">
            {/* 노드 */}
            <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-light-100 bg-point dark:border-dark-900" />
            <p className="text-xs font-medium tracking-wider uppercase text-point">
              {stage.period}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{stage.role}</h3>
            <p className="mt-2 leading-relaxed text-dark-500 dark:text-dark-400">
              {stage.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
