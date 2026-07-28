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

/** 정량 지표는 본문 아래 회색 캡션(블록)으로 분리 */
function Bullet({ b }: { b: ResumeBullet }) {
  return (
    <li>
      <Inline md={b.md} />
      {b.metric && <span className="metric">{b.metric}</span>}
    </li>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

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
        {/* ===== 마스트헤드 ===== */}
        <div className="doc-head">
          <div className="contact">
            {resume.contacts.map((c, i) => (
              <Fragment key={c.label}>
                {i > 0 && <span className="dot" aria-hidden />}
                <span>
                  <b>{c.label}</b> {c.value}
                </span>
              </Fragment>
            ))}
          </div>

          <div className="name">{resume.name}</div>
          <div className="role">{resume.title}</div>

          <p className="tag">{resume.tagline}</p>
          <p className="intro">{resume.summaryLead}</p>

          <div className="leads">
            {resume.summaryPoints.map((b, i) => (
              <div className="lead-row" key={i}>
                <span className="n">{pad(i + 1)}</span>
                <p>
                  <Inline md={b.md} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 01 경력 ===== */}
        <section>
          <div className="sec-head">
            <span className="idx">01</span>
            <h2>경력</h2>
          </div>
          <div className="jobs">
            {resume.experience.map((exp) => (
              <div className="job" key={exp.company}>
                <div className="when">
                  <b>{exp.period}</b>
                  <span>{exp.role}</span>
                </div>
                <div className="body">
                  <div className="org">
                    <span className="co">{exp.company}</span>
                    {exp.note && <span className="note">{exp.note}</span>}
                  </div>
                  <ul>
                    {exp.bullets.map((b, i) => (
                      <Bullet key={i} b={b} />
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 02 사이드 프로젝트 ===== */}
        <section>
          <div className="sec-head">
            <span className="idx">02</span>
            <h2>사이드 프로젝트</h2>
          </div>
          <div className="projs">
            {resume.sideProjects.map((b, i) => (
              <div className="proj" key={i}>
                <Inline md={b.md} />
                {b.metric && <span className="metric">{b.metric}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ===== 03 기술 스택 ===== */}
        <section>
          <div className="sec-head">
            <span className="idx">03</span>
            <h2>기술 스택</h2>
          </div>
          <div className="skills">
            {resume.skills.map((row) => (
              <div className="skill" key={row.label}>
                <div className="k">{row.label}</div>
                <div className="v">{row.items}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 04 학력 · 교육 · 자격 ===== */}
        <section>
          <div className="sec-head">
            <span className="idx">04</span>
            <h2>학력 · 교육 · 자격</h2>
          </div>
          <div className="edu">
            {resume.education.map((g) => (
              <div className="edu-group" key={g.label}>
                <div className="edu-label">{g.label}</div>
                {g.items.map((it, i) => (
                  <div className="e" key={i}>
                    <div className="when">
                      <b>{it.period}</b>
                    </div>
                    <div className="ebody">
                      <span className="et">{it.title}</span>
                      {it.subtitle && <span className="es">{it.subtitle}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <p className="foot">
          온라인 이력서 <code>yoramilji.kr</code> · 정량 지표는 실측치이며 값이
          없는 항목은 추정하지 않았습니다.
        </p>
      </article>

      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
    </div>
  );
}

const RESUME_CSS = `
/* ===== 토큰 (에디토리얼 그레이스케일 · 라이트 페이퍼 고정) ===== */
.resume-scope {
  --paper:#ffffff; --ink:#1b1b1b; --ink-2:#4a4a4a; --ink-3:#6e6e6e; --ink-4:#9a9a9a;
  --rule:#eaeaea; --rule-2:#d4d4d4;
  --sans: var(--font-pretendard), 'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif;
  background:#eceae6; min-height:100vh; padding:96px 16px 48px;
}
.resume-scope *,
.resume-scope { font-variant-numeric: tabular-nums; }

/* ===== 화면 전용 툴바 ===== */
.resume-toolbar { max-width:210mm; margin:0 auto 14px; display:flex; align-items:center;
  gap:12px; flex-wrap:wrap; }
.resume-toolbar button { background:var(--ink); color:#fff; border:0; border-radius:8px;
  padding:10px 18px; font-size:14px; font-weight:700; cursor:pointer; font-family:var(--sans);
  letter-spacing:.02em; }
.resume-toolbar button:hover { background:#000; }
.resume-toolbar .hint { font-size:12px; color:var(--ink-3); }

/* ===== A4 문서 ===== */
.resume-doc {
  width:210mm; max-width:100%; margin:0 auto; background:var(--paper); color:var(--ink);
  padding:17mm 17mm 15mm; box-shadow:0 4px 24px rgba(0,0,0,.10);
  font-family:var(--sans); font-size:10pt; line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.resume-doc * { box-sizing:border-box; }

/* ===== 마스트헤드 ===== */
.doc-head { display:flex; flex-direction:column; margin-bottom:24px; }
.doc-head .contact { display:flex; flex-wrap:wrap; align-items:center; gap:5px 10px;
  font-size:8pt; letter-spacing:.05em; color:var(--ink-4); margin-bottom:18px; }
.doc-head .contact b { color:var(--ink); font-weight:600; text-transform:uppercase; letter-spacing:.1em; }
.doc-head .contact .dot { width:2px; height:2px; border-radius:50%; background:var(--ink-4); display:inline-block; }
.doc-head .name { font-size:25pt; font-weight:800; letter-spacing:-.035em; line-height:1.08; color:var(--ink); }
.doc-head .role { font-size:8.5pt; letter-spacing:.16em; text-transform:uppercase;
  color:var(--ink-4); margin-top:5px; }
.doc-head .tag { font-size:11.5pt; line-height:1.5; color:var(--ink-3); margin:14px 0 0; letter-spacing:-.005em; }
.doc-head .intro { font-size:10pt; line-height:1.7; color:var(--ink-2); margin:10px 0 0; max-width:64em; }

.doc-head .leads { display:flex; flex-direction:column; margin-top:16px; }
.doc-head .lead-row { display:grid; grid-template-columns:20px 1fr; gap:12px; padding:8px 0;
  border-top:1px solid var(--rule); align-items:start; break-inside:avoid; }
.doc-head .leads .lead-row:last-child { border-bottom:1px solid var(--rule); }
.doc-head .lead-row .n { font-size:7.5pt; letter-spacing:.08em; color:var(--ink-4); padding-top:2px; }
.doc-head .lead-row p { margin:0; font-size:9.6pt; line-height:1.6; color:var(--ink-2); }
.doc-head .lead-row strong { color:var(--ink); font-weight:700; }

/* ===== 섹션 ===== */
.resume-doc section { margin-top:22px; }
.resume-doc .sec-head { display:flex; flex-direction:column; gap:3px; margin-bottom:12px; break-after:avoid; }
.resume-doc .sec-head .idx { font-size:8pt; letter-spacing:.16em; color:var(--ink-4); }
.resume-doc .sec-head h2 { margin:0; font-size:13.5pt; font-weight:800; letter-spacing:-.03em; color:var(--ink); }

/* ===== 공통 리스트 / 지표 ===== */
.resume-doc ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:7px; }
.resume-doc li { font-size:9.6pt; line-height:1.6; color:var(--ink-2); break-inside:avoid; }
.resume-doc strong { color:var(--ink); font-weight:600; }
.resume-doc .metric { display:block; margin-top:3px; font-size:8pt; letter-spacing:.01em;
  color:var(--ink-4); line-height:1.5; }

/* ===== 경력 ===== */
.resume-doc .job { display:grid; grid-template-columns:37mm 1fr; gap:8mm; padding:12px 0;
  border-top:1px solid var(--rule); align-items:start; }
.resume-doc .jobs .job:last-child { border-bottom:1px solid var(--rule); }
.resume-doc .job .when { display:flex; flex-direction:column; gap:3px; padding-top:2px; break-after:avoid; }
.resume-doc .job .when b { font-size:9pt; font-weight:700; letter-spacing:.01em; color:var(--ink); }
.resume-doc .job .when span { font-size:8pt; letter-spacing:.04em; color:var(--ink-4); }
.resume-doc .job .org { display:flex; flex-direction:column; gap:2px; margin-bottom:8px; break-after:avoid; }
.resume-doc .job .org .co { font-size:12pt; font-weight:700; letter-spacing:-.02em; color:var(--ink); }
.resume-doc .job .org .note { font-size:8.4pt; font-style:italic; color:var(--ink-3); line-height:1.45; }

/* ===== 사이드 프로젝트 ===== */
.resume-doc .proj { padding:9px 0; border-top:1px solid var(--rule);
  font-size:9.6pt; line-height:1.6; color:var(--ink-2); break-inside:avoid; }
.resume-doc .projs .proj:last-child { border-bottom:1px solid var(--rule); }
.resume-doc .proj strong { color:var(--ink); font-weight:700; }

/* ===== 기술 스택 ===== */
.resume-doc .skill { display:grid; grid-template-columns:32mm 1fr; gap:6mm; padding:8px 0;
  border-top:1px solid var(--rule); align-items:baseline; break-inside:avoid; }
.resume-doc .skills .skill:last-child { border-bottom:1px solid var(--rule); }
.resume-doc .skill .k { font-size:9pt; font-weight:700; letter-spacing:.01em; color:var(--ink); }
.resume-doc .skill .v { font-size:9.4pt; line-height:1.6; color:var(--ink-2); }

/* ===== 학력 · 교육 · 자격 ===== */
.resume-doc .edu-label { font-size:8pt; letter-spacing:.14em; text-transform:uppercase;
  color:var(--ink-4); margin:14px 0 2px; }
.resume-doc .edu-group:first-child .edu-label { margin-top:0; }
.resume-doc .edu .e { display:grid; grid-template-columns:37mm 1fr; gap:8mm; padding:9px 0;
  border-top:1px solid var(--rule); align-items:start; break-inside:avoid; }
.resume-doc .edu .edu-group:last-child .e:last-child { border-bottom:1px solid var(--rule); }
.resume-doc .edu .when b { font-size:9pt; font-weight:700; letter-spacing:.01em; color:var(--ink); }
.resume-doc .edu .ebody { display:flex; flex-direction:column; gap:2px; }
.resume-doc .edu .et { font-size:10.5pt; font-weight:700; letter-spacing:-.02em; color:var(--ink); }
.resume-doc .edu .es { font-size:8.6pt; color:var(--ink-3); line-height:1.45; }

/* ===== 푸터 ===== */
.resume-doc .foot { margin:22px 0 0; border-top:1px solid var(--rule); padding-top:14px;
  font-size:8pt; line-height:1.7; color:var(--ink-4); }
.resume-doc .foot code { font-family:var(--sans); font-size:8pt; color:var(--ink-3); }

/* ===== 인쇄 ===== */
@media print {
  @page { size:A4; margin:15mm 16mm; }
  html, body { background:#fff !important; }
  /* 사이트 크롬 숨김: Header(<header>), CursorTrail(<canvas>), FullScreenLoader(.z-9999) */
  header, canvas, .z-9999, .no-print { display:none !important; }
  .resume-scope { background:#fff; padding:0; min-height:0; }
  .resume-doc { width:auto; max-width:none; margin:0; padding:0; box-shadow:none; font-size:10pt; }
  .resume-doc, .resume-scope { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  /* 작은 단위만 쪼개짐 방지. section·job은 한 페이지보다 클 수 있어 제외(제외 안 하면 빈 페이지 발생) */
  .resume-doc .proj, .resume-doc .skill,
  .resume-doc .edu .e, .resume-doc .lead-row { break-inside:avoid; }
}
`;
