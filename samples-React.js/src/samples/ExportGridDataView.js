import React from 'react';
import PropTypes from 'prop-types';
// AUIGrid 엑셀, PDF 바로 다운로딩 처리 모듈
// eslint-disable-next-line
import FileSaver from 'file-saver';
// AUIGrid PDF 처리 모듈
// eslint-disable-next-line
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit';

const ExportGridDataView = (props) => {
	// 엑셀로 내보내기
	const exportClick = () => {
		const grid = props.myGrid.current;
		// 내보내기 실행
		grid.exportToXlsx({ ...props.xlsxProps, progressBar: true });
	};

	// PDF 로 내보내기
	const exportPdfClick = () => {
		const grid = props.myGrid.current;
		// 내보내기 실행
		grid.exportToPdf({ ...props.pdfProps, fontPath: './fonts/nyjgothic-medium.ttf' });
	};
	return (
		<div>
			<button className="btn" onClick={exportClick}>
				엑셀(xlsx)로 저장
			</button>
			<button className="btn" onClick={exportPdfClick}>
				PDF로 저장
			</button>
		</div>
	);
};

ExportGridDataView.propTypes = {
	myGrid: PropTypes.object.isRequired,
	xlsxProps: PropTypes.object,
	pdfProps: PropTypes.object
};

ExportGridDataView.defaultProps = {
	xlsxProps: {},
	pdfProps: {}
};

export default ExportGridDataView;
