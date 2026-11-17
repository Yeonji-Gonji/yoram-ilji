import { describe, expect, it } from 'vitest';
import { getShareableCoverUrl } from './notion-image-url';

const SITE_URL = 'https://example.com';
const PAGE_ID = '00000000-0000-4000-8000-000000000003';
const PROXY_URL = `${SITE_URL}/api/notion-image?type=cover&pageId=${PAGE_ID}`;
const S3_URL =
  'https://prod-files-secure.s3.us-west-2.amazonaws.com/workspace/file/cover.png?X-Amz-Expires=3600&X-Amz-Signature=test';
const EXTERNAL_URL = 'https://images.unsplash.com/photo-1?fm=jpg';

describe('getShareableCoverUrl', () => {
  it('S3 임시 URL 은 사이트의 프록시 절대 URL 로 바꾼다', () => {
    expect(getShareableCoverUrl(S3_URL, PAGE_ID, SITE_URL)).toBe(PROXY_URL);
  });

  it('사이트 URL 끝에 슬래시가 있어도 같은 주소가 나온다', () => {
    expect(getShareableCoverUrl(S3_URL, PAGE_ID, `${SITE_URL}/`)).toBe(
      PROXY_URL,
    );
  });

  it('외부 영구 URL 은 그대로 돌려준다', () => {
    expect(getShareableCoverUrl(EXTERNAL_URL, PAGE_ID, SITE_URL)).toBe(
      EXTERNAL_URL,
    );
  });

  it('커버가 없으면 null 을 돌려준다', () => {
    expect(getShareableCoverUrl(null, PAGE_ID, SITE_URL)).toBeNull();
  });
});
