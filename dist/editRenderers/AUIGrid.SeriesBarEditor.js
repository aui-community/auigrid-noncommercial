/*!
 * AUIGrid Non-Commercial v3.0.20.1 - Series bar edit renderer sample
 * Copyright (c) AUISoft Co., Ltd. All rights reserved.
 *
 * AUIGrid 예제 파일입니다. AUIGrid 사용권 범위 안에서 이 파일을 복사하거나 수정하여 사용할 수 있습니다.
 * 이 허용은 이 예제 파일에만 적용되며 AUIGrid.js에는 적용되지 않습니다.
 * This is an AUIGrid sample file. You may copy and modify it for use with AUIGrid within the
 * scope of your AUIGrid license. This permission applies only to this sample file, not to AUIGrid.js.
 * License: https://github.com/aui-community/auigrid-noncommercial/blob/main/LICENSE
 */
/*
 * AUIGrid 사용자 정의 에디트 렌더러 - 시리즈 막대 편집기
 *
 * 숫자 시리즈를 막대그래프로 띄워 값을 편집합니다. 데모는 SparkColumnRenderer로 월별 값을 표시합니다.
 * 막대를 위아래로 끌거나 막대 칸을 클릭하여 값을 지정하고, 선택한 값은 숫자로 직접 입력할 수 있습니다.
 * ←/→는 항목 선택, ↑/↓는 step만큼 증감하며 Shift를 함께 누르면 10배로 조절합니다.
 * 전체 +10%/-10%와 비교 시리즈 복사를 지원하며, Enter는 확인, Esc는 취소입니다.
 *
 * 연결 파일
 *   AUIGrid.js 다음에 AUIGrid.SeriesBarEditor.js와 AUIGrid.SeriesBarEditor.css를 연결합니다.
 *   별도 외부 라이브러리는 필요하지 않습니다.
 *
 * 사용법 (그리드 속성 editable: true)
 *   {
 *     dataField: "targets",
 *     editRenderer: {
 *       type: "CustomEditRenderer",
 *       jsClass: AUIGrid.SeriesBarEditor,
 *       vPosition: "bottom",
 *       extraProps: {
 *         labels: ["1월", "2월", "3월"], // 시리즈 길이에 맞춘 항목 이름
 *         min: 0, step: 5, max: 300,
 *         unit: "백만",
 *         color: "#5b8def",
 *         colorField: "color",          // 행의 색상 필드가 color보다 우선
 *         compareField: "prev",         // 비교 시리즈 필드, 생략 가능
 *         compareLabel: "전년 실적",
 *         title: "2027 목표"            // 문자열 또는 function (item) { return item.name; }
 *       }
 *     }
 *   }
 *   행 데이터 예: { targets: "100,120,140", prev: "90,110,130", color: "#5b8def" }
 *   숫자 배열과 쉼표 문자열을 읽으며, 단일 필드에는 쉼표 문자열로 저장합니다.
 *
 * 주요 옵션 (extraProps)
 *   min은 기본 0, step은 기본 1입니다. 막대와 증감 조작은 step에 맞추며 숫자 직접 입력은 그대로 받습니다.
 *   max는 그래프의 초기 축 최대값입니다. 생략하면 값과 비교값의 최댓값에 1.25배 여유를 두어 정합니다.
 *   입력값이 커지면 축도 늘어나므로 max는 입력값 상한이 아닙니다.
 *   labels 생략 시 순번을 표시합니다. color의 기본값은 "#5b8def"입니다.
 *   title 생략 시 "값 편집", confirm과 cancel 생략 시 "확인", "취소"를 표시합니다.
 *
 * 여러 필드 방식
 *   dataField: "m1,m2,m3"이면 각 필드에서 읽습니다. compareField도 같은 형식을 지원합니다.
 *   v3.0.20.1부터 엔진이 전달하는 this.pid로 대상 그리드를 찾습니다. 별도 ID 설정은 필요 없습니다.
 *   이전 엔진을 사용하는 경우에는 extraProps.gridID를 지정할 수 있습니다.
 *   행 데이터 예: { m1: 100, m2: 120, m3: 140, "m1,m2,m3": "" }
 *   확인하면 바뀐 필드를 AUIGrid.updateRow()로 저장하고, 취소하면 기존 값을 유지합니다.
 *   extraProps.onChange를 지정하면 저장 후 { rowIndex, changes, item }을 전달합니다.
 */
/* eslint-disable */
(function () {
	function toNumbers(value) {
		if (Array.isArray(value)) return value.map(Number);
		if (value == null || value === '') return [];
		return String(value).split(',').map(function (v) {
			return Number(v.trim()) || 0;
		});
	}

	/* "m1,m2,m3" 처럼 쉼표로 구분된 필드 목록이면 배열로, 아니면 null */
	function fieldList(dataField) {
		return dataField && dataField.indexOf(',') >= 0 ? dataField.split(',').map(function (f) {
			return f.trim();
		}) : null;
	}

	/* 단일 필드(배열 / 쉼표 문자열) 또는 여러 필드에서 숫자 시리즈를 읽습니다. */
	function readSeries(item, dataField) {
		var fields = fieldList(dataField);
		if (!fields) return toNumbers(item[dataField]);
		return fields.map(function (f) {
			return Number(item[f]) || 0;
		});
	}

	/* 보기 좋은 눈금 최대값 (1, 2, 2.5, 5, 10 의 배수) */
	function niceCeil(value) {
		if (value <= 0) return 10;
		var power = Math.pow(10, Math.floor(Math.log10(value)));
		var steps = [1, 2, 2.5, 5, 10];
		for (var i = 0; i < steps.length; i++) {
			if (steps[i] * power >= value) return steps[i] * power;
		}
		return 10 * power;
	}

	/* 소수 둘째 자리까지, 천 단위 구분 */
	function format(n) {
		return (Math.round(n * 100) / 100).toLocaleString('ko-KR');
	}

	window.AUIGrid.SeriesBarEditor = window.AUIGrid.Class({
		/****************************************************************
		 *
		 * Overriden Properties
		 *
		 ****************************************************************/

		tagName: 'div',
		element: null,
		cssClass: 'aui-grid-edit-renderer-custom aui-grid-edit-renderer-custom-series',
		data: null,
		columnData: null,
		columnIndex: -1,
		rowIndex: -1,
		dataField: '',

		/* v3.0.20.1부터 엔진이 create() 전에 전달하는 소유 그리드 ID */
		pid: '',
		extraProps: null,

		/****************************************************************
		 *
		 * Private Properties (규칙 : __ 로 시작)
		 *
		 ****************************************************************/

		__values: null,
		__original: '',
		__compare: null,
		__max: 0,
		__selected: 0,
		__injected: false,
		__drag: null,

		__plot: null,
		__slots: null,
		__axis: null,
		__summary: null,
		__valueInput: null,
		__valueLabel: null,

		/****************************************************************
		 *
		 * Overriden Methods
		 *
		 ****************************************************************/

		create: function () {
			var props = this.extraProps || {};
			var item = this.data;
			var element = this.element;

			var labels = props.labels || [];
			var values = readSeries(item, this.dataField);
			var count = labels.length || values.length;
			this.__values = [];
			for (var i = 0; i < count; i++) this.__values.push(values[i] || 0);
			this.__original = this.__values.join(',');
			// 여러 필드는 소유 그리드에 저장합니다. 이전 엔진의 gridID 설정도 계속 지원합니다.
			this.__fields = fieldList(this.dataField);
			this.__multi = !!(this.__fields && (this.pid || props.gridID));
			this.__closed = false;
			this.__labels = labels.length ? labels : this.__values.map(function (v, idx) {
				return String(idx + 1);
			});
			this.__compare = props.compareField ? readSeries(item, props.compareField) : null;
			this.__step = props.step || 1;
			this.__min = props.min != null ? props.min : 0;
			this.__max = props.max || niceCeil(Math.max.apply(null, this.__values.concat(this.__compare || [], [1])) * 1.25);

			this.__onPointerDown = this.__onPointerDown.bind(this);
			this.__onPointerMove = this.__onPointerMove.bind(this);
			this.__onPointerUp = this.__onPointerUp.bind(this);
			this.__onKeyDown = this.__onKeyDown.bind(this);
			this.__onValueInput = this.__onValueInput.bind(this);
			this.__onToolClick = this.__onToolClick.bind(this);

			// 제목 + 요약
			var head = this.__el('div', 'sbe-head');
			var title = this.__el('div', 'sbe-title');
			title.textContent = (typeof props.title === 'function' ? props.title(item) : props.title) || '값 편집';
			this.__summary = this.__el('div', 'sbe-summary');
			head.append(title, this.__summary);
			element.appendChild(head);

			// 차트 : 세로 눈금 + 막대 영역
			var chart = this.__el('div', 'sbe-chart');
			this.__axis = this.__el('div', 'sbe-axis');
			this.__plot = this.__el('div', 'sbe-plot');
			this.__slots = [];
			this.__values.forEach(function (v, idx) {
				var slot = this.__el('div', 'sbe-slot');
				slot.dataset.index = idx;
				var compare = this.__el('i', 'sbe-compare');
				var bar = this.__el('i', 'sbe-bar');
				bar.style.background = (props.colorField && item[props.colorField]) || props.color || '#5b8def';
				var value = this.__el('span', 'sbe-value');
				var label = this.__el('span', 'sbe-label');
				label.textContent = this.__labels[idx];
				slot.append(compare, bar, value, label);
				this.__plot.appendChild(slot);
				this.__slots.push({ slot: slot, bar: bar, compare: compare, value: value });
			}, this);
			this.__plot.addEventListener('pointerdown', this.__onPointerDown);
			chart.append(this.__axis, this.__plot);
			element.appendChild(chart);

			// 하단 : 선택 항목 입력 + 도구 + 버튼
			var foot = this.__el('div', 'sbe-foot');
			var edit = this.__el('label', 'sbe-edit');
			this.__valueLabel = this.__el('span');
			this.__valueInput = this.__el('input');
			this.__valueInput.type = 'number';
			this.__valueInput.step = this.__step;
			this.__valueInput.min = this.__min;
			this.__valueInput.addEventListener('input', this.__onValueInput);
			var unit = this.__el('span', 'sbe-unit');
			unit.textContent = props.unit || '';
			edit.append(this.__valueLabel, this.__valueInput, unit);

			var tools = this.__el('div', 'sbe-tools');
			var toolDefs = [
				['up', '+10%'],
				['down', '-10%']
			];
			if (this.__compare) toolDefs.push(['copy', (props.compareLabel || '비교값') + ' 복사']);
			// 기존 사용자 정의 편집기와 같은 확인, 취소 순서로 배치합니다.
			toolDefs.push(['confirm', props.confirm || '확인'], ['cancel', props.cancel || '취소']);
			toolDefs.forEach(function (def) {
				var btn = this.__el('button', 'sbe-btn sbe-' + def[0]);
				btn.type = 'button';
				btn.dataset.tool = def[0];
				btn.textContent = def[1];
				tools.appendChild(btn);
			}, this);
			tools.addEventListener('click', this.__onToolClick);
			this.__tools = tools;
			foot.append(edit, tools);
			element.appendChild(foot);

			element.tabIndex = 0;
			element.addEventListener('keydown', this.__onKeyDown);

			this.__drawAxis();
			this.__render();
			// 팝업 배치 후 포커스를 주되, 먼저 닫혔으면 예약을 해제합니다.
			this.__focusTimer = setTimeout(
				function () {
					if (this.element) this.element.focus();
				}.bind(this)
			);
		},

		destroy: function (unload) {
			// 제거는 정리만 담당합니다. API 취소나 그리드 제거가 값을 저장하지 않게 합니다.
			clearTimeout(this.__focusTimer);
			this.__stopDrag();
			if (this.__plot) this.__plot.removeEventListener('pointerdown', this.__onPointerDown);
			if (this.__valueInput) this.__valueInput.removeEventListener('input', this.__onValueInput);
			if (this.__tools) this.__tools.removeEventListener('click', this.__onToolClick);
			if (this.element) this.element.removeEventListener('keydown', this.__onKeyDown);
			this.__plot = null;
			this.__slots = null;
			this.__axis = null;
			this.__summary = null;
			this.__valueInput = null;
			this.__valueLabel = null;
			this.__tools = null;
			this.$super.destroy(unload);
		},

		triggerEditEndEvent: function (newValue, which) {
			this.$super.triggerEditEndEvent(newValue, which);
		},

		triggerEditCancelEvent: function (which) {
			this.$super.triggerEditCancelEvent(which);
		},

		// 확인, 바깥 클릭 및 공개 API의 완료/취소를 같은 경로로 처리합니다.
		triggerEditComplete: function (cancel, which) {
			if (this.__multi && !this.__closed) {
				this.__closed = true;
				if (!cancel) this.__saveFields();
			}
			// 여러 필드의 저장은 updateRow가 맡고 조합 dataField는 빈값을 유지합니다.
			this.$super.triggerEditComplete(this.__multi ? true : cancel, which);
		},

		injectValue: function (value) {
			this.$super.injectValue(value);
		},

		/****************************************************************
		 *
		 * Private Methods (규칙 : __ 로 시작)
		 *
		 ****************************************************************/

		__el: function (tag, className) {
			var el = document.createElement(tag);
			if (className) el.className = className;
			return el;
		},

		__snap: function (value) {
			var step = this.__step;
			var snapped = Math.round(value / step) * step;
			// 부동소수점 오차 정리
			snapped = Math.round(snapped * 1e6) / 1e6;
			return Math.max(this.__min, snapped);
		},

		/* 세로 눈금 (0, 25, 50, 75, 100%) */
		__drawAxis: function () {
			this.__axis.textContent = '';
			for (var i = 0; i <= 4; i++) {
				var tick = this.__el('span', 'sbe-tick');
				tick.style.bottom = i * 25 + '%';
				tick.textContent = format((this.__max * i) / 4);
				this.__axis.appendChild(tick);
			}
		},

		__render: function () {
			var values = this.__values;
			var compare = this.__compare;
			var max = this.__max;
			this.__slots.forEach(function (s, idx) {
				var v = values[idx];
				s.bar.style.height = Math.min(100, (v / max) * 100) + '%';
				s.value.textContent = format(v);
				s.value.style.bottom = 'calc(' + Math.min(100, (v / max) * 100) + '% + 2px)';
				if (compare) {
					s.compare.style.height = Math.min(100, ((compare[idx] || 0) / max) * 100) + '%';
				} else {
					s.compare.style.display = 'none';
				}
				s.slot.classList.toggle('sbe-selected', idx === this.__selected);
			}, this);

			// 요약 : 합계, 평균, 비교 대비
			var props = this.extraProps || {};
			var sum = values.reduce(function (a, b) {
				return a + b;
			}, 0);
			var text = '합계 ' + format(sum) + (props.unit ? ' ' + props.unit : '') + ', 평균 ' + format(sum / values.length);
			if (compare) {
				var prev = compare.reduce(function (a, b) {
					return a + b;
				}, 0);
				if (prev) {
					var rate = ((sum - prev) / prev) * 100;
					text += ', ' + (props.compareLabel || '비교') + ' 대비 ' + (rate >= 0 ? '+' : '') + rate.toFixed(1) + '%';
				}
			}
			this.__summary.textContent = text;

			// 선택 항목 입력칸 (입력 중이면 덮어쓰지 않음)
			this.__valueLabel.textContent = this.__labels[this.__selected];
			if (document.activeElement !== this.__valueInput) this.__valueInput.value = values[this.__selected];

			// 여러 필드 방식은 편집기가 직접 저장하므로 값을 주입하지 않습니다. (주입하면 쉼표 dataField 에 저장됨)
			if (this.__multi) return;

			// 외부 요인(다른 셀 클릭 등)으로 끝나도 적용되도록, 바뀐 경우에만 주입합니다.
			var current = values.join(',');
			if (current !== this.__original) {
				this.__injected = true;
				this.injectValue(current);
			} else if (this.__injected) {
				this.injectValue(current);
			}
		},

		/* 막대 영역의 y 좌표 -> 값 */
		__valueAt: function (clientY) {
			var rect = this.__plot.getBoundingClientRect();
			var ratio = (rect.bottom - clientY) / rect.height;
			return this.__snap(Math.min(1, Math.max(0, ratio)) * this.__max);
		},

		__onPointerDown: function (event) {
			var slot = event.target.closest('.sbe-slot');
			if (!slot || event.button !== 0) return;
			event.preventDefault();
			event.stopPropagation();
			var index = Number(slot.dataset.index);
			this.__selected = index;
			this.__values[index] = this.__valueAt(event.clientY);
			this.__drag = { index: index, pointerId: event.pointerId };
			try {
				this.__plot.setPointerCapture(event.pointerId);
			} catch (e) {}
			this.__plot.addEventListener('pointermove', this.__onPointerMove);
			this.__plot.addEventListener('pointerup', this.__onPointerUp);
			this.__plot.addEventListener('pointercancel', this.__onPointerUp);
			this.element.classList.add('sbe-dragging');
			this.__render();
		},

		__onPointerMove: function (event) {
			if (!this.__drag) return;
			this.__values[this.__drag.index] = this.__valueAt(event.clientY);
			this.__render();
		},

		__onPointerUp: function () {
			this.__stopDrag();
			if (this.element) this.element.focus();
		},

		__stopDrag: function () {
			if (!this.__drag || !this.__plot) return;
			try {
				this.__plot.releasePointerCapture(this.__drag.pointerId);
			} catch (e) {}
			this.__plot.removeEventListener('pointermove', this.__onPointerMove);
			this.__plot.removeEventListener('pointerup', this.__onPointerUp);
			this.__plot.removeEventListener('pointercancel', this.__onPointerUp);
			this.__drag = null;
			if (this.element) this.element.classList.remove('sbe-dragging');
		},

		__onValueInput: function () {
			var n = Number(this.__valueInput.value);
			if (this.__valueInput.value === '' || isNaN(n)) return;
			this.__values[this.__selected] = Math.max(this.__min, n);
			// 입력값이 눈금을 넘으면 눈금을 넓힙니다.
			if (n > this.__max) {
				this.__max = niceCeil(n * 1.1);
				this.__drawAxis();
			}
			this.__render();
		},

		__onToolClick: function (event) {
			var tool = event.target.dataset && event.target.dataset.tool;
			if (!tool) return;
			if (tool === 'confirm') return this.__onConfirm();
			if (tool === 'cancel') return this.__cancel();
			if (tool === 'up' || tool === 'down') {
				var rate = tool === 'up' ? 1.1 : 0.9;
				this.__values = this.__values.map(function (v) {
					return this.__snap(v * rate);
				}, this);
				var top = Math.max.apply(null, this.__values);
				if (top > this.__max) {
					this.__max = niceCeil(top * 1.1);
					this.__drawAxis();
				}
			} else if (tool === 'copy' && this.__compare) {
				this.__values = this.__values.map(function (v, idx) {
					return this.__snap(this.__compare[idx] || 0);
				}, this);
			}
			this.__render();
		},

		__onKeyDown: function (event) {
			var inInput = event.target === this.__valueInput;
			var key = event.key;
			if (key === 'Enter') {
				event.preventDefault();
				event.stopPropagation();
				this.__onConfirm();
			} else if (key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				this.__cancel();
			} else if (!inInput && (key === 'ArrowLeft' || key === 'ArrowRight')) {
				event.preventDefault();
				event.stopPropagation();
				var count = this.__values.length;
				this.__selected = (this.__selected + (key === 'ArrowLeft' ? count - 1 : 1)) % count;
				this.__render();
			} else if (!inInput && (key === 'ArrowUp' || key === 'ArrowDown')) {
				event.preventDefault();
				event.stopPropagation();
				var delta = this.__step * (event.shiftKey ? 10 : 1) * (key === 'ArrowUp' ? 1 : -1);
				var next = this.__snap(this.__values[this.__selected] + delta);
				this.__values[this.__selected] = next;
				if (next > this.__max) {
					this.__max = niceCeil(next * 1.1);
					this.__drawAxis();
				}
				this.__render();
			} else {
				// 그리드의 셀 이동 등 키 처리로 전달되지 않게 합니다.
				event.stopPropagation();
			}
		},

		__onConfirm: function () {
			var current = this.__values.join(',');
			// 바뀐 것이 없으면 수정 표시가 남지 않도록 취소로 닫습니다.
			if (current === this.__original) {
				this.__cancel();
				return;
			}
			this.triggerEditEndEvent(current);
		},

		__cancel: function () {
			this.__closed = true;
			this.triggerEditCancelEvent();
		},

		/* 여러 필드 방식 : 바뀐 필드만 updateRow 로 저장하고 onChange 를 호출합니다. */
		__saveFields: function () {
			var props = this.extraProps || {};
			// 엔진이 주입한 ID를 우선해 같은 편집기를 여러 그리드에서 사용할 수 있습니다.
			var gridID = this.pid || props.gridID;
			var item = this.data;
			var values = this.__values;
			var changes = {};
			this.__fields.forEach(function (f, i) {
				if (Number(item[f]) !== values[i]) changes[f] = values[i];
			});
			if (!Object.keys(changes).length) return;

			var rowIndex = this.rowIndex;
			var rowId = item[window.AUIGrid.getProp(gridID, 'rowIdField')];
			var onChange = typeof props.onChange === 'function' ? props.onChange : null;
			// 편집기가 닫힌 뒤 행 ID로 대상을 다시 찾고, 제거된 그리드나 행이면 저장하지 않습니다.
			setTimeout(function () {
				if (!window.AUIGrid.isCreated(gridID)) return;
				rowIndex = window.AUIGrid.rowIdToIndex(gridID, rowId);
				if (rowIndex < 0) return;
				window.AUIGrid.updateRow(gridID, changes, rowIndex);
				if (onChange) onChange({ rowIndex: rowIndex, changes: changes, item: window.AUIGrid.getItemByRowIndex(gridID, rowIndex) });
			});
		}
	}).extend(window.AUIGrid.EditRendererBase);
})();
