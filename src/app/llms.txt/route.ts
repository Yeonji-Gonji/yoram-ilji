import { siteConfig } from '@/lib/seo';
import { getBlogPosts } from '@/services/notion.api';
import { getPortfolioCards } from '@/services/portfolio.notion.api';
import { getNotionBlogTitle } from '@/utils/getResource';

export const revalidate = 3600;

/**
 * llms.txt — LLM 크롤러용 사이트 안내 문서 (https://llmstxt.org 표준 형식).
 * Notion fetch 실패 시에도 정적 부분은 항상 반환한다.
 */
export async function GET() {
  const lines: string[] = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `${siteConfig.name}(${siteConfig.url})는 프론트엔드 개발자 ${siteConfig.author.name}의 개인 사이트입니다. React, Next.js, TypeScript 중심의 기술 블로그 글과 웹 개발·디자인 포트폴리오 프로젝트를 소개합니다.`,
    '',
  ];

  // 블로그 섹션
  try {
    const posts = await getBlogPosts();
    if (posts.length > 0) {
      lines.push('## 블로그', '');
      for (const post of posts) {
        const title = getNotionBlogTitle(post);
        const category = post.properties.카테고리?.select?.name;
        const desc = category
          ? `${category} 카테고리의 기술 블로그 글`
          : '기술 블로그 글';
        lines.push(`- [${title}](${siteConfig.url}/blog/${post.id}): ${desc}`);
      }
      lines.push('');
    }
  } catch {
    // Notion fetch 실패 시 블로그 섹션 생략
  }

  // 포트폴리오 섹션
  try {
    const cards = await getPortfolioCards();
    if (cards.length > 0) {
      lines.push('## 포트폴리오', '');
      for (const card of cards) {
        const desc = card.description || card.subtitle || '포트폴리오 프로젝트';
        lines.push(
          `- [${card.title}](${siteConfig.url}/portfolio/${card.id}): ${desc}`,
        );
      }
      lines.push('');
    }
  } catch {
    // Notion fetch 실패 시 포트폴리오 섹션 생략
  }

  // 주요 페이지 섹션 (정적)
  lines.push(
    '## 주요 페이지',
    '',
    `- [홈](${siteConfig.url}): 소개와 대표 작업 모음`,
    `- [블로그](${siteConfig.url}/blog): 기술 블로그 글 목록`,
    `- [포트폴리오](${siteConfig.url}/portfolio): 프로젝트 포트폴리오 목록`,
    `- [프로필](${siteConfig.url}/profile): 개발자 프로필과 경력 소개`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
