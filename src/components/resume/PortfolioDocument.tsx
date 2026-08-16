'use client';

import { portfolioDoc, type PortfolioDocData } from '@/data/portfolio-doc';
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

// 이력서(ResumeDocument)와 같은 양식·토큰을 쓴다. 정본 = docs/portfolio/case-*.md
export default function PortfolioDocument({
  data = portfolioDoc,
}: {
  data?: PortfolioDocData;
}) {
  return (
    <div className="folio-scope">
      <div className="folio-toolbar no-print">
        <button type="button" onClick={() => window.print()}>
          PDF로 저장 / 인쇄
        </button>
        <span className="hint">
          인쇄 대화상자에서 여백 &ldquo;기본&rdquo;, 배경 그래픽 켜기 ·
          머리글/바닥글 끄기를 권장합니다.
        </span>
      </div>

      <article className="folio-doc">
        {/* ===== 표지 ===== */}
        {/* 주의: <header>를 쓰면 인쇄 CSS의 사이트 크롬 숨김(header{display:none})에 걸려 표지가 사라진다 */}
        <div className="cover">
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

          <div className="doc-kind">PORTFOLIO</div>
          <div className="name">{data.name}</div>
          <div className="role">{data.title}</div>
          <p className="tag">{data.tagline}</p>
          <p className="lead">{data.lead}</p>

          <div className="axes">
            {data.axes.map((a, i) => (
              <div className="axis" key={i}>
                <div className="axis-label">{a.label}</div>
                <p>{a.body}</p>
              </div>
            ))}
          </div>

          <div className="toc">
            <div className="toc-label">수록 케이스</div>
            {data.cases.map((c) => (
              <div className="toc-row" key={c.no}>
                <span className="n">{c.no}</span>
                <span className="t">{c.title}</span>
                <span className="k">{c.kind}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 케이스 ===== */}
        {data.cases.map((c) => (
          <section className="case" key={c.no}>
            <div className="case-head">
              <span className="idx">CASE {c.no}</span>
              <h2>{c.title}</h2>
              <div className="meta">
                <span>{c.meta}</span>
                <span className="bar" aria-hidden>
                  |
                </span>
                <span>{c.kind}</span>
              </div>
            </div>

            <p className="summary">
              <Inline md={c.summary} />
            </p>

            <div className="block">
              <div className="block-label">상황과 문제</div>
              <ul>
                {c.problem.map((p, i) => (
                  <li key={i}>
                    <Inline md={p} />
                  </li>
                ))}
              </ul>
            </div>

            {c.journey && (
              <div className="block">
                <div className="block-label">{c.journey.label}</div>
                <div className="journey">
                  {c.journey.steps.map((s, i) => (
                    <div className={`step ${s.state ?? 'ok'}`} key={i}>
                      <div className="step-mark" aria-hidden />
                      <div className="step-body">
                        <span className="step-label">{s.label}</span>
                        {s.note && <span className="step-note">{s.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="legend">
                  <span>
                    <i className="m ok" aria-hidden /> 정상
                  </span>
                  <span>
                    <i className="m warn" aria-hidden /> 구현 완료, 검증 잔여
                  </span>
                  <span>
                    <i className="m gap" aria-hidden /> 끊긴 지점
                  </span>
                </div>
              </div>
            )}

            <div className="block">
              <div className="block-label">한 일</div>
              {c.work.map((w, i) => (
                <div className="work" key={i}>
                  <div className="work-label">{w.label}</div>
                  <ul>
                    {w.items.map((it, j) => (
                      <li key={j}>
                        <Inline md={it} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {c.judgement && (
              <div className="block">
                <div className="block-label">{c.judgement.label}</div>
                {c.judgement.intro && (
                  <p className="intro">{c.judgement.intro}</p>
                )}
                <div className="jtable">
                  <div className="jrow jhead">
                    <span>대상</span>
                    <span>성격</span>
                    <span>상태</span>
                  </div>
                  {c.judgement.rows.map((r, i) => (
                    <div className="jrow" key={i}>
                      <span className="s">{r.subject}</span>
                      <span className="k">{r.kind}</span>
                      <span className="st">{r.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="block">
              <div className="block-label">결과</div>
              <ul className="result">
                {c.result.map((r, i) => (
                  <li key={i}>
                    <Inline md={r} />
                  </li>
                ))}
              </ul>
            </div>

            {c.learned && <p className="learned">{c.learned}</p>}

            <div className="foot-row">
              {c.stack && (
                <div className="stack">
                  <b>스택</b> {c.stack}
                </div>
              )}
              {c.note && (
                <div className="note">
                  <b>역할 경계와 한계</b> {c.note}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* ===== 마무리 ===== */}
        <section className="closing">
          {data.closing.map((g, i) => (
            <div className="close-group" key={i}>
              <div className="block-label">{g.label}</div>
              <ul>
                {g.items.map((it, j) => (
                  <li key={j}>
                    <Inline md={it} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="outro">
            각 케이스의 근거 화면과 기록은 <code>yoramilji.kr</code> 에서 볼 수
            있습니다.
          </p>
        </section>
      </article>

      <style dangerouslySetInnerHTML={{ __html: FOLIO_CSS }} />
    </div>
  );
}

const FOLIO_CSS = `
/* ===== 토큰 (이력서와 동일한 그레이스케일 에디토리얼) ===== */
.folio-scope {
  --paper:#ffffff; --ink:#1b1b1b; --ink-2:#4a4a4a; --ink-3:#6e6e6e; --ink-4:#9a9a9a;
  --rule:#eaeaea; --rule-2:#d4d4d4;
  --sans: var(--font-pretendard), 'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif;
  background:#eceae6; min-height:100vh; padding:96px 16px 48px;
}
.folio-scope *, .folio-scope { font-variant-numeric: tabular-nums; }

.folio-toolbar { max-width:210mm; margin:0 auto 14px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.folio-toolbar button { background:var(--ink); color:#fff; border:0; border-radius:8px;
  padding:10px 18px; font-size:14px; font-weight:700; cursor:pointer; font-family:var(--sans); letter-spacing:.02em; }
.folio-toolbar .hint { font-size:12px; color:var(--ink-3); }

.folio-doc {
  width:210mm; max-width:100%; margin:0 auto; background:var(--paper); color:var(--ink);
  padding:19mm 18mm 16mm; box-shadow:0 4px 24px rgba(0,0,0,.10);
  font-family:var(--sans); font-size:9.2pt; line-height:1.62; -webkit-font-smoothing:antialiased;
}
.folio-doc * { box-sizing:border-box; }

/* ===== 표지 ===== */
.folio-doc .cover { display:flex; flex-direction:column; }
.folio-doc .contact { display:flex; flex-wrap:wrap; align-items:center; gap:5px 10px;
  font-size:8pt; letter-spacing:.05em; color:var(--ink-4); margin-bottom:18px; }
.folio-doc .contact b { color:var(--ink); font-weight:600; text-transform:uppercase; letter-spacing:.1em; }
.folio-doc .contact .dot { width:2px; height:2px; border-radius:50%; background:var(--ink-4); display:inline-block; }
.folio-doc .doc-kind { font-size:7.5pt; letter-spacing:.24em; color:var(--ink-4); margin-bottom:6px; }
.folio-doc .cover .name { font-size:21pt; font-weight:800; letter-spacing:.02em; line-height:1.1; }
.folio-doc .cover .role { font-size:8pt; letter-spacing:.15em; text-transform:uppercase; color:var(--ink-4); margin-top:5px; }
.folio-doc .cover .tag { font-size:10pt; line-height:1.5; color:var(--ink-3); margin:13px 0 0; }
.folio-doc .cover .lead { font-size:9pt; line-height:1.7; color:var(--ink-2); margin:9px 0 0; }

.folio-doc .axes { display:flex; flex-direction:column; margin-top:16px; }
.folio-doc .axis { padding:8px 0; border-top:1px solid var(--rule); break-inside:avoid; }
.folio-doc .axes .axis:last-child { border-bottom:1px solid var(--rule); }
.folio-doc .axis-label { font-size:9.4pt; font-weight:700; letter-spacing:-.01em; color:var(--ink); }
.folio-doc .axis p { margin:3px 0 0; font-size:8.8pt; line-height:1.6; color:var(--ink-2); }

.folio-doc .toc { margin-top:18px; }
.folio-doc .toc-label { font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-4); margin-bottom:6px; }
.folio-doc .toc-row { display:grid; grid-template-columns:22px 1fr auto; gap:8px; align-items:baseline;
  padding:6px 0; border-top:1px solid var(--rule); font-size:8.8pt; }
.folio-doc .toc-row .n { font-size:7.5pt; color:var(--ink-4); letter-spacing:.06em; }
.folio-doc .toc-row .t { color:var(--ink); font-weight:600; }
.folio-doc .toc-row .k { font-size:7.6pt; color:var(--ink-4); }

/* ===== 케이스 ===== */
.folio-doc .case { margin-top:26px; break-before:page; }
.folio-doc .case-head { padding-bottom:6px; border-bottom:1px solid var(--ink); break-after:avoid; }
.folio-doc .case-head .idx { font-size:7.5pt; letter-spacing:.16em; color:var(--ink-4); }
.folio-doc .case-head h2 { margin:2px 0 0; font-size:13pt; font-weight:800; letter-spacing:-.025em; line-height:1.3; }
.folio-doc .meta { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:4px;
  font-size:8pt; color:var(--ink-3); }
.folio-doc .meta .bar { color:var(--rule-2); }

.folio-doc .summary { margin:10px 0 0; font-size:9pt; line-height:1.7; color:var(--ink-2); }

.folio-doc .block { margin-top:12px; break-inside:avoid; }
.folio-doc .block-label { font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase;
  color:var(--ink-4); margin-bottom:5px; }
.folio-doc .work { margin-bottom:7px; break-inside:avoid; }
.folio-doc .work-label { font-size:8.6pt; font-weight:700; color:var(--ink); margin-bottom:2px; }

.folio-doc ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px; }
.folio-doc li { position:relative; padding-left:9px; font-size:8.6pt; line-height:1.6;
  color:var(--ink-2); break-inside:avoid; }
.folio-doc li::before { content:'-'; position:absolute; left:0; top:0; color:var(--rule-2); }
.folio-doc ul.result li::before { content:'•'; color:var(--ink-4); }
.folio-doc ul.result li { color:var(--ink); }
.folio-doc strong { font-weight:600; color:var(--ink); }

/* ===== 여정 (단계별 상태) ===== */
.folio-doc .journey { display:flex; flex-direction:column; gap:0; margin-top:2px; }
.folio-doc .step { display:grid; grid-template-columns:14px 1fr; gap:7px; align-items:start;
  padding:3.5px 0; position:relative; break-inside:avoid; }
.folio-doc .step::before { content:''; position:absolute; left:6px; top:0; bottom:0; width:1px; background:var(--rule); }
.folio-doc .step:first-child::before { top:9px; }
.folio-doc .step:last-child::before { bottom:auto; height:9px; }
.folio-doc .step-mark { width:7px; height:7px; border-radius:50%; margin:5px 0 0 3px; z-index:1;
  background:#fff; border:1.5px solid var(--ink-4); }
.folio-doc .step.warn .step-mark { border-color:#B7791F; background:#FBF1DC; }
.folio-doc .step.gap .step-mark { border-color:#C0392B; background:#FBE3DF; }
.folio-doc .step-body { display:flex; flex-wrap:wrap; align-items:baseline; gap:6px; }
.folio-doc .step-label { font-size:8.6pt; color:var(--ink); font-weight:600; }
.folio-doc .step-note { font-size:7.8pt; color:var(--ink-4); }
.folio-doc .step.gap .step-note { color:#9A4034; }
.folio-doc .legend { display:flex; flex-wrap:wrap; gap:12px; margin-top:6px; font-size:7.4pt; color:var(--ink-4); }
.folio-doc .legend .m { display:inline-block; width:6px; height:6px; border-radius:50%; margin-right:3px;
  border:1.5px solid var(--ink-4); background:#fff; }
.folio-doc .legend .m.warn { border-color:#B7791F; background:#FBF1DC; }
.folio-doc .legend .m.gap { border-color:#C0392B; background:#FBE3DF; }

/* ===== 판단 근거 표 ===== */
.folio-doc .intro { margin:0 0 6px; font-size:8.4pt; line-height:1.6; color:var(--ink-2); }
.folio-doc .jtable { display:flex; flex-direction:column; }
.folio-doc .jrow { display:grid; grid-template-columns:1fr 62px 1.15fr; gap:8px; padding:5px 0;
  border-top:1px solid var(--rule); font-size:8.2pt; line-height:1.5; break-inside:avoid; }
.folio-doc .jrow.jhead { border-top:1px solid var(--rule-2); font-size:7.4pt; letter-spacing:.08em;
  color:var(--ink-4); text-transform:uppercase; }
.folio-doc .jrow .s { color:var(--ink); font-weight:600; }
.folio-doc .jrow .k { color:var(--ink-3); font-size:7.8pt; }
.folio-doc .jrow .st { color:var(--ink-2); }

.folio-doc .learned { margin:10px 0 0; padding:8px 10px; background:#f7f7f6;
  font-size:8.6pt; line-height:1.6; color:var(--ink-2); break-inside:avoid; }

.folio-doc .foot-row { margin-top:10px; padding-top:8px; border-top:1px solid var(--rule);
  display:flex; flex-direction:column; gap:4px; break-inside:avoid; }
.folio-doc .stack, .folio-doc .note { font-size:7.8pt; line-height:1.55; color:var(--ink-4); }
.folio-doc .stack b, .folio-doc .note b { color:var(--ink-3); font-weight:600; margin-right:4px; }

/* ===== 마무리 ===== */
.folio-doc .closing { margin-top:26px; break-before:page; }
.folio-doc .close-group { margin-bottom:14px; }
.folio-doc .outro { margin:16px 0 0; border-top:1px solid var(--rule); padding-top:12px;
  font-size:7.6pt; color:var(--ink-4); }
.folio-doc .outro code { font-family:var(--sans); color:var(--ink-3); }

/* ===== 인쇄 ===== */
@media print {
  @page { size:A4; margin:15mm 16mm; }
  html, body { background:#fff !important; }
  header, canvas, .z-9999, .no-print { display:none !important; }
  .folio-scope { background:#fff; padding:0; min-height:0; }
  .folio-doc { width:auto; max-width:none; margin:0; padding:0; box-shadow:none; font-size:9.2pt; }
  .folio-doc, .folio-scope { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  /* 표지(목차 포함)는 한 장을 온전히 쓰고, 케이스마다 새 페이지에서 시작한다 */
  .folio-doc .axis, .folio-doc .toc-row, .folio-doc .work, .folio-doc .learned { break-inside:avoid; }
  .folio-doc .case-head, .folio-doc .block-label { break-after:avoid; }
}
`;
