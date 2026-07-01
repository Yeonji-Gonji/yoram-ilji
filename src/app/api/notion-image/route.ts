import { getBlock, getPost } from '@/services/notion.api';
import { NotionPage } from '@/types/notion.type';
import { BlockObjectResponse } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId');
  const blockId = searchParams.get('blockId');
  const type = searchParams.get('type') || 'cover';

  try {
    let imageUrl: string | null = null;

    if (type === 'cover' && pageId) {
      // 페이지 커버 이미지
      const post = (await getPost(pageId)) as NotionPage;
      const cover = post.cover;

      if (cover?.type === 'file') {
        imageUrl = cover.file.url;
      } else if (cover?.type === 'external') {
        imageUrl = cover.external.url;
      }
    } else if (type === 'block' && blockId) {
      // 본문 내 이미지 블록: ID로 직접 조회 (중첩·페이지네이션 안전)
      const block = (await getBlock(blockId)) as BlockObjectResponse;

      if (block && 'type' in block && block.type === 'image') {
        const imageBlock = block.image;
        if (imageBlock.type === 'file') {
          imageUrl = imageBlock.file.url;
        } else if (imageBlock.type === 'external') {
          imageUrl = imageBlock.external.url;
        }
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 이미지를 가져와서 프록시
    const imageResponse = await fetch(imageUrl, {
      next: { revalidate: 0 }, // 항상 신선한 데이터 가져오기
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: imageResponse.status },
      );
    }

    const contentType =
      imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Notion image proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
