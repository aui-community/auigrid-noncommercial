<script setup>
	import CodeBlock from '@/views/CodeBlock.vue';
	import sampleDefaultCode from '@/samples/SampleDefault.vue?raw';
</script>
<template>
	<div class="home-main">
		<h1 class="home-title">AUIGrid for Vue 3</h1>
		<p>자바스크립트 프레임워크 중 하나인 Vue.js 버전 3에서 AUIGrid 를 어떻게 사용 할 수 있는지를 보여주는 데모입니다.</p>
		<p>
			AUIGrid 에서 지원하는 모든 기능에 대한 데모를 보고자 한다면<a href="https://www.auisoft.net/demo/auigrid" class="link-is-link"> 여기 </a>
			를 클릭하세요.
		</p>
		<p>본 데모는 다음 의존도 및 환경에서 작성되었습니다.</p>
		<ul class="sub-headline padding-0">
			<li><strong>vue</strong>: ^3.5.14</li>
			<li><strong>vue-router</strong>: ^4.5.1</li>
			<li><strong>axios</strong>: ^1.9.0</li>
			<li><strong>file-saver</strong>: ^2.0.5</li>
			<li><strong>echarts</strong>: ^5.6.0</li>
			<li><strong>xlsx</strong>: ^0.18.5</li>
		</ul>
		<h2 class="headline">HOW TO CODE</h2>
		<p class="sub-headline">Vue 3 환경에서 다음처럼 코딩하여 AUIGrid 사용이 가능합니다.</p>
		<h3>이 프로젝트 전체 소스는 정품(또는 평가판)의 ROOT/samples-Vue.js 폴더에 존재합니다.</h3>
		<div class="codeblock-wrap">
			<CodeBlock language="javascript">{{ sampleDefaultCode }}</CodeBlock>
		</div>
		<p>
			<a href="https://www.auisoft.net/demo/auigrid" class="link-is-link"> 일반 Javascript 환경의 데모 보러 가기 </a>
		</p>
	</div>
</template>
