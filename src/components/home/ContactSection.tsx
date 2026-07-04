'use client';

import { appConfig } from '@/lib/config';
import { motion, Variants } from 'framer-motion';
import { Github, LucideIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import EmailModal from '../common/EmailModal';
import SectionHeader from '../common/SectionHeader';

// 연락처 정보
const contactInfo = {
  email: appConfig.contactEmail,
  github: 'https://github.com/Yeonji-Gonji',
};

interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOut cubic bezier
    },
  },
};

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="h-full flex items-center justify-center text-center relative z-10 pointer-events-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-md">
        <SectionHeader title="Contact Me" href="/profile" align="center" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          {/* 이메일 보내기 버튼 */}
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center justify-center gap-3 rounded-full px-6 py-3 bg-point hover:bg-point-dark text-white font-medium transition-colors cursor-pointer">
            <Mail className="w-5 h-5" />
            <span>이메일 보내기</span>
          </button>
          {/* 깃허브 링크 */}
          <Link
            href={contactInfo.github}
            target="_blank"
            className="rounded-full flex items-center justify-center gap-3 px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-900 dark:text-white font-medium transition-colors group cursor-pointer">
            <Github className="w-5 h-5" />
            <span>깃허브</span>
          </Link>
        </div>

        <motion.p
          variants={itemVariants}
          className="mt-12 text-sm text-dark-300 dark:text-dark-600">
          ©2025 요람일지. All rights reserved.
        </motion.p>
      </motion.div>

      {/* 이메일 모달 */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}
