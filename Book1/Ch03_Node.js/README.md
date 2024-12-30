Chapter 03: Node.js

1. Node.js 란? 
2. 설치 방법
    - 이하 생략 
3. npm (node package manager)
    - 여러 파일을 하나의 파일처럼 관리해주는 단위
    - 최상위 폴더인 '루트 폴더' 존재 
    - 패키지 만들기 
        a. 'npm init' 명령어 입력
            -> node package manager 초기화 명령어 
            -> 최소한의 구성요소 자동 생성 
        b. 명령어 입력 후, page 이름, 버전, 등 필요사항에 대한 내용 및 확인(Enter Key) 입력
        c. 'Is This Ok?' 에 대한 질문에 대하여 'Enter' Key 입력하면 패키지 초기화 완료됨
        d. 초기화가 완료되면, 'package.json'이라는 파일이 생성되어 있음 
    - 'package.json'
        * 구성 항목
            a. name: 패키지 이름  
            b. version: 패키지 버전   
            c. description: 패키지 설명 (보통 패키지를 구성한 프로그램 관련 설명을 작성)  
            d. main: 패키지의 소스 코드 파일 중 메인 역할을 담당하는 소스 코드 파일  
            e. scripts: 패키지를 쉽게 다루기 위해 지정한 매크로 명령어   
            f. author: 패키지를 만든 사람  
            g. license: 패키지의 라이선스  
        * 예시   
            <img src="./ex_packagejson_conf.png" width="200" height="200"/>
            