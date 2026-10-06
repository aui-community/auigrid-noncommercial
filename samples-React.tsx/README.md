# AUIGrid React TypeScript 샘플

React 18과 Vite를 사용하는 AUIGrid 예제 프로젝트입니다. 기존 데모 목록과 HOME의 Dependencies, HOW TO CODE 구성은 유지합니다.

## 개발 서버 실행

Node.js 20.19 이상(20.x) 또는 22.12 이상이 필요합니다. Node.js 22.12 이상을 권장합니다.

```sh
npm ci
npm run dev
```

기존 `npm start`도 같은 Vite 개발 서버를 실행합니다. 터미널에 표시되는 주소의 `/demo/auigrid-react-tsx/` 경로를 엽니다. 기본 포트는 5173이며 사용 중이면 다음 포트를 사용합니다.

## 빌드와 미리보기

```sh
npm run build
npm run preview
```

배포 파일은 기존과 동일하게 `build/`에 생성됩니다. 미리보기 서버의 `/demo/auigrid-react-tsx/` 경로에서 배포 결과를 확인합니다. 서버에 배포할 때는 이 경로에 `build/`의 내용을 배치하고, 데모 상세 주소를 새로고침해도 같은 `index.html`을 반환하도록 SPA 대체 경로를 설정합니다.

배포 경로를 바꾸려면 `vite.config.mjs`의 `base`를 수정합니다. 라우터와 public 자산 경로는 `import.meta.env.BASE_URL`을 사용합니다.

## 예제 구성

- `index.html`: Vite의 HTML 진입점입니다. `public/`은 데이터, 이미지 등 정적 자산만 보관합니다.
- `src/App.tsx`: 기존 메뉴와 데모 라우팅을 유지합니다.
- `src/views/Home.tsx`: Dependencies 및 HOW TO CODE를 제공합니다.
- `src/demoSources.ts`: 각 데모의 소스 보기 목록입니다. Vite의 `?raw` 가져오기로 원문을 표시합니다.
- `src/static/`: 제공된 AUIGrid 엔진, 라이선스, 스타일과 React 래퍼를 사용합니다.

## TypeScript

AUIGrid 타입은 npm의 `aui-grid` 패키지를 사용합니다. 로컬 선언 파일로 대체하지 않습니다. `npm run build`는 TypeScript 검사 후 Vite 빌드를 실행하며, 타입 검사만 실행하려면 다음 명령을 사용합니다.

```sh
npm run type-check
```

`src/vite-env.d.ts`에서 Vite의 `BASE_URL`, 자산 및 `?raw` 가져오기 타입을 불러옵니다.
