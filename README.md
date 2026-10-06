# AUIGrid Non-Commercial

AUIGrid는 Active-X 없이 자바스크립트, HTML, CSS만으로 작성된 웹 데이터그리드(DataGrid)입니다.

AUIGrid에는 상용 라이선스(Enterprise License)와 비상용 라이선스(Non-Commercial License)가 있으며, 이 패키지는 **비상용 라이선스**에 해당합니다.

- 비상업적 목적의 로컬호스트(`localhost`, `127.0.0.1`) 환경에서 영구적으로 무료 사용할 수 있습니다.
- 상용 라이선스와 기능 차이가 없습니다. 모두 동일한 기능을 제공합니다.
- 로컬호스트 외의 접속 도메인이나 접속 IP에서 평가하려면 [30일 평가판](https://www.auisoft.net/dcenter.html)을 이용하십시오.
- 사용 전에 아래 [라이선스](#라이선스) 항목을 반드시 확인하십시오.

## 목차

- [빠른 시작 (CDN)](#빠른-시작-cdn)
- [기본 사용 방법](#기본-사용-방법)
- [디렉토리 구성](#디렉토리-구성)
- [MCP 서버](#mcp-서버)
- [라이선스](#라이선스)
- [기술 지원 및 유지보수](#기술-지원-및-유지보수)
- [문의](#문의)

## 빠른 시작 (CDN)

jsDelivr CDN으로 제공되는 `dist` 디렉토리를 사용합니다. 아래 3개 파일을 HTML에 추가하면 됩니다.

```html
<!-- AUIGrid 라이브러리 (필수) -->
<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid.js"></script>

<!-- AUIGrid 라이선스 파일 (필수) -->
<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGridLicense.js"></script>

<!-- AUIGrid 테마 CSS (필수) - 원하는 테마가 있다면 다른 파일로 교체하십시오. -->
<link href="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid_style.css" rel="stylesheet" />
```

| 파일                | 설명                    |
| ------------------- | ----------------------- |
| `AUIGrid.js`        | AUIGrid 라이브러리 본체 |
| `AUIGridLicense.js` | AUIGrid 라이선스 파일   |
| `AUIGrid_style.css` | AUIGrid 테마 CSS        |

## 기본 사용 방법

```html
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />

		<!-- AUIGrid 라이브러리 (필수) -->
		<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid.js"></script>
		<!-- AUIGrid 라이선스 파일 (필수) -->
		<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGridLicense.js"></script>
		<!-- AUIGrid 테마 CSS (필수) - 원하는 테마가 있다면 다른 파일로 교체하십시오. -->
		<link href="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid_style.css" rel="stylesheet" />

		<script>
			// AUIGrid 생성 후 반환 ID
			let myGridID;

			document.addEventListener('DOMContentLoaded', () => {
				// 칼럼 레이아웃 정의
				const columnLayout = [
					{ dataField: 'name', headerText: 'Name', width: 140 },
					{ dataField: 'country', headerText: 'Country', width: 120 },
					{ dataField: 'product', headerText: 'Product', width: 120 },
					{ dataField: 'quantity', headerText: 'Quantity' },
					{ dataField: 'price', headerText: 'Price', dataType: 'numeric' },
					{ dataField: 'date', headerText: 'Date' }
				];

				// 그리드 속성 설정
				const gridProps = {
					editable: true
				};

				// #grid_wrap 에 그리드 생성
				myGridID = AUIGrid.create('#grid_wrap', columnLayout, gridProps);

				// cellClick 이벤트 바인딩
				AUIGrid.bind(myGridID, 'cellClick', function (event) {
					console.log(event);
					alert(`${event.type} 이벤트, 클릭한 값: ${event.value}`);
				});

				// 데이터 로딩
				fetch('./data/normal_100.json')
					.then((response) => {
						if (!response.ok) throw new Error('HTTP error ' + response.status);
						return response.json();
					})
					.then((data) => {
						// 그리드에 JSON 데이터 삽입
						AUIGrid.setGridData(myGridID, data);
					})
					.catch((error) => {
						alert('데이터 요청 실패: ' + error.message);
					});
			});
		</script>
	</head>
	<body>
		<div id="grid_wrap" style="width:800px;height:480px;"></div>
	</body>
</html>
```

## 디렉토리 구성

| 디렉토리                | 설명                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `AUIGrid`               | AUIGrid 라이브러리와 스타일(CSS). 실제 프로젝트에서는 이 디렉토리만 복사해서 사용하십시오.                            |
| `dist`                  | `AUIGrid` 디렉토리와 동일한 내용. CDN 배포용입니다.                                                                   |
| `AUIGrid-React`         | React.js에서 AUIGrid를 사용하기 위한 서브 컴포넌트                                                                    |
| `AUIGrid-Vue`           | Vue.js에서 AUIGrid를 사용하기 위한 서브 컴포넌트                                                                      |
| `documentation`         | AUIGrid 문서. `index.html` 파일을 실행하십시오.                                                                       |
| `samples`               | 개별 기능 샘플 전체                                                                                                   |
| `samples-React.js`      | React.js 샘플                                                                                                         |
| `samples-React.tsx`     | React.js + TypeScript 샘플                                                                                            |
| `samples-Vue.js`        | Vue.js 샘플                                                                                                           |
| `samples-Vue.ts`        | Vue.js + TypeScript 샘플                                                                                              |
| `export_server_samples` | 엑셀, CSV, PDF 내보내기를 서버 사이드에서 처리하는 예제 (PHP, JSP, ASP). 사용하는 서버 환경에 맞는 것을 선택하십시오. |
| `pdfkit`                | PDF 출력용 라이브러리. PDF 저장 기능을 사용할 때만 필요합니다.                                                        |

## MCP 서버

AI 도구에서 AUIGrid MCP 서버를 연결해 사용할 수 있습니다. 연결 방식은 두 가지입니다.

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

## 라이선스

이 패키지는 비상용 라이선스(Non-Commercial License)로 제공됩니다. 비상업적 목적의 로컬호스트(`localhost`, `127.0.0.1`) 환경에서 영구적으로 사용할 수 있습니다.

### 1. 허용된 사용

다음과 같은 비상업적 목적으로 소프트웨어를 사용할 수 있습니다.

- 교육, 학술 및 연구 목적
- 개인적 용도
- 테스트, 개발 및 데모 목적
- 로컬호스트(`localhost`, `127.0.0.1`) 환경에서의 사용

### 2. 금지된 사용

다음과 같은 상업적 용도로는 소프트웨어를 사용할 수 없습니다.

- 비즈니스 또는 전문적인 운영 목적
- 소프트웨어 또는 그 수정본을 라이선스, 임대, 교환, 판매하는 행위
- 상업 제품 또는 서비스에 소프트웨어를 포함하는 행위
- 정부 기관 또는 국제 기구에서의 사용

### 3. 비상업적 평가 목적

기업 직원은 상업적 환경이 아닌 환경에서 평가, 개발 및 테스트 목적으로만 소프트웨어를 사용할 수 있습니다.

### 4. 로컬호스트 사용 제한

본 소프트웨어는 로컬호스트(`localhost`, `127.0.0.1`) 환경에서만 사용이 허용됩니다.

외부 웹 서버에 업로드하여 별도의 접속 도메인이나 접속 IP가 존재하는 경우, 유효한 상용 라이선스를 구매해야 합니다. 구매 전 평가가 필요하다면 아래 30일 평가판을 이용하십시오.

### 5. 30일 평가판 안내

로컬호스트(`localhost`, `127.0.0.1`) 환경 외의 접속 도메인이나 접속 IP에서 사용하고자 하는 경우, 30일 평가판을 제공합니다.

- 평가판 라이선스는 정품과 동일한 기능을 제공합니다.
- 사전 평가, 적합성 검토(PoC), 테스트 목적으로 사용할 수 있습니다.
- 제공 기간은 30일입니다.
- 다운로드: <https://www.auisoft.net/dcenter.html>

### 6. 상업적 이용 안내

소프트웨어를 상업적 목적으로 사용하려면 라이선스 제공자와 협의하여 적절한 라이선스를 구매해야 합니다. 상용 라이선스에 대한 자세한 내용은 <https://www.auisoft.net> 에서 확인할 수 있습니다.

## 기술 지원 및 유지보수

- **기술 지원**: Non-Commercial 사용자는 공식적인 기술 지원을 받을 수 없습니다.
- **업데이트**: Non-Commercial 사용자를 위한 소프트웨어 업데이트를 제공할 의무가 없습니다.
- **유지보수 및 보안 패치**: 당사의 재량에 따라 제공될 수 있습니다.

## 문의

상업적 사용이 필요한 경우 아래로 문의해 주시기 바랍니다.

- 이메일: <aui@auisoft.net>
- 홈페이지: <https://www.auisoft.net>
