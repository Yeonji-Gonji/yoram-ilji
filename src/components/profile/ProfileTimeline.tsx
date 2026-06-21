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
      '타이포그래피·레이아웃·시지각의 기본기를 쌓으며 "보기 좋은 것"이 아니라 "읽히고 쓰이는 것"을 고민하기 시작했습니다.',
  },
  {
    period: '~ 2022',
    role: 'UI/UX 디자이너',
    detail:
      '커머스·패션뷰티 브랜드 웹사이트를 디자인했습니다(오뚜기몰·ANNE KLEIN·YOUANDUS·ANDBAG 등). 디자인 시스템과 사이트맵을 직접 설계하며 화면 너머의 구조를 보는 눈을 길렀습니다.',
  },
  {
    period: '전향',
    role: '프론트엔드로 전환',
    detail:
      '디자인을 넘겨주고 끝나는 게 아니라, 프로덕트의 가치를 끝까지 직접 실현하고 싶어 개발로 방향을 틀었습니다.',
  },
  {
    period: '2023.12 - 2024.07',
    role: '프론트엔드 · ARESA Korea',
    detail:
      '부동산 진단·계산 서비스에서 지도·대출 계산기·관리자처럼 데이터가 많은 화면을 다뤘습니다. React로 배웠지만 사내 스택 Angular에 빠르게 적응했습니다.',
  },
  {
    period: '2024 - 현재',
    role: 'AI 프로덕트 PM + 프론트엔드 · 주식회사 업폴(Upfall)',
    detail:
      'AI 에이전트 챗봇과 임베드형 SDK를 기획·개발했습니다. 기획과 개발 사이의 병목을, 화면을 직접 구현할 수 있다는 점으로 메우는 일을 합니다.',
  },
];

export default function ProfileTimeline() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20">
      <h2 className="mb-12 text-2xl font-medium md:text-3xl">
        디자인에서 개발까지
      </h2>

      <div className="relative border-l-2 border-light-400 pl-8 dark:border-dark-700">
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
            <p className="text-xs font-medium uppercase tracking-wider text-point">
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
