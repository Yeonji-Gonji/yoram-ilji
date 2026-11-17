/**
 * 노션 이미지 URL을 프록시 URL로 변환합니다.
 *
 * 노션의 S3 임시 URL은 약 1시간 후 만료되므로,
 * 프록시 API를 통해 항상 유효한 이미지를 제공합니다.
 */

/**
 * S3 임시 URL인지 확인합니다.
 */
export function isNotionS3Url(url: string): boolean {
  return url.includes("prod-files-secure.s3.us-west-2.amazonaws.com");
}

/**
 * 커버 이미지용 프록시 URL을 생성합니다.
 */
export function getCoverProxyUrl(pageId: string): string {
  return `/api/notion-image?type=cover&pageId=${pageId}`;
}

/**
 * 블록 이미지용 프록시 URL을 생성합니다.
 */
export function getBlockImageProxyUrl(pageId: string, blockId: string): string {
  return `/api/notion-image?type=block&pageId=${pageId}&blockId=${blockId}`;
}

/**
 * 노션 이미지 URL이 S3 임시 URL이면 프록시 URL로 변환하고,
 * 외부 영구 URL이면 그대로 반환합니다.
 */
export function getProxiedCoverUrl(
  originalUrl: string | null,
  pageId: string
): string | null {
  if (!originalUrl) return null;

  // S3 임시 URL인 경우 프록시 사용
  if (isNotionS3Url(originalUrl)) {
    return getCoverProxyUrl(pageId);
  }

  // 외부 영구 URL은 그대로 사용
  return originalUrl;
}

/**
 * 페이지 밖에서 읽히는 커버 URL(og:image, twitter:image, JSON-LD image)을 만듭니다.
 *
 * 공유 미리보기 수집기와 검색 봇은 HTML에 적힌 URL을 나중에 따로 받아 갑니다.
 * S3 임시 URL을 그대로 적으면 만료 뒤 403이 되므로 프록시의 절대 URL로 바꾸고,
 * 외부 영구 URL은 그대로 반환합니다.
 */
export function getShareableCoverUrl(
  originalUrl: string | null,
  pageId: string,
  siteUrl: string
): string | null {
  const coverUrl = getProxiedCoverUrl(originalUrl, pageId);
  if (!coverUrl) return null;

  // 프록시 URL은 경로만 있으므로 사이트 주소를 붙여 절대 URL로 만든다
  return coverUrl.startsWith("/")
    ? new URL(coverUrl, siteUrl).toString()
    : coverUrl;
}
