import React from 'react';
import imgHowToCode from '../assets/howtocode.jpg';

const Home = () => {
	return (
		<div className="home-main">
			<h1 className="home-title">AUIGrid for React.js + Typescript</h1>
			<p>자바스크립트 라이브러리 중 하나인 React.js 의 Typescript 환경에서 AUIGrid 를 어떻게 사용 할 수 있는지를 보여주는 데모입니다.</p>
			<p>
				AUIGrid 에서 지원하는 모든 기능에 대한 데모를 보고자 한다면{' '}
				<a href="https://www.auisoft.net/demo/auigrid" className="link-is-link">
					여기{' '}
				</a>
				를 클릭하세요.
			</p>
			<p>본 데모는 다음 의존도 및 환경에서 작성되었습니다.</p>
			<ul className="sub-headline padding-0">
				<li>"@types/file-saver": "^2.0.5"</li>
				<li>"@types/node": "^16.11.59"</li>
				<li>"@types/react": "^18.0.21"</li>
				<li>"@types/react-dom": "^18.0.6"</li>
				<li>"@types/react-router-dom": "^5.3.3"</li>
				<li>
					<span style={{ backgroundColor: '#ff0' }}>"aui-grid": "^2.0.12",</span>
				</li>
				<li>"axios": "^1.0.0"</li>
				<li>"file-saver": "^2.0.5"</li>
				<li>"react": "^18.2.0"</li>
				<li>"react-dom": "^18.2.0"</li>
				<li>"react-router-dom": "^6.4.2"</li>
				<li>"react-scripts": "5.0.1"</li>
				<li>"typescript": "^4.8.4"</li>
			</ul>

			<h2 className="headline">HOW TO CODE</h2>
			<p className="sub-headline"> React 환경에서 다음처럼 코딩하여 AUIGrid 사용이 가능합니다. </p>
			<h3>이 프로젝트 전체 소스는 정품(또는 평가판)의 ROOT/samples-React.tsx 폴더에 존재합니다.</h3>
			<img src={imgHowToCode} alt="HOW TO CODE" style={{ margin: '0 auto', maxWidth: 700 }} />
			<p>
				<a href="https://www.auisoft.net/demo/auigrid" className="link-is-link">
					일반 Javascript 환경의 데모 보러 가기
				</a>
			</p>
		</div>
	);
};

export default Home;
