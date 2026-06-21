'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { MenuIcon, MoonIcon, SunIcon, XIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './SvgIcons';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/profile', label: 'Profile' },
];

export default function Header() {
  const { scrollY } = useScroll();
  const { resolvedTheme, setTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 모바일 메뉴가 열려있을 때 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: '-100%', opacity: 0 },
        }}
        initial="visible"
        animate={hidden && !mobileMenuOpen ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-medium text-xl w-12 h-12">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 hover:cursor-pointer">
              <Link
                href="/blog"
                className="hover:text-dark-300 transition-all duration-300">
                <p>블로그</p>
              </Link>
              <Link
                href="/portfolio"
                className="hover:text-dark-300 transition-all duration-300">
                <p>포트폴리오</p>
              </Link>
              <Link
                href="/profile"
                className="hover:text-dark-300 transition-all duration-300">
                <p>프로필</p>
              </Link>
              <div className="border border-r border-gray-200 h-4" />
              <button
                className="p-1 rounded-md group cursor-pointer hover:text-dark-300 transition-all duration-300"
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }>
                {mounted &&
                  (resolvedTheme === 'dark' ? (
                    <MoonIcon className="size-6" />
                  ) : (
                    <SunIcon className="size-6" />
                  ))}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="메뉴 열기">
              <MenuIcon className="size-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm md:hidden">
            {/* Close Button & Logo */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between">
              <Link
                href="/"
                className="font-medium text-xl w-12 h-12"
                onClick={() => setMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button
                className="p-2 text-white cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="메뉴 닫기">
                <XIcon className="size-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="h-full flex flex-col items-end justify-center pr-8 gap-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}>
                  <Link
                    href={link.href}
                    className="text-white text-2xl font-medium hover:text-gray-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}>
                <button
                  className="p-2 text-white cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => {
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                  }}>
                  {mounted &&
                    (resolvedTheme === 'dark' ? (
                      <MoonIcon className="size-6" />
                    ) : (
                      <SunIcon className="size-6" />
                    ))}
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
