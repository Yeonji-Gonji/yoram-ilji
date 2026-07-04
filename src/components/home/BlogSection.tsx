import SectionHeader from '@/components/common/SectionHeader';
import RetryImage from '@/components/common/RetryImage';
import { NotionPage } from '@/types/notion.type';
import { getNotionBlogImageUrl, getNotionBlogTitle } from '@/utils/getResource';
import { getProxiedCoverUrl } from '@/utils/notion-image-url';
import dayjs from 'dayjs';
import Link from 'next/link';

/** 홈 블로그 그리드 한 칸: 원본 페이지 + 서버에서 만든 본문 요약 */
export interface HomeBlogPost {
  page: NotionPage;
  excerpt: string;
}

interface Props {
  posts: HomeBlogPost[];
}

/**
 * 홈 Blog — 최신 글 4×2 그리드. 캐러셀 대신 제목+2줄 요약을 펼쳐서
 * 한 화면에 최대한 많은 콘텐츠를 노출하는 전략.
 */
export default function BlogSection({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <div className="pointer-events-auto relative z-10 mx-auto w-full max-w-7xl px-6">
      <SectionHeader
        title="Blog"
        href="/blog"
        subtitle="공부하며 정리한 글을 기록합니다."
      />

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 text-left sm:grid-cols-2 lg:grid-cols-4">
        {posts.map(({ page, excerpt }) => (
          <BlogGridCard key={page.id} page={page} excerpt={excerpt} />
        ))}
      </div>
    </div>
  );
}

/**
 * 그리드 전용 콤팩트 카드. 공용 BlogCard(오버레이형)와 달리 텍스트를
 * 이미지 밖으로 꺼내 요약까지 보여준다.
 */
function BlogGridCard({ page, excerpt }: HomeBlogPost) {
  const title = getNotionBlogTitle(page);
  const coverImageUrl = getProxiedCoverUrl(getNotionBlogImageUrl(page), page.id);
  const category = page.properties.카테고리.select?.name;
  // 표시 날짜는 '날짜'(실제 발행일) 우선, 없으면 생성일로 폴백
  const displayDate =
    page.properties.날짜?.date?.start ?? page.properties.생성일.created_time;

  return (
    <Link href={`/blog/${page.id}`} className="group block">
      <article className="flex h-full flex-col">
        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          {coverImageUrl ? (
            <RetryImage
              src={coverImageUrl}
              alt={title}
              fill
              draggable={false}
              className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
          )}

          {category && (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm dark:bg-black/70 dark:text-gray-200">
              {category}
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 font-semibold leading-snug text-dark-900 transition-colors duration-300 group-hover:text-point dark:text-light-100">
          {title}
        </h3>

        {excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-dark-500 dark:text-dark-400">
            {excerpt}
          </p>
        )}

        <time
          dateTime={dayjs(displayDate).format('YYYY-MM-DD')}
          className="mt-auto pt-2 text-xs text-dark-400 dark:text-dark-500">
          {dayjs(displayDate).format('YYYY.MM.DD')}
        </time>
      </article>
    </Link>
  );
}
