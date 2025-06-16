import React, { useEffect, useRef, useState } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
import axios from 'axios';
import ExportGridDataView from '../samples/ExportGridDataView';
import './Showcase02.css';
import iconMan from '../assets/office_man.png';
import iconFemale from '../assets/office_female.png';
import iconDate from '../assets/calendar-icon.png';

// 상단 계층 리스트
const listItems = [
	{
		text: '계층 1 Depth 만 보이기',
		value: 1
	},
	{
		text: '계층 2 Depth 만 보이기',
		value: 2
	},
	{
		text: '계층 3 Depth 만 보이기',
		value: 3
	}
];

const Showcase02 = () => {
	const [isExpanded, setIsExpanded] = useState(true);

	// 그리드 객체
	const myGrid = useRef();

	// AUIGrid 칼럼 레이아웃
	const columnLayout = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 50
		},
		{
			dataField: 'name',
			headerText: 'Task Name',
			filter: {
				showIcon: true
			},
			headerTooltip: {
				show: true,
				tooltipHtml:
					'<div style="width:180px;text-align:left;"><p>Just an incredibly simple <span style="color:#F29661;">AUIGrid</span></p><p>Faucibus sed lobortis aliquam lorem blandit. Lorem eu nunc metus col. Commodo id in arcu ante lorem ipsum sed accumsan erat praesent faucibus commodo ac mi lacus. Adipiscing mi ac commodo. </p></div>' // eslint-disable-line
			},
			style: 'showcase2-my-left-text',
			width: 400
		},
		{
			dataField: 'charge',
			headerText: 'Charge',
			filter: {
				showIcon: true
			},
			headerTooltip: {
				show: true,
				tooltipHtml: '<div style="width:120px;text-align:left;"><p>Things I Can Do</p><p> Integer eu ante ornare amet commetus vestibulum blandit integer in curae ac faucibus integer non. Adipiscing cubilia elementum integer lorem ipsum dolor sit amet.</p></div>' // eslint-disable-line
			},
			style: 'showcase2-my-left-text',
			width: 120,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 20, // icon 가로 사이즈, 지정하지 않으면 24로 기본값 적용됨
				iconHeight: 20,
				iconFunction: (rowIndex, columnIndex, value) => {
					if (value && value.substr(0, 1) === 'A') return iconFemale;
					return iconMan;
				}
			},
			editRenderer: {
				type: 'ComboBoxRenderer',
				showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				historyMode: true, // 콤보 리스트 외에 사용자가 다른 값을 입력하면 해당 값이 기존 list 에 추가되어 출력됨
				listAlign: 'left'
			}
		},
		{
			dataField: 'complete',
			headerText: 'Complete(%)',
			width: 100,
			dataType: 'numeric',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100
			},
			editRenderer: {
				type: 'NumberStepRenderer',
				min: 0,
				max: 100,
				step: 1
			},
			styleFunction: (rowIndex, columnIndex, value) => {
				if (value === 100) return 'showcase2-complete-red';
			}
		},
		{
			dataField: 'start',
			headerText: 'Start Date',
			formatString: 'mm/dd/yyyy',
			dataType: 'date',
			width: 120,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: {
					// icon 값 참조할 테이블 레퍼런스
					default: iconDate // default
				},
				onClick: () => {
					// 달력 아이콘 클릭하면 실제로 달력을 띄움.
					// 즉, 수정으로 진입함.
					myGrid.current.openInputer();
				}
			},
			editRenderer: {
				type: 'CalendarRenderer',
				showEditorBtn: false, // 기본 에디터버턴 사용 안함.
				onlyCalendar: true, // 달력으로만 수정 가능
				titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				monthTitleString: 'mmm',
				formatMonthString: 'mmm yyyy',
				formatYearString: 'yyyy',
				showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력 안함
				showTodayBtn: true, // 오늘 날짜 선택 버턴 출력
				todayText: 'Today' // 오늘 날짜 버턴 텍스트
			}
		},
		{
			dataField: 'end',
			headerText: 'End Date',
			formatString: 'mm/dd/yyyy',
			dataType: 'date',
			width: 120,
			renderer: {
				type: 'IconRenderer',
				iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
				iconHeight: 16,
				iconPosition: 'aisleRight',
				iconTableRef: {
					// icon 값 참조할 테이블 레퍼런스
					default: iconDate // default
				},
				onClick: () => {
					// 달력 아이콘 클릭하면 실제로 달력을 띄움.
					// 즉, 수정으로 진입함.
					myGrid.current.openInputer();
				}
			},
			editRenderer: {
				type: 'CalendarRenderer',
				showEditorBtn: false, // 기본 에디터버턴 사용 안함.
				onlyCalendar: true, // 달력으로만 수정 가능
				titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				monthTitleString: 'mmm',
				formatMonthString: 'mmm yyyy',
				formatYearString: 'yyyy',
				showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력 안함
				showTodayBtn: true, // 오늘 날짜 선택 버턴 출력
				todayText: 'Today' // 오늘 날짜 버턴 텍스트
			}
		},
		{
			dataField: 'issue',
			headerText: 'Issues',
			style: 'showcase2-my-left-text'
		}
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		selectionMode: 'singleRow',
		editable: true,
		enableFilter: true,
		showStateColumn: true,
		// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
		treeColumnIndex: 1,
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: true,
		// 체크박스 사용 안함
		showRowCheckColumn: false,
		showRowNumColumn: false
	};

	useEffect(() => {
		console.log('Showcase02 마운트됨');

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		return () => {
			console.log('Showcase02 언마운트됨');
		};
	}, []);

	// 데이터 요청 메소드
	const requestGridData = () => {
		const grid = myGrid.current;
		grid.showAjaxLoader();
		// axios 모듈을 통하여 요청합니다.
		const REQ_URL = './data/schedule_tree.json';
		axios.get(REQ_URL).then((result) => {
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	const handleSelect = (e) => {
		// 셀렉트 선택 값
		const depth = Number(e.target.value);

		// 해당 depth 까지 오픈함
		myGrid.current.showItemsOnDepth(depth);
	};

	const handleExpandBtnClick = () => {
		const grid = myGrid.current;
		if (!isExpanded) {
			grid.expandAll();
		} else {
			grid.collapseAll();
		}
		setIsExpanded(!isExpanded);
	};

	return (
		<div>
			<div className="desc">
				<ExportGridDataView myGrid={myGrid} xlsxProps={{ fileName: '쇼케이스-02' }} pdfProps={{ fileName: '쇼케이스-02' }} />
				<p>프로젝트 일정 관리 테이블을 출력한 모습입니다. ( 계층구조 데이터 표현 )</p>
				<div>
					<button className="btn" onClick={handleExpandBtnClick}>
						모두 열기/닫기
					</button>
					<select onChange={handleSelect} defaultValue="0">
						<option value="0" disabled="disabled">
							-- 특정 계층까지만 보이기 --
						</option>
						{listItems.map(({ text, value }) => (
							<option value={value} key={value}>
								{text}
							</option>
						))}
					</select>
				</div>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default Showcase02;
