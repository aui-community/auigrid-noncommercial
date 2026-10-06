import type AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import type * as IGrid from 'aui-grid';
// 기존 npm aui-grid의 공개 계약을 기반으로 래퍼 인스턴스를 사용합니다.
export type GridInstance = AUIGrid;
// 현재 npm 2.0.18에는 3.0.19 PercentageRenderer가 없어 이 샘플에서 쓰는 옵션만 보완합니다.
// 나머지 칼럼, 이벤트와 메서드는 npm 타입 검사를 그대로 받으며 제품 런타임은 수정하지 않습니다.
interface PercentageOptions {
    showBar?: boolean;
    showLabel?: boolean;
    precision?: number;
    offset?: number;
    styleRange?: Record<string, string>[];
}
export function percentageRenderer(options: PercentageOptions): NonNullable<IGrid.Column['renderer']> {
    // 새 렌더러와 구버전 npm 선언을 연결하는 유일한 경계입니다.
    return { type: 'PercentageRenderer', ...options } as unknown as NonNullable<IGrid.Column['renderer']>;
}
