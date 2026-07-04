import { Metadata } from 'next';
import { appConfig } from './config';

export const siteConfig = {
  name: '요람일지',
  description:
    '프론트엔드 개발자 준희의 기술 블로그입니다. React, Next.js, TypeScript 등 웹 개발 지식과 프로젝트 경험을 공유합니다.',
  url: appConfig.siteUrl,
  author: {
    name: 'MODAC',
    url: 'https://github.com/MODAC0',
    email: 'modac0@naver.com',
  },
  locale: 'ko_KR',
  language: 'ko',
  themeColor: '#ff675b',
  keywords: [
    '프론트엔드',
    '개발자',
    '블로그',
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    '웹 개발',
    '포트폴리오',
    '기술 블로그',
    '요람일지',
    'MODAC',
  ],
  social: {
    github: 'https://github.com/MODAC0',
  },
  verification: {
    google: 'UimLmElRI67QcT3q6TV1e69w7TLIEIapPPodlLsUk-k',
    naver: '6ea838eea3a76e335a02ba4a15e6bc54190674d6',
  },
};

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string | null;
  noIndex?: boolean;
  pathname?: string;
}

export function generateSeoMetadata({
  title,
  description,
  image,
  noIndex = false,
  pathname = '',
}: GenerateMetadataProps = {}): Metadata {
  // OG용 전체 제목. <title>은 루트 layout의 template(%s | 요람일지)이 사이트명을
  // 붙이므로 여기서 붙이면 "… | 요람일지 | 요람일지"로 중복된다.
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageUrl = `${siteConfig.url}${pathname}`;

  return {
    ...(title ? { title } : {}),
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      // image 미지정 시 파일 컨벤션(opengraph-image.tsx) OG 이미지가 적용되도록
      // images 필드를 아예 넣지 않는다.
      ...(image
        ? {
            images: [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: pageTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  };
}

// 블로그 포스트용 JSON-LD 구조화 데이터 생성
export function generateArticleJsonLd({
  title,
  description,
  publishedTime,
  modifiedTime,
  author,
  image,
  url,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  image?: string | null;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    image: image || undefined,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// 웹사이트 JSON-LD 구조화 데이터 생성
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Person/Organization JSON-LD 구조화 데이터 생성
export function generatePersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    sameAs: [siteConfig.social.github],
    jobTitle: '프론트엔드 개발자',
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Web Development',
    ],
  };
}

// Breadcrumb JSON-LD 구조화 데이터 생성
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// 포트폴리오용 CreativeWork JSON-LD 구조화 데이터 생성
export function generatePortfolioJsonLd({
  title,
  description,
  image,
  url,
  dateCreated,
  skills,
}: {
  title: string;
  description: string;
  image?: string;
  url: string;
  dateCreated?: string;
  skills?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description,
    image: image,
    url: url,
    dateCreated: dateCreated,
    creator: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    keywords: skills?.join(', '),
  };
}

// 프로필 페이지용 ProfilePage JSON-LD 구조화 데이터 생성
export function generateProfilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
      sameAs: [siteConfig.social.github],
      jobTitle: '프론트엔드 개발자',
      description: siteConfig.description,
    },
  };
}
