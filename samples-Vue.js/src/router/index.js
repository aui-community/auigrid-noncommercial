import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('../views/HomeView.vue')
	},
	// 쇼케이스
	{
		path: '/Showcase01',
		name: 'Showcase01',
		component: () => import('../showcases/ShowCase01.vue')
	},
	{
		path: '/Showcase02',
		name: 'Showcase02',
		component: () => import('../showcases/ShowCase02.vue')
	},
	{
		path: '/Showcase03',
		name: 'Showcase03',
		component: () => import('../showcases/ShowCase03.vue')
	},
	{
		path: '/Showcase04',
		name: 'Showcase04',
		component: () => import('../showcases/ShowCase04.vue')
	},
	{
		path: '/Showcase05',
		name: 'Showcase05',
		component: () => import('../showcases/ShowCase05.vue')
	},
	{
		path: '/Showcase06',
		name: 'Showcase06',
		component: () => import('../showcases/ShowCase06.vue')
	},
	{
		path: '/Showcase07',
		name: 'Showcase07',
		component: () => import('../showcases/ShowCase07.vue')
	},

	// 샘플들
	{
		path: '/SampleDefault',
		name: 'SampleDefault',
		component: () => import('../samples/SampleDefault.vue')
	},
	{
		path: '/StylingView',
		name: 'StylingView',
		component: () => import('../samples/StylingView.vue')
	},
	{
		path: '/EditDropDown',
		name: 'EditDropDown',
		component: () => import('../samples/EditDropDown.vue')
	},
	{
		path: '/RendererTemplate',
		name: 'RendererTemplate',
		component: () => import('../samples/RendererTemplate.vue')
	},
	{
		path: '/DragToDropTwoGrid',
		name: 'DragToDropTwoGrid',
		component: () => import('../samples/DragToDropTwoGrid.vue')
	},
	{
		path: '/CustomRendererStock',
		name: 'CustomRendererStock',
		component: () => import('../samples/CustomRendererStock.vue')
	},
	{
		path: '/CustomRendererEchart',
		name: 'CustomRendererEchart',
		component: () => import('../samples/CustomRendererEchart.vue')
	},
	{
		path: '/CustomRendererInput',
		name: 'CustomRendererInput',
		component: () => import('../samples/CustomRendererInput.vue')
	},
	{
		path: '/CustomEditRendererTextarea',
		name: 'CustomEditRendererTextarea',
		component: () => import('../samples/CustomEditRendererTextarea.vue')
	},
	{
		path: '/CustomEditRenderer',
		name: 'CustomEditRenderer',
		component: () => import('../samples/CustomEditRenderer.vue')
	},
	{
		path: '/XlsxImportGrid',
		name: 'XlsxImportGrid',
		component: () => import('../samples/XlsxImportGrid.vue')
	},
	{
		path: '/ExportMultiXlsx',
		name: 'ExportMultiXlsx',
		component: () => import('../samples/ExportMultiXlsx.vue')
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

router.onError(() => {
	window.location.reload();
});

export default router;
