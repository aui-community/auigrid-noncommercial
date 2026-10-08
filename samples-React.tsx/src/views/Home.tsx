import './Home.css';
import CodeBlock from './CodeBlock';
// 실행 예제 원문은 Vite의 raw 가져오기로 표시합니다.
import sampleDefaultCode from '../samples/SampleDefault.tsx?raw';

const Home = () => {
	return (
		<div className="home-main">
			<p>React의 TypeScript 환경에서 AUIGrid를 사용하는 방법을 보여주는 데모입니다.</p>
			<p>
				AUIGrid 에서 지원하는 모든 기능에 대한 데모를 보고자 한다면{' '}
				<a href="https://www.auisoft.net/demo/auigrid" className="link-is-link">
					여기{' '}
				</a>
				를 클릭하세요.
			</p>
			<p>본 데모는 React + TypeScript + Vite 환경에서 다음 의존도로 작성되었습니다.</p>
			<p>타입 정의와 렌더러 및 이벤트 상수는 npm의 <code>aui-grid</code> 패키지를 사용합니다.</p>
			{/* 설치 명령은 기존 코드 복사 도구를 재사용하여 안내합니다. */}
			<div className="home-install">
				<div className="home-install-title">터미널</div>
				<CodeBlock language="none">npm install aui-grid@latest</CodeBlock>
			</div>
			{/* 의존성 안내를 독립된 카드로 구성하고 두 종류가 있으면 나란히 표시합니다. */}
			<div className="home-dependencies">
				<section className="dependency-card">
					<h2>Dependencies</h2>
					<ul>
						<li>
						<strong>aui-grid</strong>: latest
						</li>
						<li>
						<strong>axios</strong>: ^1.0.0
						</li>
						<li>
						<strong>file-saver</strong>: ^2.0.5
						</li>
						<li>
						<strong>react</strong>: ^18.2.0
						</li>
						<li>
						<strong>react-dom</strong>: ^18.2.0
						</li>
						<li>
						<strong>react-router-dom</strong>: ^6.4.2
						</li>
						<li>
						<strong>typescript</strong>: ^4.8.4
						</li>
					</ul>
				</section>
			</div>

			<h2 className="headline">HOW TO CODE</h2>
			<p className="sub-headline"> React 환경에서 다음처럼 코딩하여 AUIGrid 사용이 가능합니다. </p>
			<h3>이 프로젝트 전체 소스는 정품(또는 평가판)의 ROOT/samples-React.tsx 폴더에 존재합니다.</h3>
			<div className="codeblock-wrap">
				<CodeBlock language="tsx">{sampleDefaultCode}</CodeBlock>
			</div>
			<p>
				<a href="https://www.auisoft.net/demo/auigrid" className="link-is-link">
					일반 Javascript 환경의 데모 보러 가기
				</a>
			</p>
		</div>
	);
};

export default Home;
