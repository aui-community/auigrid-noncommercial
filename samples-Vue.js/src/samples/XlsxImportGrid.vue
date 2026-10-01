<script setup>
	import AUIGrid from '@/static/AUIGrid-Vue.js/AUIGrid.vue';
	import { read, utils } from 'xlsx';
	import './samples.css';
	import { ref, onMounted } from 'vue';

	const myGrid = ref(null);

	const gridProps = {
		width: '100%',
		height: 480,
		noDataMessage: 'XLSX 파일을 선택하면 해당 데이터가 이곳에 출력됩니다.'
	};

	const initColumnLayout = [
		{ dataField: '0', headerText: 'A', width: 120 },
		{ dataField: '1', headerText: 'B', width: 120 },
		{ dataField: '2', headerText: 'C', width: 120 },
		{ dataField: '3', headerText: 'D', width: 120 },
		{ dataField: '4', headerText: 'E', width: 120 },
		{ dataField: '5', headerText: 'F', width: 120 },
		{ dataField: '6', headerText: 'G', width: 120 },
		{ dataField: '7', headerText: 'H', width: 120 }
	];

	const toJson = (workbook) => {
		const result = {};
		workbook.SheetNames.forEach((sheetName) => {
			const roa = utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if (roa.length > 0) {
				result[sheetName] = roa;
			}
		});
		return result;
	};

	const processWorkbook = (wb) => {
		const output = JSON.stringify(toJson(wb)).replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
		return JSON.parse(output);
	};

	const parseCsv = (value) => value.split('\n').map((row) => row.split(','));

	const createAUIGrid = (csvStr) => {
		const grid = myGrid.value;
		const data = parseCsv(csvStr);

		if (data.length <= 0) {
			alert('데이터가 존재하지 않는 파일입니다.');
			return;
		}

		const firstRow = data[0];
		if (typeof firstRow === 'undefined') {
			alert('AUIGrid 로 변환할 수 없는 엑셀 파일입니다.');
			return;
		}

		const columnLayout = firstRow.map((_v, n) => ({ dataField: n, headerText: `Col${1 + n}`, width: 100 }));

		grid.changeColumnLayout(columnLayout);
		grid.setCsvGridData(csvStr, false);
	};

	const onChange = (event) => {
		const file = event.target.files[0];
		if (typeof file === 'undefined') {
			alert('파일 선택 시 오류 발생!!');
			return;
		}
		const reader = new FileReader();
		reader.addEventListener('load', (e) => {
			const workbook = read(e.target.result, { type: 'binary' });
			const jsonObj = processWorkbook(workbook);
			const csvStr = jsonObj[Object.keys(jsonObj)[0]];
			createAUIGrid(csvStr);
		});
		reader.readAsArrayBuffer(file);
	};

	onMounted(() => {
		myGrid.value.setGridData([]);
	});
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
