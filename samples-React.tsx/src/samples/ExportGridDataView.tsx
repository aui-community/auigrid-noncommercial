import { useCallback } from 'react';
import FileSaver from 'file-saver';
// eslint-disable-next-line
import '../static/AUIGrid.pdfkit/AUIGrid.pdfkit';
import AUIGrid from '../static/AUIGrid-React.tsx/AUIGridReact';

interface IProps {
	myGrid: React.RefObject<AUIGrid>;
	xlsxProps?: Record<string, any>;
	pdfProps?: Record<string, any>;
}

declare global {
	interface Window {
		saveAs: typeof FileSaver.saveAs;
	}
}

window.saveAs = FileSaver.saveAs;

const ExportGridDataView = ({ myGrid, xlsxProps = {}, pdfProps = {} }: IProps) => {
	const exportClick = useCallback(() => {
		(myGrid.current as AUIGrid).exportToXlsx({ ...xlsxProps, progressBar: true });
	}, [myGrid, xlsxProps]);

	const exportPdfClick = useCallback(() => {
		(myGrid.current as AUIGrid).exportToPdf({ ...pdfProps, fontPath: './fonts/nyjgothic-medium.ttf' });
	}, [myGrid, pdfProps]);

	return (
		<div>
			<button onClick={exportClick}>엑셀(xlsx)로 저장</button>
			<button onClick={exportPdfClick}>PDF로 저장</button>
		</div>
	);
};

export default ExportGridDataView;
