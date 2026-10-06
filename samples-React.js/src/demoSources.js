// 각 데모의 실행 파일을 그대로 보여 줍니다. 원문 변경은 앱 빌드 시 자동 반영됩니다.
export const demoSources = {
    '/Showcase01': {
        file: 'src/showcases/Showcase01.js',
        load: () => import('./showcases/Showcase01.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase02.js',
        load: () => import('./showcases/Showcase02.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase03.js',
        load: () => import('./showcases/Showcase03.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase04.js',
        load: () => import('./showcases/Showcase04.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase05.js',
        load: () => import('./showcases/Showcase05.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase06.js',
        load: () => import('./showcases/Showcase06.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase07.js',
        load: () => import('./showcases/Showcase07.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase08.js',
        load: () => import('./showcases/Showcase08.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase09.js',
        load: () => import('./showcases/Showcase09.js?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase10.js',
        load: () => import('./showcases/Showcase10.js?raw').then((module) => module.default),
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
        file: 'src/samples/SampleDefault.js',
        load: () => import('./samples/SampleDefault.js?raw').then((module) => module.default)
    },
    '/SampleBandBody': {
        file: 'src/samples/SampleBandBody.js',
        load: () => import('./samples/SampleBandBody.js?raw').then((module) => module.default)
    },
    '/Styling': {
        file: 'src/samples/Styling.js',
        load: () => import('./samples/Styling.js?raw').then((module) => module.default)
    },
    '/EditDropDown': {
        file: 'src/samples/EditDropDown.js',
        load: () => import('./samples/EditDropDown.js?raw').then((module) => module.default)
    },
    '/Template': {
        file: 'src/samples/RendererTemplate.js',
        load: () => import('./samples/RendererTemplate.js?raw').then((module) => module.default)
    },
    '/DragDrop2Grid': {
        file: 'src/samples/DragToDropTwoGrid.js',
        load: () => import('./samples/DragToDropTwoGrid.js?raw').then((module) => module.default)
    },
    '/CustomRendererStock': {
        file: 'src/samples/CustomRendererStock.js',
        load: () => import('./samples/CustomRendererStock.js?raw').then((module) => module.default)
    },
    '/CustomRendererEchart': {
        file: 'src/samples/CustomRendererEchart.js',
        load: () => import('./samples/CustomRendererEchart.js?raw').then((module) => module.default)
    },
    '/CustomRendererInput': {
        file: 'src/samples/CustomRendererInput.js',
        load: () => import('./samples/CustomRendererInput.js?raw').then((module) => module.default)
    },
    '/CustomEditRendererTextarea': {
        file: 'src/samples/CustomEditRendererTextarea.js',
        load: () => import('./samples/CustomEditRendererTextarea.js?raw').then((module) => module.default)
    },
    '/CustomEditRendererDatePicker': {
        file: 'src/samples/CustomEditRendererDatePicker.js',
        load: () => import('./samples/CustomEditRendererDatePicker.js?raw').then((module) => module.default)
    },
    '/XlsxImportGrid': {
        file: 'src/samples/XlsxImportGrid.js',
        load: () => import('./samples/XlsxImportGrid.js?raw').then((module) => module.default)
    },
    '/ExportMultiGrid': {
        file: 'src/samples/ExportMultiXlsx.js',
        load: () => import('./samples/ExportMultiXlsx.js?raw').then((module) => module.default)
    }
};
