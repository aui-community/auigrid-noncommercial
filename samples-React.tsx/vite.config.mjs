import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 기존 배포 주소와 build 폴더를 유지하여 웹 서버 및 배포 도구와 호환합니다.
export default defineConfig({
    plugins: [react()],
    base: '/demo/auigrid-react-tsx/',
    build: { outDir: 'build' }
});
