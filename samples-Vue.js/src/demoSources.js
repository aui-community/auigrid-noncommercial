// 실행하는 Vue 컴포넌트의 원문을 요청할 때만 불러옵니다.
export const demoSources = {
    '/Showcase01': {
        file: 'src/showcases/ShowCase01.vue',
        load: () => import('./showcases/ShowCase01.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase1Model.js',
                language: 'javascript',
                load: () => import('./showcases/showcase1Model.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase02': {
        file: 'src/showcases/ShowCase02.vue',
        load: () => import('./showcases/ShowCase02.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase2Model.js',
                language: 'javascript',
                load: () => import('./showcases/showcase2Model.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase03': {
        file: 'src/showcases/ShowCase03.vue',
        load: () => import('./showcases/ShowCase03.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase3Model.js',
                language: 'javascript',
                load: () => import('./showcases/showcase3Model.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase04': {
        file: 'src/showcases/ShowCase04.vue',
        load: () => import('./showcases/ShowCase04.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase4Model.js',
                language: 'javascript',
                load: () => import('./showcases/showcase4Model.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/Showcase04.css',
                language: 'css',
                load: () => import('./showcases/Showcase04.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase05': {
        file: 'src/showcases/ShowCase05.vue',
        load: () => import('./showcases/ShowCase05.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase5Model.js',
                language: 'javascript',
                load: () => import('./showcases/showcase5Model.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-grid-features.css',
                language: 'css',
                load: () => import('./showcases/showcase-grid-features.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase06': {
        file: 'src/showcases/ShowCase06.vue',
        load: () => import('./showcases/ShowCase06.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase6Model.js',
                language: 'javascript',
                load: () => import('./showcases/showcase6Model.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-grid-features.css',
                language: 'css',
                load: () => import('./showcases/showcase-grid-features.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase07': {
        file: 'src/showcases/ShowCase07.vue',
        load: () => import('./showcases/ShowCase07.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/purchaseDemo.js',
                language: 'javascript',
                load: () => import('./showcases/purchaseDemo.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/Showcase07.css',
                language: 'css',
                load: () => import('./showcases/Showcase07.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-options.css',
                language: 'css',
                load: () => import('./showcases/showcase-options.css?raw').then((module) => module.default)
            },
            {
                file: 'src/renderers/purchase_approval/ApprovalActionsRenderer.js',
                language: 'javascript',
                load: () =>
                    import('./renderers/purchase_approval/ApprovalActionsRenderer.js?raw').then(
                        (module) => module.default
                    )
            },
            {
                file: 'src/renderers/purchase_approval/ApprovalStepsRenderer.js',
                language: 'javascript',
                load: () =>
                    import('./renderers/purchase_approval/ApprovalStepsRenderer.js?raw').then(
                        (module) => module.default
                    )
            },
            {
                file: 'src/renderers/purchase_approval/AttachmentRenderer.js',
                language: 'javascript',
                load: () =>
                    import('./renderers/purchase_approval/AttachmentRenderer.js?raw').then((module) => module.default)
            },
            {
                file: 'src/renderers/purchase_approval/DueDateRenderer.js',
                language: 'javascript',
                load: () =>
                    import('./renderers/purchase_approval/DueDateRenderer.js?raw').then((module) => module.default)
            },
            {
                file: 'src/renderers/purchase_approval/RequesterRenderer.js',
                language: 'javascript',
                load: () =>
                    import('./renderers/purchase_approval/RequesterRenderer.js?raw').then((module) => module.default)
            },
            {
                file: 'src/renderers/purchase_approval/cell-utils.js',
                language: 'javascript',
                load: () => import('./renderers/purchase_approval/cell-utils.js?raw').then((module) => module.default)
            },
            {
                file: 'src/renderers/purchase_approval/index.js',
                language: 'javascript',
                load: () => import('./renderers/purchase_approval/index.js?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase08': {
        file: 'src/showcases/ShowCase08.vue',
        load: () => import('./showcases/ShowCase08.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/renderers/MyCalendarRenderer.js',
                language: 'javascript',
                load: () => import('./renderers/MyCalendarRenderer.js?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/Showcase08.css',
                language: 'css',
                load: () => import('./showcases/Showcase08.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase09': {
        file: 'src/showcases/ShowCase09.vue',
        load: () => import('./showcases/ShowCase09.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/Showcase09.css',
                language: 'css',
                load: () => import('./showcases/Showcase09.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-options.css',
                language: 'css',
                load: () => import('./showcases/showcase-options.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase10': {
        file: 'src/showcases/ShowCase10.vue',
        load: () => import('./showcases/ShowCase10.vue?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/Showcase10.css',
                language: 'css',
                load: () => import('./showcases/Showcase10.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-options.css',
                language: 'css',
                load: () => import('./showcases/showcase-options.css?raw').then((module) => module.default)
            }
        ]
    },
    '/SampleDefault': {
        file: 'src/samples/SampleDefault.vue',
        load: () => import('./samples/SampleDefault.vue?raw').then((module) => module.default)
    },
    '/SampleBandBody': {
        file: 'src/samples/SampleBandBody.vue',
        load: () => import('./samples/SampleBandBody.vue?raw').then((module) => module.default)
    },
    '/StylingView': {
        file: 'src/samples/StylingView.vue',
        load: () => import('./samples/StylingView.vue?raw').then((module) => module.default)
    },
    '/EditDropDown': {
        file: 'src/samples/EditDropDown.vue',
        load: () => import('./samples/EditDropDown.vue?raw').then((module) => module.default)
    },
    '/RendererTemplate': {
        file: 'src/samples/RendererTemplate.vue',
        load: () => import('./samples/RendererTemplate.vue?raw').then((module) => module.default)
    },
    '/DragToDropTwoGrid': {
        file: 'src/samples/DragToDropTwoGrid.vue',
        load: () => import('./samples/DragToDropTwoGrid.vue?raw').then((module) => module.default)
    },
    '/CustomRendererStock': {
        file: 'src/samples/CustomRendererStock.vue',
        load: () => import('./samples/CustomRendererStock.vue?raw').then((module) => module.default)
    },
    '/CustomRendererEchart': {
        file: 'src/samples/CustomRendererEchart.vue',
        load: () => import('./samples/CustomRendererEchart.vue?raw').then((module) => module.default)
    },
    '/CustomRendererInput': {
        file: 'src/samples/CustomRendererInput.vue',
        load: () => import('./samples/CustomRendererInput.vue?raw').then((module) => module.default)
    },
    '/CustomEditRendererTextarea': {
        file: 'src/samples/CustomEditRendererTextarea.vue',
        load: () => import('./samples/CustomEditRendererTextarea.vue?raw').then((module) => module.default)
    },
    '/CustomEditRenderer': {
        file: 'src/samples/CustomEditRenderer.vue',
        load: () => import('./samples/CustomEditRenderer.vue?raw').then((module) => module.default)
    },
    '/XlsxImportGrid': {
        file: 'src/samples/XlsxImportGrid.vue',
        load: () => import('./samples/XlsxImportGrid.vue?raw').then((module) => module.default)
    },
    '/ExportMultiXlsx': {
        file: 'src/samples/ExportMultiXlsx.vue',
        load: () => import('./samples/ExportMultiXlsx.vue?raw').then((module) => module.default)
    }
};
