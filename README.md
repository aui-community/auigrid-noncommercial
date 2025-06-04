# AUIGrid Non-Commercial

AUIGrid 는 Active-X 사용 없이 자바스크립트와 HTML, CSS 로 작성된 웹 데이터그리드(DataGrid) 입니다.

AUIGrid 는 상용 라이선스(Enterprise License) 와 비상용 라이선스(Non-Commercial License)가 존재합니다.

이 패키지는 비상용 라이선스(Non-Commercial License)에 해당되므로 사용을 원하는 분은 라이선스 세부항목 확인 후 사용하십시오.

## 무료 라이선스 사용권 부여 및 제한

비상용 목적의 로컬호스트(localhost, 127.0.0.1) 환경에서 영구적으로 사용 가능합니다.

상용 라이선스와 비상용 라이선스 상의 기능적 제한은 없습니다.

모두 동일한 기능을 제공합니다.

자세한 사항은 다음의 허가된 사용 및 금지된 사용, 상업적 이용에 대하여 확인하십시오.

1 허용된 사용

귀하는 다음과 같은 비상업적 목적으로 소프트웨어를 사용할 수 있습니다:

-   교육, 학술 및 연구 목적
-   개인적 용도
-   테스트, 개발 및 데모 목적으로 사용
-   로컬호스트(localhost, 127.0.0.1) 환경에서의 사용

2 금지된 사용

귀하는 다음과 같은 상업적 용도로 소프트웨어를 사용할 수 없습니다:

-   비즈니스 또는 전문적인 운영 목적
-   소프트웨어 또는 그 수정본을 라이선스, 임대, 교환, 판매하는 행위
-   상업 제품 또는 서비스에 소프트웨어를 포함하는 행위
-   정부 기관 또는 국제 기구에서의 사용

3 비상업적 평가 목적

기업 직원은 상업적 환경이 아닌 환경에서 평가, 개발 및 테스트 목적으로만 소프트웨어를 사용할 수 있습니다.

4 상업적 이용 안내

소프트웨어를 상업적 목적으로 사용하려면 라이선스 제공자와 협의하여 적절한 라이선스를 구매해야 합니다.
상업적 사용이 필요한 경우 당사(aui@auisoft.net)에 문의해 주시기 바랍니다.
상세한 상업 라이선스에 대한 내용은 https://www.auisoft.net 에서 확인 가능합니다.

5 로컬호스트 사용 제한

본 소프트웨어는 로컬호스트(localhost, 127.0.0.1) 환경에서만 사용이 허용됩니다.
외부 웹 서버에 업로드하여 별도의 접속 도메인이나 접속 IP가 존재하는 경우, 유효한 상업용 라이선스를 구매해야 합니다.

## 디렉토리 설명

-   AUIGrid : AUIGrid 라이브러리와 스타일(css) 가 있는 디렉토리입니다.
    실제로 AUIGrid 를 사용할 때 이 디렉토리만 복사해서 사용하십시오.

-   AUIGrid-React : AUIGrid 를 React.js 라이브러리에서 사용토록 작성된 서브 컴포넌트입니다.

-   AUIGrid-Vue : AUIGrid 를 Vue.js 프레임워크에서 사용토록 작성된 서브 컴포넌트입니다.

-   dist : AUIGrid 디렉토리와 동일합니다. CDN 배포를 위해 추가된 디렉토리입니다.

-   documentation : AUIGrid 다큐멘트 문서가 있습니다.
    index.html 파일을 실행하십시오.

-   export_server_samples : 엑셀, CSV, PDF 등 내보내기 할 때 서버사이드에서 처리할 예제가 있습니다.
    PHP, JSP, ASP 소스 샘플이 있으니 맞는 서버 사이드를 선택해서 사용하십시오.

-   pdfkit : PDF 출력을 위한 라이브러리가 있습니다.
    PDF 저장 기능을 사용할 때만 필요한 라이브러리이니 참고하십시오.

-   samples : 개별적인 모든 샘플이 있는 디렉토리입니다.

-   samples-React.js : React.js 라이브러리에서의 샘플이 있는 디렉토리입니다.

-   samples-React.tsx : React.js + Typescript 라이브러리에서의 샘플이 있는 디렉토리입니다.

-   samples-Vue.js : Vue.js 프레임워크에서의 샘플이 있는 디렉토리입니다.

-   samples-Vue.ts : Vue.js + Typescript 프레임워크에서의 샘플이 있는 디렉토리입니다.

## CDN 사용

기본 제공되는 jsDelivr CDN 의 dist 디렉토리를 사용하십시오.

기본적으로 다음 3개의 JS와 CSS를 HTML 파일에 추가해서 CDN 사용 가능합니다.

```html
<!-- 실제적인 AUIGrid 라이브러리입니다. 그리드 출력을 위해 꼭 삽입하십시오.-->
<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid.js"></script>

<!-- AUIGrid 라이선선스 파일입니다. 그리드 출력을 위해 꼭 삽입하십시오. -->
<script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGridLicense.js"></script>

<!-- AUIGrid 테마 CSS 파일입니다. 그리드 출력을 위해 꼭 삽입하십시오. -->
<!-- 원하는 테마가 있다면, 다른 파일로 교체 하십시오. -->
<link href="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid_style.css" rel="stylesheet" />
```

## 기본적인 사용방법

```HTML
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Script-Type" content="text/javascript" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- 실제적인 AUIGrid 라이브러리입니다. 그리드 출력을 위해 꼭 삽입하십시오.-->
    <script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid.js"></script>
    <!-- AUIGrid 라이선선스 파일입니다. 그리드 출력을 위해 꼭 삽입하십시오. -->
    <script src="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGridLicense.js"></script>
    <!-- AUIGrid 테마 CSS 파일입니다. 그리드 출력을 위해 꼭 삽입하십시오. -->
    <!-- 원하는 테마가 있다면, 다른 파일로 교체 하십시오. -->
    <link href="https://cdn.jsdelivr.net/gh/aui-community/auigrid-noncommercial@main/dist/AUIGrid_style.css" rel="stylesheet" />
    <script>
    // AUIGrid 생성 후 반환 ID
    let myGridID;

    document.addEventListener("DOMContentLoaded", () => {
      // 칼럼 레이아웃 정의
      const columnLayout = [
        { dataField: "name", headerText: "Name", width: 140 },
        { dataField: "country", headerText: "Country", width: 120 },
        { dataField: "product", headerText: "Product", width: 120 },
        { dataField: "quantity", headerText: "Quantity" },
        { dataField: "price", headerText: "Price", dataType: "numeric" },
        { dataField: "date", headerText: "Date" }
      ];

      // 그리드 속성 설정
      const gridProps = {
        editable: true
      };

      // 실제로 #grid_wrap 에 그리드 생성
      myGridID = AUIGrid.create("#grid_wrap", columnLayout, gridProps);

      // 그리드 cellClick 이벤트 바인딩
      AUIGrid.bind(myGridID, "cellClick", function(event) {
        console.log(event);
        // 그리드 셀 클릭 시 알림 창
        alert(`${event.type} 이벤트, 클릭한 값: ${event.value}`);
      });

      // 데이터 로딩
      fetch("./data/normal_100.json")
        .then(response => {
          if (!response.ok) throw new Error("HTTP error " + response.status);
          return response.json();
        })
        .then(data => {
          // 그리드에 데이터 JSON 데이터 삽입
          AUIGrid.setGridData(myGridID, data);
        })
        .catch(error => {
          alert("데이터 요청 실패: " + error.message);
        });
    });
  </script>
</head>
<body>
    <div id="grid_wrap" style="width:800px;height:480px;"></div>
</body>
</html>
```

## 기술 지원 및 유지보수

-   기술 지원: Non-Commercial 사용자는 공식적인 기술 지원을 받을 수 없습니다.
-   업데이트 및 유지보수: Non-Commercial 사용자를 위한 소프트웨어 업데이트를 제공할 의무가 없습니다.
-   Non-Commercial 사용자의 유지보수 및 보안 패치는 당사의 재량에 따라 제공될 수 있습니다.
