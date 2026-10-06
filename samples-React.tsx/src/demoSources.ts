// 컴포넌트 외에 데이터 처리와 스타일도 개별 파일로 읽을 수 있습니다.
export interface SourceFile {
    file: string;
    load: () => Promise<string>;
    language?: string;
}
export interface DemoSource extends SourceFile {
    files?: SourceFile[];
}
// 각 데모의 실행 파일을 그대로 보여 줍니다. 원문 변경은 앱 빌드 시 자동 반영됩니다.
export const demoSources: Record<string, DemoSource> = {
    '/Showcase01': {
        file: 'src/showcases/Showcase01.tsx',
        load: () => import('./showcases/Showcase01.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase1Model.ts',
                language: 'typescript',
                load: () => import('./showcases/showcase1Model.ts?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcaseTypes.ts',
                language: 'typescript',
                load: () => import('./showcases/showcaseTypes.ts?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase02': {
        file: 'src/showcases/Showcase02.tsx',
        load: () => import('./showcases/Showcase02.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase2Model.ts',
                language: 'typescript',
                load: () => import('./showcases/showcase2Model.ts?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcaseTypes.ts',
                language: 'typescript',
                load: () => import('./showcases/showcaseTypes.ts?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase03': {
        file: 'src/showcases/Showcase03.tsx',
        load: () => import('./showcases/Showcase03.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase3Model.ts',
                language: 'typescript',
                load: () => import('./showcases/showcase3Model.ts?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcase-workspaces.css',
                language: 'css',
                load: () => import('./showcases/showcase-workspaces.css?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/showcaseTypes.ts',
                language: 'typescript',
                load: () => import('./showcases/showcaseTypes.ts?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase04': {
        file: 'src/showcases/Showcase04.tsx',
        load: () => import('./showcases/Showcase04.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase4Model.ts',
                language: 'typescript',
                load: () => import('./showcases/showcase4Model.ts?raw').then((module) => module.default)
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
            },
            {
                file: 'src/showcases/showcaseTypes.ts',
                language: 'typescript',
                load: () => import('./showcases/showcaseTypes.ts?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase05': {
        file: 'src/showcases/Showcase05.tsx',
        load: () => import('./showcases/Showcase05.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase5Model.ts',
                language: 'typescript',
                load: () => import('./showcases/showcase5Model.ts?raw').then((module) => module.default)
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
            },
            {
                file: 'src/showcases/showcaseTypes.ts',
                language: 'typescript',
                load: () => import('./showcases/showcaseTypes.ts?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase06': {
        file: 'src/showcases/Showcase06.tsx',
        load: () => import('./showcases/Showcase06.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/showcase6Model.ts',
                language: 'typescript',
                load: () => import('./showcases/showcase6Model.ts?raw').then((module) => module.default)
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
            },
            {
                file: 'src/showcases/showcaseTypes.ts',
                language: 'typescript',
                load: () => import('./showcases/showcaseTypes.ts?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase07': {
        file: 'src/showcases/Showcase07.tsx',
        load: () => import('./showcases/Showcase07.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/showcases/purchaseDemo.ts',
                language: 'typescript',
                load: () => import('./showcases/purchaseDemo.ts?raw').then((module) => module.default)
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
        file: 'src/showcases/Showcase08.tsx',
        load: () => import('./showcases/Showcase08.tsx?raw').then((module) => module.default),
        files: [
            {
                file: 'src/renderers/MyCalendarRenderer.ts',
                language: 'typescript',
                load: () => import('./renderers/MyCalendarRenderer.ts?raw').then((module) => module.default)
            },
            {
                file: 'src/showcases/Showcase08.css',
                language: 'css',
                load: () => import('./showcases/Showcase08.css?raw').then((module) => module.default)
            }
        ]
    },
    '/Showcase09': {
        file: 'src/showcases/Showcase09.tsx',
        load: () => import('./showcases/Showcase09.tsx?raw').then((module) => module.default),
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
        file: 'src/showcases/Showcase10.tsx',
        load: () => import('./showcases/Showcase10.tsx?raw').then((module) => module.default),
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
        file: 'src/samples/SampleDefault.tsx',
        load: () => import('./samples/SampleDefault.tsx?raw').then((module) => module.default)
    },
    '/SampleBandBody': {
        file: 'src/samples/SampleBandBody.tsx',
        load: () => import('./samples/SampleBandBody.tsx?raw').then((module) => module.default)
    },
    '/Styling': {
        file: 'src/samples/Styling.tsx',
        load: () => import('./samples/Styling.tsx?raw').then((module) => module.default)
    },
    '/SampleTreeGrid': {
        file: 'src/samples/SampleTreeGrid.tsx',
        load: () => import('./samples/SampleTreeGrid.tsx?raw').then((module) => module.default)
    },
    '/EditDropDown': {
        file: 'src/samples/EditDropDown.tsx',
        load: () => import('./samples/EditDropDown.tsx?raw').then((module) => module.default)
    },
    '/Template': {
        file: 'src/samples/RendererTemplate.tsx',
        load: () => import('./samples/RendererTemplate.tsx?raw').then((module) => module.default)
    },
    '/DragDrop2Grid': {
        file: 'src/samples/DragToDropTwoGrid.tsx',
        load: () => import('./samples/DragToDropTwoGrid.tsx?raw').then((module) => module.default)
    },
    '/CustomRendererInput': {
        file: 'src/samples/CustomRendererInput.tsx',
        load: () => import('./samples/CustomRendererInput.tsx?raw').then((module) => module.default)
    },
    '/CustomEditRendererTextarea': {
        file: 'src/samples/CustomEditRendererTextarea.tsx',
        load: () => import('./samples/CustomEditRendererTextarea.tsx?raw').then((module) => module.default)
    }
};
