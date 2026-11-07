import { defineConfig } from 'vite';

// GitHub Actions에서 저장소 이름을 반영해서 넘겨줍니다.
// 로컬 개발에서는 루트('/')를 사용합니다.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
});
