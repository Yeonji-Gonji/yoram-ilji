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
      '타이포그래피·레이아웃·시지각의 기본기를 쌓으며 화면이 읽히고 쓰이는 방식을 고민하기 시작했습니다.',
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
      '프론트엔드 첫 실무입니다. 부동산 진단 모바일앱(Ionic Angular)의 지도·대출 계산기 화면과 데이터 시각화를 구현하고 관리자 사이트를 새로 만들면서 사내 공용 컴포넌트를 정리했습니다.',
  },
  {
    period: '2025.02 - 현재',
    role: '프로덕트 엔지니어 · 주식회사 업폴(Upfall)',
    detail:
      '임베드형 AI 에이전트 SDK를 단독 개발하고 채널마다 갈라져 있던 위젯 리포를 인하우스·카페24·쇼피파이 3앱 모노레포로 합쳐 단위 테스트 1,271건과 영향 범위 기반 자동 발행 체계로 운영합니다. 자사 SaaS 웹(API 175개)의 인증·구독 결제와 백엔드 전면 개편 이관을 맡았고 한의원 홈페이지·CMS 리뉴얼은 PM 겸 프론트엔드로 진행했습니다.',
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
