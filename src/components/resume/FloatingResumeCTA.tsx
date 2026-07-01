'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

/** 프로필 페이지에 떠 있는 이력서 PDF 다운로드 CTA */
export default function FloatingResumeCTA() {
  return (
    <motion.a
      href="/junhei-kim-resume.pdf"
      download="김준희_이력서.pdf"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-point px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-point/30 transition-transform hover:-translate-y-0.5 hover:bg-point-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-point/50"
      aria-label="이력서 PDF 다운로드">
      <Download className="size-4" />
      이력서 다운로드
    </motion.a>
  );
}
