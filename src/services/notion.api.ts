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

const dataSourceId = process.env.NOTION_DATA_SOURCE_ID!;

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
          property: '생성일',
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
          property: '생성일',
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
