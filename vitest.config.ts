import path from 'node:path';
import { defineConfig } from 'vitest/config';

// 순수 로직 단위 테스트 전용(퀴즈 채점·출제). DOM 불필요 → node 환경.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
