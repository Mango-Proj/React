# Chapter 04: Start React

<hr/>

## React 란? 
- Node.js 라이브러리 중 하나
- 복잡한 웹 서비스를 빠르고 쉽게 개발하는데 용이 
- 페이스북에서 개발 및 관리
- 특성 
    + 컴포넌트 기반의 유연성
        + 신규 기능 추가 혹은 기존 기능 개선 시 코드 수정 용이 
        + '모듈화'
            + 여러 페이지에서 공통으로 사용되는 코드들을 하나의 모듈들로 구성
            + '컴포넌트' 단위의 모듈을 만들어놓고 필요할 때 호출하여 사용
            + '컴포넌트'?: 페이지를 구성하는 요소 (단위)

    + 쉽고 간단한 업데이트 
        + 교체가 필요한 요소를 삭제하고, 새롭게 수정사항을 반영한 요소를 다시 생성하여 통째로 업데이트 

    + 빠른 업데이트 
        + 'Virtual DOM'(실제 DOM의 사본 역할) 이용
        + 페이지 내 변경사항 발생 시, Virtual DOM에 변경사항을 업데이트하며 해당 내용들을 모았다가 한번에 실제 DOM을 업데이트
        + 여러 번의 업데이트를 한번에 처리하기 때문에, 업데이트 빈도가 잦아도 브러우저 성능이 저하되지 않음

## Create React App
- React App 생성 
    + command: 'npx create-react-app .'
        + npx
            + 'Node Package Execute' (노드 패키지 실행) 명령어
            + npm과 같이 Node.js가 설치될 때 같이 설치됨
            + 해당 명령어를 이용하면 특정 라이브러리를 항상 '최신' 버전으로 실행 가능 
        + '.'
            + 현재 폴더를 의미 
            + 별도의 폴더 생성 없이 현재 위치한 폴더에 라이브러리들을 설치하겠다는 의미 
        + 앱 생성시 주의 사항
            + 폴더 명: 리액트 앱 생성 규칙으로 폴더명에 대문자가 들어가면 안됨.
            + 앱 생성이 너무 오래걸리는 경우 (보통 5분 내외 소요) 네트워크 환경 변경해볼 것 
            + Node.js LTS버전에서 실행할 것 

- React App 구성 요소 
    + Node.js 패키지 
        + 동일한 구성 항목 존재  
            + 'package.json', 'package-lock.json', 'node_modules'

    + React App이 별도로 자동으로 생성한 폴더
        + 흔히 'Template' 이라고 부름
        + 구성 요소: 
            + 'public': 리액티에서 공통으로 사용하는 파일들 저장 폴더 
            + 'src': 프로그래밍 소스 저장 및 관리 폴더

    + 'package.json'의 'dependcies'
         + 생성한 리액트 앱 내 라이브러리 관련 정보 확인 가능 

- React App 실행
    + 'npm run start' 명령어 입력 
    + 그 후 리액트 앱 주소인 'https://localhost:3000'에 접속
    + 'Ctrl+C' 입력 후 'y' 입력 후 엔터 키 입력하면 App 실행 종료 

    + (별도로 발생한 ERROR) : Can't resolve 'web-vitals'. 
        + 'npm i web-vitals --save-dev' 명령어를 실행하여 web-vitals 설치하여 해결 