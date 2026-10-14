# AUIGrid Non-Commercial

AUIGrid는 자바스크립트, HTML, CSS만으로 작성된 웹 데이터그리드(DataGrid)입니다. 순수 JavaScript는 물론 React, Vue에서도 사용할 수 있습니다.

AUIGrid에는 상용 라이선스(Enterprise License)와 비상용 라이선스(Non-Commercial License)가 있으며, 이 패키지는 **비상용 라이선스**에 해당합니다.

- 비상업적 목적으로 로컬호스트(`localhost`, `127.0.0.1`) 환경에서 영구적으로 무료 사용할 수 있습니다.
- 상용 라이선스와 기능 차이가 없습니다. 모두 동일한 기능을 제공합니다.
- 로컬호스트 외의 접속 도메인이나 접속 IP에서 평가하려면 [30일 평가판](https://www.auisoft.net/dcenter.html)을 이용하십시오.
- 사용 전에 [LICENSE](./LICENSE) 파일을 반드시 확인하십시오. 아래 [라이선스](#라이선스) 항목은 요약입니다.

## 목차

- [빠른 시작 (CDN)](#빠른-시작-cdn)
- [기본 사용 방법](#기본-사용-방법)
- [엑셀·PDF 내보내기](#엑셀pdf-내보내기)
- [데모와 샘플 실행](#데모와-샘플-실행)
- [디렉토리 구성](#디렉토리-구성)
- [MCP 서버](#mcp-서버)
- [라이선스](#라이선스)
- [기술 지원 및 유지보수](#기술-지원-및-유지보수)
- [문의](#문의)

## 빠른 시작 (CDN)

jsDelivr CDN으로 제공되는 `dist` 디렉토리를 사용합니다. 아래 3개 파일을 HTML에 추가하면 됩니다. **라이선스 파일을 엔진보다 먼저** 불러오십시오.

```html
<!-- AUIGrid 라이선스 파일 (필수) - AUIGrid.js 보다 먼저 불러옵니다. -->
<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGridLicense.js"></script>

<!-- AUIGrid 라이브러리 (필수) -->
<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid.js"></script>

<!-- AUIGrid 테마 CSS (필수) - 원하는 테마가 있다면 다른 파일로 교체하십시오. -->
<link href="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid_style.css" rel="stylesheet" />
```

| 파일                | 설명                    |
| ------------------- | ----------------------- |
| `AUIGridLicense.js` | AUIGrid 라이선스 파일   |
| `AUIGrid.js`        | AUIGrid 라이브러리 본체 |
| `AUIGrid_style.css` | AUIGrid 테마 CSS        |

> **반드시 로컬 웹 서버로 여십시오.** 비상업판은 `http://localhost` 또는 `http://127.0.0.1` 주소에서만 동작합니다.
> 파일 탐색기에서 HTML을 더블 클릭하여 `file://` 주소로 열면 라이선스 확인이 되지 않습니다.
>
> ```bash
> python -m http.server 8080 --bind 127.0.0.1
> ```
>
> 위 명령을 HTML 파일이 있는 폴더에서 실행한 뒤 `http://127.0.0.1:8080/` 으로 접속합니다. 환경에 따라 `python` 대신 `python3` 또는 `py -3` 을 사용하며, VS Code Live Server 등 다른 로컬 서버를 써도 됩니다.

## 기본 사용 방법

아래 내용을 `index.html` 로 저장하고 로컬 웹 서버로 열면 바로 그리드가 나타납니다.

```html
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>AUIGrid 시작하기</title>

		<!-- AUIGrid 라이선스 파일 (필수) - AUIGrid.js 보다 먼저 불러옵니다. -->
		<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGridLicense.js"></script>
		<!-- AUIGrid 라이브러리 (필수) -->
		<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid.js"></script>
		<!-- AUIGrid 테마 CSS (필수) - 원하는 테마가 있다면 다른 파일로 교체하십시오. -->
		<link href="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid_style.css" rel="stylesheet" />
	</head>
	<body>
		<div id="grid_wrap" style="width: 800px; height: 480px"></div>

		<script>
			// 칼럼 레이아웃 정의
			const columnLayout = [
				{ dataField: 'name', headerText: 'Name', width: 140 },
				{ dataField: 'country', headerText: 'Country', width: 120 },
				{ dataField: 'product', headerText: 'Product', width: 120 },
				{ dataField: 'quantity', headerText: 'Quantity', dataType: 'numeric' },
				{ dataField: 'price', headerText: 'Price', dataType: 'numeric', formatString: '#,##0' },
				{ dataField: 'date', headerText: 'Date', width: 120 }
			];

			// 그리드 속성 설정
			const gridProps = {
				editable: true
			};

			// #grid_wrap 에 그리드 생성. 반환값(그리드 ID)은 모든 메소드의 첫 번째 인자입니다.
			const myGridID = AUIGrid.create('#grid_wrap', columnLayout, gridProps);

			// 데이터 삽입 (서버에서 받아 오려면 fetch 결과를 setGridData 에 넘기십시오)
			AUIGrid.setGridData(myGridID, [
				{ name: 'Anna', country: 'Korea', product: 'Laptop', quantity: 12, price: 1250000, date: '2026-10-01' },
				{ name: 'Lucas', country: 'Germany', product: 'Monitor', quantity: 4, price: 320000, date: '2026-10-02' },
				{ name: 'Mia', country: 'Japan', product: 'Keyboard', quantity: 30, price: 89000, date: '2026-10-03' }
			]);

			// 이벤트는 생성 후 AUIGrid.bind 로 연결합니다.
			AUIGrid.bind(myGridID, 'cellClick', (event) => {
				console.log(event.dataField, event.value);
			});
		</script>
	</body>
</html>
```

## 엑셀·PDF 내보내기

`AUIGrid.exportToXlsx()` 등으로 서버를 거치지 않고 브라우저에서 바로 파일을 저장하려면 `FileSaver.min.js` 를 함께 불러와야 합니다. 이 파일이 없으면 **오류 메시지 없이 아무 일도 일어나지 않습니다.**

```html
<!-- 파일 저장 도구: 패키지의 export_server_samples/FileSaver.min.js 를 프로젝트에 복사해 사용합니다. -->
<script src="./FileSaver.min.js"></script>
```

- PDF 내보내기는 `pdfkit/` 의 라이브러리와 글꼴이 추가로 필요합니다. 사용 방법은 `pdfkit/` 의 설명서를 참고하십시오.
- 서버에서 파일을 만들어 내려받는 방식은 `export_server_samples/` 의 예제(PHP, JSP, ASP, ASP.NET)를 참고하십시오.

## 데모와 샘플 실행

자세한 절차는 패키지의 [`설치 실행 방법.txt`](./설치%20실행%20방법.txt) 를 참고하십시오.

- **JavaScript 데모:** 패키지 전체를 로컬 웹 서버로 열고 **패키지 루트의 `index.html`** 에 접속합니다. 데모 목록에서 항목을 고르면 `samples/` 의 개별 데모가 열립니다. `samples/index.html` 을 여는 구조가 아닙니다.
- **개발 문서:** 같은 서버의 `documentation/index.html` 로 접속합니다.
- **React · Vue 샘플:** Node.js 22.12 이상과 npm이 필요합니다. 실행할 샘플의 `src/static/` 아래에 패키지 루트의 `AUIGrid/` 폴더 전체를 복사한 뒤, 해당 샘플 폴더에서 `npm install` 과 `npm run dev` 를 실행합니다.

## 디렉토리 구성

| 경로                    | 설명                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `index.html`            | 전체 JavaScript 데모 목록. 로컬 웹 서버로 이 파일에 접속합니다.                                         |
| `설치 실행 방법.txt`    | 설치, 라이선스 준비, 데모와 React·Vue 샘플 실행 안내                                                    |
| `LICENSE`               | 비상용 라이선스(AUI Non-Commercial License) 전문                                                        |
| `AUIGrid`               | AUIGrid 라이브러리, 라이선스 파일, 테마 CSS, 이미지, 렌더러. 실제 프로젝트에서는 이 폴더를 복사해 씁니다. |
| `dist`                  | `AUIGrid` 디렉토리와 동일한 내용. CDN 배포용입니다.                                                     |
| `AUIGrid-React`         | React에서 AUIGrid를 사용하기 위한 래퍼 컴포넌트 (JavaScript · TypeScript)                               |
| `AUIGrid-Vue`           | Vue에서 AUIGrid를 사용하기 위한 래퍼 컴포넌트 (JavaScript · TypeScript)                                 |
| `documentation`         | AUIGrid 개발 문서. 로컬 웹 서버로 `index.html` 에 접속합니다.                                           |
| `samples`               | 개별 기능 데모와 데모 데이터(`samples/data`)                                                            |
| `samples-React.js`      | React + JavaScript + Vite 샘플                                                                          |
| `samples-React.tsx`     | React + TypeScript + Vite 샘플                                                                          |
| `samples-Vue.js`        | Vue 3 + JavaScript + Vite 샘플                                                                          |
| `samples-Vue.ts`        | Vue 3 + TypeScript + Vite 샘플                                                                          |
| `export_server_samples` | 서버 사이드 내보내기 예제(PHP, JSP, ASP, ASP.NET)와 파일 저장 도구 `FileSaver.min.js`                   |
| `pdfkit`                | PDF 내보내기 라이브러리, 글꼴 및 사용 설명서. PDF 저장 기능을 사용할 때만 필요합니다.                   |

## MCP 서버

AI 도구에서 AUIGrid MCP 서버를 연결하면 공식 API 문서와 예제를 조회해 코드를 작성할 수 있습니다. 연결 방식은 두 가지입니다.

| 방식                   | 조건               | 사용 시점                            |
| ---------------------- | ------------------ | ------------------------------------ |
| 원격 엔드포인트 (권장) | 설치 불필요        | 일반적인 경우                        |
| 로컬 npm 패키지        | Node.js 22.12 이상 | 네트워크에서 외부 연결이 차단된 경우 |

### 원격 엔드포인트 (권장)

Streamable HTTP 방식이며 인증이 필요 없습니다.

```
https://auigrid.com/mcp
```

- URL을 정확히 그대로 사용하십시오. 끝에 슬래시(`/`)를 붙이지 않습니다.
- 브라우저에서 이 주소를 열면 405가 반환되는데, 정상 동작입니다.

### 로컬 npm 패키지

AI 도구가 npx(stdio)로 [`auigrid-mcp-server`](https://www.npmjs.com/package/auigrid-mcp-server)를 실행합니다. Node.js 22.12 이상이 필요합니다.

```bash
npx -y auigrid-mcp-server@latest
```

도구별 설정 방법(Claude Code, Codex CLI, Cursor, VS Code)은 <https://auigrid.com/#ai> 를 참고하십시오.

## 라이선스

이 패키지는 [AUI Non-Commercial License](./LICENSE)로 제공됩니다. 아래는 요약이며, **[LICENSE](./LICENSE) 전문이 우선합니다.**

### 1. 사용할 수 있는 경우

로컬호스트(`localhost`, `127.0.0.1`)에서 다음 비상업적 목적으로 영구적으로 무료 사용할 수 있습니다.

- 교육, 학술 및 연구
- 개인적 학습 및 개인 프로젝트
- 테스트, 개발 및 데모

기업이나 기관의 직원도 도입 검토를 위한 평가, 개발 및 테스트 목적으로 로컬호스트에서 사용할 수 있습니다. 이 경우에도 실제 업무 운영이나 고객 서비스에는 사용할 수 없습니다.

### 2. 할 수 없는 것

- 로컬호스트가 아닌 접속 도메인이나 접속 IP에서의 사용 (외부 웹 서버, 사내 서버, 클라우드 포함)
- 상업적 이용, 비즈니스 또는 전문적 운영 목적의 사용
- 소프트웨어나 그 수정본을 라이선스, 임대, 교환, 판매하거나 대가를 받고 제공하는 행위
- 상업 제품이나 서비스에 포함하거나 함께 배포하는 행위
- 정부 기관, 지방자치단체, 공공기관 또는 국제기구에서의 사용
- 당사의 서면 허가 없이 소프트웨어를 수정하는 행위 (문서화된 API를 사용하는 것은 수정이 아닙니다)
- 사용권 검사 등 기술적 보호 조치를 제거, 우회 또는 무력화하는 행위
- 관련 법령이 명시적으로 허용하는 경우를 제외한 역분해, 디컴파일, 디스어셈블, 리버스 엔지니어링 또는 소스코드 추출 시도
- 저작권 표시, 라이선스 표시 및 머리 주석을 제거하거나 변경하는 행위

### 3. 지적재산권과 보증

- 소프트웨어와 그 구성요소(코드, 이미지, 문서)의 지적재산권은 주식회사 에이유아이소프트에 있으며, 사용권만 부여됩니다.
- 포함된 오픈소스 구성요소는 각 오픈소스 라이선스를 따릅니다.
- 소프트웨어는 "있는 그대로(As-Is)" 제공되며, 어떠한 보증도 하지 않습니다.
- 라이선스를 위반하면 사용권은 즉시 종료되며, 사용을 중단하고 모든 사본을 삭제해야 합니다.

### 4. 로컬호스트 밖에서 사용하려면

| 목적                                     | 방법                                                                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| 도입 전 평가, 적합성 검토(PoC), 테스트   | [30일 평가판](https://www.auisoft.net/dcenter.html) (정품과 동일한 기능, 기술 지원 없음)      |
| 실제 서비스, 상업적 이용                 | [상용 라이선스 구매](https://www.auisoft.net/price.html)                                      |

## 기술 지원 및 유지보수

- **기술 지원**: 비상용 라이선스 사용자는 공식적인 기술 지원을 받을 수 없습니다.
- **업데이트**: 비상용 라이선스 사용자를 위한 소프트웨어 업데이트를 제공할 의무가 없습니다.
- **유지보수 및 보안 패치**: 당사의 재량에 따라 제공될 수 있습니다.

## 문의

상업적 사용이 필요한 경우 아래로 문의해 주시기 바랍니다.

- 이메일: <aui@auisoft.net>
- 가격 및 라이선스: <https://www.auisoft.net/price.html>
- 홈페이지: <https://www.auisoft.net>
