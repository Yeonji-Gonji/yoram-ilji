import { portfolioItems } from '@/content/portfolio';
import {
  getAdjacent,
  getFeaturedCards,
  getPortfolioBlocks,
  getPortfolioBySlug,
  getPortfolioCards,
  getPortfolioSlugs,
} from '@/services/portfolio.api';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const publicDir = path.resolve(import.meta.dirname, '../../../public');

describe('포트폴리오 정본 데이터', () => {
  it('발행 케이스 16건이 모두 로드되고 slug 가 유일하다', () => {
    expect(portfolioItems).toHaveLength(16);
    const slugs = portfolioItems.map((item) => item.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => /^[a-z0-9-]+$/.test(slug))).toBe(true);
  });

  it('필수 메타가 비어 있지 않다', () => {
    for (const item of portfolioItems) {
      expect(item.title.trim(), item.id).not.toBe('');
      expect(item.description.trim(), item.id).not.toBe('');
      expect(item.skills.length, item.id).toBeGreaterThan(0);
      expect(item.blocks.length, item.id).toBeGreaterThan(0);
    }
  });

  it('이미지는 전부 로컬 정적 파일이고 Notion 프록시를 거치지 않는다', () => {
    const sources: string[] = [];
    for (const item of portfolioItems) {
      sources.push(item.thumbnail, item.coverImage);
      for (const block of item.blocks) {
        if (block.type === 'image') sources.push(block.src);
      }
    }

    expect(sources.length).toBeGreaterThan(0);
    for (const src of sources) {
      expect(src.startsWith('/portfolio/'), src).toBe(true);
      expect(src.includes('/api/notion-image'), src).toBe(false);
      expect(existsSync(path.join(publicDir, src)), src).toBe(true);
    }
  });

  it('본문 이미지에는 레이아웃 시프트를 막을 실제 크기가 들어 있다', () => {
    for (const item of portfolioItems) {
      for (const block of item.blocks) {
        if (block.type !== 'image') continue;
        expect(block.width, block.src).toBeGreaterThan(0);
        expect(block.height, block.src).toBeGreaterThan(0);
      }
    }
  });

  it('본문에 em dash 를 쓰지 않는다', () => {
    const texts = portfolioItems.flatMap((item) => [
      item.description,
      item.subtitle,
      ...item.metrics,
    ]);
    for (const text of texts) {
      expect(text.includes('—'), text).toBe(false);
    }
  });
});

describe('포트폴리오 조회 API', () => {
  it('카테고리로 걸러낸다', async () => {
    const all = await getPortfolioCards();
    const design = await getPortfolioCards('design');
    const development = await getPortfolioCards('development');

    expect(all).toHaveLength(portfolioItems.length);
    expect(design.length + development.length).toBe(all.length);
    expect(design.every((card) => card.category === 'design')).toBe(true);
  });

  it('카드에는 본문 블록이 실리지 않는다', async () => {
    const [card] = await getPortfolioCards();
    expect(card).not.toHaveProperty('blocks');
  });

  it('대표 카드는 개발 케이스만, 대표를 앞세워 limit 만큼 준다', async () => {
    const featured = await getFeaturedCards(6);

    expect(featured).toHaveLength(6);
    expect(featured.every((card) => card.category === 'development')).toBe(
      true,
    );
    const lastFeaturedIndex = featured.findLastIndex((card) => card.featured);
    const firstPlainIndex = featured.findIndex((card) => !card.featured);
    expect(lastFeaturedIndex).toBeLessThan(firstPlainIndex);
  });

  it('limit 이 전체 개발 케이스보다 크면 있는 만큼만 준다', async () => {
    const featured = await getFeaturedCards(100);
    const development = portfolioItems.filter(
      (item) => item.category === 'development',
    );
    expect(featured).toHaveLength(development.length);
  });

  it('slug 목록은 정본 순서를 그대로 따른다', async () => {
    expect(await getPortfolioSlugs()).toEqual(
      portfolioItems.map((item) => item.id),
    );
  });

  it('slug 로 메타를 찾고, 없는 slug 는 null 이다', async () => {
    const meta = await getPortfolioBySlug('voidx-addon-sdk');
    expect(meta?.title).toBe('임베드형 AI 에이전트 SDK');
    expect(meta).not.toHaveProperty('blocks');
    expect(await getPortfolioBySlug('zzz-nonexistent-control')).toBeNull();
  });

  it('본문 블록은 slug 로 따로 가져오고, 없는 slug 는 빈 배열이다', async () => {
    const blocks = await getPortfolioBlocks('voidx-addon-sdk');
    expect(blocks.length).toBeGreaterThan(0);
    expect(await getPortfolioBlocks('zzz-nonexistent-control')).toEqual([]);
  });

  it('이전·다음은 정본 배열 순서를 따르고 양 끝에서는 null 이다', async () => {
    const slugs = portfolioItems.map((item) => item.id);

    const first = await getAdjacent(slugs[0]);
    expect(first.prev).toBeNull();
    expect(first.next?.id).toBe(slugs[1]);

    const last = await getAdjacent(slugs[slugs.length - 1]);
    expect(last.next).toBeNull();
    expect(last.prev?.id).toBe(slugs[slugs.length - 2]);

    const middle = await getAdjacent(slugs[2]);
    expect(middle.prev?.id).toBe(slugs[1]);
    expect(middle.next?.id).toBe(slugs[3]);
  });

  it('없는 slug 의 이전·다음은 둘 다 null 이다', async () => {
    expect(await getAdjacent('zzz-nonexistent-control')).toEqual({
      prev: null,
      next: null,
    });
  });
});
