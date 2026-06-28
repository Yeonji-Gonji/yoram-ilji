import '@/assets/styles/globals.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import AppProvider from '@/components/AppProvider';
import Header from '@/components/common/Header';
import RouteChangeLoader from '@/components/common/RouteChangeLoader';
import CursorTrail from '@/components/effects/CursorTrail';
import {
  generatePersonJsonLd,
  generateWebsiteJsonLd,
  siteConfig,
} from '@/lib/seo';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.png'],
    creator: `@${siteConfig.author.name}`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  category: 'technology',
  classification: 'Blog',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  verification: {
    google: siteConfig.verification.google,
    other: {
      'naver-site-verification': siteConfig.verification.naver,
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.name,
  },
};

const websiteJsonLd = generateWebsiteJsonLd();
const personJsonLd = generatePersonJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <AppProvider>
          <CursorTrail />
          <RouteChangeLoader />
          <Header />
          <main className="min-h-screen">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
