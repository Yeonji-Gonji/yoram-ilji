'use client';

import { appConfig } from '@/lib/config';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { SphereModel } from '../common/SphereModel';

export function ProfileHero() {
  const email = appConfig.contactEmail;
  return (
    <div className="flex items-center justify-center w-full dark:bg-dark-900">
      <div className="flex flex-col-reverse items-center justify-between w-full">
        <div className="flex flex-col justify-center flex-1 shrink">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="pb-6 mb-6 text-center border-b border-slate-200 dark:border-slate-800">
              <h1 className="mb-2 text-4xl font-medium tracking-tight md:text-5xl text-slate-900 dark:text-white">
                JUNHEI KIM
              </h1>

              <p className="text-xl text-slate-500 dark:text-slate-400 *:font-medium">
                Frontend Developer
              </p>
            </div>
            <div className="mb-8 space-y-4">
              <p className="leading-6 text-slate-600 dark:text-slate-300">
                시각디자인을 전공하고 UI/UX 디자이너로 일하다 프론트엔드
                개발자로 전향했습니다. 디자이너 시절 쌓은 화면 설계와 디자인
                시스템 경험은, 지금 코드를 작성할 때 사용자 관점에서 판단하는
                기준이 됩니다.
                <br />
                <br />
                현재는 AI 프로덕트 스타트업에서 기획(PM)과 프론트엔드 개발을
                함께 맡고 있습니다. 1년 가까이 방향을 잡지 못하던 신규 AI 챗봇
                서비스의 PM을 맡아, 3개월 만에 브랜딩과 서비스 목표를 확정하고
                MVP 개발·출시 준비까지 끌어냈습니다. 기획과 개발 사이의 간극을
                좁혀 제품의 완성도를 높이는 일을 해왔습니다.
                <br />
                <br />
                여러 서비스를 운영 단계까지 책임지면서, 실사용자 결제 장애를
                직접 감지해 프론트엔드에서 추가 피해를 막고 당일 환불로 대응한
                경험도 있습니다. 임베드형 AI SDK는 호스트 사이트와의 버전 충돌을
                해결하기 위해 배포 방식을 NPM에서 CDN으로 바꾸고, GitHub
                Actions로 배포를 자동화했습니다.
                <br />
                <br />그 전에는 부동산 진단 서비스에서 지도·대출 계산기처럼
                데이터가 많은 화면을 다루며 프론트엔드 기초를 쌓았고, 전시 부스
                체험 웹앱을 3D(react-three-fiber)와 실시간 채팅으로 구현하기도
                했습니다. 새로운 기술 스택이 주어져도 검증하고 만들어내며
                적응하는 편입니다.
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  <span>Seoul, South Korea</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="size-4" />
                  <span>{email}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 오른쪽 - 원형 3D 모델 */}
        <div className="items-center justify-center hidden md:flex">
          <SphereModel className="w-full h-[200px]" />
        </div>
      </div>
    </div>
  );
}
