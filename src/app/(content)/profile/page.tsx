import ProfileExperience from '@/components/profile/ProfileExperience';
import { ProfileHero } from '@/components/profile/ProfileHero';
import ProfileSkills from '@/components/profile/ProfileSkills';
import ProfileTimeline from '@/components/profile/ProfileTimeline';
import FloatingResumeCTA from '@/components/resume/FloatingResumeCTA';
import { generateProfilePageJsonLd, siteConfig } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로필',
  description:
    '프론트엔드 개발자 MODAC의 프로필입니다. 기술 스택, 경험, 프로젝트 이력을 확인하세요.',
  keywords: [
    '프론트엔드 개발자',
    '프로필',
    '이력서',
    'React',
    'Next.js',
    'TypeScript',
  ],
  alternates: {
    canonical: '/profile',
  },
  openGraph: {
    title: '프로필 | ' + siteConfig.name,
    description:
      '프론트엔드 개발자 MODAC의 프로필입니다. 기술 스택, 경험, 프로젝트 이력을 확인하세요.',
    type: 'profile',
    url: `${siteConfig.url}/profile`,
  },
};

const profileJsonLd = generateProfilePageJsonLd();

export default function ProfilePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <div className="w-full max-w-6xl px-6 py-16 mx-auto">
        <ProfileHero />
        <ProfileTimeline />
        <ProfileExperience />
        <ProfileSkills />
      </div>
      <FloatingResumeCTA />
    </>
  );
}
