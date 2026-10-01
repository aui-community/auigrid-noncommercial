import PropTypes from 'prop-types';
// eslint-disable-next-line
import FileSaver from 'file-saver';
// eslint-disable-next-line
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit';

const ExportGridDataView = ({ myGrid, xlsxProps, pdfProps }) => {
	const exportClick = () => {
		myGrid.current.exportToXlsx({ ...xlsxProps, progressBar: true });
	};

	const exportPdfClick = () => {
		myGrid.current.exportToPdf({ ...pdfProps, fontPath: './fonts/nyjgothic-medium.ttf' });
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
