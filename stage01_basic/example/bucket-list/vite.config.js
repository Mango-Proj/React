import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 설정 파일
// - React 플러그인을 등록해 JSX를 처리합니다
// - 별도 설정 없이 기본값으로도 충분합니다
export default defineConfig({
  plugins: [react()],
});
