/*
 * AUIGrid 사용자 정의 에디트 렌더러 - 여러 줄 텍스트 편집기 연결 모듈
 *
 * 프레임워크에서 공용 AUIGrid.TextareaEditor.js 파일을 사용할 수 있도록 내보냅니다.
 * JS와 전용 CSS를 함께 가져옵니다. 그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *
 * 사용법 (그리드 속성 editable: true)
 *   import MyTextareaEditor from "../editRenderers/MyTextareaEditor";
 *   {
 *     dataField: "content",
 *     editRenderer: {
 *       type: "CustomEditRenderer",
 *       jsClass: MyTextareaEditor, vPosition: "bottom"
 *     }
 *   }
 *
 * 동작과 설정
 *   Ctrl+Enter 확인, Enter 줄바꿈, Esc 취소를 지원합니다. 하단 안내는 extraProps.helpText로 지정합니다.
 *   옵션과 기본값은 static/AUIGrid/editRenderers/AUIGrid.TextareaEditor.js의 상단 주석을 참고합니다.
 */
import '@/static/AUIGrid/editRenderers/AUIGrid.TextareaEditor';
import '@/static/AUIGrid/editRenderers/AUIGrid.TextareaEditor.css';
export default window.AUIGrid.TextareaEditor;
