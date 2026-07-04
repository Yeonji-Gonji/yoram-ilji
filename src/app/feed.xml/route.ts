import { siteConfig } from '@/lib/seo';
import { getBlogPosts } from '@/services/notion.api';
import { getNotionBlogTitle } from '@/utils/getResource';
import type { NotionPage } from '@/types/notion.type';

export const revalidate = 3600;

/** XML 특수문자 이스케이프 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toItemXml(post: NotionPage): string {
  const title = getNotionBlogTitle(post);
  const category = post.properties.카테고리?.select?.name;
  const description = `${category ? `[${category}] ` : ''}${title} - ${siteConfig.description}`;
  const url = `${siteConfig.url}/blog/${post.id}`;
  const dateStr =
    post.properties.날짜?.date?.start ?? post.properties.생성일.created_time;
  const pubDate = new Date(dateStr).toUTCString();

  return [
    '    <item>',
    `      <title>${escapeXml(title)}</title>`,
    `      <link>${escapeXml(url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    `      <description>${escapeXml(description)}</description>`,
    '    </item>',
  ].join('\n');
}

/** RSS 2.0 피드. Notion fetch 실패 시에도 빈 channel의 유효한 XML을 반환한다. */
export async function GET() {
  let itemsXml = '';
  try {
    const posts = await getBlogPosts();
    itemsXml = posts.map(toItemXml).join('\n');
  } catch {
    itemsXml = '';
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(siteConfig.name)}</title>`,
    `    <link>${escapeXml(siteConfig.url)}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    `    <language>${siteConfig.language}</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${siteConfig.url}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    '  </channel>',
    '</rss>',
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
