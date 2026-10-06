import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import SourceDialog from './views/SourceDialog';
import './App.css';
import Home from './views/Home';
import Showcase01 from './showcases/Showcase01';
import Showcase02 from './showcases/Showcase02';
import Showcase03 from './showcases/Showcase03';
import Showcase04 from './showcases/Showcase04';
import Showcase05 from './showcases/Showcase05';
import Showcase06 from './showcases/Showcase06';
import Showcase07 from './showcases/Showcase07';
import Showcase08 from './showcases/Showcase08';
import Showcase09 from './showcases/Showcase09';
import Showcase10 from './showcases/Showcase10';
import SampleDefault from './samples/SampleDefault';
import SampleBandBody from './samples/SampleBandBody';
import Syling from './samples/Styling';
import RendererTemplate from './samples/RendererTemplate';
import DragToDropTwoGrid from './samples/DragToDropTwoGrid';
import EditDropDown from './samples/EditDropDown';
import SampleTreeGrid from './samples/SampleTreeGrid';
import CustomEditRendererTextarea from './samples/CustomEditRendererTextarea';
import CustomRendererInput from './samples/CustomRendererInput';

interface IMenuItem {
	path: string;
	name: string;
	text: string;
	element: ReactElement;
}

// 쇼케이스 메뉴 리스트
const mainMenuList: IMenuItem[] = [
	{ path: '/Showcase01', name: 'Showcase01', text: '산업 장비 자원 운영표', element: <Showcase01 /> },
	{ path: '/Showcase02', name: 'Showcase02', text: '자율주행 로봇 BOM 원가', element: <Showcase02 /> },
	{ path: '/Showcase03', name: 'Showcase03', text: '재생에너지 월별 리포트', element: <Showcase03 /> },
	{ path: '/Showcase04', name: 'Showcase04', text: '실시간 서비스 모니터링', element: <Showcase04 /> },
	{ path: '/Showcase05', name: 'Showcase05', text: 'AI 모델 벤치마크 비교', element: <Showcase05 /> },
	{ path: '/Showcase06', name: 'Showcase06', text: '설계 변경 전후 대조표', element: <Showcase06 /> },
	{ path: '/Showcase07', name: 'Showcase07', text: '구매 요청 및 결재 현황', element: <Showcase07 /> },
	{ path: '/Showcase08', name: 'Showcase08', text: '일별 목표치 달성률 그리드', element: <Showcase08 /> },
	// WebDemo와 동일한 순번으로 쇼케이스를 연결합니다.
	{ path:'/Showcase09', name:'Showcase09', text:'반응형 밴드형 워크스페이스', element:<Showcase09 /> },
	{ path:'/Showcase10', name:'Showcase10', text:'자재 발주 및 입고 검수', element:<Showcase10 /> }
];

// 일반 샘플 메뉴 리스트
const subMenuList: IMenuItem[] = [
	{ path: '/SampleDefault', name: 'SampleDefault', text: 'JSON 그리드 기본 출력 샘플', element: <SampleDefault /> },
	// 기본 출력 다음에 밴드형 레이아웃을 비교합니다.
	{ path: '/SampleBandBody', name: 'SampleBandBody', text: '밴드형 바디 레이아웃 기본', element: <SampleBandBody /> },
	{ path: '/Styling', name: 'Styling', text: '그리드 행, 열 스타일링(Styling)', element: <Syling /> },
	{ path: '/SampleTreeGrid', name: 'SampleTreeGrid', text: '트리 그리드 - 일반 데이터를 계층 구조로 표현', element: <SampleTreeGrid /> },
	{ path: '/EditDropDown', name: 'EditDropDown', text: '에디트렌더러 - 드랍다운리스트렌더러', element: <EditDropDown /> },
	{ path: '/Template', name: 'Template', text: 'HTML 템플릿 렌더러 - 편집 적용', element: <RendererTemplate /> },
	{ path: '/DragDrop2Grid', name: 'DragToDropTwoGrid', text: '행, 드래그&드랍 - 2개의 그리드 간 행 이동', element: <DragToDropTwoGrid /> },
	{ path: '/CustomRendererInput', name: 'CustomRendererInput', text: 'CustomRenderer 작성 - Input 작성', element: <CustomRendererInput /> },
	{ path: '/CustomEditRendererTextarea', name: 'CustomEditRendererTextarea', text: 'CustomEditRenderer 작성 - 샘플 1 textarea', element: <CustomEditRendererTextarea /> }
];

// Router 안에서 현재 경로를 읽어 제목과 소스만 갱신하며 데모 컴포넌트의 생명주기는 유지합니다.
function DemoShell() {
    const { pathname } = useLocation();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [sourceOpen, setSourceOpen] = useState(false);
    const keyword = query.trim().toLocaleLowerCase();
    const matches = (item: IMenuItem) => item.text.toLocaleLowerCase().includes(keyword) || item.name.toLocaleLowerCase().includes(keyword);
    const currentMenu = [...mainMenuList, ...subMenuList].find(item => item.path.toLowerCase() === pathname.toLowerCase());
    const isHome = pathname === '/';
    const category = isHome ? 'HOME' : (currentMenu && mainMenuList.includes(currentMenu)) ? '쇼케이스' : '샘플';
    const pageTitle = isHome ? 'AUIGrid 데모 라이브러리' : currentMenu?.text || 'AUIGrid 데모';
    const resultCount = [...mainMenuList, ...subMenuList].filter(matches).length;

    // 뒤로/앞으로 이동에서도 소스 창과 모바일 메뉴가 이전 페이지에 남지 않습니다.
    useEffect(() => {
        setIsNavOpen(false);
        setSourceOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);
    useEffect(() => {
        const closeOnResize = () => setIsNavOpen(false);
        const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsNavOpen(false); };
        window.addEventListener('resize', closeOnResize);
        window.addEventListener('keydown', closeOnEscape);
        return () => { window.removeEventListener('resize', closeOnResize); window.removeEventListener('keydown', closeOnEscape); };
    }, []);

    return (
        <div className={`app sample-shell${isNavOpen ? ' sample-nav-open' : ''}`}>
            <a className="sample-skip" href="#sample-main">본문으로 이동</a>
            <header className="sample-header">
                <div className="sample-logo-bar">
                    <button type="button" className="sample-menu-toggle" aria-label="데모 메뉴" aria-controls="sample-nav" aria-expanded={isNavOpen} onClick={() => setIsNavOpen(!isNavOpen)}><span className="sample-menu-icon" /></button>
                    <NavLink className="sample-brand" to="/" aria-label="AUIGrid HOME">
                        <span className="sample-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
                        <span className="sample-brand-text"><strong>AUIGrid</strong><span>JavaScript 데이터 그리드</span></span>
                    </NavLink>
                    <span className="sample-header-label">React + TypeScript 데모</span>
                </div>
                <nav className="sample-header-links" aria-label="제품 안내">
                    <a href="https://www.auisoft.net/documentation/auigrid/">문서</a>
                    <a href="https://www.auisoft.net/price.html">라이선스</a>
                    <a href="https://www.auisoft.net/dcenter.html" className="btn sample-trial">평가판 다운로드</a>
                </nav>
            </header>
            {isNavOpen && <button type="button" className="sample-nav-backdrop" aria-label="데모 메뉴 닫기" onClick={() => setIsNavOpen(false)} />}
            <nav id="sample-nav" className="sample-nav" aria-label="데모 목록">
                <div className="sample-nav-top">
                    <div className="sample-nav-heading">전체 데모 <span>{mainMenuList.length + subMenuList.length}</span></div>
                    <label className="sample-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="데모 검색" placeholder="데모 검색" value={query} onChange={event => setQuery(event.target.value)} /></label>
                </div>
                <div className="sample-nav-scroll">
                    <NavLink to="/" end onClick={() => setIsNavOpen(false)}>HOME</NavLink>
                    {mainMenuList.some(matches) && <strong className="sample-nav-group">쇼케이스</strong>}
                    <ul>{mainMenuList.map(item => matches(item) && <li key={item.name}><NavLink to={item.path} onClick={() => setIsNavOpen(false)}>{Number(item.name.replace('Showcase', ''))}. {item.text}</NavLink></li>)}</ul>
                    {subMenuList.some(matches) && <strong className="sample-nav-group">샘플</strong>}
                    <ul>{subMenuList.map((item, index) => matches(item) && <li key={item.name}><NavLink to={item.path} onClick={() => setIsNavOpen(false)}>{index + 1}. {item.text}</NavLink></li>)}</ul>
                    {keyword && <p className="sample-nav-empty" role="status">{resultCount ? `${resultCount}개 데모 검색됨` : '검색 결과가 없습니다.'}</p>}
                </div>
            </nav>
            <main id="sample-main" className="sample-main" tabIndex={-1}>
                <div className="sample-page-heading">
                    <div><div className="sample-breadcrumb"><NavLink to="/">데모</NavLink><span aria-hidden="true">/</span><span>{category}</span></div><h1>{pageTitle}</h1></div>
                    {!isHome && currentMenu && <button type="button" className="sample-source-open" onClick={() => setSourceOpen(true)}><span aria-hidden="true">&lt;/&gt;</span> 소스 보기</button>}
                </div>
                {!isHome && <div className="sample-preview-toolbar"><span className="sample-preview-label"><i aria-hidden="true" />실행 화면</span><span className="sample-framework-label">React + TypeScript</span></div>}
                <div className={`view-content sample-view${isHome ? ' sample-view--home' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {mainMenuList.map(({ name, path, element }) => <Route key={name} path={path} element={element} />)}
                        {subMenuList.map(({ name, path, element }) => <Route key={name} path={path} element={element} />)}
                    </Routes>
                </div>
            </main>
            <footer className="sample-footer"><span>Copyright © AUISoft Co., Ltd.</span><a href="#sample-main">맨 위로</a></footer>
            {sourceOpen && currentMenu && <SourceDialog path={currentMenu.path} title={currentMenu.text} onClose={() => setSourceOpen(false)} />}
        </div>
    );
}

function App() {
    return <BrowserRouter basename={import.meta.env.BASE_URL}><DemoShell /></BrowserRouter>;
}

export default App;
