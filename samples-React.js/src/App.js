import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import logo from './assets/auisoft.png';
import './App.css';
import Home from './views/Home';
import Showcase01 from './showcases/Showcase01';
import Showcase02 from './showcases/Showcase02';
import Showcase03 from './showcases/Showcase03';
import Showcase04 from './showcases/Showcase04';
import Showcase05 from './showcases/Showcase05';
import Showcase06 from './showcases/Showcase06';
import Showcase07 from './showcases/Showcase07';
import SampleDefault from './samples/SampleDefault';
import Syling from './samples/Styling';
import RendererTemplate from './samples/RendererTemplate';
import DragToDropTwoGrid from './samples/DragToDropTwoGrid';
import EditDropDown from './samples/EditDropDown';
import XlsxImportGrid from './samples/XlsxImportGrid';
import ExportMultiGrid from './samples/ExportMultiXlsx';
import CustomRendererEchart from './samples/CustomRendererEchart';
import CustomRendererStock from './samples/CustomRendererStock';
import CustomEditRendererDatePicker from './samples/CustomEditRendererDatePicker';
import CustomEditRendererTextarea from './samples/CustomEditRendererTextarea';
import CustomRendererInput from './samples/CustomRendererInput';

// 쇼케이스 메뉴 리스트
const mainMenuList = [
	{ path: '/Showcase01', name: 'Showcase01', text: '학생 출석 CRUD 그리드', element: <Showcase01 /> },
	{ path: '/Showcase02', name: 'Showcase02', text: '프로젝트 일정 트리 그리드', element: <Showcase02 /> },
	{ path: '/Showcase03', name: 'Showcase03', text: '채널 마케팅 예산', element: <Showcase03 /> },
	{ path: '/Showcase04', name: 'Showcase04', text: '실시간 주식 종목', element: <Showcase04 /> },
	{ path: '/Showcase05', name: 'Showcase05', text: '국가 별 핸드폰 판매 통계', element: <Showcase05 /> },
	{ path: '/Showcase06', name: 'Showcase06', text: '손익 계산 내역', element: <Showcase06 /> },
	{ path: '/Showcase07', name: 'Showcase07', text: '일별 목표치 달성률 그리드', element: <Showcase07 /> }
];

// 일반 샘플 메뉴 리스트
const subMenuList = [
	{ path: '/SampleDefault', name: 'SampleDefault', text: 'JSON 그리드 출력 샘플(제거, 재생성)', element: <SampleDefault /> },
	{ path: '/Styling', name: 'Styling', text: '그리드 행, 열 스타일링(Styling)', element: <Syling /> },
	{ path: '/EditDropDown', name: 'EditDropDown', text: '에디트렌더러 - 드랍다운리스트렌더러', element: <EditDropDown /> },
	{ path: '/Template', name: 'Template', text: 'HTML 템플릿 렌더러 - 편집 적용', element: <RendererTemplate /> },
	{ path: '/DragDrop2Grid', name: 'DragToDropTwoGrid', text: '행, 드래그&드랍 - 2개의 그리드 간 행 이동', element: <DragToDropTwoGrid /> },
	{ path: '/CustomRendererStock', name: 'CustomRendererStock', text: 'CustomRenderer 작성 - 샘플 1 주식 렌더러 ', element: <CustomRendererStock /> },
	{ path: '/CustomRendererEchart', name: 'CustomRendererEchart', text: 'CustomRenderer 작성 - 아파치 ECharts', element: <CustomRendererEchart /> },
	{ path: '/CustomRendererInput', name: 'CustomRendererInput', text: 'CustomRenderer 작성 - Input 작성', element: <CustomRendererInput /> },
	{ path: '/CustomEditRendererTextarea', name: 'CustomEditRendererTextarea', text: 'CustomEditRenderer 작성 - 샘플 1 textarea', element: <CustomEditRendererTextarea /> },
	{ path: '/CustomEditRendererDatePicker', name: 'CustomEditRendererDatePicker', text: 'CustomEditRenderer 작성 - ReactDatepicker', element: <CustomEditRendererDatePicker /> },

	{ path: '/XlsxImportGrid', name: 'XlsxImportGrid', text: 'XLSX파일 임포팅으로 그리드 데이터 출력', element: <XlsxImportGrid /> },
	{ path: '/ExportMultiGrid', name: 'XlsxMultiGrid', text: '다수의 그리드 1개의 엑셀로 내보내기', element: <ExportMultiGrid /> }
];

function App() {
	const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 1300 ? true : false);

	const handleKnobClick = () => {
		setIsNavOpen(!isNavOpen);
	};

	const handleLinkClick = () => {
		if (window.innerWidth < 1300) {
			setIsNavOpen(false);
		}
	};

	useEffect(() => {
		const handleResize = (e) => {
			//console.log('window 리사이징');
			if (window.innerWidth >= 1300) {
				setIsNavOpen(true);
			} else {
				setIsNavOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<div className="app">
				<div className="header">
					<div className="logo-bar">
						<button className="knob-btn" onClick={handleKnobClick}>
							<span className="knob-bar"></span>
							<span className="knob-bar"></span>
							<span className="knob-bar"></span>
						</button>
						<img id="logo" src={logo} alt="AUISoft" />
						<span className="title">AUIGrid 3.0 DEMO for React.js</span>
					</div>
					<div className="header-buttons">
						<a href="https://www.auisoft.net/dcenter.html" className="btn btn-primary">
							DOWNLOAD FREE TRIAL
						</a>
						<a href="https://www.auisoft.net/price.html" className="btn btn-primary">
							PRICING &amp; LICENSE
						</a>
					</div>
				</div>
				<div className="nav" style={isNavOpen ? { transform: 'translateX(0px)' } : { transform: 'translateX(-300px)' }}>
					<h3 className="force-text-center">AUIGrid for React</h3>
					<ul className="nav-menu">
						<li>
							<NavLink to="/" onClick={handleLinkClick}>
								<span className="nav-item" style={{ fontWeight: 500 }}>
									HOME
								</span>
							</NavLink>
						</li>
						{mainMenuList.map((item, index) => (
							<li key={index}>
								<NavLink to={item.path} onClick={handleLinkClick} className={({ isActive }) => (isActive ? 'nav-item-active' : '')}>
									<span className="nav-item">
										{index + 1}. {item.text}
									</span>
								</NavLink>
							</li>
						))}
					</ul>
					<hr className="divider-root"></hr>
					<ul className="nav-menu">
						{subMenuList.map((item, index) => (
							<li key={index}>
								<NavLink to={item.path} onClick={handleLinkClick} className={({ isActive }) => (isActive ? 'nav-item-active' : '')}>
									<span className="nav-item">
										{index + 1}. {item.text}
									</span>
								</NavLink>
							</li>
						))}
					</ul>
					<div className="nav-border"></div>
				</div>
				<div className="container">
					<div className="view-content">
						<Routes>
							<Route className="page" exact path="/" element={<Home />} />
							{mainMenuList.map(({ name, path, element }) => (
								<Route key={name} className="page" exact path={path} element={element} />
							))}
							{subMenuList.map(({ name, path, element }) => (
								<Route key={name} className="page" exact path={path} element={element} />
							))}
						</Routes>
					</div>
				</div>
				<div className="footer">
					<span>Copyright © AUISoft Co., Ltd.</span>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
