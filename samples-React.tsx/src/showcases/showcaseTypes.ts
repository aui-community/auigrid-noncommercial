import type AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import * as IGrid from 'aui-grid';
// 기존 npm aui-grid의 공개 계약을 기반으로 래퍼 인스턴스를 사용합니다.
export type GridInstance = AUIGrid;
// npm의 공식 타입과 상수를 사용해 백분율 렌더러 옵션을 검사합니다.
// 샘플에서 타입을 중복 정의하거나 구버전 선언을 위한 강제 변환을 하지 않습니다.
type PercentageOptions = Omit<IGrid.PercentageRenderer, 'type'>;
export function percentageRenderer(options: PercentageOptions): IGrid.PercentageRenderer {
    return { type: IGrid.RendererKind.PercentageRenderer, ...options };
}
