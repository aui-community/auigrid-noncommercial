<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	import './RendererTemplateFunc';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 이름, SPA 프로젝트일 때 해당 그리드는 중복되어선 안됨.
			gridName: 'RendererTemplate',

			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				// 행 높이 설정
				rowHeight: 34,
				editable: true,
				showStateColumn: true,
				selectionMode: 'multipleCells'
			},

			// 그리드 칼럼 레이아웃
			columnLayout2: [],

			// 그리드 데이터
			gridData: [
				{ name: 'Steve', code: '001', check: 'v1' },
				{ name: 'Emma', code: '003', check: 'v1,v2,v3' },
				{ name: 'Steve', code: '004', check: 'v2' },
				{ name: 'Anna', code: '003', check: 'v1,v2,v3' },
				{ name: 'Lawrence', code: '005', check: 'v1,v2,v3' },
				{ name: 'Steve', code: '003', check: 'v1,v2,v3' },
				{ name: 'Anna', code: '002', check: 'v1,v2,v3' },
				{ name: 'Lawrence', code: '002', check: 'v3' },
				{ name: 'Lawrence', code: 'None', check: 'v1,v3' },
				{ name: 'Kim', code: '001', check: 'v1,v2' },
				{ name: 'Emma', code: '005', check: 'v1,v2,v3' },
				{ name: 'Kim', code: '002', check: 'v1,v2,v3' },
				{ name: 'Kim', code: 'None', check: 'v1,v2,v3' },
				{ name: 'Steve', code: '001', check: 'v1,v2,v3' },
				{ name: 'Anna', code: '005', check: 'v1,v3' },
				{ name: 'Anna', code: '005', check: 'v1,v2,v3' },
				{ name: 'Kim', code: '001', check: 'v3' },
				{ name: 'Steve', code: 'None', check: 'v1,v2,v3' },
				{ name: 'Kim', code: '002', check: 'v2,v3' },
				{ name: 'Kim', code: '001', check: 'v1,v2,v3' }
			],

			// 셀렉트 표현할 리스트
			mySelectList: [
				{ value: '001', text: '선택 1' },
				{ value: '002', text: '선택 2' },
				{ value: '003', text: '선택 3' },
				{ value: '004', text: '선택 4' },
				{ value: '005', text: '선택 5' }
			]
		}),
		created() {
			console.log('RendererTemplate 생성됨');
			this.columnLayout2 = [
				{
					dataField: 'name',
					headerText: 'Template-ButtonGroup',
					width: 260,
					renderer: {
						// HTML 템플릿 렌더러 사용
						type: 'TemplateRenderer'
					},
					// dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
					labelFunction: (rowIndex, columnIndex, value) => {
						// HTML 템플릿 작성
						let template = '<div class="my_div">';
						template += '<span class="my_div_text_box">' + value + '</span>';
						template += '<span class="my_div_btn" onclick="javascript:$agRendererTemplate.myApplyBtnClick(' + rowIndex + ', event);">적용</span>';
						template += '<span class="my_div_btn2" onclick="javascript:$agRendererTemplate.myPopupBtnClick(' + rowIndex + ', event);">팝업</span>';
						template += '</div>';
						return template;
					}
				},
				{
					dataField: 'code',
					headerText: 'Template-Select',
					width: 280,
					editable: false, // 그리드의 에디팅 사용 안함( 템플릿에서 만든 Select 로 에디팅 처리 하기 위함 )
					renderer: {
						// HTML 템플릿 렌더러 사용
						type: 'TemplateRenderer'
					},
					// dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
					labelFunction: (rowIndex, columnIndex, value) => {
						// HTML 템플릿 작성
						if (!value) return '';
						let template = '<div class="my_div">';

						if (value === 'None') {
							template += '<span style="line-height:2em;">선택할 수 없도록 작성됨(즉, 동적 select 표현)</span>';
						} else {
							template += '<span class="my_div_code_span">코드명 : ' + value + '</span>';
							template += '<select style="width:100px;height:20px;" onchange="javascript:$agRendererTemplate.mySelectChangeHandler(' + rowIndex + ', this.value, event);">';

							this.mySelectList.forEach((element) => {
								const code = element['value'];
								const text = element['text'];
								if (code === value) {
									template += '<option value="' + code + '" selected="selected">' + text + '</option>';
								} else {
									template += '<option value="' + code + '">' + text + '</option>';
								}
							});
							template += '</select>';
						}
						template += '</div>';
						return template; // HTML 템플릿 반환..그대도 innerHTML 속성값으로 처리됨
					}
				},
				{
					dataField: 'check',
					headerText: 'Template-CheckGroup',
					width: 180,
					editable: false, // 그리드의 에디팅 사용 안함( 템플릿에서 만든 Select 로 에디팅 처리 하기 위함 )
					renderer: {
						// HTML 템플릿 렌더러 사용
						type: 'TemplateRenderer'
					},
					// dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
					labelFunction: (rowIndex, columnIndex, value) => {
						// HTML 템플릿 작성
						const valueArr = value.split(',');
						const inputTagArr = [];
						let template = '<div class="my_div">';
						template += '<span class="my_div_chk_span">';

						inputTagArr[0] = '<input type="checkbox" value="v1" onclick="javascript:$agRendererTemplate.myCheckClick(' + rowIndex + ', event);">값1';
						inputTagArr[1] = '<input type="checkbox" value="v2" onclick="javascript:$agRendererTemplate.myCheckClick(' + rowIndex + ', event);">값2';
						inputTagArr[2] = '<input type="checkbox" value="v3" onclick="javascript:$agRendererTemplate.myCheckClick(' + rowIndex + ', event);">값3';

						valueArr.forEach((element) => {
							switch (element) {
								case 'v1':
									inputTagArr[0] = '<input type="checkbox" checked="checked" value="v1" onclick="javascript:$agRendererTemplate.myCheckClick(' + rowIndex + ', event);">값1';
									break;
								case 'v2':
									inputTagArr[1] = '<input type="checkbox" checked="checked" value="v2" onclick="javascript:$agRendererTemplate.myCheckClick(' + rowIndex + ', event);">값2';
									break;
								case 'v3':
									inputTagArr[2] = '<input type="checkbox" checked="checked" value="v3" onclick="javascript:$agRendererTemplate.myCheckClick(' + rowIndex + ', event);">값3';
									break;
								default:
									break;
							}
						});
						template += inputTagArr.join('');
						template += '</span>';
						template += '</div>';
						return template;
					}
				}
			];
		},

		mounted() {
			console.log('RendererTemplate 마운트됨');
			const grid = this.$refs.myGrid;
			grid.setGridData(this.gridData);
		},

		unmounted() {
			console.log('RendererTemplate 언마운트됨');
		},
		methods: {}
	};
</script>
<template>
	<div>
		<div class="desc">
			<p>데이터 값이 HTML 인 경우 그대로 출력하며, 사용자가 임의로 labelFunction 에서 HTML 스트링을 작성할 수 있습니다.(innerHTML 처리)</p>
			<strong>템플릿 렌더러에서 수정 가능한 태그를 어떻게 작성하는지를 보여주는 데모입니다.</strong>
			<p>템플릿 렌더러로 작성된 데이터 수정도 Undo(Ctrl+Z), Redo(Ctrl+Y) 를 지원합니다.</p>
			<p>HTML 템플릿은 행 높이를 벗어날 수 없습니다. 예를 들어 br 태그로 개행을 한다해도 지정된 행 높이를 벗어 날 수 없습니다.(그리드의 rowHeight 속성으로 높이를 크게 하십시오.)</p>
			<p>■ 단점 : 사용자가 HTML 템플릿을 작성하였기 때문에 엑셀 저장, 그룹핑, 필터링, 정렬 등에 제약을 받습니다. (dataField 값 기준으로 처리됩니다.)</p>
			<p><strong>템플릿 렌더러(TempalateRenderer)를 Vue.js 와 같은 프로젝트에서 사용을 추천하지 않습니다. CustomRenderer를 사용하십시오.</strong></p>
		</div>
		<!-- name 속성을 설정하면 해당 값이 포함되어 그리드의 id 가 설정됨.(예: aui-grid-wrap-이름) -->
		<AUIGrid ref="myGrid" :name="gridName" :columnLayout="columnLayout2" :gridProps="gridProps" />
	</div>
</template>
<style>
	/* 커스텀 칼럼 스타일 정의 */
	.aui-grid-user-custom-column {
		background: #ffffee;
		font-weight: bold;
	}

	/* HTML 템플릿에서 사용할 스타일 정의*/
	.my_div {
		display: inline-block;
		margin-top: 4px;
		line-height: 12px;
	}
	.my_div_text_box {
		display: inline-block;
		border: 1px solid #aaa;
		text-align: left;
		width: 140px;
		padding: 4px;
	}
	.my_div_btn {
		color: #fff !important;
		background-color: #2a2d33;
		font-weight: bold;
		margin: 2px 4px;
		padding: 2px 4px;
		line-height: 2em;
		cursor: pointer;
	}
	.my_div_btn2 {
		color: #fff !important;
		background-color: #ee5315;
		font-weight: bold;
		margin: 2px 4px;
		padding: 2px 4px;
		line-height: 2em;
		cursor: pointer;
	}
	.my_div_code_span {
		margin-right: 4px;
		color: #000099;
	}
	.my_div_chk_span {
		line-height: 2em;
	}
	.my_div_chk_span input {
		margin-left: 4px;
		width: 16px;
		height: 16px;
	}
	/* HTML 템플릿에서 사용할 스타일 정의 끝*/
</style>
