/**
 * 포트폴리오 PDF 생성 스크립트
 *
 * PortfolioDocument.tsx(디자인)를 정적 렌더한 뒤 Playwright(크로미움) 인쇄 엔진으로 A4 PDF를 뽑는다.
 * 내용 정본 = docs/portfolio/case-01~08.md, 렌더 소스 = src/data/portfolio-doc.ts.
 * 이력서(gen-resume-pdf.tsx)와 같은 방식이라 두 산출물의 양식이 어긋나지 않는다.
 *
 * 실행: pnpm gen:portfolio-pdf [출력경로]
 * 기본 출력: docs/portfolio/_out/김준희_포트폴리오.pdf (제출 산출물 규칙 = docs/portfolio/README.md)
 */
import { chromium } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import PortfolioDocument from '@/components/resume/PortfolioDocument';

const [, , outArg] = process.argv;
const OUT = outArg
  ? path.resolve(process.cwd(), outArg)
  : path.resolve(
      process.cwd(),
      '../docs/portfolio/_out/김준희_포트폴리오.pdf',
    );

const body = renderToStaticMarkup(createElement(PortfolioDocument));
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
  await page.emulateMedia({ media: 'print' });
  await mkdir(path.dirname(OUT), { recursive: true });
  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log('✓ 포트폴리오 PDF 생성 완료:', OUT);
} finally {
  await browser.close();
}
