'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface CursorTrailContextValue {
  /** 마우스 효과 활성화 여부 */
  enabled: boolean;
  /** 켜기/끄기 토글 */
  toggle: () => void;
  /** 마운트 완료 여부 (하이드레이션 불일치 방지용) */
  mounted: boolean;
}

const CursorTrailContext = createContext<CursorTrailContextValue>({
  enabled: true,
  toggle: () => {},
  mounted: false,
});

const STORAGE_KEY = 'cursor-trail-enabled';

export function CursorTrailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 기본값은 켜짐. 저장된 설정이 있으면 마운트 후 반영한다.
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setEnabled(stored === 'true');
    setMounted(true);
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <CursorTrailContext.Provider value={{ enabled, toggle, mounted }}>
      {children}
    </CursorTrailContext.Provider>
  );
}

export const useCursorTrail = () => useContext(CursorTrailContext);
