# auigrid-vue-js-samples

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## 컨테이너 크기에 맞춘 자동 리사이징

서브 컴포넌트의 `resizeMode="container"`를 지정하면 `ResizeObserver`로 그리드를 담는 호스트 DIV의 크기 변화를 감지합니다. 창 크기가 그대로여도 사이드바나 부모 레이아웃 변경으로 호스트 크기가 바뀌면 그리드를 조정합니다.

```vue
<!-- 부모의 가로 폭 변화에 맞추며 높이는 480px로 유지합니다. -->
<AUIGrid
  resizeMode="container"
  :resizeDelayTime="100"
  :gridProps="{ width: '100%', height: 480 }"
  :columnLayout="columnLayout"
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
