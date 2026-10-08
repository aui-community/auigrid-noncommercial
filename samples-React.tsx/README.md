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

## 컨테이너 크기에 맞춘 자동 리사이징

서브 컴포넌트의 `resizeMode="container"`를 지정하면 `ResizeObserver`로 그리드를 담는 호스트 DIV의 크기 변화를 감지합니다. 창 크기가 그대로여도 사이드바나 부모 레이아웃 변경으로 호스트 크기가 바뀌면 그리드를 조정합니다.

```jsx
{/* 부모의 가로 폭 변화에 맞추며 높이는 480px로 유지합니다. */}
<AUIGrid
  resizeMode="container"
  resizeDelayTime={100}
  gridProps={{ width: '100%', height: 480 }}
  columnLayout={columnLayout}
/>
```

- `resizeMode`는 `"window"`(기본값) 또는 `"container"`를 사용합니다. 생략하면 기존 창 크기 이벤트 방식입니다.
- `autoResize={false}`(React) 또는 `:autoResize="false"`(Vue)이면 자동 감지를 등록하지 않습니다.
- `resizeDelayTime`의 기본값은 300ms입니다. 컨테이너 방식도 마지막 변경 알림 후 이 시간을 기다린 뒤 다음 애니메이션 프레임에 조정합니다. `0`이면 지연 타이머 이후 다음 프레임에 반영합니다.
- 이 옵션들은 `gridProps`가 아닌 서브 컴포넌트의 속성입니다. `resizeMode`와 `autoResize`는 생성 시 지정하며 실행 중 속성 변경으로 감지 방식을 전환하지 않습니다.
- 관찰 대상은 엔진 내부 셀이 아닌 래퍼의 호스트 DIV입니다. 높이도 부모에 맞추려면 호스트 CSS에 높이를 지정하고, 백분율 높이를 사용할 때는 부모의 높이도 명확히 지정하십시오. Flex/Grid 레이아웃에서는 필요에 따라 `min-width: 0`을 지정합니다. 콘텐츠가 부모 크기를 계속 늘리는 순환 레이아웃은 CSS에서 해결해야 합니다.
- 크기가 동일하거나 DOM이 분리됐거나 숨겨져 크기가 0이면 엔진을 호출하지 않습니다. 자동 높이를 사용하는 경우 데이터가 결정하는 높이를 부모의 고정 높이로 강제하지 않습니다.
- Vue `KeepAlive` 비활성화에서는 관찰과 예약 작업을 중단하고 복귀 시 다시 연결합니다. 그리드 데이터와 편집 상태를 재생성하지 않습니다.
- 컴포넌트 해제 및 래퍼의 `destroy()`에서 컨테이너 관찰을 정리하며, `create()`로 다시 만들면 재연결합니다. `ResizeObserver`가 없는 환경에서는 창 크기 이벤트로 대체합니다.
- 실제 `resize()`가 실행되면 편집 완료 등 엔진의 기존 리사이징 동작이 적용됩니다. 수동 `resize()`의 호출 방법은 같습니다.
