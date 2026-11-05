import { describe, expect, it } from 'vitest';
import {
  CONTACT_MAX_LENGTH,
  escapeHtml,
  toMailtoHref,
  validateContactInput,
} from './contact-email';

describe('escapeHtml', () => {
  it('&<>"\' 다섯 문자를 엔티티로 바꾼다', () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
    );
  });

  it('이미 엔티티처럼 보이는 입력도 글자 그대로 보이게 한 번만 이스케이프한다', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });

  it('한글·줄바꿈은 그대로 둔다', () => {
    expect(escapeHtml('안녕하세요\n두 번째 줄')).toBe('안녕하세요\n두 번째 줄');
  });
});

describe('toMailtoHref', () => {
  it('@ 는 남기고 로컬·도메인 부분의 URL 예약 문자를 인코딩한다', () => {
    expect(toMailtoHref('a+b@example.com')).toBe('mailto:a%2Bb@example.com');
    expect(toMailtoHref('x@example.com?bcc=y&body=z')).toBe(
      'mailto:x@example.com%3Fbcc%3Dy%26body%3Dz',
    );
  });
});

describe('validateContactInput', () => {
  const valid = {
    name: '홍길동',
    email: 'hong@example.com',
    subject: '문의',
    message: '내용',
  };

  it('정상 입력은 그대로 돌려준다', () => {
    expect(validateContactInput(valid)).toEqual({ ok: true, input: valid });
  });

  it('상한을 넘으면 필드 이름과 상한을 담은 안내를 준다', () => {
    const r = validateContactInput({
      ...valid,
      message: 'a'.repeat(CONTACT_MAX_LENGTH.message + 1),
    });
    expect(r).toEqual({
      ok: false,
      error: '메시지는 5000자 이하로 입력해주세요.',
    });
  });

  it.each([null, undefined, 'text', 1, []])(
    '객체가 아닌 본문(%j)은 필수 입력 안내',
    (body) => {
      expect(validateContactInput(body)).toEqual({
        ok: false,
        error: '모든 필드를 입력해주세요.',
      });
    },
  );
});
