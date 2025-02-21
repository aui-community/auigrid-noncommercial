<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	import axios from 'axios';
	// AUIGrid 커스텀 에디트렌더러 import
	import MyTextareaEditor from '../editRenderers/MyTextareaEditor';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				editable: true,
				// 워드랩 개행 처리
				wordWrap: true,
				selectionMode: 'multipleCells'
			},

			// 그리드 칼럼 레이아웃
			columnLayout: [
				{
					dataField: 'no',
					headerText: 'No.',
					width: 50
				},
				{
					dataField: 'title',
					headerText: 'Title',
					width: 200,
					editRenderer: {
						type: 'CustomEditRenderer',
						jsClass: MyTextareaEditor,
						vPosition: 'top',
						fitWidth: true
					}
				},
				{
					dataField: 'content',
					headerText: 'Content',
					style: 'my-wrap-column', // 줄바꿈 문자 들어온 값 그대로 개행 시키기 위한 스타일
					width: 400,
					editRenderer: {
						type: 'CustomEditRenderer',
						jsClass: MyTextareaEditor,
						vPosition: 'top',
						fitWidth: true,
						extraProps: {
							confirm: '확 인(Ctrl+Enter)',
							cancel: '취 소(Esc)'
						}
					}
				},
				{
					dataField: 'date',
					headerText: 'Date',
					width: 140
				}
			]
		}),
		created() {
			console.log('CustomEditRendererTextarea 생성됨');
		},

		mounted() {
			console.log('CustomEditRendererTextarea 마운트됨');
			// 초기 데이터 얻기
			this.requestGridData();
		},

		unmounted() {
			console.log('CustomEditRendererTextarea 언마운트됨');
		},
		methods: {
			// 그리드 데이터 조회하여 삽입
			requestGridData() {
				const grid = this.$refs.myGrid;
				const REQ_URL = './data/article_list.json';
				grid.showAjaxLoader();
				axios.get(REQ_URL).then((result) => {
					//console.log(result);
					// 그리드 데이터 삽입
					grid.setGridData(result.data);
					grid.removeAjaxLoader();
				});
			}
		}
	};
</script>
<template>
	<div>
		<div className="desc">
			<p>Vue에서 어떻게 CustomEditRenderer 를 정의하고 사용하는지를 보여주는 데모입니다.</p>
			<p>이 샘플은 일반 JS에 작성한 AUIGrid.TextareaEditor 를 Vue로 출력한 모습입니다.</p>
			<p>
				즉, <a href="https://www.auisoft.net/demo/auigrid/editRenderer_custom_1.html?er_cus_1&theme=default&s=5648" target="_blank" rel="noreferrer"> <strong>사용자 정의 에디트렌더러 - textarea 샘플</strong> </a>을 그대로 Vue로 작성한 데모입니다.
			</p>
		</div>
		<AUIGrid ref="myGrid" :columnLayout="columnLayout" :gridProps="gridProps" />
	</div>
</template>
<style>
	/* 줄바꿈 문자 들어온 값 그대로 개행 시키기 위한 스타일 */
	.my-wrap-column .aui-grid-renderer-base {
		white-space: pre-wrap;
	}
</style>
