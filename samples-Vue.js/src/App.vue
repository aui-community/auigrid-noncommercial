<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import SourceDialog from './views/SourceDialog.vue';

const mainMenuList = [
				{
					path: '/Showcase01',
					name: 'Showcase01',
					text: '산업 장비 자원 운영표'
				},
				{
					path: '/Showcase02',
					name: 'Showcase02',
					text: '자율주행 로봇 BOM 원가'
				},
				{
					path: '/Showcase03',
					name: 'Showcase03',
					text: '재생에너지 월별 리포트'
				},
				{
					path: '/Showcase04',
					name: 'Showcase04',
					text: '실시간 서비스 모니터링'
				},
				{
					path: '/Showcase05',
					name: 'Showcase05',
					text: 'AI 모델 벤치마크 비교'
				},
				{ path: '/Showcase06', name: 'Showcase06', text: '설계 변경 전후 대조표' },
				{ path: '/Showcase07', name: 'Showcase07', text: '구매 요청 및 결재 현황' },
				{
					path: '/Showcase08',
					name: 'Showcase08',
					text: '일별 목표치 달성률 그리드'
				},
				// WebDemo와 동일한 순번으로 쇼케이스를 연결합니다.
				{ path:'/Showcase09', name:'Showcase09', text:'반응형 밴드형 워크스페이스' },
				{ path:'/Showcase10', name:'Showcase10', text:'자재 발주 및 입고 검수' }
			];
const subMenuList = [
				{
					path: '/SampleDefault',
					name: 'SampleDefault',
					text: 'JSON 그리드 출력 샘플(제거, 재생성)'
				},
				// 기본 출력 다음에 밴드형 레이아웃을 비교합니다.
				{ path: '/SampleBandBody', name: 'SampleBandBody', text: '밴드형 바디 레이아웃 기본' },
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
			];


// 메뉴는 원래 순서를 유지하고 현재 경로에서 제목/원문 연결만 찾습니다.
const route = useRoute();
const isNavOpen = ref(false);
const sourceOpen = ref(false);
const query = ref('');
const keyword = computed(() => query.value.trim().toLocaleLowerCase());
const matches = (item) => item.text.toLocaleLowerCase().includes(keyword.value) || item.name.toLocaleLowerCase().includes(keyword.value);
const currentMenu = computed(() => [...mainMenuList, ...subMenuList].find(item => item.path.toLowerCase() === route.path.toLowerCase()));
const isHome = computed(() => route.path === '/');
const category = computed(() => (currentMenu.value && mainMenuList.includes(currentMenu.value)) ? '쇼케이스' : '샘플');
const pageTitle = computed(() => currentMenu.value?.text || 'AUIGrid 데모');
const resultCount = computed(() => [...mainMenuList, ...subMenuList].filter(matches).length);
const closeNavigation = () => { isNavOpen.value = false; };
const closeOnEscape = (event) => { if (event.key === 'Escape') closeNavigation(); };
// 페이지 이동과 화면 크기 변경 뒤 이전 메뉴/소스 창이 남지 않도록 정리합니다.
watch(() => route.path, () => {
    closeNavigation();
    sourceOpen.value = false;
    window.scrollTo(0, 0);
});
onMounted(() => { window.addEventListener('resize', closeNavigation); window.addEventListener('keydown', closeOnEscape); });
onUnmounted(() => { window.removeEventListener('resize', closeNavigation); window.removeEventListener('keydown', closeOnEscape); });
</script>

<template>
    <div class="sample-shell" :class="{ 'sample-nav-open': isNavOpen }">
        <a class="sample-skip" href="#sample-main">본문으로 이동</a>
        <header class="sample-header">
            <div class="sample-logo-bar">
                <button type="button" class="sample-menu-toggle" aria-label="데모 메뉴" aria-controls="sample-nav" :aria-expanded="isNavOpen" @click="isNavOpen = !isNavOpen"><span class="sample-menu-icon"></span></button>
                <RouterLink class="sample-brand" to="/" aria-label="AUIGrid HOME"><span class="sample-brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sample-brand-text"><strong>AUIGrid</strong><span>JavaScript 데이터 그리드</span></span></RouterLink>
            </div>
            <nav class="sample-header-links" aria-label="제품 안내"><a href="https://www.auisoft.net/documentation/auigrid/">문서</a><a href="https://www.auisoft.net/price.html">라이선스</a><a href="https://www.auisoft.net/dcenter.html" class="btn sample-trial">평가판 다운로드</a></nav>
        </header>
        <button v-if="isNavOpen" type="button" class="sample-nav-backdrop" aria-label="데모 메뉴 닫기" @click="isNavOpen = false"></button>
        <nav id="sample-nav" class="sample-nav" aria-label="데모 목록">
            <div class="sample-nav-top"><div class="sample-nav-heading">전체 데모 <span>{{ mainMenuList.length + subMenuList.length }}</span></div><label class="sample-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="데모 검색" placeholder="데모 검색" v-model="query" /></label></div>
            <div class="sample-nav-scroll">
                <RouterLink to="/" @click="isNavOpen = false">HOME</RouterLink>
                <strong v-if="mainMenuList.some(matches)" class="sample-nav-group">쇼케이스</strong>
                <ul><li v-for="item in mainMenuList" :key="item.name" v-show="matches(item)"><RouterLink :to="item.path" @click="isNavOpen = false">{{ Number(item.name.replace('Showcase', '')) }}. {{ item.text }}</RouterLink></li></ul>
                <strong v-if="subMenuList.some(matches)" class="sample-nav-group">샘플</strong>
                <ul><li v-for="(item, index) in subMenuList" :key="item.name" v-show="matches(item)"><RouterLink :to="item.path" @click="isNavOpen = false">{{ index + 1 }}. {{ item.text }}</RouterLink></li></ul>
                <p v-if="keyword" class="sample-nav-empty" role="status">{{ resultCount ? `${resultCount}개 데모 검색됨` : '검색 결과가 없습니다.' }}</p>
            </div>
        </nav>
        <main id="sample-main" class="sample-main" tabindex="-1">
            <!-- HOME은 소개 제목을 사용하므로 경로와 중복 제목 영역 없이 콘텐츠부터 표시합니다. -->
            <div v-if="!isHome" class="sample-page-heading"><div><div class="sample-breadcrumb"><RouterLink to="/">데모</RouterLink><span aria-hidden="true">/</span><span>{{ category }}</span></div><h1>{{ pageTitle }}</h1></div><button v-if="currentMenu" type="button" class="sample-source-open" @click="sourceOpen = true"><span aria-hidden="true">&lt;/&gt;</span> 소스 보기</button></div>
            <div v-if="!isHome" class="sample-preview-toolbar"><span class="sample-preview-label"><i aria-hidden="true"></i>실행 화면</span><span class="sample-framework-label">Vue</span></div>
            <div class="view-content sample-view" :class="{ 'sample-view--home': isHome }">
<RouterView />
            </div>
        </main>
        <footer class="sample-footer"><span>Copyright © AUISoft Co., Ltd.</span><a href="#sample-main">맨 위로</a></footer>
        <SourceDialog v-if="sourceOpen && currentMenu" :path="currentMenu.path" :title="currentMenu.text" @close="sourceOpen = false" />
    </div>
</template>
