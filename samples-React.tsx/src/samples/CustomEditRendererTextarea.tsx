import { useEffect, useRef } from 'react';
import * as IGrid from 'aui-grid';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';
import axios from 'axios';
import MyTextareaEditor from '../editRenderers/MyTextareaEditor';
import './CustomEditRendererTextarea.css';

const columnLayout: IGrid.Column[] = [
	{ dataField: 'no', headerText: 'No.', width: 50 },
	{
		dataField: 'title',
		headerText: 'Title',
		width: 200,
		editRenderer: {
			type: IGrid.EditRendererKind.CustomEditRenderer,
			jsClass: MyTextareaEditor,
			vPosition: 'top',
			fitWidth: true
		}
	},
	{
		dataField: 'content',
		headerText: 'Content',
		style: 'my-wrap-column',
		width: 400,
		editRenderer: {
			type: IGrid.EditRendererKind.CustomEditRenderer,
			jsClass: MyTextareaEditor,
			vPosition: 'top',
			fitWidth: true,
			extraProps: { confirm: '확 인(Ctrl+Enter)', cancel: '취 소(Esc)' }
		}
	},
	{ dataField: 'date', headerText: 'Date', width: 140 }
];

const gridProps: IGrid.Props = {
	width: '100%',
	height: 480,
	editable: true,
	wordWrap: true,
	selectionMode: 'multipleCells'
};

const EditRendererCustom1 = () => {
	const myGrid = useRef<AUIGrid>(null);

	useEffect(() => {
		const grid = myGrid.current as AUIGrid;

		grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
			console.log(event);
		});

		grid.bind([IGrid.EventKind.CellClick, IGrid.EventKind.HeaderClick], (event: IGrid.CellClickEvent | IGrid.HeaderClickEvent) => {
			switch (event.type) {
				case IGrid.EventKind.CellClick:
					console.log((event as IGrid.CellClickEvent).value);
					break;
				case IGrid.EventKind.HeaderClick:
					console.log(event.headerText);
					break;
			}
		});

		grid.bind(IGrid.EventKind.CellDoubleClick, (event: IGrid.CellDoubleClickEvent) => {
			console.log(event);
		});

		grid.showAjaxLoader();
		axios.get('./data/article_list.json').then((result) => {
			grid.setGridData(result.data);
			grid.removeAjaxLoader();
		});
	}, []);

	return (
		<div>
			<div className="desc">
				<p>리액트 + Typescript 에서 어떻게 CustomEditRenderer 를 정의하고 사용하는지를 보여주는 데모입니다.</p>
				<p>이 샘플은 일반 JS에 작성한 AUIGrid.TextareaEditor 를 리액트 + Typescript 로 출력한 모습입니다.</p>
				<p>
					즉,{' '}
					<a href="https://www.auisoft.net/demo/auigrid/editRenderer_custom_1.html?er_cus_1&theme=default&s=5648" target="_blank" rel="noreferrer">
						<strong>사용자 정의 에디트렌더러 - textarea 샘플</strong>
					</a>
					을 그대로 리액트 + Typescript 로 작성한 데모입니다.
				</p>
			</div>
			<AUIGrid ref={myGrid} columnLayout={columnLayout} gridProps={gridProps} />
		</div>
	);
};

export default EditRendererCustom1;
