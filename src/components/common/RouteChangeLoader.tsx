"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";

function RouteChangeLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 첫 진입 시 로딩 애니메이션
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // 라우트 변경 감지
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // 링크 클릭 시 로딩 시작
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      // 다운로드 링크·새 탭 링크는 클라이언트 라우트 변경이 아니므로 제외.
      // (예: 이력서 PDF 다운로드 버튼 → pathname이 안 바뀌어 로더가 영영 안 꺼짐)
      if (anchor.hasAttribute("download") || anchor.target === "_blank") {
        return;
      }

      const href = anchor.getAttribute("href");
      // 내부 링크인 경우만 처리
      if (href && href.startsWith("/") && !href.startsWith("//")) {
        // 정적 파일(확장자 포함) 경로는 라우트 변경이 아니므로 제외
        const lastSegment = href.split(/[?#]/)[0].split("/").pop() ?? "";
        if (lastSegment.includes(".")) return;

        // 현재 경로와 다른 경우만 로딩 표시
        if (href !== pathname) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // 안전장치: 라우트 변경이 감지되지 않아도 일정 시간 후 로더를 강제 종료
  useEffect(() => {
    if (!isLoading) return;
    const failSafe = setTimeout(() => setIsLoading(false), 8000);
    return () => clearTimeout(failSafe);
  }, [isLoading]);

  return <FullScreenLoader isLoading={isInitialLoad || isLoading} />;
}

export default function RouteChangeLoader() {
  return (
    <Suspense fallback={null}>
      <RouteChangeLoaderContent />
    </Suspense>
  );
}
