'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';
import { CursorTrailProvider } from './effects/CursorTrailContext';

export * from '@heroui/react';

export default function AppProvider({children}: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <HeroUIProvider>
        <CursorTrailProvider>{children}</CursorTrailProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}