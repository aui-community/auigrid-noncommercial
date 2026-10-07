<script setup lang="ts">
	import './Home.css';
	import CodeBlock from '@/views/CodeBlock.vue';
	import sampleDefaultCode from '@/samples/SampleDefault.vue?raw';
</script>
<template>
	<div class="home-main">
		<h1 class="home-title">AUIGrid for Vue 3 + TypeScript</h1>
		<p>Vue 3의 TypeScript 환경에서 AUIGrid를 사용하는 방법을 보여주는 데모입니다.</p>
		<p>
			AUIGrid 에서 지원하는 모든 기능에 대한 데모를 보고자 한다면
			<a href="https://www.auisoft.net/demo/auigrid" class="link-is-link"> 여기</a>
			를 클릭하세요.
		</p>
		<p>본 데모는 Vue 3 + TypeScript + Vite 환경에서 다음 의존도로 작성되었습니다.</p>
		<p>타입 정의와 렌더러 및 이벤트 상수는 npm의 <code>aui-grid</code> 패키지를 사용합니다.</p>
		<!-- 설치 명령은 기존 코드 복사 도구를 재사용하여 안내합니다. -->
		<div class="home-install">
			<div class="home-install-title">터미널</div>
			<CodeBlock language="none" code="npm install aui-grid@latest" />
		</div>
		<!-- 의존성 안내를 독립된 카드로 구성하고 두 종류가 있으면 나란히 표시합니다. -->
		<div class="home-dependencies">
			<section class="dependency-card">
				<h2>Dependencies</h2>
				<ul>
					<li><strong>axios</strong>: ^1.7.2</li>
					<li><strong>file-saver</strong>: ^2.0.5</li>
					<li><strong>vue</strong>: ^3.5.10</li>
					<li><strong>vue-router</strong>: ^4.4.5</li>
				</ul>
			</section>
			<section class="dependency-card">
				<h2>Dev Dependencies</h2>
				<ul>
					<li><strong>@vitejs/plugin-vue</strong>: ^5.0.5</li>
					<li><strong>aui-grid</strong>: latest</li>
					<li><strong>typescript</strong>: ~5.4.0</li>
					<li><strong>vite</strong>: ^5.3.1</li>
					<li><strong>vue-tsc</strong>: ^2.0.21</li>
				</ul>
			</section>
		</div>

		<h2 class="headline">HOW TO CODE</h2>
		<p class="sub-headline">Vue.js 환경에서 다음처럼 코딩하여 AUIGrid 사용이 가능합니다.</p>
		<h3>이 프로젝트 전체 소스는 정품(또는 평가판)의 ROOT/samples-Vue.ts 폴더에 존재합니다.</h3>
		<div class="codeblock-wrap">
			<CodeBlock language="markup" :code="sampleDefaultCode" />
		</div>
		<p>
			<a href="https://www.auisoft.net/demo/auigrid" class="link-is-link"> 일반 Javascript 환경의 데모 보러 가기 </a>
		</p>
	</div>
</template>
