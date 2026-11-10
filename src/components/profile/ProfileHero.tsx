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
                Frontend Developer · Product Engineer
              </p>
            </div>
            <div className="mb-8 space-y-4">
              <p className="leading-6 text-slate-600 dark:text-slate-300">
                시각디자인을 전공하고 UI/UX 디자이너로 2년 4개월 일하다
                프론트엔드 개발자로 전향했습니다. 지금은 화면 안쪽만 보지 않고
                백엔드 API 계약, 배포, 인프라, 기획까지 시스템 전체 구조를
                파악한 상태에서 프론트엔드가 맡을 범위를 정하고 그 범위는
                끝까지 책임지는 방식으로 일합니다.
                <br />
                <br />
                AI 에이전트 SaaS 스타트업 업폴에서 고객사 사이트에 script 한
                줄로 설치되는 임베드형 AI 에이전트 SDK를 단독으로 설계했고
                채널마다 갈라져 있던 위젯 리포를 인하우스·카페24·쇼피파이 세
                앱이 공용 패키지를 나눠 쓰는 모노레포로 합쳐 단위 테스트
                1,271건이 빌드 앞단을 지키는 구조로 키웠습니다. 같은 기간 자사
                SaaS 웹에서는 회원 인증과 구독 결제를 설계·구현하고 백엔드
                재설계에 맞춰 175개 API 경로를 계약 테스트로 고정해 끊김 없이
                옮겼으며 한의원 홈페이지·CMS 리뉴얼은 PM을 겸해 요구사항
                정의부터 출시와 유지보수까지 맡았습니다.
                <br />
                <br />
                복잡한 비즈니스 규칙과 손댈 수 없는 레거시가 함께 있을 때
                주로 일이 막힙니다. 그래서 요구사항을 문서로 먼저 맞추고
                계약과 오류 응답을 테스트로 고정하고 배포 뒤에는 직접 재보는
                쪽을 택해 왔습니다. 동료와 사용자가 믿고 쓸 수 있는 제품을
                만드는 일을 계속하고 싶습니다.
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
