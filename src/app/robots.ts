import { siteConfig } from '@/lib/seo';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 크롤러는 페이지 렌더링을 위해 JS/CSS(_next/static)를 읽어야 하므로 _next는 차단하지 않는다.
  // 커버 이미지는 /api/notion-image로 서빙되므로 이미지 색인을 위해 예외 허용한다.
  // (그 외 /api 라우트는 크롤 가치가 없어 계속 차단.)
  const allow = ['/', '/api/notion-image'];
  const disallow = ['/api/', '/404', '/private/'];

  return {
    rules: [
      { userAgent: '*', allow, disallow },
      { userAgent: 'Googlebot', allow, disallow },
      { userAgent: 'Yeti', allow, disallow }, // Naver 봇
      { userAgent: 'Bingbot', allow, disallow },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
