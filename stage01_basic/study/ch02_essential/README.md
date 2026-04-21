# ch02 · 컴포넌트, 상태, 이벤트, 조건부 렌더링

React의 핵심 개념들을 단계적으로 익힙니다.  
컴포넌트를 조립하고, 상태로 화면을 바꾸고, 이벤트에 반응하고, 조건에 따라 다른 화면을 보여주는 방법을 배웁니다.

---

## 목차

1. [컴포넌트 재사용과 부모-자식 관계](#1-컴포넌트-재사용과-부모-자식-관계)
2. [Fragment — 불필요한 div 없애기](#2-fragment--불필요한-div-없애기)
3. [useState — 상태로 화면 바꾸기](#3-usestate--상태로-화면-바꾸기)
4. [이벤트 처리](#4-이벤트-처리)
5. [조건부 렌더링](#5-조건부-렌더링)
6. [props와 state 비교 및 함께 사용하기](#6-props와-state-비교-및-함께-사용하기)
7. [예제 파일 목록](#7-예제-파일-목록)

---

## 1. 컴포넌트 재사용과 부모-자식 관계

### 1-1. 컴포넌트 재사용

> **비유: 인감도장**  
> 인감도장을 한 번 만들어두면 여러 서류에 찍을 수 있듯이,  
> 컴포넌트를 한 번 만들어두면 여러 페이지에서 반복해서 사용할 수 있습니다.

웹사이트의 헤더, 푸터, 내비게이션처럼 **여러 페이지에서 공통으로 쓰이는 UI**를 컴포넌트로 만들면 코드 중복을 없앨 수 있습니다.

```jsx
// CommonUI.jsx — 공통 컴포넌트 정의
function Header() {
  return <header>My Website Header</header>;
}

function Footer() {
  return <footer>My Website Footer</footer>;
}

function Navigation() {
  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

export { Header, Footer, Navigation };
```

```jsx
// App.jsx — 공통 컴포넌트 가져다 쓰기
import { Header, Footer, Navigation } from './CommonUI';

function Home() {
  return (
    <div>
      <Header />       {/* 여기서도 사용 */}
      <Navigation />
      <h1>Home Page</h1>
      <Footer />       {/* 여기서도 사용 */}
    </div>
  );
}
```

> **핵심**: 컴포넌트를 `export`로 내보내고, `import`로 가져와 태그처럼 사용합니다.

---

### 1-2. 부모-자식 관계

> **비유: 회사 조직도**  
> 사장(최상위) → 부서장(중간) → 팀원(하위) 구조처럼,  
> 컴포넌트도 트리 구조로 중첩됩니다.  
> 상위 컴포넌트가 하위 컴포넌트를 포함하고, 데이터는 위에서 아래로만 흐릅니다.

```
App (최상위)
 └── VideoBox (부모)
       └── Comments (부모이자 자식)
             └── Comment (최하위 자식)
```

```jsx
function Comment(props) {
  // props.text: 부모(Comments)에서 내려받은 댓글 텍스트
  return <div>{props.text}</div>;
}

function Comments() {
  return (
    <div>
      {/* Comment에 text 데이터를 전달합니다 */}
      <Comment text="첫 번째 댓글입니다" />
      <Comment text="두 번째 댓글입니다" />
    </div>
  );
}

function VideoBox() {
  return (
    <div>
      <h2>비디오 제목</h2>
      <Comments />    {/* Comments 컴포넌트를 포함 */}
    </div>
  );
}
```

**부모-자식 관계 규칙 요약**

| | 부모 → 자식 | 자식 → 부모 |
|---|---|---|
| 데이터 전달 | ✅ props로 가능 | ❌ 직접 불가 (함수 전달로 간접 가능) |
| 방향 | 위 → 아래 (단방향) | 불가 |

**예제 파일:** `01_component_reuse.jsx`

---

## 2. Fragment — 불필요한 div 없애기

### 2-1. 왜 필요한가?

> **비유: 투명 포장지**  
> 여러 물건을 담아야 하지만 빈 상자를 하나 더 추가하고 싶지 않을 때,  
> 투명 포장지처럼 묶어주면서도 실제로는 존재하지 않는 것처럼 보이게 합니다.

React 컴포넌트는 반드시 **하나의 루트 요소**를 반환해야 합니다.  
`<div>`로 묶으면 해결되지만, 실제 DOM에 불필요한 `<div>`가 쌓입니다.

```jsx
// ❌ 에러: 두 개의 요소를 나란히 반환하면 오류가 발생합니다
function MyComponent() {
  return (
    <h1>제목</h1>
    <p>내용</p>
  );
  // Parsing error: Adjacent JSX elements must be wrapped in an enclosing tag.
}

// ⚠️ div로 해결은 되지만 — DOM에 쓸데없는 div가 추가됩니다
function MyComponent() {
  return (
    <div>
      <h1>제목</h1>
      <p>내용</p>
    </div>
  );
}
```

---

### 2-2. Fragment 사용법

```jsx
import { Fragment } from 'react';

// 방법 1: <Fragment> 태그 사용
function VideoDetails() {
  return (
    <Fragment>
      <h1>비디오 제목</h1>
      <p>비디오에 대한 설명</p>
    </Fragment>
  );
}

// 방법 2: <></> 단축 문법 (더 많이 사용)
function Comments() {
  return (
    <>
      <h2>댓글</h2>
      <p>첫 번째 댓글입니다.</p>
    </>
  );
}
```

**Fragment 비교표**

| | `<div>` 사용 | `<Fragment>` / `<>` 사용 |
|---|---|---|
| DOM 요소 추가 | ✅ div가 실제로 추가됨 | ❌ 아무것도 추가 안 됨 |
| CSS 레이아웃 영향 | ⚠️ 의도치 않은 영향 가능 | ✅ 영향 없음 |
| import 필요 여부 | 불필요 | `<>` 는 불필요, `<Fragment>` 는 필요 |

> **`<>` vs `<Fragment>` 언제 쓰나?**  
> 대부분은 `<>`를 씁니다.  
> 단, 리스트 렌더링에서 `key`가 필요할 때는 `<Fragment key={id}>`를 써야 합니다.

**예제 파일:** `02_fragment.jsx`

---

## 3. useState — 상태로 화면 바꾸기

### 3-1. 일반 변수와의 차이

> **비유: 화이트보드 vs 전광판**  
> 일반 변수는 혼자 메모하는 화이트보드입니다 — 값은 바뀌지만 밖에서는 모릅니다.  
> state는 전광판입니다 — 값이 바뀌면 보는 사람(React) 모두가 알고 화면이 갱신됩니다.

```jsx
// ❌ 일반 변수 — 클릭해도 화면이 바뀌지 않습니다
function BadCounter() {
  let count = 0;
  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={() => { count += 1; }}>+1</button>
      {/* 콘솔에선 증가하지만 화면엔 항상 0이 표시됩니다 */}
    </>
  );
}
```

---

### 3-2. useState 기본 문법

```jsx
import { useState } from 'react';

// const [현재값, 값을바꾸는함수] = useState(초기값);
const [count, setCount] = useState(0);
```

| 부분 | 설명 |
|------|------|
| `count` | 현재 상태 값 (읽기만 가능) |
| `setCount` | 상태를 바꾸는 함수 (이 함수를 호출해야 화면이 갱신됨) |
| `useState(0)` | 초기값을 0으로 설정 |

---

### 3-3. 카운터 구현

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1); // 함수로 분리하면 코드가 깔끔해집니다
  const decrement = () => setCount(count - 1);

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

---

### 3-4. state 변수 여러 개 사용하기

한 컴포넌트에서 state 변수를 여러 개 선언할 수 있습니다.  
어느 하나라도 값이 바뀌면 컴포넌트가 다시 렌더링됩니다.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // 카운트 상태
  const [step, setStep]   = useState(1);  // 증가 단위 상태

  return (
    <>
      <h1>Count: {count}</h1>
      <h3>Step: {step}</h3>
      <button onClick={() => setCount(count + step)}>+{step}</button>
      <button onClick={() => setCount(count - step)}>-{step}</button>
      <label>
        Step: <input type="number" onChange={e => setStep(Number(e.target.value))} />
      </label>
    </>
  );
}
```

**예제 파일:** `03_useState.jsx`

---

## 4. 이벤트 처리

> **비유: 초인종**  
> 초인종(이벤트 속성)을 설치해 두면, 누군가 누를 때(이벤트 발생)  
> 미리 연결된 벨(이벤트 핸들러 함수)이 울립니다.

---

### 4-1. HTML vs React 이벤트 차이

| | HTML | React |
|---|---|---|
| 이벤트 속성 이름 | 소문자: `onclick`, `onchange` | camelCase: `onClick`, `onChange` |
| 핸들러 등록 방식 | 실행 코드를 문자열로: `onclick="alert()"` | 함수 참조를 전달: `onClick={handleClick}` |

> **함수 참조 vs 함수 호출**  
> `onClick={handleClick}` — ✅ 올바름: 클릭할 때 실행  
> `onClick={handleClick()}` — ❌ 잘못됨: 렌더링할 때 바로 실행됨

---

### 4-2. onClick — 버튼 클릭

```jsx
import { useState } from 'react';

function ClickCounter() {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(count + 1);

  return (
    <>
      <p>버튼이 {count}번 클릭되었습니다.</p>
      <button onClick={handleClick}>클릭</button>
    </>
  );
}
```

---

### 4-3. onChange — 폼 입력

`onChange`는 입력 필드의 값이 변할 때마다 실시간으로 발생합니다.  
이벤트 객체 `e`의 `e.target.value`로 현재 입력된 값을 가져옵니다.

```jsx
import { useState } from 'react';

function NameForm() {
  const [name, setName] = useState('');

  const handleChange = (e) => setName(e.target.value); // e.target.value = 현재 입력값

  return (
    <>
      <input type="text" value={name} onChange={handleChange} />
      <p>안녕하세요, {name}님!</p>
    </>
  );
}
```

---

### 4-4. onKeyDown — 키보드 입력

`onKeyDown`은 키보드의 키를 누르는 순간 발생합니다.  
`e.key`로 어떤 키가 눌렸는지 확인할 수 있습니다.

```jsx
import { useState } from 'react';

function KeyPressLogger() {
  const [key, setKey] = useState('');

  const handleKeyDown = (e) => setKey(e.key); // e.key = 눌린 키 이름 ('Enter', 'a', 'Shift' 등)

  return (
    <>
      <input type="text" onKeyDown={handleKeyDown} />
      <p>마지막으로 누른 키: {key}</p>
    </>
  );
}
```

**주요 이벤트 속성 정리**

| 이벤트 속성 | 발생 시점 |
|-------------|-----------|
| `onClick` | 요소를 클릭할 때 |
| `onChange` | 입력 필드 값이 변경될 때 (실시간) |
| `onKeyDown` | 키를 누르는 순간 (반복 발생 가능) |
| `onKeyUp` | 키를 뗄 때 |
| `onSubmit` | 폼을 제출할 때 |
| `onFocus` | 요소에 포커스가 생길 때 |
| `onBlur` | 요소에서 포커스가 사라질 때 |

**예제 파일:** `04_event.jsx`

---

## 5. 조건부 렌더링

> **비유: 스마트폰 화면**  
> 잠금 상태일 때는 잠금 화면, 해제 상태일 때는 홈 화면을 보여주듯이,  
> 조건부 렌더링은 **특정 조건에 따라 다른 화면을 보여주는 것**입니다.

---

### 5-1. if 문 — 복잡한 분기 처리

여러 조건을 나눠야 할 때 유용합니다.

```jsx
import { useState } from 'react';

function Greeting() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // return 전에 if 문으로 변수에 JSX를 할당합니다
  let message;
  if (isLoggedIn) {
    message = <h1>다시 오신 것을 환영합니다!</h1>;
  } else {
    message = <h1>로그인해 주세요.</h1>;
  }

  return (
    <>
      {message}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>
    </>
  );
}
```

---

### 5-2. 삼항 연산자 — JSX 안에서 간단히 분기

`조건 ? 참일때_JSX : 거짓일때_JSX` 형태로, JSX 안에서 직접 사용합니다.

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <>
      <h1>
        {isLoggedIn ? '다시 오신 것을 환영합니다!' : '로그인해 주세요.'}
      </h1>
      {isLoggedIn
        ? <button>로그아웃</button>
        : <button>로그인</button>
      }
    </>
  );
}
```

---

### 5-3. && 논리 연산자 — 조건이 참일 때만 표시

조건이 거짓일 때 **아무것도 보여주지 않을 때** 유용합니다.

```jsx
function Notification({ isLoggedIn, hasNewMessage }) {
  return (
    <>
      {isLoggedIn && <p>로그인된 사용자에게만 보이는 메뉴</p>}
      {hasNewMessage && <p>🔔 새로운 메시지가 있습니다!</p>}
    </>
  );
}
```

> **⚠️ `&&` 주의사항**  
> `{count && <p>있음</p>}` — count가 `0`이면 화면에 `0`이 출력됩니다!  
> `{count > 0 && <p>있음</p>}` 처럼 명시적인 비교식을 쓰세요.

**세 가지 패턴 비교**

| 방법 | 언제 사용? | 예시 |
|------|-----------|------|
| `if` 문 | 3개 이상의 분기, return 전 처리 | 3단계 등급 표시 |
| 삼항 연산자 `? :` | 두 가지 중 하나 선택 | 로그인/로그아웃 버튼 |
| `&&` | 조건이 참일 때만 표시 | 알림 뱃지, 경고 메시지 |

**예제 파일:** `05_conditional_rendering.jsx`

---

## 6. props와 state 비교 및 함께 사용하기

### 6-1. props vs state 핵심 차이

> **비유**  
> - **props**: 부모님이 준 용돈 — 받기만 하고 내 맘대로 바꿀 수 없습니다  
> - **state**: 내 지갑 잔고 — 내가 직접 쓰고 채우며 관리합니다

| | props | state |
|---|---|---|
| 데이터 출처 | 부모 컴포넌트 | 자기 자신 |
| 변경 가능 여부 | ❌ 읽기 전용 | ✅ setState로 변경 가능 |
| 변경 시 렌더링 | 부모가 변경하면 재렌더링 | setState 호출 시 재렌더링 |
| 주요 용도 | 컴포넌트에 데이터 전달 | 컴포넌트 내부 상태 관리 |

---

### 6-2. props 기본값 설정 (defaultProps)

부모가 props를 전달하지 않았을 때 사용할 기본값을 설정합니다.

```jsx
function Greeting(props) {
  return <h1>{props.number}. Hello, {props.name}!</h1>;
}

// name props가 없으면 'Guest'를 기본값으로 사용합니다
Greeting.defaultProps = {
  name: 'Guest',
};
```

```jsx
// App.jsx
<Greeting number={1} />           {/* name 미전달 → "Hello, Guest!" */}
<Greeting number={2} name="Jane" /> {/* name 전달 → "Hello, Jane!" */}
```

> **현대적 방식**: 구조 분해 기본값도 많이 사용합니다  
> `function Greeting({ number, name = 'Guest' }) { ... }`

---

### 6-3. props와 state 함께 사용하기

실무에서는 props(외부 데이터)와 state(내부 상태)를 함께 사용하는 경우가 많습니다.

```jsx
// Video.jsx — props로 제목 받고, state로 좋아요 관리
import { useState } from 'react';

function Video(props) {
  const [liked, setLiked] = useState(false); // 내부 상태: 좋아요 여부

  return (
    <div>
      <h2>{props.title}</h2>           {/* 외부 데이터: 부모에서 받은 제목 */}
      <button onClick={() => setLiked(!liked)}>
        {liked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </div>
  );
}
```

```jsx
// App.jsx — Video 컴포넌트에 제목을 props로 전달
function App() {
  const videos = [
    { id: 1, title: '리액트 튜토리얼' },
    { id: 2, title: '자바스크립트 기초' },
  ];

  return (
    <>
      {videos.map(video => (
        <Video key={video.id} title={video.title} />
      ))}
    </>
  );
}
```

> **설계 원칙**: 변하지 않는 데이터(제목, 사용자 이름 등)는 props로 받고,  
> 사용자 상호작용으로 변하는 데이터(좋아요, 카운트 등)는 state로 관리합니다.

**예제 파일:** `06_props_state.jsx`

---

## 7. 예제 파일 목록

| 파일 | 주제 | 핵심 개념 |
|------|------|-----------|
| `01_component_reuse.jsx` | 컴포넌트 재사용, 부모-자식 관계 | export/import, props 전달, 컴포넌트 트리 |
| `02_fragment.jsx` | Fragment 컴포넌트 | `<>`, `<Fragment>`, div 문제점 |
| `03_useState.jsx` | 상태 관리 | useState, 여러 state 변수, 함수 분리 |
| `04_event.jsx` | 이벤트 처리 | onClick, onChange, onKeyDown |
| `05_conditional_rendering.jsx` | 조건부 렌더링 | if/삼항/&&, 컴포넌트 전환, 리스트 필터링 |
| `06_props_state.jsx` | props와 state | 차이 비교, defaultProps, 함께 사용하기 |

---

## 핵심 개념 한눈에 보기

| 개념 | 한 줄 요약 |
|------|-----------|
| 컴포넌트 재사용 | 한 번 만든 컴포넌트를 여러 곳에서 import해 사용 |
| 부모-자식 관계 | 컴포넌트 트리 구조, 데이터는 위→아래로만 흐름 |
| Fragment `<>` | DOM에 추가되지 않는 투명 래퍼, 불필요한 div 제거 |
| useState | 변하면 화면이 갱신되는 상태 값 선언 |
| 이벤트 속성 | camelCase (onClick, onChange), 함수 참조를 전달 |
| 조건부 렌더링 | if / 삼항 `? :` / 논리 `&&` 세 가지 패턴 |
| props | 부모 → 자식, 읽기 전용 외부 데이터 |
| state | 자신의 내부 상태, setState로만 변경 가능 |
| defaultProps | props가 전달되지 않았을 때 사용할 기본값 |
