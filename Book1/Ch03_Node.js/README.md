# Chapter 03: Node.js

<hr/>

## Node.js 란? 
- Javascript Runtime Environment<br/>

## 설치 방법
- 이하 생략<br/>

## npm (node package manager)
- 여러 파일을 하나의 파일처럼 관리해주는 단위<br/>
- 최상위 폴더인 '루트 폴더' 존재<br/>
- 패키지 만들기<br/>
    1. 'npm init' 명령어 입력<br/>
        + node package manager 초기화 명령어<br/>
        + 최소한의 구성요소 자동 생성<br/>
    2. 명령어 입력 후, page 이름, 버전, 등 필요사항에 대한 내용 및 확인(Enter Key) 입력<br/>
        + 'Is This Ok?' 에 대한 질문에 대하여 'Enter' Key 입력하면 패키지 초기화 완료됨<br/>
        + 초기화가 완료되면, 'package.json'이라는 파일이 생성되어 있음<br/>
    3. 'package.json'  
        * 구성 항목<br/>
            + name: 패키지 이름<br/>
            + version: 패키지 버전<br/>
            + description: 패키지 설명 (보통 패키지를 구성한 프로그램 관련 설명을 작성)<br/>
            + main: 패키지의 소스 코드 파일 중 메인 역할을 담당하는 소스 코드 파일<br/>
            + scripts: 패키지를 쉽게 다루기 위해 지정한 매크로 명령어<br/>
            + author: 패키지를 만든 사람<br/>
            + license: 패키지의 라이선스<br/>
        * 예시<br/>
            <img src="./ex_packagejson_conf.png" width="600" height="400"/>
            