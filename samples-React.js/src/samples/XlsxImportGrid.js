import React, { useEffect, useRef } from 'react';
import AUIGrid from '../static/AUIGrid-React.js/AUIGridReact';
// xlsx 라이브러리
import { read, utils } from 'xlsx';

const XlsxImportGrid = () => {
	// 그리드 객체
	const myGrid = useRef();

	// 그리드 칼럼 레이아웃 정의
	const initColumnLayout = [
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
	];

	// 그리드 속성 정의
	const gridProps = {
		width: '100%',
		height: 480,
		noDataMessage: 'XLSX 파일을 선택하면 해당 데이터가 이곳에 출력됩니다.'
	};

	useEffect(() => {
		console.log('XlsxImportGrid 마운트됨');

		const grid = myGrid.current;
		// 최초 빈 배열 삽입
		grid.setGridData([]);

		return () => {
			console.log('XlsxImportGrid 언마운트됨');
		};
	}, []);

	// 파일 체인지 핸들러
	const onChange = (event) => {
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
			const jsonObj = process_wb(workbook);

			// csv 스트링 얻기
			const csvStr = jsonObj[Object.keys(jsonObj)[0]];
			console.log(csvStr);
			createAUIGrid(csvStr);
		});

		reader.readAsArrayBuffer(file);
	};

	// workbook 파싱하여 반환.
	const process_wb = (wb) => {
		let output = '';
		output = JSON.stringify(to_json(wb));
		output = output.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
		return JSON.parse(output);
	};

	// 엑셀 시트를 파싱하여 반환
	const to_json = (workbook) => {
		const result = {};
		workbook.SheetNames.forEach(function (sheetName) {
			// CSV 로 파싱
			const roa = utils.sheet_to_csv(workbook.Sheets[sheetName]);

			if (roa.length > 0) {
				result[sheetName] = roa;
			}
		});
		return result;
	};

	// csv 스트링 파싱하여 배열로 반환
	const parseCsv = (value) => {
		const rows = value.split('\n');
		const pData = [];
		rows.forEach(function (v, i) {
			pData[i] = v.split(',');
		});
		return pData;
	};

	// 엑셀 파일 시트에서 파싱한 csv 스트링 기반으로 그리드 동적 생성
	const createAUIGrid = (csvStr) => {
		const grid = myGrid.current;
		const data = parseCsv(csvStr);
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
	};

	return (
		<div>
			<p>AUIGrid 자체적으로 엑셀 임포팅 기능은 지원하지 않습니다.</p>
			<p>다만, XLSX 파일(또는 XLS)를 JSON,CSV 등으로 파싱해 주는 라이브러(SheetJS js-xlsx)를 활용하여 동적으로 AUIGrid 임포팅을 구현한 응용 데모입니다.</p>
			<p>출처 : https://docs.sheetjs.com/</p>
			<input type="file" className="btn" name="files" accept=".xlsx" onChange={onChange} />
			<AUIGrid ref={myGrid} columnLayout={initColumnLayout} gridProps={gridProps} />
		</div>
	);
};

export default XlsxImportGrid;
