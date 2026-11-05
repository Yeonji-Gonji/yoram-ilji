import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

// 실제 발송은 하지 않는다. sendMail 에 넘어간 인자만 본다.
const sendMail = vi.hoisted(() => vi.fn());
vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail }) },
}));

const valid = {
  name: '홍길동',
  email: 'hong@example.com',
  subject: '문의드립니다',
  message: '안녕하세요.',
};

const post = (body: unknown) =>
  POST(
    new NextRequest('http://localhost/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

const sentHtml = (): string => sendMail.mock.calls[0][0].html;

beforeEach(() => {
  sendMail.mockReset();
  sendMail.mockResolvedValue({});
});

describe('POST /api/send-email: HTML 이스케이프', () => {
  it('이름·제목·메시지의 태그를 이스케이프해 메일 HTML 에 넣는다', async () => {
    const res = await post({
      ...valid,
      name: '<b>이름</b>',
      subject: '<img src=x onerror=alert(1)>',
      message: '<a href="https://evil.example">클릭</a> & \'따옴표\'',
    });

    expect(res.status).toBe(200);
    const html = sentHtml();
    expect(html).not.toContain('<b>이름</b>');
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<a href="https://evil.example">');
    expect(html).toContain('&lt;b&gt;이름&lt;/b&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain(
      '&lt;a href=&quot;https://evil.example&quot;&gt;클릭&lt;/a&gt; &amp; &#39;따옴표&#39;',
    );
  });

  it('답장 링크의 mailto 주소를 URL 인코딩한다', async () => {
    const res = await post({ ...valid, email: 'a+b@example.com?cc=x' });

    expect(res.status).toBe(200);
    const html = sentHtml();
    expect(html).toContain('href="mailto:a%2Bb@example.com%3Fcc%3Dx"');
    expect(html).not.toContain('mailto:a+b@example.com?cc=x');
  });
});

describe('POST /api/send-email: 이메일 형식', () => {
  it.each(['"x"<attacker@evil.example>', 'a<b@example.com', 'a,b@example.com'])(
    '주소 목록으로 해석될 수 있는 문자가 든 %s 는 400',
    async (email) => {
      const res = await post({ ...valid, email });
      expect(res.status).toBe(400);
      expect(sendMail).not.toHaveBeenCalled();
    },
  );
});

describe('POST /api/send-email: 길이 상한', () => {
  it.each([
    ['name', 200],
    ['subject', 200],
    ['message', 5000],
  ] as const)('%s 는 %i자까지 받고 넘으면 400', async (field, max) => {
    const ok = await post({ ...valid, [field]: 'a'.repeat(max) });
    expect(ok.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const over = await post({ ...valid, [field]: 'a'.repeat(max + 1) });
    expect(over.status).toBe(400);
    expect((await over.json()).error).toContain(`${max}자`);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('이메일은 254자를 넘으면 400', async () => {
    const res = await post({
      ...valid,
      email: `${'a'.repeat(243)}@example.com`,
    });
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe('POST /api/send-email: 필드 타입', () => {
  it.each([
    ['객체', { ...valid, name: { toString: 'x' } }],
    ['배열', { ...valid, message: ['a', 'b'] }],
    ['숫자', { ...valid, subject: 123 }],
  ])('문자열이 아닌 값(%s)은 400', async (_, body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each([
    ['JSON 이 아닌 본문', 'not-json'],
    ['null 본문', 'null'],
  ])('%s 은 400', async (_, raw) => {
    const res = await post(raw);
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('빈 필드가 있으면 기존과 같이 400', async () => {
    const res = await post({ ...valid, subject: '' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('모든 필드를 입력해주세요.');
  });
});
