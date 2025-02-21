import React, { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';

const PUBLIC_URL = process.env.PUBLIC_URL;

const DragToDropTwoGrid = () => {
	// 상단 마스터 그리드 객체
	const myMasterGrid = useRef<AUIGrid>(null);

	// 하단 디테일 그리드 객체
	const myDetailGrid = useRef<AUIGrid>(null);

	// 상단 마스터 그리드 칼럼 레이아웃 정의
	const columnLayoutMaster: IGrid.Column[] = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 160
		},
		{
			dataField: 'name',
			headerText: 'Name',
			width: 160
		},
		{
			dataField: 'flag',
			headerText: 'Flag IMG',
			editable: false,
			prefix: PUBLIC_URL + '/assets/',
			renderer: {
				type: IGrid.RendererKind.ImageRenderer,
				imgHeight: 24,
				altField: 'country'
			},
			width: 100
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 140
		},
		{
			dataField: 'color',
			headerText: 'Color',
			width: 100
		},
		{
			dataField: 'price',
			headerText: 'Price',
			dataType: 'numeric',
			style: 'my-column',
			width: 120
		},
		{
			dataField: 'quantity',
			headerText: 'Quantity',
			dataType: 'numeric',
			style: 'my-column',
			width: 100
		},
		{
			dataField: 'date',
			headerText: 'Date',
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd', // 데이터의 날짜 형식
			formatString: 'yyyy년 mm월 dd일', // 그리드에 보여줄 날짜 형식
			width: 140
		}
	];

	// 상단 마스터 그리드 속성 정의
	const gridMasterProps: IGrid.Props = {
		width: '100%',
		height: 280,
		selectionMode: 'multipleCells',
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: true,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: true,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: true,
		// 드랍을 받아줄 그리드가 다른 그리드에도 있는지 여부 (기본값 : false)
		// 즉, 드리드 간의 행 이동인지 여부
		dropToOthers: true
	};

	// 하단 디테일 그리드 칼럼 레이아웃 정의
	const columnLayoutDeatil: IGrid.Column[] = [
		{
			dataField: 'id',
			headerText: 'ID',
			width: 160
		},
		{
			dataField: 'name',
			headerText: 'Name',
			width: 140
		},
		{
			dataField: 'country',
			headerText: 'Country',
			width: 140
		},
		{
			dataField: 'product',
			headerText: 'Product',
			width: 180
		}
	];

	// 하단 디테일 그리드 속성 정의
	const gridDetailProps: IGrid.Props = {
		width: '100%',
		height: 280,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: true,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: true,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: true,
		// 드랍을 받아줄 그리드가 다른 그리드에도 있는지 여부 (기본값 : false)
		// 즉, 드리드 간의 행 이동인지 여부
		dropToOthers: true
	};

	useEffect(() => {
		console.log('DragToDropTwoGrid 마운트됨');

		// 드랍 완료 이벤트 핸들러
		const dropEndEventHandler = (e: IGrid.DropEndEvent) => {
			// 정보 출력
			const gridDirection: string = '그리드 ' + e.pid + ' → ' + e.pidToDrop;
			const msg: string = gridDirection + ' 드랍 완료 : ' + e.fromRowIndex + '→' + e.toRowIndex + ' 에 ' + e.items.length + ' 행(들) 드랍 됨';
			console.log(msg);
		};

		// 최초 마운팅 될 때 그리드 이벤트 세팅
		myMasterGrid.current?.bind(IGrid.EventKind.DropEnd, dropEndEventHandler);
		myDetailGrid.current?.bind(IGrid.EventKind.DropEnd, dropEndEventHandler);

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();

		// 하단 디테일 그리드는 빈 배열로 초기화
		myDetailGrid.current?.setGridData([]);

		return () => {
			console.log('DragToDropTwoGrid 언마운트됨');
		};
	}, []);

	// 그리드 데이터 조회하여 삽입
	const requestGridData = () => {
		const grid = myMasterGrid.current as AUIGrid;
		const REQ_URL: string = './data/normal_100.json';

		grid.showAjaxLoader();
		axios.get(REQ_URL).then((result: any) => {
			//console.log(result);
			// 그리드 데이터 삽입
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	};

	return (
		<div>
			<div className="desc">
				<p>두 개의 그리드 간의 드래그&드랍으로 행 이동을 정의한 모습입니다.(두 그리드 상호 간의 드래그&드랍))</p>
				<p>드래그&드랍으로 다른 그리드에 행을 이동 시킨 경우 이동 전 그리드는 행 삭제로, 이동 된 그리드는 행 추가로 인식됩니다.</p>
			</div>
			<h4 style={{ textAlign: 'left' }}> 상단 마스터 그리드</h4>
			<AUIGrid ref={myMasterGrid} columnLayout={columnLayoutMaster} gridProps={gridMasterProps} />
			<h4 style={{ textAlign: 'left', height: 20 }}>하단 디테일 그리드</h4>
			<AUIGrid ref={myDetailGrid} columnLayout={columnLayoutDeatil} gridProps={gridDetailProps} />
		</div>
	);
};

export default DragToDropTwoGrid;
