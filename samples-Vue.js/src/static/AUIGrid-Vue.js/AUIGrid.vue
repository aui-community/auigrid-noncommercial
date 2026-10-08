<script>
	/**
	 * AUIGrid.vue for Vue.js v1.7.20261008
	 * Based on AUIGrid v3.0.19.2
	 * Copyright © AUISoft Co., Ltd.
	 * www.auisoft.net
	 */
	/* eslint-disable */

	// 프로젝트 경로에 맞게 바꾸세요
	import '../AUIGrid/AUIGrid';
	import '../AUIGrid/AUIGridLicense';
	import '../AUIGrid/AUIGrid_style.css';

	// AUIGrid.defaultProps 에 공통적인 속성을 설정합니다.
	// AUIGrid.defaultProps 설정은 AUIGrid.js 정의 이후 선언해야 합니다.
	// 선언하면 AUIGrid 를 생성 할 때 기본적으로 defaultProps 를 확장하여 생성합니다.
	// 따라서 매 페이지의 그리드를 생성할 때 공통적인 속성을 여기서 작성하십시오.
	if (typeof window !== 'undefined' && typeof window.AUIGrid !== 'undefined') {
		window.AUIGrid.defaultProps = {
			// 모바일인 경우 자동으로 작은 사이즈의 스크롤을 표시할지 여부
			// 여기서 정의했기 때문에 앞으로 모든 그리드는 속성 autoScrollSize: true 를 상속 받아 적용됨.
			autoScrollSize: true,

			// 다른 framework wrapper와 동일하게 선택 이벤트를 간소화합니다.
			// 일반 선택에서 selectedItems가 필요하면 gridProps.simplifySelectionEvent를 false로 지정합니다.
			// enableSelectionAll이 true이면 엔진에서 간소화가 강제됩니다.
			simplifySelectionEvent: true
		};
	}

	// 이 아래 소스는 절대 수정하지 마세요.
	const $ag = typeof window === 'undefined' ? {} : window.AUIGrid;

	// 엔진 내부가 아닌 호스트 DIV를 관찰하며, 래퍼마다 독립된 예약 작업을 소유합니다.
	// 배포 시 래퍼 파일만 복사해도 사용할 수 있도록 외부 모듈에 의존하지 않습니다.
	function createContainerResize(getPID, getDelay) {
		let observer = null;
		let host = null;
		let timer = null;
		let frame = null;
		let generation = 0;
		let width = -1,
			height = -1;

		function stop() {
			// 해제 직전에 전달된 관찰 알림과 타이머도 이전 세대의 작업으로 무효화합니다.
			generation++;
			if (observer) observer.disconnect();
			observer = null;
			window.removeEventListener('resize', schedule);
			if (timer !== null) window.clearTimeout(timer);
			if (frame !== null) window.cancelAnimationFrame(frame);
			timer = frame = null;
			host = null;
			width = height = -1;
		}

		function schedule() {
			if (!host) return;
			const current = generation;
			if (timer !== null) window.clearTimeout(timer);
			if (frame !== null) window.cancelAnimationFrame(frame);
			frame = null;
			// 기존 resizeDelayTime을 지키고 레이아웃 읽기/쓰기는 다음 프레임에 모읍니다.
			timer = window.setTimeout(() => {
				if (current !== generation) return;
				timer = null;
				frame = window.requestAnimationFrame(() => {
					if (current !== generation || !host) return;
					frame = null;
					const pid = getPID();
					if (!host.isConnected || document.getElementById(pid.slice(1)) !== host || !$ag.isCreated(pid)) return;
					const nextWidth = host.offsetWidth,
						nextHeight = host.offsetHeight;
					// 엔진의 작은 크기 재시도 경로로 들어가지 않고, 다시 표시될 때 관찰 알림을 기다립니다.
					if (nextWidth <= 5 || nextHeight <= 5) {
						width = height = -1;
						return;
					}
					if (nextWidth === width && nextHeight === height) return;
					width = nextWidth;
					height = nextHeight;
					$ag.resize(pid);
					// autoGridHeight 등 엔진 자체의 크기 반영을 다음 외부 변경으로 오인하지 않습니다.
					if (current === generation && host) {
						width = host.offsetWidth;
						height = host.offsetHeight;
					}
				});
			}, getDelay());
		}

		function start() {
			const target = document.getElementById(getPID().slice(1));
			if (!target || host === target) return;
			stop();
			host = target;
			const current = generation;
			if (typeof window.ResizeObserver === 'function') {
				observer = new window.ResizeObserver(() => {
					if (current === generation) schedule();
				});
				observer.observe(target, { box: 'border-box' });
			} else {
				// ResizeObserver가 없는 환경에서는 기존 창 크기 이벤트로 대체합니다.
				window.addEventListener('resize', schedule);
			}
			schedule();
		}

		// Vue 반응형 프록시 대신 클로저가 네이티브 관찰자와 예약 핸들을 관리합니다.
		return Object.freeze({ start, stop });
	}

	export default {
		props: {
			name: {
				type: String,
				default: ''
			},
			autoResize: {
				type: Boolean,
				default: true
			},
			// container는 호스트 크기를 관찰하고 window는 기존 창 크기 이벤트를 사용합니다.
			resizeMode: {
				type: String,
				default: 'window',
				validator: (value) => value === 'window' || value === 'container'
			},
			resizeDelayTime: {
				type: Number,
				default: 300
			},
			gridProps: {
				type: Object,
				default() {
					return {};
				}
			},
			columnLayout: {
				type: Array,
				default() {
					return null;
				}
			},
			footerLayout: {
				type: Array,
				default() {
					return null;
				}
			}
		},
		data: () => ({
			timerId: null,
			auiMountGeneration: 0,
			auiResizeInactive: false,
			auiContainerResize: null
		}),
		created: function () {
			//crypto 로 uuid 생성함. (유니크 값)
			this.uuid = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
			this.id = 'aui-grid-wrap-' + (this.name !== '' ? this.name : this.uuid);
			this.pid = '#' + this.id;
			this.timerId = null;
		},
		mounted: function () {
			const generation = ++this.auiMountGeneration;
			const columnLayout = this.__getColumnLayoutByProxy();
			const gridProps = this.__getGridPropsByProxy();
			const footerLayout = this.__getFooterLayoutByProxy();
			if (columnLayout !== null) $ag.create(this.pid, columnLayout, gridProps);
			if (generation !== this.auiMountGeneration) return;
			if (footerLayout !== null) $ag.setFooter(this.pid, footerLayout);
			if (generation !== this.auiMountGeneration) return;
			this.__setupEvents();
			this.__setupGlobalResize();
		},
		beforeDestroy: function () {
			// for Vue 2
			this.__resetGlobalResize();
			if ($ag.isCreated(this.pid)) $ag.destroy(this.pid);
		},
		beforeUnmount: function () {
			// for Vue 3
			this.__resetGlobalResize();
			if ($ag.isCreated(this.pid)) $ag.destroy(this.pid);
		},
		activated: function () {
			this.auiResizeInactive = false;
			// 캐시된 DOM 복귀 후 컨테이너 관찰만 재개하며 그리드 데이터는 재생성하지 않습니다.
			if (this.resizeMode === 'container') this.__setupGlobalResize();
		},
		deactivated: function () {
			this.auiResizeInactive = true;
			if (this.auiContainerResize) this.auiContainerResize.stop();
		},
		methods: {
			__setupEvents() {
				let n, name;
				const that = this;
				const events = [
					'addColumn',
					'addRow',
					'addRowFinish',
					'addTreeColumn',
					'cellClick',
					'cellDoubleClick',
					'cellEditCancel',
					'cellEditEnd',
					'cellLongTap',
					'columnStateChange',
					'copyEnd',
					'dropCancel',
					'dropCellsEnd',
					'dropCellsCancel',
					'dropEnd',
					'filtering',
					'footerClick',
					'footerDoubleClick',
					'grouping',
					'hScrollChange',
					'indent',
					'notFound',
					'outdent',
					'pageChange',
					'pageRowCountChange',
					'pasteEnd',
					'removeColumn',
					'removeRow',
					'removeSoftRows',
					'rowAllChkClick',
					'rowCheckClick',
					'selectionChange',
					'ready',
					'sorting',
					'treeLazyRequest',
					'treeOpenChange',
					'undoRedoChange',
					'updateRow',
					'updateRows',
					'vScrollChange'
				];
				const invokers = [
					'beforeInsertRow',
					'beforeRemoveColumn',
					'beforeRemoveRow',
					'beforeRemoveSoftRows',
					'cellEditBegin',
					'cellEditEndBefore',
					'contextMenu',
					'copyBegin',
					// 그리드 간 셀 드래그도 출발지에서 수신하며 pidToDrop, false 반환과 isMoveMode 변경을 그대로 전달합니다.
					'dragCellsBegin',
					'dropCellsEndBefore',
					'dragBegin',
					'dropEndBefore',
					'headerClick',
					'keyDown',
					'pasteBegin',
					'rowNumCellClick',
					'rowNumHeaderClick',
					'rowStateCellClick',
					'selectionConstraint'
				];

				if (typeof this._events !== 'undefined') {
					// for Vue 2
					for (n in events) {
						name = events[n];
						if (this.__isEventHandlerDefined(name)) {
							$ag.bind(this.pid, name, function (e) {
								that.$emit(e.type, e);
							});
						}
					}
					for (n in invokers) {
						name = invokers[n];
						if (this.__isEventHandlerDefined(name)) {
							$ag.bind(this.pid, name, function (e) {
								return that.__invoke(e.type, e);
							});
						}
					}
				} else {
					// for Vue 3
					for (n in events) {
						name = events[n];
						if (this.__isEventHandlerDefined(name)) {
							$ag.bind(this.pid, name, function (e) {
								that.$emit(e.type, e);
							});
						}
					}
					for (n in invokers) {
						name = invokers[n];
						if (this.__isEventHandlerDefined(name)) {
							$ag.bind(this.pid, name, function (e) {
								return that.__invoke(e.type, e);
							});
						}
					}
				}
			},
			__invoke(n, e) {
				if (typeof this._events !== 'undefined') {
					// for Vue 2
					if (this._events[n] && typeof this._events[n][0] == 'function') {
						return this._events[n][0](e);
					}
				} else {
					// for Vue 3
					const name = 'on' + n.replace(/^[a-z]/, (c) => c.toUpperCase());
					if (!this.$attrs[name]) return;
					return this.$attrs[name](e);
				}
			},
			__isEventHandlerDefined(name) {
				// for Vue 2
				if (typeof this._events !== 'undefined') {
					return this._events[name];
				}
				return typeof this.$attrs['on' + name.replace(/^[a-z]/, (c) => c.toUpperCase())] === 'function';
			},
			__setupGlobalResize() {
				if (!this.autoResize) return;
				if (this.resizeMode === 'container') {
					if (this.auiResizeInactive) return;
					if (!this.auiContainerResize)
						this.auiContainerResize = createContainerResize(
							() => this.pid,
							() => this.resizeDelayTime
						);
					this.auiContainerResize.start();
					return;
				}
				window.addEventListener('resize', this.__globalResizeHandler);
			},
			__resetGlobalResize() {
				if (this.auiContainerResize) this.auiContainerResize.stop();
				this.auiMountGeneration++;
				if (this.timerId !== null) {
					clearTimeout(this.timerId);
					this.timerId = null;
				}
				window.removeEventListener('resize', this.__globalResizeHandler);
			},
			__globalResizeHandler() {
				const that = this;
				const generation = this.auiMountGeneration;
				const pid = this.pid;
				if (this.timerId !== null) {
					clearTimeout(this.timerId);
				}
				const timerId = setTimeout(function () {
					if (generation !== that.auiMountGeneration) return;
					if ($ag.isCreated(pid)) {
						try {
							$ag.resize(pid);
						} catch (e) {}
					}
				}, this.resizeDelayTime);
				this.timerId = timerId;
			},
			__getColumnLayoutByProxy: function () {
				if (this.columnLayout === null) return null;
				else if (Array.isArray(this.columnLayout) || this.columnLayout instanceof Array || this.columnLayout.constructor == 'Array') {
					return this.columnLayout;
				}
				// if (isProxy(this.columnLayout)) { const rawObjectOrArray = toRaw(this.columnLayout); console.log(rawObjectOrArray); } only Vue3
				return Object.assign([], this.columnLayout);
			},
			__getGridPropsByProxy: function () {
				if (this.gridProps === null) return {};
				else if (typeof this.gridProps.gridProps === 'object') {
					return Object.assign({}, this.gridProps);
				}
				return this.gridProps;
			},
			__getFooterLayoutByProxy: function () {
				if (this.footerLayout === null) return null;
				else if (Array.isArray(this.footerLayout) || this.footerLayout instanceof Array || this.footerLayout.constructor == 'Array') {
					return this.footerLayout;
				}
				return Object.assign([], this.footerLayout);
			},
			getPID() {
				return this.pid;
			},
			create(columnLayout, props, footerLayout) {
				if ($ag.isCreated(this.pid)) return this.pid;
				$ag.create(this.pid, columnLayout, props);
				if (footerLayout) {
					$ag.setFooter(this.pid, footerLayout);
				}
				this.__setupEvents();
				this.__setupGlobalResize();
				return this.pid;
			},

			addCheckedRowsByIds(rowIds) {
				$ag.addCheckedRowsByIds.call($ag, this.pid, arguments[0]);
			},
			addCheckedRowsByValue(dataField, value) {
				$ag.addCheckedRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			addColumn(cItems, position) {
				$ag.addColumn.call($ag, this.pid, arguments[0], arguments[1]);
			},
			addRow(items, rowIndex) {
				$ag.addRow.call($ag, this.pid, arguments[0], arguments[1]);
			},
			addTreeColumn(cItems, parentDataField, position) {
				$ag.addTreeColumn.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			addTreeRow(item, parentRowId, position) {
				$ag.addTreeRow.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			addTreeRowByIndex(items, rowIndex) {
				$ag.addTreeRowByIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			addUncheckedRowsByIds(rowIds) {
				$ag.addUncheckedRowsByIds.call($ag, this.pid, arguments[0]);
			},
			addUncheckedRowsByValue(dataField, value) {
				$ag.addUncheckedRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			appendData(items) {
				$ag.appendData.call($ag, this.pid, arguments[0]);
			},
			bind(name, func) {
				$ag.bind.call($ag, this.pid, arguments[0], arguments[1]);
			},
			changeColumnLayout(newLayout) {
				$ag.changeColumnLayout.call($ag, this.pid, arguments[0]);
			},
			changeExtraColumnOrders(orders) {
				$ag.changeExtraColumnOrders.call($ag, this.pid, arguments[0]);
			},
			changeExtraColumnWidth(name, width) {
				$ag.changeExtraColumnWidth.call($ag, this.pid, arguments[0], arguments[1]);
			},
			changeFooterLayout(newLayout) {
				$ag.changeFooterLayout.call($ag, this.pid, arguments[0]);
			},
			clearFilter(dataField) {
				$ag.clearFilter.call($ag, this.pid, arguments[0]);
			},
			clearFilterAll() {
				$ag.clearFilterAll.call($ag, this.pid);
			},
			clearGridData() {
				$ag.clearGridData.call($ag, this.pid);
			},
			clearSelection() {
				$ag.clearSelection.call($ag, this.pid);
			},
			clearSortingAll() {
				$ag.clearSortingAll.call($ag, this.pid);
			},
			clearUndoRedoStack() {
				$ag.clearUndoRedoStack.call($ag, this.pid);
			},
			closeFilterLayer() {
				$ag.closeFilterLayer.call($ag, this.pid);
			},
			collapseAll() {
				$ag.collapseAll.call($ag, this.pid);
			},
			destroy() {
				if (this.auiContainerResize) this.auiContainerResize.stop();
				$ag.destroy.call($ag, this.pid);
			},
			expandAll() {
				$ag.expandAll.call($ag, this.pid);
			},
			expandItemByRowId(rowId, open, recursive) {
				$ag.expandItemByRowId.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			exportAsCsv(props) {
				$ag.exportAsCsv.call($ag, this.pid, arguments[0]);
			},
			exportAsJson(keyValueMode, props) {
				$ag.exportAsJson.call($ag, this.pid, arguments[0], arguments[1]);
			},
			exportAsObject(keyValueMode) {
				return $ag.exportAsObject.call($ag, this.pid, arguments[0]);
			},
			exportAsPdf(props) {
				$ag.exportAsPdf.call($ag, this.pid, arguments[0]);
			},
			exportAsTxt(props) {
				$ag.exportAsTxt.call($ag, this.pid, arguments[0]);
			},
			exportAsXlsx(exportWithStyle, props) {
				$ag.exportAsXlsx.call($ag, this.pid, arguments[0], arguments[1]);
			},
			exportAsXml(props) {
				$ag.exportAsXml.call($ag, this.pid, arguments[0]);
			},
			exportToCsv(props) {
				$ag.exportToCsv.call($ag, this.pid, arguments[0]);
			},
			exportToJson(keyValueMode, props) {
				$ag.exportToJson.call($ag, this.pid, arguments[0], arguments[1]);
			},
			exportToObject(keyValueMode) {
				return $ag.exportToObject.call($ag, this.pid, arguments[0]);
			},
			// bodyLayoutMode는 화면을 바꾸지 않고 PDF 파일에만 적용합니다. (v3.0.19)
			exportToPdf(props) {
				$ag.exportToPdf.call($ag, this.pid, arguments[0]);
			},
			exportToTxt(props) {
				$ag.exportToTxt.call($ag, this.pid, arguments[0]);
			},
			// v3.0.19: 옵션의 bodyLayoutMode는 Excel에만 적용하며 기존 두 인자 호출도 유지합니다.
			exportToXlsx(exportWithStyle, props) {
				$ag.exportToXlsx.call($ag, this.pid, arguments[0], arguments[1]);
			},
			// 각 시트의 props에 bodyLayoutMode를 독립적으로 지정할 수 있습니다.
			exportToXlsxMulti(subGridIds, props) {
				$ag.exportToXlsxMulti.call($ag, this.pid, arguments[0], arguments[1]);
			},
			exportToXml(props) {
				$ag.exportToXml.call($ag, this.pid, arguments[0]);
			},
			forceEditingComplete(value, cancel) {
				$ag.forceEditingComplete.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getAddedColumnFields() {
				return $ag.getAddedColumnFields.call($ag, this.pid);
			},
			getAddedRowItems() {
				return $ag.getAddedRowItems.call($ag, this.pid);
			},
			getAscendantsByRowId(rowId) {
				return $ag.getAscendantsByRowId.call($ag, this.pid, arguments[0]);
			},
			getCellElementByIndex(rowIndex, columnIndex) {
				return $ag.getCellElementByIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getCellFormatValue(rowIndex, dataField) {
				return $ag.getCellFormatValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getCellValue(rowIndex, dataField) {
				return $ag.getCellValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getCheckedRowItems() {
				return $ag.getCheckedRowItems.call($ag, this.pid);
			},
			getCheckedRowItemsAll() {
				return $ag.getCheckedRowItemsAll.call($ag, this.pid);
			},
			getColumnCount() {
				return $ag.getColumnCount.call($ag, this.pid);
			},
			getColumnDistinctValues(dataField, total) {
				return $ag.getColumnDistinctValues.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getColumnIndexByDataField(dataField) {
				return $ag.getColumnIndexByDataField.call($ag, this.pid, arguments[0]);
			},
			getColumnInfoList() {
				return $ag.getColumnInfoList.call($ag, this.pid);
			},
			getColumnItemByDataField(dataField) {
				return $ag.getColumnItemByDataField.call($ag, this.pid, arguments[0]);
			},
			getColumnItemByIndex(columnIndex) {
				return $ag.getColumnItemByIndex.call($ag, this.pid, arguments[0]);
			},
			getColumnLayout() {
				return $ag.getColumnLayout.call($ag, this.pid);
			},
			getColumnValues(dataField, total) {
				return $ag.getColumnValues.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getColumnWidthByDataField(dataField) {
				return $ag.getColumnWidthByDataField.call($ag, this.pid, arguments[0]);
			},
			getColumnWidthList() {
				return $ag.getColumnWidthList.call($ag, this.pid);
			},
			getCurrentPageData() {
				return $ag.getCurrentPageData.call($ag, this.pid);
			},
			getDataFieldByColumnIndex(columnIndex) {
				return $ag.getDataFieldByColumnIndex.call($ag, this.pid, arguments[0]);
			},
			getDepthByRowId(rowId) {
				return $ag.getDepthByRowId.call($ag, this.pid, arguments[0]);
			},
			getDescendantsByRowId(rowId) {
				return $ag.getDescendantsByRowId.call($ag, this.pid, arguments[0]);
			},
			getEditedRowColumnItems() {
				return $ag.getEditedRowColumnItems.call($ag, this.pid);
			},
			getEditedRowItems() {
				return $ag.getEditedRowItems.call($ag, this.pid);
			},
			// 접힌 그룹의 자손까지 포함한 필터 결과 건수를 조회합니다.
			getFilteredRowCount() {
				return $ag.getFilteredRowCount.call($ag, this.pid);
			},

			getFilterCache() {
				return $ag.getFilterCache.call($ag, this.pid);
			},
			getFilterInlineTexts() {
				return $ag.getFilterInlineTexts.call($ag, this.pid);
			},
			getFitColumnSizeByDataField(dataField) {
				return $ag.getFitColumnSizeByDataField.call($ag, this.pid, arguments[0]);
			},
			getFitColumnSizeList(fitToGrid) {
				return $ag.getFitColumnSizeList.call($ag, this.pid, arguments[0]);
			},
			getFooterData() {
				return $ag.getFooterData.call($ag, this.pid);
			},
			getFooterFormatValueByDataField(posField) {
				return $ag.getFooterFormatValueByDataField.call($ag, this.pid, arguments[0]);
			},
			getFooterLayout() {
				return $ag.getFooterLayout.call($ag, this.pid);
			},
			getFooterValueByDataField(posField) {
				return $ag.getFooterValueByDataField.call($ag, this.pid, arguments[0]);
			},
			getGridData() {
				return $ag.getGridData.call($ag, this.pid);
			},
			getGridDataWithState(stateField, option) {
				return $ag.getGridDataWithState.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getHiddenColumnDataFields() {
				return $ag.getHiddenColumnDataFields.call($ag, this.pid);
			},
			getHiddenColumnIndexes() {
				return $ag.getHiddenColumnIndexes.call($ag, this.pid);
			},
			getIndexesByEvent(mouseEvent) {
				return $ag.getIndexesByEvent.call($ag, this.pid, arguments[0]);
			},
			getInitCellValue(rowId, dataField) {
				return $ag.getInitCellValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getInitValueItem(rowId) {
				return $ag.getInitValueItem.call($ag, this.pid, arguments[0]);
			},
			getItemByRowId(rowId) {
				return $ag.getItemByRowId.call($ag, this.pid, arguments[0]);
			},
			getItemByRowIndex(rowIndex) {
				return $ag.getItemByRowIndex.call($ag, this.pid, arguments[0]);
			},
			getItemsByValue(dataField, value) {
				return $ag.getItemsByValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getMergeEndColumnIndex(rowIndex, columnIndex) {
				return $ag.getMergeEndColumnIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getMergeEndRowIndex(rowIndex, columnIndex) {
				return $ag.getMergeEndRowIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getMergeItems(rowIndex, columnIndex) {
				return $ag.getMergeItems.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getMergeStartColumnIndex(rowIndex, columnIndex) {
				return $ag.getMergeStartColumnIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getMergeStartRowIndex(rowIndex, columnIndex) {
				return $ag.getMergeStartRowIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getMobileMode() {
				return $ag.getMobileMode.call($ag, this.pid);
			},
			getOrgGridData() {
				return $ag.getOrgGridData.call($ag, this.pid);
			},
			getParentColumnByDataField(dataField) {
				return $ag.getParentColumnByDataField.call($ag, this.pid, arguments[0]);
			},
			getParentItemByRowId(rowId) {
				return $ag.getParentItemByRowId.call($ag, this.pid, arguments[0]);
			},
			getProp(name) {
				return $ag.getProp.call($ag, this.pid, arguments[0]);
			},
			getProperty(name) {
				return $ag.getProperty.call($ag, this.pid, arguments[0]);
			},
			getRemovedColumnFields() {
				return $ag.getRemovedColumnFields.call($ag, this.pid);
			},
			getRemovedItems(includeAdded) {
				return $ag.getRemovedItems.call($ag, this.pid, arguments[0]);
			},
			getRemovedNewItems() {
				return $ag.getRemovedNewItems.call($ag, this.pid);
			},
			getRowCount() {
				return $ag.getRowCount.call($ag, this.pid);
			},
			getRowIndexesByValue(dataField, values) {
				return $ag.getRowIndexesByValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getRowPosition() {
				return $ag.getRowPosition.call($ag, this.pid);
			},
			getRowsByValue(dataField, values) {
				return $ag.getRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			getScaleFactor() {
				return $ag.getScaleFactor.call($ag, this.pid);
			},
			getSelectedColIndexes() {
				return $ag.getSelectedColIndexes.call($ag, this.pid);
			},
			getSelectedIndex() {
				return $ag.getSelectedIndex.call($ag, this.pid);
			},
			getSelectedItems(performanceMode) {
				return $ag.getSelectedItems.call($ag, this.pid, arguments[0]);
			},
			getSelectedPrimeIndexOnMerge() {
				return $ag.getSelectedPrimeIndexOnMerge.call($ag, this.pid);
			},
			getSelectedRowIndexes() {
				return $ag.getSelectedRowIndexes.call($ag, this.pid);
			},
			getSelectedRows() {
				return $ag.getSelectedRows.call($ag, this.pid);
			},
			getSelectedText(exceptHidden) {
				return $ag.getSelectedText.call($ag, this.pid, arguments[0]);
			},
			getSortCollator() {
				return $ag.getSortCollator.call($ag, this.pid);
			},
			getSortingFields() {
				return $ag.getSortingFields.call($ag, this.pid);
			},
			getStateCache() {
				return $ag.getStateCache.call($ag, this.pid);
			},
			getTextDataProvider() {
				return $ag.getTextDataProvider.call($ag, this.pid);
			},
			getTreeFilteredFlatData() {
				return $ag.getTreeFilteredFlatData.call($ag, this.pid);
			},
			getTreeFlatData() {
				return $ag.getTreeFlatData.call($ag, this.pid);
			},
			getTreeGridData() {
				return $ag.getTreeGridData.call($ag, this.pid);
			},
			getTreeTotalDepth() {
				return $ag.getTreeTotalDepth.call($ag, this.pid);
			},
			hideColumnByDataField(dataField) {
				$ag.hideColumnByDataField.call($ag, this.pid, arguments[0]);
			},
			hideColumnGroup(dataField) {
				$ag.hideColumnGroup.call($ag, this.pid, arguments[0]);
			},
			hideExtraColumn(name) {
				$ag.hideExtraColumn.call($ag, this.pid, arguments[0]);
			},
			hideFooterLater() {
				$ag.hideFooterLater.call($ag, this.pid);
			},
			indentTreeDepth() {
				$ag.indentTreeDepth.call($ag, this.pid);
			},
			indexToRowId(rowIndex) {
				return $ag.indexToRowId.call($ag, this.pid, arguments[0]);
			},
			isAddedById(rowId) {
				return $ag.isAddedById.call($ag, this.pid, arguments[0]);
			},
			isAddedByRowIndex(rowIndex) {
				return $ag.isAddedByRowIndex.call($ag, this.pid, arguments[0]);
			},
			isAvailabePdf() {
				return $ag.isAvailabePdf.call($ag, this.pid);
			},
			isAvailableLocalDownload() {
				return $ag.isAvailableLocalDownload.call($ag, this.pid);
			},
			isCheckedRowById(rowId) {
				return $ag.isCheckedRowById.call($ag, this.pid, arguments[0]);
			},
			isCreated() {
				return $ag.isCreated.call($ag, this.pid);
			},
			isEditedById(rowId) {
				return $ag.isEditedById.call($ag, this.pid, arguments[0]);
			},
			isEditedByRowIndex(rowIndex) {
				return $ag.isEditedByRowIndex.call($ag, this.pid, arguments[0]);
			},
			isEditedCell(rowId, dataField) {
				return $ag.isEditedCell.call($ag, this.pid, arguments[0], arguments[1]);
			},
			isEditedCellByIndex(rowIndex, columnIndex) {
				return $ag.isEditedCellByIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			isFilteredGrid() {
				return $ag.isFilteredGrid.call($ag, this.pid);
			},
			isItemBranchByRowId(rowId) {
				return $ag.isItemBranchByRowId.call($ag, this.pid, arguments[0]);
			},
			isItemOpenByRowId(rowId) {
				return $ag.isItemOpenByRowId.call($ag, this.pid, arguments[0]);
			},
			isItemVisibleByRowId(rowId) {
				return $ag.isItemVisibleByRowId.call($ag, this.pid, arguments[0]);
			},
			isLazyRequestedByIndex(rowIndex) {
				return $ag.isLazyRequestedByIndex.call($ag, this.pid, arguments[0]);
			},
			isMergedCell(rowIndex, columnIndex) {
				return $ag.isMergedCell.call($ag, this.pid, arguments[0], arguments[1]);
			},
			isMergedCellByColumn(rowIndex, columnIndex) {
				return $ag.isMergedCellByColumn.call($ag, this.pid, arguments[0], arguments[1]);
			},
			isMergedCellByRow(rowIndex, columnIndex) {
				return $ag.isMergedCellByRow.call($ag, this.pid, arguments[0], arguments[1]);
			},
			isOpenFilterLayer() {
				return $ag.isOpenFilterLayer.call($ag, this.pid);
			},
			isRemovedById(rowId) {
				return $ag.isRemovedById.call($ag, this.pid, arguments[0]);
			},
			isRemovedByRowIndex(rowIndex) {
				return $ag.isRemovedByRowIndex.call($ag, this.pid, arguments[0]);
			},
			isSelectionReversed() {
				return $ag.isSelectionReversed.call($ag, this.pid);
			},
			isSortedGrid() {
				return $ag.isSortedGrid.call($ag, this.pid);
			},
			isTreeGrid() {
				return $ag.isTreeGrid.call($ag, this.pid);
			},
			isUniqueValue(dataField, value) {
				return $ag.isUniqueValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			movePageTo(pageNum, keepVScrollPos, keepHScrollPos) {
				$ag.movePageTo.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			moveRowToIndex(rowId, toRowIndex) {
				$ag.moveRowToIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			moveRows2Down() {
				$ag.moveRows2Down.call($ag, this.pid);
			},
			moveRows2Up() {
				$ag.moveRows2Up.call($ag, this.pid);
			},
			moveRowsToDown() {
				$ag.moveRowsToDown.call($ag, this.pid);
			},
			moveRowsToUp() {
				$ag.moveRowsToUp.call($ag, this.pid);
			},
			openEditDownListLayer() {
				$ag.openEditDownListLayer.call($ag, this.pid);
			},
			openFilterLayer(dataField) {
				$ag.openFilterLayer.call($ag, this.pid, arguments[0]);
			},
			openInputer() {
				$ag.openInputer.call($ag, this.pid);
			},
			outdentTreeDepth() {
				$ag.outdentTreeDepth.call($ag, this.pid);
			},
			prependData(items) {
				$ag.prependData.call($ag, this.pid, arguments[0]);
			},
			redo() {
				$ag.redo.call($ag, this.pid);
			},
			redoable() {
				return $ag.redoable.call($ag, this.pid);
			},
			refresh() {
				$ag.refresh.call($ag, this.pid);
			},
			refreshRows(items, style, flashTime) {
				$ag.refreshRows.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			removeAjaxLoader() {
				$ag.removeAjaxLoader.call($ag, this.pid);
			},
			removeCheckedRows() {
				$ag.removeCheckedRows.call($ag, this.pid);
			},
			removeColumn(columnIndex) {
				$ag.removeColumn.call($ag, this.pid, arguments[0]);
			},
			removeInfoMessage() {
				$ag.removeInfoMessage.call($ag, this.pid);
			},
			removeRow(rowIndex) {
				$ag.removeRow.call($ag, this.pid, arguments[0]);
			},
			removeRowByRowId(rowIds) {
				$ag.removeRowByRowId.call($ag, this.pid, arguments[0]);
			},
			removeSoftRows(ids) {
				return $ag.removeSoftRows.call($ag, this.pid, arguments[0]);
			},
			removeToastMessage() {
				$ag.removeToastMessage.call($ag, this.pid);
			},
			resetLazyStateByIndex(rowIndex) {
				$ag.resetLazyStateByIndex.call($ag, this.pid, arguments[0]);
			},
			resetUpdatedColumns(option) {
				$ag.resetUpdatedColumns.call($ag, this.pid, arguments[0]);
			},
			resetUpdatedItemById(rowId, option) {
				$ag.resetUpdatedItemById.call($ag, this.pid, arguments[0], arguments[1]);
			},
			resetUpdatedItems(option) {
				$ag.resetUpdatedItems.call($ag, this.pid, arguments[0]);
			},
			resize(width, height) {
				$ag.resize.call($ag, this.pid, arguments[0], arguments[1]);
			},
			restoreEditedCells(cells) {
				$ag.restoreEditedCells.call($ag, this.pid, arguments[0]);
			},
			restoreEditedRows(rowIndex) {
				$ag.restoreEditedRows.call($ag, this.pid, arguments[0]);
			},
			restoreSoftRows(option) {
				$ag.restoreSoftRows.call($ag, this.pid, arguments[0]);
			},
			rowIdToIndex(rowId) {
				return $ag.rowIdToIndex.call($ag, this.pid, arguments[0]);
			},
			search(dataField, term, opts) {
				$ag.search.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			searchAll(term, opts) {
				$ag.searchAll.call($ag, this.pid, arguments[0], arguments[1]);
			},
			selectRowsByRowId(rowId) {
				$ag.selectRowsByRowId.call($ag, this.pid, arguments[0]);
			},
			setAllCheckedRows(check) {
				$ag.setAllCheckedRows.call($ag, this.pid, arguments[0]);
			},
			setCellMerge(flag) {
				$ag.setCellMerge.call($ag, this.pid, arguments[0]);
			},
			setCellValue(rowIndex, dataField, value) {
				$ag.setCellValue.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			setCheckedRowsByIds(rowIds) {
				$ag.setCheckedRowsByIds.call($ag, this.pid, arguments[0]);
			},
			setCheckedRowsByValue(dataField, value) {
				$ag.setCheckedRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setColumnChildOrder(dataFieldOrders) {
				$ag.setColumnChildOrder.call($ag, this.pid, arguments[0]);
			},
			setColumnOrder(dataFieldOrders) {
				$ag.setColumnOrder.call($ag, this.pid, arguments[0]);
			},
			setColumnProp(columnIndex, propObj) {
				$ag.setColumnProp.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setColumnPropByDataField(dataField, propObj) {
				$ag.setColumnPropByDataField.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setColumnSizeList(sizeList) {
				return $ag.setColumnSizeList.call($ag, this.pid, arguments[0]);
			},
			setCsvGridData(csvData, isSimpleMode) {
				$ag.setCsvGridData.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setEditingInputValue(value) {
				$ag.setEditingInputValue.call($ag, this.pid, arguments[0]);
			},
			setFilter(dataField, func) {
				$ag.setFilter.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setFilterByValues(dataField, values) {
				$ag.setFilterByValues.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setFilterCache(cache) {
				$ag.setFilterCache.call($ag, this.pid, arguments[0]);
			},
			setFilterInlineTexts(values) {
				$ag.setFilterInlineTexts.call($ag, this.pid, arguments[0]);
			},
			setFixedColumnCount(count) {
				$ag.setFixedColumnCount.call($ag, this.pid, arguments[0]);
			},
			setFixedRowCount(count) {
				$ag.setFixedRowCount.call($ag, this.pid, arguments[0]);
			},
			setFocus() {
				$ag.setFocus.call($ag, this.pid);
			},
			setFooter(footerLayout) {
				$ag.setFooter.call($ag, this.pid, arguments[0]);
			},
			setGridData(data) {
				$ag.setGridData.call($ag, this.pid, arguments[0]);
			},
			setGroupBy(groupingFields, summaryProps) {
				$ag.setGroupBy.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setHScrollPosition(columnIndex) {
				$ag.setHScrollPosition.call($ag, this.pid, arguments[0]);
			},
			setHScrollPositionByPx(pixel) {
				$ag.setHScrollPositionByPx.call($ag, this.pid, arguments[0]);
			},
			setHeaderRendererProp(columnIndex, propObj) {
				$ag.setHeaderRendererProp.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setHeaderRendererPropByDataField(dataField, propObj) {
				$ag.setHeaderRendererPropByDataField.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setHoverMode(mode) {
				return $ag.setHoverMode.call($ag, this.pid, arguments[0]);
			},
			setInfoMessage(msgHTML) {
				$ag.setInfoMessage.call($ag, this.pid, arguments[0]);
			},
			setPageRowCount(count) {
				$ag.setPageRowCount.call($ag, this.pid, arguments[0]);
			},
			setProp(obj, value) {
				$ag.setProp.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setProperty(obj, value) {
				$ag.setProperty.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setRendererProp(columnIndex, propObj) {
				$ag.setRendererProp.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setRowPosition(rowPosition) {
				$ag.setRowPosition.call($ag, this.pid, arguments[0]);
			},
			setScaleFactor(scaleFactor) {
				$ag.setScaleFactor.call($ag, this.pid, arguments[0]);
			},
			setSelectionAll() {
				$ag.setSelectionAll.call($ag, this.pid);
			},
			setSelectionBlock(startRowIndex, endRowIndex, startColumnIndex, endColumnIndex) {
				$ag.setSelectionBlock.call($ag, this.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
			},
			// 셀 종류를 조회합니다. 없는 행이나 바디 셀은 null입니다.
			getBodyCellKind(rowIndex, dataField) {
				return $ag.getBodyCellKind.call($ag, this.pid, arguments[0], arguments[1]);
			},
			// 필드명으로 상위 셀과 하위 셀을 선택합니다.
			setSelectionByDataField(rowIndex, dataField) {
				$ag.setSelectionByDataField.call($ag, this.pid, arguments[0], arguments[1]);
			},
			// 시작 셀을 활성 셀로 유지하면서 필드 사이의 영역을 선택합니다.
			setSelectionBlockByDataField(startRowIndex, endRowIndex, startColDataField, endColDataField) {
				$ag.setSelectionBlockByDataField.call($ag, this.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
			},
			setSelectionByIndex(rowIndex, columnIndex) {
				$ag.setSelectionByIndex.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setSelectionColumn(startColIdx, endColIdx) {
				$ag.setSelectionColumn.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setSelectionMode(mode) {
				$ag.setSelectionMode.call($ag, this.pid, arguments[0]);
			},
			setSortCollator(collator) {
				$ag.setSortCollator.call($ag, this.pid, arguments[0]);
			},
			setSorting(sortingInfoArr, onlyLastDepthSorting) {
				$ag.setSorting.call($ag, this.pid, arguments[0], arguments[1]);
			},
			setXmlGridData(xmlData, tagName) {
				$ag.setXmlGridData.call($ag, this.pid, arguments[0], arguments[1]);
			},
			showAjaxLoader() {
				$ag.showAjaxLoader.call($ag, this.pid);
			},
			showAllColumns() {
				$ag.showAllColumns.call($ag, this.pid);
			},
			showColumnByDataField(dataField) {
				$ag.showColumnByDataField.call($ag, this.pid, arguments[0]);
			},
			showColumnGroup(dataField) {
				$ag.showColumnGroup.call($ag, this.pid, arguments[0]);
			},
			showExtraColumn(name) {
				$ag.showExtraColumn.call($ag, this.pid, arguments[0]);
			},
			showFooterLater() {
				$ag.showFooterLater.call($ag, this.pid);
			},
			showInfoMessage(msgHTML) {
				$ag.showInfoMessage.call($ag, this.pid, arguments[0]);
			},
			showItemsOnDepth(depth) {
				$ag.showItemsOnDepth.call($ag, this.pid, arguments[0]);
			},
			showToastMessage(rowIndex, columnIndex, message) {
				$ag.showToastMessage.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			syncGridData(gridData, stateCache) {
				$ag.syncGridData.call($ag, this.pid, arguments[0], arguments[1]);
			},
			unbind(name) {
				$ag.unbind.call($ag, this.pid, arguments[0]);
			},
			undo() {
				$ag.undo.call($ag, this.pid);
			},
			undoable() {
				return $ag.undoable.call($ag, this.pid);
			},
			update() {
				$ag.update.call($ag, this.pid);
			},
			updateAllToValue(dataField, value) {
				$ag.updateAllToValue.call($ag, this.pid, arguments[0], arguments[1]);
			},
			updateExpFuncAll() {
				$ag.updateExpFuncAll.call($ag, this.pid);
			},
			updateGrouping() {
				$ag.updateGrouping.call($ag, this.pid);
			},
			updateRow(item, rowIndex, isMarkEdited) {
				$ag.updateRow.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			updateRowBlockToValue(startRowIndex, endRowIndex, dataFields, values) {
				$ag.updateRowBlockToValue.call($ag, this.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
			},
			updateRows(items, rowIndexes, isMarkEdited) {
				$ag.updateRows.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
			},
			updateRowsById(items, isMarkEdited) {
				$ag.updateRowsById.call($ag, this.pid, arguments[0], arguments[1]);
			},
			validateChangedGridData(requireFields, message) {
				return $ag.validateChangedGridData.call($ag, this.pid, arguments[0], arguments[1]);
			},
			validateGridData(requireFields, message) {
				return $ag.validateGridData.call($ag, this.pid, arguments[0], arguments[1]);
			},
			validateGridDataByFunc(requireFields, validFunc, message, onlyByFunc) {
				return $ag.validateGridDataByFunc.call($ag, this.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
			}
		}
	};

	export const agUtils = {
		isCreated: $ag.isCreated,
		// Grid ID 없이 엔진의 진입점을 그대로 전달합니다. 제공 보류 엔진의 DISABLED 오류도 유지합니다.
		getPluginRuntime: $ag.getPluginRuntime,
		formatDate: $ag.formatDate,
		formatNumber: $ag.formatNumber,
		getActiveGrid: $ag.getActiveGrid,
		getCreatedGridAll: $ag.getCreatedGridAll,
		makeValueMasked: $ag.makeValueMasked,
		makeValueUnmasked: $ag.makeValueUnmasked,
		releaseDate: $ag.releaseDate,
		version: $ag.version
	};
</script>
<template>
	<div v-bind:id="id"></div>
</template>
