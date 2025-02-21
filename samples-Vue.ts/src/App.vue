<script setup lang="ts">
	import { ref, onMounted, onUnmounted, VueElement } from 'vue';
	import { RouterLink, RouterView } from 'vue-router';

	interface IMenuItem {
		path: string;
		name: string;
		text: string;
	}

	const isNavOpen = ref<boolean>(window.innerWidth >= 1300 ? true : false);

	const handleKnobClick = () => {
		isNavOpen.value = !isNavOpen.value;
	};

	const handleLinkClick = () => {
		if (window.innerWidth < 1300) {
			isNavOpen.value = false;
		}
	};

	const handleResize = () => {
		//console.log('window 리사이징');
		if (window.innerWidth >= 1300) {
			isNavOpen.value = true;
		} else {
			isNavOpen.value = false;
		}
	};

	onMounted(() => {
		window.addEventListener('resize', handleResize);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', handleResize);
	});

	// 쇼케이스 메뉴 리스트
	const mainMenuList: IMenuItem[] = [
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
	];
	// 일반 샘플 메뉴 리스트
	const subMenuList: IMenuItem[] = [
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
			path: '/SampleTreeGrid',
			name: 'SampleTreeGrid',
			text: '트리 그리드 - 일반 데이터를 계층 구조로 표현'
		},
		{
			path: '/EditDropDown',
			name: 'EditDropDown',
			text: '에디트렌더러 - 드랍다운리스트렌더러'
		},
		{
			path: '/Template',
			name: 'Template',
			text: 'HTML 템플릿 렌더러 - 편집 적용'
		},
		{
			path: '/DragDrop2Grid',
			name: 'DragDrop2Grid',
			text: '행, 드래그&드랍 - 2개의 그리드 간 행 이동'
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
		}
	];
</script>

<template>
	<div>
		<div class="header">
			<div class="logo-bar">
				<button class="knob-btn btn" @click="handleKnobClick">
					<span class="knob-bar"></span>
					<span class="knob-bar"></span>
					<span class="knob-bar"></span>
				</button>
				<img id="logo" src="@/assets/auisoft.png" alt="AUISoft" />
				<span class="title">AUIGrid 3.0 DEMO for Vue.js + Typescript</span>
			</div>
			<div class="header-buttons">
				<a href="https://www.auisoft.net/dcenter.html" class="btn btn-primary"> DOWNLOAD FREE TRIAL </a>
				<a href="https://www.auisoft.net/price.html" class="btn btn-primary"> PRICING &amp; LICENSE </a>
			</div>
		</div>
		<div class="nav" v-bind:style="isNavOpen ? 'transform: translateX(0px)' : 'translateX(-300px)'">
			<h3 class="force-text-center">AUIGrid for Vue3 + TS</h3>
			<ul class="nav-menu">
				<li>
					<RouterLink to="/" @click="handleLinkClick" active-class="nav-item-active"><span class="nav-item" style="font-weight: 500">HOME</span></RouterLink>
				</li>
				<li :key="item.name" v-for="(item, index) in mainMenuList">
					<RouterLink :to="item.path" @click="handleLinkClick" active-class="nav-item-active"
						><span class="nav-item">{{ index + 1 }}. {{ item.text }}</span></RouterLink
					>
				</li>
			</ul>
			<hr class="divider-root" />
			<ul class="nav-menu">
				<li :key="item.name" v-for="(item, index) in subMenuList">
					<RouterLink :to="item.path" @click="handleLinkClick" active-class="nav-item-active"
						><span class="nav-item">{{ index + 1 }}. {{ item.text }}</span></RouterLink
					>
				</li>
			</ul>
			<div class="nav-border"></div>
		</div>
		<div class="container">
			<div class="view-content">
				<RouterView v-slot="{ Component }">
					<template v-if="Component">
						<Transition mode="out-in">
							<KeepAlive>
								<Suspense>
									<!-- main content -->
									<component :is="Component" :key="$route.fullPath"></component>
									<!-- loading state -->
									<template #fallback> Loading... </template>
								</Suspense>
							</KeepAlive>
						</Transition>
					</template>
				</RouterView>
			</div>
		</div>
		<div class="footer">
			<span>Copyright © AUISoft Co., Ltd.</span>
		</div>
	</div>
</template>
