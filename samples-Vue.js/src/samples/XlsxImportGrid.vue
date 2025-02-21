<script>
	// AUIGrid 컴포넌트
	import AUIGrid from '../static/AUIGrid-Vue.js/AUIGrid.vue';
	// xlsx 라이브러리
	import { read, utils } from 'xlsx';
	import './samples.css';

	export default {
		components: {
			AUIGrid
		},

		data: () => ({
			// 그리드 속성 정의
			gridProps: {
				width: '100%',
				height: 480,
				noDataMessage: 'XLSX 파일을 선택하면 해당 데이터가 이곳에 출력됩니다.'
			},

			// 최초 칼럼 레이아웃
			initColumnLayout: [
				{
					dataField: '0',
					headerText: 'A',
					width: 120
				},
				{
					dataField: '1',
					headerText: 'B',
					width: 120
				},
				{
					dataField: '2',
					headerText: 'C',
					width: 120
				},
				{
					dataField: '3',
					headerText: 'D',
					width: 120
				},
				{
					dataField: '4',
					headerText: 'E',
					width: 120
				},
				{
					dataField: '5',
					headerText: 'F',
					width: 120
				},
				{
					dataField: '6',
					headerText: 'G',
					width: 120
				},
				{
					dataField: '7',
					headerText: 'H',
					width: 120
				}
			]
		}),
		created() {
			console.log('XlsxImportGrid 생성됨');
		},

		mounted() {
			console.log('XlsxImportGrid 마운트됨');
			const grid = this.$refs.myGrid;
			// 최초 빈 배열 삽입
			grid.setGridData([]);
		},

		unmounted() {
			console.log('XlsxImportGrid 언마운트됨');
		},
		methods: {
			// 파일 체인지 핸들러
			onChange(event) {
				const file = event.target.files[0];
				if (typeof file == 'undefined') {
					alert('파일 선택 시 오류 발생!!');
					return;
				}
				const reader = new FileReader();
				reader.addEventListener('load', (e) => {
					const data = e.target.result;

					// 엑셀 바이너리 읽기
					const workbook = read(data, { type: 'binary' });

					// xlsx 를 json 으로 변환
					const jsonObj = this.process_wb(workbook);

					// csv 스트링 얻기
					const csvStr = jsonObj[Object.keys(jsonObj)[0]];
					console.log(csvStr);
					this.createAUIGrid(csvStr);
				});

				reader.readAsArrayBuffer(file);
			},

			// workbook 파싱하여 반환.
			process_wb(wb) {
				let output = '';
				output = JSON.stringify(this.to_json(wb));
				output = output.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
				return JSON.parse(output);
			},

			// 엑셀 시트를 파싱하여 반환
			to_json(workbook) {
				const result = {};
				workbook.SheetNames.forEach(function (sheetName) {
					// CSV 로 파싱
					const roa = utils.sheet_to_csv(workbook.Sheets[sheetName]);

					if (roa.length > 0) {
						result[sheetName] = roa;
					}
				});
				return result;
			},

			// csv 스트링 파싱하여 배열로 반환
			parseCsv(value) {
				const rows = value.split('\n');
				const pData = [];
				rows.forEach(function (v, i) {
					pData[i] = v.split(',');
				});
				return pData;
			},

			// 엑셀 파일 시트에서 파싱한 csv 스트링 기반으로 그리드 동적 생성
			createAUIGrid(csvStr) {
				const grid = this.$refs.myGrid;
				const data = this.parseCsv(csvStr);
				console.log(data);

				if (data.length <= 0) {
					alert('데이터가 존재하지 않는 파일입니다.');
					return;
				}

				//데이터에 맞게 적용 시킬 칼럼 레이아웃
				const columnLayout = [];

				// 현재 엑셀 파일의 0번째 행을 기준으로 컬럼을 작성함.
				// 만약 상단에 문서 제목과 같이 있는 경우 조정 필요.
				const firstRow = data[0];

				if (typeof firstRow == 'undefined') {
					alert('AUIGrid 로 변환할 수 없는 엑셀 파일입니다.');
					return;
				}

				// 칼럼 레이아웃 작성
				firstRow.forEach(function (v, n) {
					columnLayout.push({
						dataField: n,
						headerText: 'Col' + (1 + n),
						width: 100
					});
				});

				// 칼럼 레이아웃 적용 시킴.
				grid.changeColumnLayout(columnLayout);

				// 그리드에 CSV 데이터 삽입.
				grid.setCsvGridData(csvStr, false);
			}
		}
	};
</script>
<template>
	<div>
		<p>AUIGrid 자체적으로 엑셀 임포팅 기능은 지원하지 않습니다.</p>
		<p>다만, XLSX 파일(또는 XLS)를 JSON,CSV 등으로 파싱해 주는 라이브러(SheetJS js-xlsx)를 활용하여 동적으로 AUIGrid 임포팅을 구현한 응용 데모입니다.</p>
		<p>SheetJS Community Edition is licensed under the "Apache 2.0 License".</p>
		<p><a href="https://docs.sheetjs.com/" target="_blank" class="link-is-link">https://docs.sheetjs.com/</a></p>
		<input class="btn" type="file" name="files" accept=".xlsx" @change="onChange" />
		<AUIGrid ref="myGrid" :columnLayout="initColumnLayout" :gridProps="gridProps" />
	</div>
</template>
