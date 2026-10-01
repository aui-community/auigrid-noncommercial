<script setup lang="ts">
	import CodeBlock from '@/views/CodeBlock.vue';
	import sampleDefaultCode from '@/samples/SampleDefault.vue?raw';
</script>
<template>
	<div class="home-main">
		<h1 class="home-title">AUIGrid for Vue.js + Typescript</h1>
		<p>자바스크립트 프레임워크 중 하나인 Vue.js 버전 3, Typescript 환경에서 AUIGrid 를 어떻게 사용 할 수 있는지를 보여주는 데모입니다.</p>
		<p>
			AUIGrid 에서 지원하는 모든 기능에 대한 데모를 보고자 한다면
			<a href="https://www.auisoft.net/demo/auigrid" class="link-is-link"> 여기</a>
			를 클릭하세요.
		</p>
		<p>본 데모는 다음 의존도 및 환경에서 작성되었습니다.</p>
		<ul class="sub-headline padding-0">
			<h2>Dependencies</h2>
			<ul>
				<li><strong>axios</strong>: ^1.7.2</li>
				<li><strong>file-saver</strong>: ^2.0.5</li>
				<li><strong>vue</strong>: ^3.5.10</li>
				<li><strong>vue-router</strong>: ^4.4.5</li>
			</ul>
			<h2>Dev Dependencies</h2>
			<ul>
				<li><strong>@vitejs/plugin-vue</strong>: ^5.0.5</li>
				<li><strong>aui-grid</strong>: ^2.0.18</li>
				<li><strong>typescript</strong>: ~5.4.0</li>
				<li><strong>vite</strong>: ^5.3.1</li>
				<li><strong>vue-tsc</strong>: ^2.0.21</li>
			</ul>
		</ul>
		<h2 class="headline">HOW TO CODE</h2>
		<p class="sub-headline">Vue.js 환경에서 다음처럼 코딩하여 AUIGrid 사용이 가능합니다.</p>
		<h3>이 프로젝트 전체 소스는 정품(또는 평가판)의 ROOT/samples-Vue.ts 폴더에 존재합니다.</h3>
		<div class="codeblock-wrap">
			<CodeBlock language="javascript">{{ sampleDefaultCode }}</CodeBlock>
		</div>
		<p>
			<a href="https://www.auisoft.net/demo/auigrid" class="link-is-link"> 일반 Javascript 환경의 데모 보러 가기 </a>
		</p>
	</div>
</template>
