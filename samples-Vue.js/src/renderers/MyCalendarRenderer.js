/*
 * AUIGrid 사용자 정의 렌더러 - 날짜별 달성률 표시 연결 모듈
 *
 * 프레임워크에서 공용 AUIGrid.MyCalendarRenderer.js 파일을 사용할 수 있도록 내보냅니다.
 * JS를 가져옵니다. 배치와 색상은 src/showcases/Showcase08.css의 관련 스타일을 함께 적용합니다. 그리드 래퍼로 AUIGrid를 로드한 뒤 이 모듈을 import합니다.
 *
 * 사용법
 *   import MyCalendarRenderer from "../renderers/MyCalendarRenderer";
 *   {
 *     dataField: "0",
 *     renderer: {
 *       type: "CustomRenderer",
 *       jsClass: MyCalendarRenderer
 *     }
 *   }
 *
 * 동작과 설정
 *   행 데이터 예: { "0": { date: 1, value: 75, dateLabel: "2026년 10월 1일", isToday: false } }
 *   value는 0~100 기준 달성률이며 아이콘 클릭 시 상세 값을 안내합니다.
 */
import '../static/AUIGrid/renderers/AUIGrid.MyCalendarRenderer';
export default window.AUIGrid.MyCalendarRenderer;
