'use client';

import { resume, type ResumeBullet, type ResumeData } from '@/data/resume';
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
      {b.subs && b.subs.length > 0 && (
        <ul className="subs">
          {b.subs.map((s, i) => (
            <li key={i}>
              <Inline md={s} />
            </li>
          ))}
        </ul>
      )}
      {b.metric && <span className="metric">{b.metric}</span>}
    </li>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

// data: 공고 맞춤본 렌더용. 기본은 정본(data.ts) — 맞춤본도 같은 양식으로만 그린다.
export default function ResumeDocument({ data = resume }: { data?: ResumeData }) {
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
            {data.contacts.map((c, i) => (
              <Fragment key={c.label}>
                {i > 0 && <span className="dot" aria-hidden />}
                <span>
                  <b>{c.label}</b> {c.value}
                </span>
              </Fragment>
            ))}
          </div>

          <div className="name">{data.name}</div>
          <div className="role">{data.title}</div>

          <p className="tag">{data.tagline}</p>
          <p className="intro">{data.summaryLead}</p>

          <div className="leads">
            {data.summaryPoints.map((b, i) => (
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
            {data.experience.map((exp) => (
              <div className="job" key={exp.company}>
                <div className="org">
                  <span className="co">{exp.company}</span>
                  <div className="meta">
                    <span>{exp.period}</span>
                    <span className="bar" aria-hidden>
                      |
                    </span>
                    <span>{exp.role}</span>
                  </div>
                  {exp.note && <span className="note">{exp.note}</span>}
                </div>
                <ul>
                  {exp.bullets.map((b, i) => (
                    <Bullet key={i} b={b} />
                  ))}
                </ul>
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
            {data.sideProjects.map((b, i) => (
              <div className="proj" key={i}>
                <Inline md={b.md} />
                {b.subs && b.subs.length > 0 && (
                  <ul className="subs">
                    {b.subs.map((s, j) => (
                      <li key={j}>
                        <Inline md={s} />
                      </li>
                    ))}
                  </ul>
                )}
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
            {data.skills.map((row) => (
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
            {data.education.map((g) => (
              <div className="edu-group" key={g.label}>
                <div className="edu-label">{g.label}</div>
                {g.items.map((it, i) => (
                  <div className="e" key={i}>
                    <span className="et">{it.title}</span>
                    <div className="meta">
                      <span>{it.period}</span>
                      {it.subtitle && (
                        <>
                          <span className="bar" aria-hidden>
                            |
                          </span>
                          <span>{it.subtitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <p className="foot">
          온라인 이력서 <code>yoramilji.kr</code> · 각 항목의 근거 화면과
          기록을 여기서 볼 수 있습니다.
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
  padding:19mm 18mm 16mm; box-shadow:0 4px 24px rgba(0,0,0,.10);
  font-family:var(--sans); font-size:9.2pt; line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
.resume-doc * { box-sizing:border-box; }

/* ===== 마스트헤드 ===== */
.doc-head { display:flex; flex-direction:column; margin-bottom:24px; }
.doc-head .contact { display:flex; flex-wrap:wrap; align-items:center; gap:5px 10px;
  font-size:8pt; letter-spacing:.05em; color:var(--ink-4); margin-bottom:18px; }
.doc-head .contact b { color:var(--ink); font-weight:600; text-transform:uppercase; letter-spacing:.1em; }
.doc-head .contact .dot { width:2px; height:2px; border-radius:50%; background:var(--ink-4); display:inline-block; }
.doc-head .name { font-size:21pt; font-weight:800; letter-spacing:.02em; line-height:1.1; color:var(--ink); }
.doc-head .role { font-size:8pt; letter-spacing:.15em; text-transform:uppercase;
  color:var(--ink-4); margin-top:5px; }
.doc-head .tag { font-size:10pt; line-height:1.5; color:var(--ink-3); margin:13px 0 0; letter-spacing:-.005em; }
.doc-head .intro { font-size:9pt; line-height:1.7; color:var(--ink-2); margin:9px 0 0; max-width:64em; }

.doc-head .leads { display:flex; flex-direction:column; margin-top:14px; }
.doc-head .lead-row { display:grid; grid-template-columns:18px 1fr; gap:10px; padding:7px 0;
  border-top:1px solid var(--rule); align-items:start; break-inside:avoid; }
.doc-head .leads .lead-row:last-child { border-bottom:1px solid var(--rule); }
.doc-head .lead-row .n { font-size:7pt; letter-spacing:.08em; color:var(--ink-4); padding-top:2px; }
.doc-head .lead-row p { margin:0; font-size:8.8pt; line-height:1.62; color:var(--ink-2); }
.doc-head .lead-row strong { color:var(--ink); font-weight:700; }

/* ===== 섹션 (제목 아래 진한 구분선) ===== */
.resume-doc section { margin-top:20px; }
.resume-doc .sec-head { display:flex; align-items:baseline; gap:8px; margin-bottom:10px;
  padding-bottom:5px; border-bottom:1px solid var(--ink); break-after:avoid; }
.resume-doc .sec-head .idx { font-size:7.5pt; letter-spacing:.14em; color:var(--ink-4); }
.resume-doc .sec-head h2 { margin:0; font-size:11.5pt; font-weight:800; letter-spacing:-.02em; color:var(--ink); }

/* ===== 공통 리스트 / 지표 ===== */
.resume-doc ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:5px; }
.resume-doc li { position:relative; padding-left:9px; font-size:8.8pt; line-height:1.62;
  color:var(--ink-2); break-inside:avoid; }
.resume-doc li::before { content:'•'; position:absolute; left:0; top:0; color:var(--ink-4); }

/* 실적 항목 (개조식 하위 불릿) */
.resume-doc ul.subs { margin:4px 0 0; gap:3px; }
.resume-doc ul.subs li { padding-left:8px; font-size:8.4pt; line-height:1.55; color:var(--ink-2); }
.resume-doc ul.subs li::before { content:'-'; color:var(--rule-2); }
.resume-doc strong { color:var(--ink); font-weight:600; }
.resume-doc .metric { display:block; margin-top:2px; font-size:7.6pt; letter-spacing:.01em;
  color:var(--ink-4); line-height:1.5; }

/* ===== 메타 한 줄 (기간 | 역할) ===== */
.resume-doc .meta { display:flex; flex-wrap:wrap; align-items:center; gap:6px;
  font-size:8pt; color:var(--ink-3); line-height:1.5; }
.resume-doc .meta .bar { color:var(--rule-2); }

/* ===== 경력 (1컬럼) ===== */
.resume-doc .job { padding:11px 0; border-top:1px solid var(--rule); }
.resume-doc .jobs .job:first-child { border-top:0; padding-top:2px; }
.resume-doc .job .org { display:flex; flex-direction:column; gap:3px; margin-bottom:8px; break-after:avoid; }
.resume-doc .job .org .co { font-size:11pt; font-weight:700; letter-spacing:-.02em; color:var(--ink); }
.resume-doc .job .org .note { font-size:8pt; font-style:italic; color:var(--ink-3); line-height:1.45; }

/* ===== 사이드 프로젝트 ===== */
.resume-doc .proj { padding:8px 0; border-top:1px solid var(--rule);
  font-size:8.8pt; line-height:1.62; color:var(--ink-2); break-inside:avoid; }
.resume-doc .projs .proj:first-child { border-top:0; padding-top:2px; }
.resume-doc .proj strong { color:var(--ink); font-weight:700; }

/* ===== 기술 스택 ===== */
.resume-doc .skill { display:grid; grid-template-columns:28mm 1fr; gap:5mm; padding:6px 0;
  border-top:1px solid var(--rule); align-items:baseline; break-inside:avoid; }
.resume-doc .skills .skill:first-child { border-top:0; padding-top:2px; }
.resume-doc .skill .k { font-size:8.4pt; font-weight:700; letter-spacing:.01em; color:var(--ink); }
.resume-doc .skill .v { font-size:8.8pt; line-height:1.6; color:var(--ink-2); }

/* ===== 학력 · 교육 · 자격 (1컬럼) ===== */
.resume-doc .edu-label { font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase;
  color:var(--ink-4); margin:12px 0 3px; }
.resume-doc .edu-group:first-child .edu-label { margin-top:0; }
.resume-doc .edu .e { display:flex; flex-direction:column; gap:2px; padding:6px 0;
  border-top:1px solid var(--rule); break-inside:avoid; }
.resume-doc .edu .edu-group .e:first-of-type { border-top:0; padding-top:2px; }
.resume-doc .edu .et { font-size:9.4pt; font-weight:700; letter-spacing:-.02em; color:var(--ink); }

/* ===== 푸터 ===== */
.resume-doc .foot { margin:20px 0 0; border-top:1px solid var(--rule); padding-top:12px;
  font-size:7.6pt; line-height:1.7; color:var(--ink-4); }
.resume-doc .foot code { font-family:var(--sans); font-size:7.6pt; color:var(--ink-3); }

/* ===== 인쇄 ===== */
@media print {
  @page { size:A4; margin:15mm 16mm; }
  html, body { background:#fff !important; }
  /* 사이트 크롬 숨김: Header(<header>), CursorTrail(<canvas>), FullScreenLoader(.z-9999) */
  header, canvas, .z-9999, .no-print { display:none !important; }
  .resume-scope { background:#fff; padding:0; min-height:0; }
  .resume-doc { width:auto; max-width:none; margin:0; padding:0; box-shadow:none; font-size:9.2pt; }
  .resume-doc, .resume-scope { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  /* 작은 단위만 쪼개짐 방지. section·job은 한 페이지보다 클 수 있어 제외(제외 안 하면 빈 페이지 발생) */
  .resume-doc .proj, .resume-doc .skill,
  .resume-doc .edu .e, .resume-doc .lead-row { break-inside:avoid; }
}
`;
