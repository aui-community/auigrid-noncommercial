export const initialView = { depth: 'all', product: '', cost: '', lead: '', visible: '' };
// React/Vue가 생성한 래퍼를 전달받고, 표시 상태는 프레임워크에 돌려줍니다.
export function createDemo(onChange, baseUrl) {
    let instance = null;
    let generation = 0;
    const view = { ...initialView };
    function grid() {
        if (!instance) throw new Error('그리드가 연결되지 않았습니다.');
        return instance;
    }
    function publish() {
        if (instance) onChange({ ...view });
    }
    let selectedProduct = 'P01';
    const numberFormat = new Intl.NumberFormat('ko-KR');
    const supplyStates = ['확보', '협의 중', '대체 검토'];
    const modules = [
        {
            name: '구동 모듈',
            parts: [
                ['구동 모터', 185000, 2],
                ['감속기', 96000, 2],
                ['구동 휠', 42000, 4],
                ['브레이크', 58000, 2]
            ]
        },
        {
            name: '전원 모듈',
            parts: [
                ['배터리 팩', 420000, 1],
                ['BMS 보드', 78000, 1],
                ['충전 커넥터', 28000, 2],
                ['전원 하네스', 19000, 3]
            ]
        },
        {
            name: '제어 모듈',
            parts: [
                ['산업용 컴퓨터', 680000, 1],
                ['모터 드라이버', 125000, 2],
                ['통신 모듈', 86000, 1],
                ['비상 정지 스위치', 17000, 2]
            ]
        },
        {
            name: '센서 모듈',
            parts: [
                ['2D LiDAR', 540000, 1],
                ['깊이 카메라', 210000, 2],
                ['초음파 센서', 22000, 4],
                ['범퍼 센서', 35000, 2]
            ]
        }
    ];
    // 제품 20개, 조립체 80개, 실제 부품 행 320개를 포함하는 420행의 BOM을 생성합니다.
    function createProducts() {
        return Array.from({ length: 20 }, (_, productIndex) => {
            const id = 'P' + String(productIndex + 1).padStart(2, '0');
            return {
                id,
                productId: id,
                nodeType: 'product',
                unitCost: 0,
                total: 0,
                leadDays: 0,
                supply: '확보',
                name:
                    'AMR-' +
                    (100 + productIndex * 10) +
                    ' / ' +
                    ['물류 이송형', '협동 작업형', '클린룸 운반형', '중량 운반형'][productIndex % 4],
                quantity: 1,
                children: modules.map((module, moduleIndex) => ({
                    id: id + '-M' + moduleIndex,
                    productId: id,
                    nodeType: 'assembly',
                    unitCost: 0,
                    total: 0,
                    leadDays: 0,
                    supply: '확보',
                    name: module.name,
                    quantity: moduleIndex === 3 && productIndex % 3 === 0 ? 2 : 1,
                    children: module.parts.map(([name, price, quantity], partIndex) => ({
                        id: id + '-M' + moduleIndex + '-C' + partIndex,
                        productId: id,
                        nodeType: 'part',
                        total: 0,
                        name,
                        quantity,
                        unitCost: Math.round((price * (1 + productIndex * 0.012)) / 100) * 100,
                        supplier: ['에이원 모션', '이음 파워', '노바 컨트롤', '루트 센서'][
                            (moduleIndex + partIndex) % 4
                        ],
                        leadDays: 5 + ((productIndex + partIndex * 3 + moduleIndex * 2) % 18),
                        supply: supplyStates[
                            (productIndex + moduleIndex + partIndex) % 9 === 0
                                ? 2
                                : (productIndex + partIndex) % 5 === 0
                                  ? 1
                                  : 0
                        ]
                    }))
                }))
            };
        });
    }
    // 부품의 금액을 먼저 구한 뒤, 조립체의 투입 수량을 곱해 제품 원가를 위로 합산합니다.
    function rollup(node, updates = []) {
        if (node.children) {
            node.children.forEach((child) => rollup(child, updates));
            node.unitCost = node.children.reduce((sum, child) => sum + child.total, 0);
            node.leadDays = Math.max(...node.children.map((child) => child.leadDays));
            node.supply = supplyStates[Math.max(...node.children.map((child) => supplyStates.indexOf(child.supply)))];
        }
        node.total = node.quantity * node.unitCost;
        updates.push({
            id: node.id,
            unitCost: node.unitCost,
            total: node.total,
            leadDays: node.leadDays,
            supply: node.supply
        });
        return node;
    }
    function validateCost(old, value, item, field) {
        const count = Number(value),
            minimum = field === 'quantity' ? 1 : 0,
            maximum = field === 'quantity' ? 999 : 100000000;
        return {
            validate: String(value).trim() !== '' && Number.isInteger(count) && count >= minimum && count <= maximum,
            message:
                field === 'quantity'
                    ? '투입 수량은 1~999 사이의 정수입니다.'
                    : '단가는 0~100,000,000원 사이의 정수입니다.'
        };
    }
    function recalculate() {
        const updates = [];
        grid()
            .getTreeGridData()
            .forEach((node) => rollup(node, updates));
        // 트리의 접힘, 정렬 및 선택 상태를 보존하고 계산 필드만 ID로 갱신합니다.
        grid().refreshRows(updates);
        updateProductSummary();
    }
    function updateProductSummary() {
        const product = grid()
            .getTreeGridData()
            .find((item) => item.id === selectedProduct);
        if (!product) return;
        view.product = product.name;
        view.cost = numberFormat.format(product.total) + '원';
        view.lead = '최장 부품 납기 ' + product.leadDays + '일 / ' + product.supply;
        view.visible = '표시 ' + grid().getRowCount() + '행 / 전체 420행';
        publish();
    }
    function showDepth(value) {
        if (value === 'all') grid().expandAll();
        else grid().showItemsOnDepth(Number(value));
        updateProductSummary();
    }
    function resetCosts() {
        grid().forceEditingComplete(null);
        const data = createProducts();
        data.forEach((node) => rollup(node));
        grid().setGridData(data);
        selectedProduct = 'P01';
        view.depth = 'all';
        grid().expandAll();
        grid().setSelectionByIndex(0, 0);
        updateProductSummary();
    }
    function exportReport(format) {
        grid().forceEditingComplete(null);
        recalculate();
        const props = { fileName: '자율주행로봇_BOM_원가' };
        if (format === 'pdf') grid().exportToPdf({ ...props, fontPath: `${baseUrl}/fonts/nyjgothic-medium.ttf` });
        else grid().exportToXlsx(props);
    }
    const numberColumn = (field, title, width) => ({
        dataField: field,
        headerText: title,
        width,
        minWidth: field === 'quantity' ? 70 : 110,
        dataType: 'numeric',
        formatString: '#,##0',
        style: 'workspace-number',
        styleFunction: (row, col, value, header, item) =>
            field !== 'total' && (field === 'quantity' ? item.nodeType !== 'product' : item.nodeType === 'part')
                ? 'bom-edit'
                : 'workspace-number',
        editable: field !== 'total',
        editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            allowPoint: false,
            validator: validateCost
        }
    });
    const columnLayout = [
        {
            dataField: 'name',
            headerText: '제품 / 조립체 / 부품',
            width: '31%',
            minWidth: 290,
            style: 'workspace-left',
            editable: false
        },
        {
            headerText: '조달 정보',
            children: [
                {
                    dataField: 'supplier',
                    headerText: '공급사',
                    width: '14%',
                    minWidth: 115,
                    editable: false
                },
                {
                    dataField: 'leadDays',
                    headerText: '납기(일)',
                    width: '8%',
                    minWidth: 75,
                    dataType: 'numeric',
                    editable: false
                },
                {
                    dataField: 'supply',
                    headerText: '수급 상태',
                    width: '11%',
                    minWidth: 100,
                    editable: false,
                    styleFunction: (row, col, value) =>
                        value === '대체 검토' ? 'bom-review' : value === '협의 중' ? 'bom-negotiate' : ''
                }
            ]
        },
        {
            headerText: '원가 시뮬레이션 (원)',
            children: [
                numberColumn('quantity', '투입 수량', '8%'),
                numberColumn('unitCost', '단가', '13%'),
                numberColumn('total', '금액', '15%')
            ]
        }
    ];
    const gridProps = {
        width: '100%',
        height: 620,

        rowIdField: 'id',
        rowIdTrustMode: true,
        editable: true,
        rowHeight: 29,
        headerHeight: 28,
        showRowNumColumn: true,
        showStateColumn: false,
        selectionMode: 'singleRow',
        displayTreeOpen: true,
        treeColumnIndex: 0,
        rowStyleFunction: (row, item) =>
            item.nodeType === 'product' ? 'bom-product-row' : item.nodeType === 'assembly' ? 'bom-assembly-row' : ''
    };
    function initialize() {
        // 집계 단가와 제품 수량은 읽기 전용이며 실제 편집 대상만 입력기를 엽니다.
        grid().bind('cellEditBegin', (event) =>
            event.dataField === 'quantity'
                ? event.item.nodeType !== 'product'
                : event.dataField === 'unitCost' && event.item.nodeType === 'part'
        );
        grid().bind('cellEditEnd', () =>
            defer(() => {
                if (instance) recalculate();
            })
        );
        grid().bind('selectionChange', (event) => {
            selectedProduct = event.primeCell.item.productId;
            updateProductSummary();
        });
        grid().bind('treeOpenChange', () =>
            defer(() => {
                if (instance) updateProductSummary();
            })
        );
        // 붙여넣기 경로에서도 읽기 전용 집계 필드를 원래 값으로 유지합니다.
        grid().bind('cellEditEndBefore', (event) => {
            const editable =
                event.dataField === 'quantity'
                    ? event.item.nodeType !== 'product'
                    : event.dataField === 'unitCost' && event.item.nodeType === 'part';
            return editable ? event.value : event.oldValue;
        });
        resetCosts();
    }
    // 큐에 남은 이전 편집 이벤트는 화면을 떠나거나 다시 연결하면 무시합니다.
    function defer(callback) {
        const current = generation;
        queueMicrotask(() => {
            if (instance && current === generation) callback();
        });
    }
    function setControl(key, value) {
        view[key] = value;
        showDepth(view.depth);
        publish();
    }
    function attach(api) {
        instance = api;
        generation++;
        initialize();
        publish();
    }
    // 인스턴스 생성/파괴는 래퍼에 맡기고 이 모델의 이벤트와 타이머만 정리합니다.
    function detach() {
        generation++;
        if (instance?.isCreated())
            instance.unbind(['cellEditBegin', 'cellEditEnd', 'cellEditEndBefore', 'selectionChange', 'treeOpenChange']);
        instance = null;
    }
    function pause() {}
    function resume() {
        if (instance?.isCreated()) instance.resize();
    }
    return { columnLayout, gridProps, attach, detach, pause, resume, setControl, resetCosts, exportReport };
}
