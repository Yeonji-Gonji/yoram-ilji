'use client';

import { appConfig } from '@/lib/config';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mail, Send, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SendStatus = 'idle' | 'loading' | 'success' | 'error';

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<SendStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 모달이 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '이메일 전송에 실패했습니다.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // 3초 후 자동으로 모달 닫기
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-lg bg-light-100 dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-light-400 dark:border-dark-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-point/10 rounded-xl">
                  <Mail className="w-5 h-5 text-point" />
                </div>
                <h2 className="text-xl font-medium">이메일 보내기</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-light-300 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                aria-label="닫기">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 콘텐츠 */}
            <div className="p-6">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    이메일이 전송되었습니다!
                  </h3>
                  <p className="text-dark-500 dark:text-dark-400">
                    빠른 시일 내에 답변드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-start">
                  {/* 이름 */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-dark-600 dark:text-dark-400">
                      이름 <span className="text-point">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="홍길동"
                      className="w-full px-4 py-3 rounded-xl border border-light-400 dark:border-dark-600 bg-light-50 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-point/50 focus:border-point transition-all"
                    />
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2 text-dark-600 dark:text-dark-400">
                      이메일 <span className="text-point">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-light-400 dark:border-dark-600 bg-light-50 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-point/50 focus:border-point transition-all"
                    />
                  </div>

                  {/* 제목 */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2 text-dark-600 dark:text-dark-400">
                      제목 <span className="text-point">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="문의 제목을 입력해주세요"
                      className="w-full px-4 py-3 rounded-xl border border-light-400 dark:border-dark-600 bg-light-50 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-point/50 focus:border-point transition-all"
                    />
                  </div>

                  {/* 메시지 */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2 text-dark-600 dark:text-dark-400">
                      메시지 <span className="text-point">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="문의 내용을 입력해주세요"
                      className="w-full px-4 py-3 rounded-xl border border-light-400 dark:border-dark-600 bg-light-50 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-point/50 focus:border-point transition-all resize-none"
                    />
                  </div>

                  {/* 에러 메시지 */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* 전송 버튼 */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 px-6 bg-point hover:bg-point-dark disabled:bg-point/50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>전송 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>이메일 보내기</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* 푸터 */}
            <div className="px-6 pb-6">
              <p className="text-xs text-center text-dark-500 dark:text-dark-400">
                이메일은{' '}
                <span className="font-medium">{appConfig.contactEmail}</span>
                으로 전송됩니다.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
