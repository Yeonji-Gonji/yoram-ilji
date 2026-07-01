import ResumeDocument from '@/components/resume/ResumeDocument';
import { siteConfig } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이력서',
  description:
    '프론트엔드 개발자 김준희(MODAC)의 이력서. 디자인 감각을 갖춘 프론트엔드 · 기획과 개발 사이를 메우는 개발자.',
  keywords: ['이력서', '프론트엔드 개발자', 'React', 'Next.js', 'TypeScript', '포트폴리오'],
  alternates: { canonical: '/resume' },
  openGraph: {
    title: '이력서 | ' + siteConfig.name,
    description: '프론트엔드 개발자 김준희(MODAC)의 이력서.',
    type: 'profile',
    url: `${siteConfig.url}/resume`,
  },
};

export default function ResumePage() {
  return <ResumeDocument />;
}
