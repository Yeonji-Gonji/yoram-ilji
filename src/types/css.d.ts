// Swiper 12는 `swiper/css` 경로가 실제 CSS 파일로 resolve되어
// moduleResolution: 'bundler' 환경에서 부수효과 import의 타입 선언을 못 찾는다(ts2882).
// 번들러는 CSS를 처리하므로, 타입체커용으로 앰비언트 모듈만 선언한다.

// 일반 CSS 부수효과 import (globals.css 등). `.css`로 끝나는 경로 전부 커버.
declare module '*.css';

// swiper/css 계열은 bare 스펙파이어라 `*.css`에 안 잡혀 개별 선언이 필요.
declare module 'swiper/css';
declare module 'swiper/css/*';
