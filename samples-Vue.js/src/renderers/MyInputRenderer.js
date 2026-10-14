/*
 * AUIGrid 사용자 정의 렌더러 - 항상 표시되는 텍스트 입력란 연결 모듈
 *
 * 프레임워크에서 공용 AUIGrid.MyInputRenderer.js 파일을 사용할 수 있도록 내보냅니다.
 * JS와 전용 CSS를 함께 가져옵니다. 그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *
 * 사용법
 *   import MyInputRenderer from "../renderers/MyInputRenderer";
 *   {
 *     dataField: "name",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: MyInputRenderer
 *     }
 *   }
 *
 * 동작과 설정
 *   포커스를 잃으면 값을 저장하고 Enter 또는 Tab으로 다음 행의 같은 칼럼으로 이동합니다.
 *   기본 편집기를 함께 열지 않으려면 칼럼에 editable: false를 지정합니다.
 */
import '../static/AUIGrid/renderers/AUIGrid.MyInputRenderer';
import '../static/AUIGrid/renderers/AUIGrid.MyInputRenderer.css';
export default window.AUIGrid.MyInputRenderer;
