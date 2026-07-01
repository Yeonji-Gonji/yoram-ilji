'use client';

import { resume, type ResumeBullet } from '@/data/resume';
import { motion } from 'framer-motion';
import { Fragment } from 'react';

/** 마크다운 볼드(**강조**)만 인라인 렌더 */
function Inline({ md }: { md: string }) {
  const parts = md.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong
            key={i}
            className="font-semibold text-slate-900 dark:text-white">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

function Bullet({ b }: { b: ResumeBullet }) {
  return (
    <li className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-point">
      <Inline md={b.md} />
      {b.metric && (
        <span className="text-slate-400 dark:text-slate-500">
          {' '}
          ({b.metric})
        </span>
      )}
    </li>
  );
}

export default function ProfileExperience() {
  return (
    <section className="w-full py-16 mx-auto">
      <h2 className="mb-10 text-2xl font-medium md:text-3xl">경력 상세</h2>

      <div className="space-y-10">
        {resume.experience.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {exp.company}
                <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                  {exp.role}
                </span>
              </h3>
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                {exp.period}
              </span>
            </div>
            {exp.note && (
              <p className="mt-1 text-sm italic text-slate-500 dark:text-slate-400">
                {exp.note}
              </p>
            )}
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              {exp.bullets.map((b, bi) => (
                <Bullet key={bi} b={b} />
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
