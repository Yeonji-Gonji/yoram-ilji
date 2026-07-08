import BlogListClient from '@/components/blog/BlogListClient';
import { getPageViewsMap } from '@/lib/analytics';
import { siteConfig } from '@/lib/seo';
import { getBlogPosts } from '@/services/notion.api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그',
  description:
    '프론트엔드 개발, React, Next.js, TypeScript 등 웹 개발을 공부하며 정리한 기술 글을 기록합니다.',
  keywords: [
    '기술 블로그',
    '프론트엔드',
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    '웹 개발',
    '개발 블로그',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: '블로그 | ' + siteConfig.name,
    description:
      '프론트엔드 개발, React, Next.js, TypeScript 등 웹 개발 관련 기술 글을 공유합니다.',
    type: 'website',
    url: `${siteConfig.url}/blog`,
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, viewsMap] = await Promise.all([
    getBlogPosts(),
    getPageViewsMap(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <h1 className="text-4xl font-medium mb-8">블로그</h1>
      <BlogListClient posts={posts} viewsMap={viewsMap} />
    </div>
  );
}
