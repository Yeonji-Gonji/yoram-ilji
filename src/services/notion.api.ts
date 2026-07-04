import { appConfig } from '@/lib/config';
import { NotionPage } from '@/types/notion.type';
import {
  Client,
  GetPageResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const dataSourceId = appConfig.notion.blogDataSourceId;

// 자식 블록을 포함한 확장된 블록 타입
export type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren[];
};

export const getPublishedPosts = async () => {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: '발행',
      checkbox: {
        equals: true,
      },
    },
  });
  return response;
};

export async function getBlogPosts() {
  if (!dataSourceId) {
    throw new Error('NOTION_DATA_SOURCE_ID가 설정되지 않았습니다.');
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: '발행',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
    });
    // 3. 타입 단언
    return response.results as NotionPage[];
  } catch (error) {
    console.error('Notion API Error:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

/**
 * 목록·카드용 본문 요약. DB에 요약 property가 없어 본문 앞쪽 paragraph의
 * 텍스트를 이어붙여 만든다. 홈처럼 서버에서 소수의 글에만 사용할 것
 * (글마다 블록 조회 1회가 추가되므로 전체 목록에는 부적합).
 */
export const getPostExcerpt = async (
  pageId: string,
  maxLength = 150,
): Promise<string> => {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 12,
    });
    const blocks = response.results.filter(
      (block): block is BlockObjectResponse => 'type' in block,
    );
    const collect = (types: string[]) =>
      blocks
        .map((block) => {
          if (!types.includes(block.type)) return '';
          const value = (block as unknown as Record<string, unknown>)[
            block.type
          ] as { rich_text?: { plain_text: string }[] };
          return value?.rich_text?.map((rt) => rt.plain_text).join('') ?? '';
        })
        .filter(Boolean)
        .join(' ');

    // 문단 우선, 문단이 없는 글(목록·소제목으로 시작)은 목록/제목 텍스트로 폴백
    const text =
      collect(['paragraph']) ||
      collect([
        'bulleted_list_item',
        'numbered_list_item',
        'heading_2',
        'heading_3',
        'quote',
        'callout',
      ]);
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}…`;
  } catch (error) {
    console.error('Notion excerpt fetch error:', error);
    return '';
  }
};

export const getPost = async (id: string): Promise<GetPageResponse> => {
  const response = await notion.pages.retrieve({ page_id: id });
  return response;
};

/** 단일 블록을 ID로 직접 조회 (중첩·페이지네이션과 무관하게 안전). */
export const getBlock = async (blockId: string) => {
  return notion.blocks.retrieve({ block_id: blockId });
};

export const getPostContent = async (
  id: string,
): Promise<ListBlockChildrenResponse> => {
  const response = await notion.blocks.children.list({ block_id: id });
  return response;
};

/**
 * 특정 블록의 자식 블록들을 가져옵니다.
 */
export const getBlockChildren = async (
  blockId: string,
): Promise<BlockObjectResponse[]> => {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    blocks.push(
      ...response.results.filter(
        (block): block is BlockObjectResponse => 'type' in block,
      ),
    );

    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return blocks;
};

export const getBlocksWithChildren = async (
  blockId: string,
): Promise<BlockWithChildren[]> => {
  const blocks = await getBlockChildren(blockId);

  const blocksWithChildren = await Promise.all(
    blocks.map(async (block): Promise<BlockWithChildren> => {
      if (block.has_children) {
        const children = await getBlocksWithChildren(block.id);
        return { ...block, children };
      }
      return block;
    }),
  );

  return blocksWithChildren;
};

export const getPostContentWithChildren = async (
  pageId: string,
): Promise<BlockWithChildren[]> => {
  return getBlocksWithChildren(pageId);
};

export async function getPostsByCategory(category: string) {
  if (!dataSourceId) {
    throw new Error('NOTION_DATA_SOURCE_ID가 설정되지 않았습니다.');
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          {
            property: '발행',
            checkbox: {
              equals: true,
            },
          },
          {
            property: '카테고리',
            select: {
              equals: category,
            },
          },
        ],
      },
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
    });
    return response.results as NotionPage[];
  } catch (error) {
    console.error('Notion API Error:', error);
    return [];
  }
}
