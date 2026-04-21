# ch03 · React 스타일링

React에서 컴포넌트에 스타일을 적용하는 4가지 방법을 배웁니다.  
각 방법의 특징과 장단점을 이해하고, 상황에 맞는 방법을 선택할 수 있게 됩니다.

---

## 목차

1. [바닐라 CSS — 전통적인 CSS 파일 사용](#1-바닐라-css--전통적인-css-파일-사용)
2. [인라인 스타일 — JS 객체로 스타일 정의](#2-인라인-스타일--js-객체로-스타일-정의)
3. [CSS 모듈 — 컴포넌트별 독립 스타일](#3-css-모듈--컴포넌트별-독립-스타일)
4. [CSS-in-JS (styled-components) — JS 안에 CSS 작성](#4-css-in-js-styled-components--js-안에-css-작성)
5. [4가지 방법 비교](#5-4가지-방법-비교)
6. [예제 파일 목록](#6-예제-파일-목록)

---

## 1. 바닐라 CSS — 전통적인 CSS 파일 사용

> **비유: 공용 유니폼**  
> 회사 전체가 같은 유니폼 규정을 공유하는 것처럼,  
> 바닐라 CSS는 하나의 CSS 파일이 전체 프로젝트에 영향을 미칩니다.  
> 누군가 같은 이름의 규칙을 덮어쓰면 의도치 않은 곳까지 바뀔 수 있습니다.

### 사용 방법

```jsx
// Header.jsx
import './Header.css';   // CSS 파일을 import합니다

function Header() {
  return <h1 className="title">Header</h1>;
}
```

```css
/* Header.css */
.title {
  font-size: 24px;
  color: blue;
}
```

### 클래스 충돌 문제

```
Header.css  →  .title { color: blue; }
Footer.css  →  .title { color: green; }
```

두 CSS 파일에 같은 `.title` 클래스가 있으면 **마지막에 불러온 CSS가 앞의 것을 덮어씁니다.**  
Header에 파란색을 적용했는데 Footer CSS 때문에 초록색으로 바뀌는 문제가 생깁니다.

| 장점 | 단점 |
|------|------|
| 학습 비용이 낮음 (기존 CSS 지식 그대로 사용) | 클래스명 충돌 가능 |
| 별도 설정 없이 바로 사용 가능 | 프로젝트가 커질수록 관리 어려움 |
| 전역 스타일 적용에 적합 | 어느 CSS가 어디에 영향을 주는지 추적 어려움 |

**예제 파일:** `01_vanilla_css.jsx`, `01_vanilla_Header.css`, `01_vanilla_Footer.css`

---

## 2. 인라인 스타일 — JS 객체로 스타일 정의

> **비유: 옷에 직접 라벨 붙이기**  
> 옷마다 "이 옷은 빨간색, 저 옷은 파란색"이라고 직접 태그를 붙이는 것처럼,  
> 인라인 스타일은 각 요소에 스타일을 직접 붙입니다.  
> 다른 요소에는 절대 영향을 주지 않습니다.

### 사용 방법

```jsx
// 스타일 객체를 변수로 정의합니다
const titleStyle = {
  fontSize: '24px',   // CSS: font-size: 24px  → camelCase로 작성!
  color: 'blue',
  backgroundColor: '#f0f0f0',  // CSS: background-color
};

function Header() {
  return <h1 style={titleStyle}>Header</h1>;
}
```

> **camelCase 규칙**  
> CSS는 `font-size`, `background-color`처럼 하이픈(-)을 씁니다.  
> 인라인 스타일에서는 `fontSize`, `backgroundColor`처럼 **camelCase**로 써야 합니다.

### 동적 스타일 — 상태에 따라 스타일 변경

```jsx
import { useState } from 'react';

function DynamicButton() {
  const [isClicked, setIsClicked] = useState(false);

  const buttonStyle = {
    backgroundColor: isClicked ? 'green' : 'red',  // 상태에 따라 색상 변경
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <button style={buttonStyle} onClick={() => setIsClicked(!isClicked)}>
      {isClicked ? '클릭됨' : '클릭하세요'}
    </button>
  );
}
```

| 장점 | 단점 |
|------|------|
| 다른 컴포넌트에 영향 없음 | CSS 파일 재사용 불가 |
| JS 변수·상태로 동적 스타일 쉽게 구현 | `:hover`, `::before` 같은 가상 선택자 사용 불가 |
| 별도 파일 관리 불필요 | 미디어 쿼리 직접 사용 불가 |
| 빠른 프로토타이핑에 적합 | 스타일이 많아지면 JSX 코드가 복잡해짐 |

**예제 파일:** `02_inline_style.jsx`

---

## 3. CSS 모듈 — 컴포넌트별 독립 스타일

> **비유: 직원 ID 카드**  
> 회사에 "홍길동"이 두 명 있어도 ID 번호가 다르면 구분됩니다.  
> CSS 모듈은 같은 클래스명을 써도 내부적으로 고유한 이름을 자동으로 만들어  
> 다른 컴포넌트와 절대 충돌하지 않게 합니다.

### 파일 명명 규칙

```
일반 CSS:    Button.css
CSS 모듈:    Button.module.css    ← .module.css 확장자 사용
```

### 사용 방법

```css
/* Box.module.css */
.color {
  background-color: skyblue;
  color: white;
}
```

```jsx
// Box.jsx
import styles from './Box.module.css';  // 객체처럼 import

function Box() {
  // className에 문자열 대신 styles.클래스명으로 접근
  return <div className={styles.color}>Box 컴포넌트</div>;
}
```

### 왜 충돌이 안 생기는가?

```html
<!-- CSS 모듈 적용 후 실제 생성되는 HTML -->
<div class="Box_color__a1b2c">Box 컴포넌트</div>
<button class="Button_color__x7y8z">Button 컴포넌트</button>
```

빌드 과정에서 `클래스명`이 `파일명_클래스명_고유해시`로 자동 변환됩니다.  
같은 `.color`를 써도 실제 클래스명이 달라지므로 충돌이 없습니다.

### 클래스 여러 개 적용

```jsx
// 백틱 템플릿 리터럴로 여러 클래스를 조합합니다
<div className={`${styles.box} ${styles.color}`}>Box</div>

// 조건부로 클래스 추가
<div className={`${styles.card} ${isActive ? styles.active : ''}`}>카드</div>
```

| 장점 | 단점 |
|------|------|
| 클래스명 충돌 완전 방지 | 동적 스타일이 인라인 방식보다 불편 |
| 일반 CSS 문법 그대로 사용 가능 | 여러 클래스 조합 시 코드가 길어질 수 있음 |
| `:hover`, 미디어 쿼리 사용 가능 | CSS 파일과 JSX 파일을 함께 관리해야 함 |
| Vite/CRA에서 별도 설정 없이 사용 가능 | |

**예제 파일:** `03_css_module.jsx`, `03_Box.module.css`, `03_Button.module.css`

---

## 4. CSS-in-JS (styled-components) — JS 안에 CSS 작성

> **비유: 맞춤 제작 옷**  
> 기성복(일반 CSS)을 사다가 입히는 게 아니라,  
> 컴포넌트마다 처음부터 맞춤 제작하듯 CSS를 작성합니다.  
> 그 스타일은 그 컴포넌트만의 것이 됩니다.

### 설치

```bash
npm install styled-components
```

### 기본 사용법

```jsx
import styled from 'styled-components';

// styled.HTML태그`CSS 코드` 형식으로 스타일된 컴포넌트를 만듭니다
const Button = styled.button`
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
`;

function App() {
  return <Button>구독</Button>;  // HTML 태그처럼 사용합니다
}
```

> **백틱(\`\`)** — 템플릿 리터럴 문법으로, 여러 줄의 CSS를 JS 안에 그대로 씁니다.

### props로 동적 스타일

```jsx
// props를 받아 조건에 따라 스타일을 다르게 적용합니다
const Button = styled.button`
  background-color: ${props => props.subscribe ? 'black' : 'orange'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
`;

function YourtubeButtons() {
  return (
    <div>
      <Button subscribe>구독</Button>   {/* subscribe prop → 검정 배경 */}
      <Button>좋아요</Button>           {/* subscribe 없음 → 주황 배경 */}
      <Button>공유</Button>             {/* subscribe 없음 → 주황 배경 */}
    </div>
  );
}
```

### styled-components만의 특징

```jsx
// ① :hover, ::before 같은 가상 선택자 사용 가능
const Card = styled.div`
  background: white;

  &:hover {
    background: #f0f4f8;  /* 마우스를 올리면 배경색 변경 */
  }
`;

// ② 기존 스타일 컴포넌트를 확장 (상속)
const DangerButton = styled(Button)`
  background-color: red;  /* Button 스타일을 그대로 이어받고 배경색만 변경 */
`;
```

| 장점 | 단점 |
|------|------|
| JS와 CSS가 한 파일에서 완전히 통합 | 외부 라이브러리 설치 필요 |
| props로 동적 스타일 구현이 매우 직관적 | 컴포넌트 이름이 많아지면 혼란스러울 수 있음 |
| :hover, 미디어 쿼리 모두 사용 가능 | 작은 프로젝트엔 과도한 설정일 수 있음 |
| 스타일 충돌 없음 | CSS 파일로 스타일을 모아 관리하기 어려움 |

**예제 파일:** `04_styled_components.jsx`

---

## 5. 4가지 방법 비교

| 방법 | 파일 구조 | 충돌 방지 | 동적 스타일 | :hover 등 | 추가 설치 |
|------|-----------|-----------|-------------|-----------|-----------|
| 바닐라 CSS | `.css` 별도 파일 | ❌ | 어려움 | ✅ | 불필요 |
| 인라인 스타일 | `.jsx` 안에 객체 | ✅ | ✅ 쉬움 | ❌ | 불필요 |
| CSS 모듈 | `.module.css` | ✅ | 보통 | ✅ | 불필요 |
| styled-components | `.jsx` 안에 CSS | ✅ | ✅ 매우 쉬움 | ✅ | 필요 |

**언제 무엇을 쓸까?**

| 상황 | 추천 방법 |
|------|-----------|
| 전역 리셋, 폰트 등 기본 스타일 | 바닐라 CSS (`index.css`) |
| 빠른 테스트, 작은 컴포넌트 | 인라인 스타일 |
| 규모 있는 프로젝트, CSS 파일 선호 | CSS 모듈 |
| props 기반 동적 스타일이 많은 경우 | styled-components |

---

## 6. 예제 파일 목록

| 파일 | 주제 | 핵심 개념 |
|------|------|-----------|
| `01_vanilla_css.jsx` | 바닐라 CSS | CSS import, 클래스 충돌 문제 시각화 |
| `01_vanilla_Header.css` | 헤더 CSS | `.title { color: blue }` |
| `01_vanilla_Footer.css` | 푸터 CSS | `.title { color: green }` (충돌 예시) |
| `02_inline_style.jsx` | 인라인 스타일 | camelCase, 동적 스타일, 조건부 스타일 |
| `03_css_module.jsx` | CSS 모듈 | `styles.클래스명`, 고유 클래스명 |
| `03_Box.module.css` | Box 모듈 CSS | `.color { background: skyblue }` |
| `03_Button.module.css` | Button 모듈 CSS | `.color { background: pink }` (충돌 없음) |
| `04_styled_components.jsx` | styled-components | `styled.button`, props 동적 스타일 |

---

## 핵심 개념 한눈에 보기

| 개념 | 한 줄 요약 |
|------|-----------|
| 바닐라 CSS | `.css` 파일을 import — 간편하지만 전역 클래스 충돌 주의 |
| 클래스 충돌 | 같은 클래스명이 여러 CSS에 있으면 마지막 import가 이전 것을 덮어씀 |
| camelCase | 인라인 스타일에서 CSS 속성을 `fontSize`, `backgroundColor`처럼 표기 |
| 동적 스타일 | 상태(state)나 props에 따라 삼항 연산자로 스타일 값을 변경 |
| CSS 모듈 | `.module.css` 확장자, `styles.클래스명`으로 접근, 자동 고유 클래스명 생성 |
| styled-components | `styled.HTML태그` + 백틱 CSS, props로 동적 스타일 |
| `&:hover` | styled-components에서 가상 선택자 사용하는 방법 |
