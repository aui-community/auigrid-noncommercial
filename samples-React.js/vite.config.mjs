import { fileURLToPath } from 'node:url';
import { defineConfig, normalizePath, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

const sourceRoot = normalizePath(fileURLToPath(new URL('./src/', import.meta.url)));

// 기존 .js 예제와 공용 React 래퍼의 파일명을 유지하면서 JSX를 변환합니다.
// 제품 엔진 및 외부 라이브러리, 소스 보기용 ?raw 요청에는 변환을 적용하지 않습니다.
function jsxInJavaScript(command) {
    return {
        name: 'auigrid-jsx-in-js',
        enforce: 'pre',
        transform(code, id) {
            const path = normalizePath(id);
            if (!path.startsWith(sourceRoot) || !path.endsWith('.js')) return;
            const relative = path.slice(sourceRoot.length);
            if (relative.startsWith('static/') && relative !== 'static/AUIGrid-React.js/AUIGridReact.js') return;
            return transformWithOxc(code, id, {
                lang: 'jsx',
                jsx: { runtime: 'automatic', development: command === 'serve' }
            });
        }
    };
}

export default defineConfig(({ command }) => ({
    plugins: [jsxInJavaScript(command), react()],
    // 개발 서버의 의존성 탐색에서도 기존 .js 파일 안의 JSX를 해석합니다.
    optimizeDeps: { rolldownOptions: { moduleTypes: { '.js': 'jsx' } } },
    base: '/demo/auigrid-react/',
    // 기존 배포 스크립트와 프레임워크 서버가 사용하는 출력 위치를 유지합니다.
    build: { outDir: 'build' }
}));
