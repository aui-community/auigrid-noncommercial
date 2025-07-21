<template>
	<div :class="currentTheme">
		<div class="header">
			<div class="logo-bar">
				<button class="knob-btn btn" @click="handleKnobClick">
					<span class="knob-bar"></span>
					<span class="knob-bar"></span>
					<span class="knob-bar"></span>
				</button>
				<img id="logo" src="./assets/auisoft.png" alt="AUISoft" />
				<span class="title">AUIGrid 3.0 DEMO for Vue.js</span>
			</div>
			<div class="header-buttons">
				<a href="https://www.auisoft.net/dcenter.html" class="btn btn-primary"> DOWNLOAD FREE TRIAL </a>
				<a href="https://www.auisoft.net/price.html" class="btn btn-primary"> PRICING &amp; LICENSE </a>
			</div>
		</div>
		<div class="nav" v-bind:style="isNavOpen ? 'transform: translateX(0px)' : 'translateX(-300px)'">
			<h3 class="force-text-center">AUIGrid for Vue 3</h3>
			<ul class="nav-menu">
				<li>
					<router-link to="/" @click="handleLinkClick" active-class="nav-item-active"><span class="nav-item" style="font-weight: 500">HOME</span></router-link>
				</li>
				<li :key="item.name" v-for="(item, index) in mainMenuList">
					<router-link :to="item.path" @click="handleLinkClick" active-class="nav-item-active"
						><span class="nav-item">{{ index + 1 }}. {{ item.text }}</span></router-link
					>
				</li>
			</ul>
			<hr class="divider-root" />
			<ul class="nav-menu">
				<li :key="item.name" v-for="(item, index) in subMenuList">
					<router-link :to="item.path" @click="handleLinkClick" active-class="nav-item-active"
						><span class="nav-item">{{ index + 1 }}. {{ item.text }}</span></router-link
					>
				</li>
			</ul>
			<div class="nav-border"></div>
		</div>
		<div class="container">
			<div class="view-content">
				<router-view />
			</div>
		</div>
		<div class="footer">
			<span>Copyright © AUISoft Co., Ltd.</span>
		</div>
	</div>
</template>

<script>
	export default {
		data: () => ({
			isNavOpen: window.innerWidth >= 1300 ? true : false,
			// 쇼케이스 메뉴 리스트
			mainMenuList: [
				{
					path: '/Showcase01',
					name: 'Showcase01',
					text: '학생 출석 CRUD 그리드'
				},
				{
					path: '/Showcase02',
					name: 'Showcase02',
					text: '프로젝트 일정 트리 그리드'
				},
				{
					path: '/Showcase03',
					name: 'Showcase03',
					text: '채널 마케팅 예산'
				},
				{
					path: '/Showcase04',
					name: 'Showcase04',
					text: '실시간 주식 종목'
				},
				{
					path: '/Showcase05',
					name: 'Showcase05',
					text: '국가 별 핸드폰 판매 통계'
				},
				{ path: '/Showcase06', name: 'Showcase06', text: '손익 계산 내역' },
				{
					path: '/Showcase07',
					name: 'Showcase07',
					text: '일별 목표치 달성률 그리드'
				}
			],
			// 일반 샘플 메뉴 리스트
			subMenuList: [
				{
					path: '/SampleDefault',
					name: 'SampleDefault',
					text: 'JSON 그리드 출력 샘플(제거, 재생성)'
				},
				{
					path: '/StylingView',
					name: 'StylingView',
					text: '그리드 행, 열 스타일링(Styling)'
				},
				{
					path: '/EditDropDown',
					name: 'EditDropDown',
					text: '에디트렌더러 - 드랍다운리스트렌더러'
				},
				{
					path: '/RendererTemplate',
					name: 'RendererTemplate',
					text: 'HTML 템플릿 렌더러 - 편집 적용'
				},
				{
					path: '/DragToDropTwoGrid',
					name: 'DragToDropTwoGrid',
					text: '행, 드래그&드랍 - 2개의 그리드 간 행 이동'
				},
				{
					path: '/CustomRendererStock',
					name: 'CustomRendererStock',
					text: 'CustomRenderer 작성 - 샘플1 주식 렌더러'
				},
				{
					path: '/CustomRendererEchart',
					name: 'CustomRendererEchart',
					text: 'CustomRenderer 작성 - 아파치 ECharts'
				},
				{
					path: '/CustomRendererInput',
					name: 'CustomRendererInput',
					text: 'CustomRenderer 작성 - Input 작성'
				},
				{
					path: '/CustomEditRendererTextarea',
					name: 'CustomEditRendererTextarea',
					text: 'CustomEditRenderer 작성 - 샘플 1 textarea'
				},
				{
					path: '/CustomEditRenderer',
					name: 'CustomEditRenderer',
					text: 'CustomEditRenderer 작성 - VueDatepicker'
				},
				{
					path: '/XlsxImportGrid',
					name: 'XlsxImportGrid',
					text: 'XLSX파일 임포팅으로 그리드 데이터 출력'
				},
				{
					path: '/ExportMultiXlsx',
					name: 'ExportMultiXlsx',
					text: '다수의 그리드 1개의 엑셀로 내보내기'
				}
			]
		}),
		methods: {
			applyTheme() {
				// <body>에 테마 클래스 적용
				document.body.classList.remove('dark-theme', 'modern-theme');
				if (this.currentTheme) {
					document.body.classList.add(this.currentTheme);
				}
			},
			handleKnobClick() {
				this.isNavOpen = !this.isNavOpen;
			},
			handleLinkClick() {
				if (window.innerWidth < 1300) {
					this.isNavOpen = false;
				}
			},
			handleResize() {
				//console.log('window 리사이징');
				if (window.innerWidth >= 1300) {
					this.isNavOpen = true;
				} else {
					this.isNavOpen = false;
				}
			}
		},
		mounted() {
			window.addEventListener('resize', this.handleResize);
		},
		unmounted() {
			window.removeEventListener('resize', this.handleResize);
		}
	};
</script>
