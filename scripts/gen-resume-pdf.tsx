/**
 * 이력서 PDF 생성 스크립트 (빌드 타임)
 *
 * ResumeDocument.tsx(디자인 정본)를 그대로 정적 렌더한 뒤, Playwright(크로미움)의
 * 인쇄 엔진으로 A4 PDF를 뽑아 public/junhei-kim-resume.pdf 를 교체한다.
 * 이렇게 하면 다운로드 버튼이 내려주는 PDF가 항상 ResumeDocument 디자인·resume.ts 내용과 일치한다.
 *
 * 실행: pnpm gen:resume-pdf  (build 스크립트에서 next build 직전에 자동 실행)
 * Next 서버를 띄우지 않고 컴포넌트를 직접 렌더하므로 Vercel 정적 자산 타이밍 문제가 없다.
 */
import { chromium } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import ResumeDocument from '@/components/resume/ResumeDocument';

const OUT = path.resolve(process.cwd(), 'public/junhei-kim-resume.pdf');

// ResumeDocument는 인라인 <style>(RESUME_CSS)를 함께 렌더하므로 디자인이 그대로 따라온다.
// 화면 폰트(--font-pretendard)는 Next 폰트 설정 대신 Pretendard 웹폰트로 공급해 동일한 서체를 재현한다.
const body = renderToStaticMarkup(createElement(ResumeDocument));
const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
<style>:root{--font-pretendard:'Pretendard Variable';} html,body{margin:0;padding:0;background:#fff;}</style>
</head>
<body>${body}</body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  // ResumeDocument의 @media print 스타일(A4 @page, no-print 숨김 등)을 적용해 인쇄본 레이아웃으로 렌더
  await page.emulateMedia({ media: 'print' });
  await mkdir(path.dirname(OUT), { recursive: true });
  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true, // RESUME_CSS의 @page { size:A4; margin:15mm 16mm } 를 존중
  });
  console.log('✓ 이력서 PDF 생성 완료:', OUT);
} finally {
  await browser.close();
}
