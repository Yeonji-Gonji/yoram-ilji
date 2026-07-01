'use client';

import { resume, type ResumeBullet } from '@/data/resume';
import { Fragment } from 'react';

/** 마크다운 볼드(**강조**)만 인라인 렌더 */
function Inline({ md }: { md: string }) {
  const parts = md.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

function Bullet({ b }: { b: ResumeBullet }) {
  return (
    <li>
      <Inline md={b.md} />
      {b.metric && <span className="metric"> ({b.metric})</span>}
    </li>
  );
}

export default function ResumeDocument() {
  return (
    <div className="resume-scope">
      {/* 화면 전용 툴바 (인쇄 시 숨김) */}
      <div className="resume-toolbar no-print">
        <button type="button" onClick={() => window.print()}>
          PDF로 저장 / 인쇄
        </button>
        <span className="hint">
          인쇄 대화상자에서 여백 &ldquo;기본&rdquo;, 배경 그래픽 켜기 ·
          머리글/바닥글 끄기를 권장합니다.
        </span>
      </div>

      <article className="resume-doc">
        <div className="doc-head">
          <div className="name">
            {resume.name} <span>: {resume.title}</span>
          </div>
          <div className="tag">{resume.tagline}</div>
          <div className="contact">
            {resume.contacts.map((c, i) => (
              <Fragment key={c.label}>
                {i > 0 && ' · '}
                <b>{c.label}</b> {c.value}
              </Fragment>
            ))}
          </div>
        </div>

        <section>
          <h2>소개</h2>
          <p className="lead">{resume.summaryLead}</p>
          <ul>
            {resume.summaryPoints.map((b, i) => (
              <Bullet key={i} b={b} />
            ))}
          </ul>
        </section>

        <section>
          <h2>경력</h2>
          {resume.experience.map((exp) => (
            <div className="job" key={exp.company}>
              <h3>
                {exp.company}: {exp.role} &nbsp;|&nbsp; {exp.period}
              </h3>
              {exp.note && <div className="meta">{exp.note}</div>}
              <ul>
                {exp.bullets.map((b, i) => (
                  <Bullet key={i} b={b} />
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>사이드 프로젝트</h2>
          <ul>
            {resume.sideProjects.map((b, i) => (
              <Bullet key={i} b={b} />
            ))}
          </ul>
        </section>

        <section>
          <h2>기술</h2>
          {resume.skills.map((row) => (
            <div className="skill-row" key={row.label}>
              <b>{row.label}</b> {row.items}
            </div>
          ))}
        </section>

        <section>
          <h2>학력 · 기타</h2>
          <ul>
            {resume.education.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>
      </article>

      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
    </div>
  );
}

const RESUME_CSS = `
/* ===== 화면 배경 & 툴바 ===== */
.resume-scope { --point:#f56a33; --ink:#1f1f1f; --muted:#6b6b6b; --hair:#e6e1da;
  background:#eceae6; min-height:100vh; padding:96px 16px 48px; }
.resume-toolbar { max-width:210mm; margin:0 auto 14px; display:flex; align-items:center;
  gap:12px; flex-wrap:wrap; }
.resume-toolbar button { background:var(--point); color:#fff; border:0; border-radius:8px;
  padding:10px 18px; font-size:14px; font-weight:700; cursor:pointer;
  font-family:var(--font-pretendard); }
.resume-toolbar button:hover { background:#d4521f; }
.resume-toolbar .hint { font-size:12px; color:var(--muted); }

/* ===== A4 문서 ===== */
.resume-doc {
  width:210mm; max-width:100%; margin:0 auto; background:#fff; color:#2b2b2b;
  padding:14mm 15mm; box-shadow:0 4px 24px rgba(0,0,0,.12);
  font-family:var(--font-pretendard); font-size:10.2pt; line-height:1.5;
}
.resume-doc * { box-sizing:border-box; }
.resume-doc .doc-head { border-bottom:2px solid var(--point); padding-bottom:10px; margin-bottom:14px; }
.resume-doc .name { font-size:22pt; font-weight:800; color:var(--ink); letter-spacing:-.02em; }
.resume-doc .name span { color:var(--point); }
.resume-doc .tag { color:var(--muted); font-size:10pt; margin:4px 0 8px; }
.resume-doc .contact { font-size:9pt; color:#444; }
.resume-doc .contact b { color:var(--ink); }

.resume-doc h2 { font-size:11.5pt; font-weight:800; color:var(--ink); margin:16px 0 8px;
  padding-left:9px; border-left:3px solid var(--point); letter-spacing:-.01em;
  break-after:avoid; }
.resume-doc h3 { font-size:10.5pt; font-weight:700; color:var(--ink); margin:11px 0 1px;
  break-after:avoid; }
.resume-doc .meta { color:var(--muted); font-size:8.8pt; font-style:italic; margin:0 0 4px; }
.resume-doc p.lead { margin:0 0 8px; }
.resume-doc ul { margin:3px 0 6px; padding-left:18px; break-inside:avoid;
  list-style:disc outside; }
.resume-doc li { margin:2.5px 0; }
.resume-doc li::marker { color:var(--point); }
.resume-doc strong { color:var(--ink); font-weight:700; }
.resume-doc .metric { color:var(--muted); font-size:8.8pt; }
.resume-doc .skill-row { margin:3px 0; }
.resume-doc .skill-row b { display:inline-block; min-width:82px; color:var(--point); font-size:9.2pt; }
.resume-doc .job { break-inside:auto; }

/* ===== 인쇄 ===== */
@media print {
  @page { size:A4; margin:14mm 15mm; }
  html, body { background:#fff !important; }
  /* 사이트 크롬 숨김: Header(<header>), CursorTrail(<canvas>), FullScreenLoader(.z-9999) */
  header, canvas, .z-9999, .no-print { display:none !important; }
  .resume-scope { background:#fff; padding:0; min-height:0; }
  .resume-doc { width:auto; max-width:none; margin:0; padding:0; box-shadow:none; }
  .resume-doc, .resume-scope { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
}
`;
