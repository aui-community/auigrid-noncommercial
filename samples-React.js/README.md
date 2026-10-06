# AUIGrid React JavaScript 샘플

React 18과 Vite를 사용하는 AUIGrid 예제 프로젝트입니다. 기존 데모 목록과 HOME의 Dependencies, HOW TO CODE 구성은 유지합니다.

## 개발 서버 실행

Node.js 20.19 이상(20.x) 또는 22.12 이상이 필요합니다. Node.js 22.12 이상을 권장합니다.

```sh
npm ci
npm run dev
```

기존 `npm start`도 같은 Vite 개발 서버를 실행합니다. 터미널에 표시되는 주소의 `/demo/auigrid-react/` 경로를 엽니다. 기본 포트는 5173이며 사용 중이면 다음 포트를 사용합니다.

## 빌드와 미리보기

```sh
npm run build
npm run preview
```

배포 파일은 기존과 동일하게 `build/`에 생성됩니다. 미리보기 서버의 `/demo/auigrid-react/` 경로에서 배포 결과를 확인합니다. 서버에 배포할 때는 이 경로에 `build/`의 내용을 배치하고, 데모 상세 주소를 새로고침해도 같은 `index.html`을 반환하도록 SPA 대체 경로를 설정합니다.

배포 경로를 바꾸려면 `vite.config.mjs`의 `base`를 수정합니다. 라우터와 public 자산 경로는 `import.meta.env.BASE_URL`을 사용합니다.

## 예제 구성

- `index.html`: Vite의 HTML 진입점입니다. `public/`은 데이터, 이미지 등 정적 자산만 보관합니다.
- `src/App.js`: 기존 메뉴와 데모 라우팅을 유지합니다.
- `src/views/Home.js`: Dependencies 및 HOW TO CODE를 제공합니다.
- `src/demoSources.js`: 각 데모의 소스 보기 목록입니다. Vite의 `?raw` 가져오기로 원문을 표시합니다.
- `src/static/`: 제공된 AUIGrid 엔진, 라이선스, 스타일과 React 래퍼를 사용합니다.

## JavaScript의 JSX

기존 예제 및 공용 래퍼의 `.js` 파일명을 유지합니다. `vite.config.mjs`의 변환 플러그인이 해당 JSX를 처리하며, 제품 엔진 및 외부 라이브러리와 `?raw` 소스 보기는 변환 대상에서 제외합니다.
