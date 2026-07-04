import { siteConfig } from '@/lib/seo';
import { getPost } from '@/services/notion.api';
import { NotionPage } from '@/types/notion.type';
import { getNotionBlogTitle } from '@/utils/getResource';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '블로그 포스트';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = (await getPost(id)) as NotionPage;
  const title = getNotionBlogTitle(post);
  const category = post.properties.카테고리?.select?.name || '블로그';

  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 60,
        color: 'white',
        fontFamily: 'sans-serif',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
        <span
          style={{
            fontSize: 24,
            color: '#ff675b',
            fontWeight: 'bold',
          }}>
          {category}
        </span>
        <span
          style={{
            fontSize: 52,
            fontWeight: 'bold',
            lineHeight: 1.3,
            maxWidth: 1000,
          }}>
          {title}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
        <span
          style={{
            fontSize: 28,
            color: '#a0a0a0',
          }}>
          {siteConfig.name}
        </span>
        <span
          style={{
            fontSize: 20,
            color: '#666',
          }}>
          {siteConfig.url}
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
