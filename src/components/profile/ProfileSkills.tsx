'use client';

import { resume } from '@/data/resume';
import { motion } from 'framer-motion';

export default function ProfileSkills() {
  return (
    <section className="w-full py-16 mx-auto">
      <h2 className="mb-10 text-2xl font-medium md:text-3xl">기술</h2>

      <div className="space-y-4">
        {resume.skills.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="grid grid-cols-1 gap-1 border-b border-light-300 pb-4 last:border-0 dark:border-dark-700 sm:grid-cols-[120px_1fr] sm:gap-4">
            <div className="text-sm font-semibold text-point">{row.label}</div>
            <div className="text-[15px] text-slate-600 dark:text-slate-300">
              {row.items}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
