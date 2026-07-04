import NotionBlock from '@/components/common/NotionBlock';
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateSeoMetadata,
  siteConfig,
} from '@/lib/seo';
import {
  getBlogPosts,
  getPost,
  getPostContentWithChildren,
} from '@/services/notion.api';
import { NotionPage } from '@/types/notion.type';
import { getNotionBlogImageUrl, getNotionBlogTitle } from '@/utils/getResource';
import { getProxiedCoverUrl } from '@/utils/notion-image-url';
import dayjs from 'dayjs';
import { Metadata } from 'next';
import Image from 'next/image';

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    id: post.id,
  }));
}

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = (await getPost(id)) as NotionPage;
  const title = getNotionBlogTitle(post);
  const coverImage = getNotionBlogImageUrl(post);
  const category = post.properties.카테고리.select?.name;
  const publishedTime = post.properties.생성일.created_time;

  return {
    ...generateSeoMetadata({
      title,
      description: `${category ? `[${category}] ` : ''}${title} - ${siteConfig.description}`,
      image: coverImage,
      pathname: `/blog/${id}`,
    }),
    keywords: [category, '기술 블로그', '프론트엔드', title].filter(
      (k): k is string => Boolean(k),
    ),
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: `${category ? `[${category}] ` : ''}${title}`,
      type: 'article',
      publishedTime,
      modifiedTime: post.properties.생성일.created_time,
      authors: [siteConfig.author.name],
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = (await getPost(id)) as NotionPage;
  const blocks = await getPostContentWithChildren(id);
  const category = post.properties.카테고리.select?.name;
  const title = getNotionBlogTitle(post);
  const originalCoverImage = getNotionBlogImageUrl(post);
  const coverImage = getProxiedCoverUrl(originalCoverImage, id);
  const publishedTime = post.properties.생성일.created_time;

  // meta description(generateMetadata)과 동일한 조합을 사용
  const description = `${category ? `[${category}] ` : ''}${title} - ${siteConfig.description}`;

  const jsonLd = generateArticleJsonLd({
    title,
    description: description || title,
    publishedTime,
    modifiedTime: post.properties.생성일.created_time,
    author: siteConfig.author.name,
    image: coverImage,
    url: `${siteConfig.url}/blog/${id}`,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', url: siteConfig.url },
    { name: '블로그', url: `${siteConfig.url}/blog` },
    { name: title, url: `${siteConfig.url}/blog/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="relative h-[calc(50vh)] overflow-hidden">
        {/* <div className="absolute inset-0 bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-transparent opacity-50" /> */}
        {coverImage && (
          <Image
            src={coverImage}
            alt={title}
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            unoptimized
            priority
          />
        )}
      </div>
      <div className="w-full h-full dark:bg-dark-800">
        <div className="max-w-4xl mx-auto py-20 px-4 ">
          <div className="flex flex-col gap-2">
            {category && (
              <span className="w-fit text-xs font-medium rounded-full backdrop-blur-sm px-2 py-1 border-point border text-point">
                {category}
              </span>
            )}
            <h1 className="text-4xl font-medium mb-4">
              {post.properties.이름.title[0].plain_text}
            </h1>
          </div>
          <div className="flex items-center mb-8 gap-2 text-dark-400">
            <span>
              작성일:{' '}
              {dayjs(
                post.properties.날짜?.date?.start ??
                  post.properties.생성일.created_time,
              ).format('YYYY년 MM월 DD일')}
            </span>
          </div>
          <article className="text-dark-900 dark:text-light-300">
            {blocks.map((block) => (
              <NotionBlock key={block.id} block={block} pageId={id} />
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
