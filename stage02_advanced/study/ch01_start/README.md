# ch01 · React 시작하기

React의 핵심 개념을 비유와 코드로 함께 익힙니다.  
이 챕터는 이후 고급 훅(useContext, useReducer, 커스텀 훅)을 배우기 전에  
기초를 단단히 다지는 출발점입니다.

---

## 목차

1. [React란 무엇인가?](#1-react란-무엇인가)
2. [프로젝트 구조](#2-프로젝트-구조-vite--react)
3. [JSX — 자바스크립트 안에 쓰는 HTML](#3-jsx--자바스크립트-안에-쓰는-html)
4. [컴포넌트 — UI의 레고 블록](#4-컴포넌트--ui의-레고-블록)
5. [Props — 컴포넌트에 데이터 전달하기](#5-props--컴포넌트에-데이터-전달하기)
6. [useState — 화면을 바꾸는 상태 관리](#6-usestate--화면을-바꾸는-상태-관리)
7. [useEffect — 렌더링 후 실행되는 작업](#7-useeffect--렌더링-후-실행되는-작업)
8. [조건부 렌더링](#8-조건부-렌더링)
9. [리스트 렌더링](#9-리스트-렌더링)
10. [예제 파일 목록](#10-예제-파일-목록)

---

## 1. React란 무엇인가?

> **비유: 레고 블록**  
> HTML·CSS·JS만으로 웹을 만들면 마치 점토 하나로 전체 조형물을 만드는 것과 같습니다.  
> React는 레고처럼 **재사용 가능한 부품(컴포넌트)** 을 조립해 화면을 만듭니다.  
> 버튼, 카드, 헤더 등 각 부품은 독립적으로 존재하고, 필요할 때마다 꺼내 쓸 수 있습니다.

**React의 핵심 특징 세 가지**

| 특징 | 설명 | 비유 |
|------|------|------|
| **컴포넌트 기반** | UI를 독립 부품으로 분리 | 레고 블록 |
| **단방향 데이터 흐름** | 데이터는 부모 → 자식 방향으로만 흐름 | 폭포수 |
| **가상 DOM** | 변경된 부분만 실제 DOM에 반영해 성능 최적화 | 수정 전 초안 비교 후 최종본에만 반영 |

**왜 React를 쓰는가?**

일반 JS(바닐라 JS)로는 데이터가 바뀔 때마다 DOM을 직접 찾아 업데이트해야 합니다.

```js
// 바닐라 JS — 카운터 증가 시 직접 DOM 조작
document.getElementById('count').textContent = count;
```

React는 **상태(state)만 바꾸면** 화면이 자동으로 업데이트됩니다.

```jsx
// React — 상태 변경 → 화면 자동 갱신
setCount(count + 1);
```

---

## 2. 프로젝트 구조 (Vite + React)

React 프로젝트를 만드는 가장 빠른 방법은 **Vite**를 사용하는 것입니다.

```bash
# 프로젝트 생성
npm create vite@latest my-app -- --template react

cd my-app
npm install
npm run dev
```

**생성된 폴더 구조**

```
my-app/
├── public/              ← 정적 파일 (이미지, 아이콘 등)
├── src/
│   ├── assets/          ← 컴포넌트에서 import하는 이미지·폰트
│   ├── App.jsx          ← 최상위 컴포넌트 (루트)
│   ├── App.css
│   ├── main.jsx         ← 앱의 진입점 (index.html에 React를 붙임)
│   └── index.css
├── index.html           ← 단 하나의 HTML 파일 (<div id="root"> 포함)
├── package.json
└── vite.config.js
```

> **SPA (Single Page Application)**  
> React 앱은 HTML 파일이 딱 하나입니다.  
> 페이지 이동처럼 보이는 것은 실제로 JS가 `<div id="root">` 안의 내용을 교체하는 것입니다.

**앱이 화면에 나타나는 흐름**

```
index.html (<div id="root">)
    ↓
main.jsx (ReactDOM.createRoot('#root').render(<App />))
    ↓
App.jsx (최상위 컴포넌트)
    ↓
Header, Main, Footer … (자식 컴포넌트들)
```

---

## 3. JSX — 자바스크립트 안에 쓰는 HTML

> **비유: 요리 레시피 카드**  
> JSX는 자바스크립트 코드 안에 HTML처럼 생긴 마크업을 직접 쓸 수 있게 해주는 문법입니다.  
> 마치 요리 레시피 카드에 재료(JS 데이터)와 조리 순서(HTML 구조)를 한 장에 적어 두는 것과 같습니다.

```jsx
// JSX: JS 변수를 {} 안에 넣어 HTML처럼 작성합니다
const name = '홍길동';

function Greeting() {
  return <h1>안녕하세요, {name}님!</h1>;
}
```

**JSX 핵심 규칙**

| 규칙 | 잘못된 예 | 올바른 예 |
|------|-----------|-----------|
| 반드시 하나의 루트 요소 | `<h1/><p/>` (두 개 나란히) | `<div><h1/><p/></div>` 또는 `<><h1/><p/></>` |
| `class` → `className` | `<div class="box">` | `<div className="box">` |
| 닫는 태그 필수 | `<input>` | `<input />` |
| JS 표현식은 `{}` | `<p>name</p>` | `<p>{name}</p>` |
| 스타일은 객체로 | `style="color:red"` | `style={{ color: 'red' }}` |

> **`<>...</>` (Fragment)**  
> 불필요한 `<div>` 추가 없이 여러 요소를 묶을 수 있습니다.  
> 빈 태그처럼 생겼고 실제 DOM에는 아무것도 추가되지 않습니다.

**예제 파일:** `01_jsx.jsx`

---

## 4. 컴포넌트 — UI의 레고 블록

> **비유: 레고 블록 설명서**  
> 컴포넌트는 "이렇게 생긴 블록을 이렇게 조립하면 이런 모양이 된다"는 설명서입니다.  
> 한 번 만들어두면 어디서든 꺼내 쓸 수 있고, 같은 블록을 여러 곳에 붙여도 됩니다.

**함수형 컴포넌트 기본 형태**

```jsx
// 컴포넌트 이름은 반드시 대문자로 시작합니다
function Button() {
  return <button>클릭하세요</button>;
}

// 화살표 함수로도 작성 가능합니다
const Card = () => {
  return (
    <div className="card">
      <h2>카드 제목</h2>
      <p>카드 내용</p>
    </div>
  );
};
```

> **왜 대문자로 시작하는가?**  
> `<button>`은 HTML 기본 태그, `<Button>`은 React 컴포넌트입니다.  
> React는 대소문자로 둘을 구분합니다. 소문자로 시작하면 HTML 태그로 인식해 오류가 납니다.

**컴포넌트 중첩 (조립)**

```jsx
function App() {
  return (
    <div>
      <Header />      {/* 컴포넌트를 태그처럼 사용 */}
      <Main />
      <Footer />
    </div>
  );
}
```

**children — 컴포넌트 안에 내용 넣기**

```jsx
// children: 컴포넌트 태그 사이에 들어오는 내용을 받습니다
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// 사용할 때 태그 사이에 내용을 넣으면 됩니다
<Card>
  <h2>제목</h2>
  <p>내용</p>
</Card>
```

**예제 파일:** `02_component.jsx`

---

## 5. Props — 컴포넌트에 데이터 전달하기

> **비유: 택배 송장**  
> Props는 부모 컴포넌트가 자식 컴포넌트에 "이 데이터로 만들어줘"라고 전달하는 명세서입니다.  
> 같은 컴포넌트라도 props가 다르면 다른 내용을 표시합니다.

```jsx
// 자식 컴포넌트: props를 매개변수로 받습니다
function UserCard({ name, role, imageUrl }) {
  return (
    <div className="user-card">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

// 부모 컴포넌트: props를 속성처럼 전달합니다
function App() {
  return (
    <div>
      <UserCard name="홍길동"  role="개발자"  imageUrl="/img/hong.jpg" />
      <UserCard name="김철수"  role="디자이너" imageUrl="/img/kim.jpg" />
    </div>
  );
}
```

**Props 기본값 (defaultProps 대신 구조 분해 기본값)**

```jsx
function Button({ label = '확인', color = 'blue', onClick }) {
  return (
    <button style={{ background: color }} onClick={onClick}>
      {label}
    </button>
  );
}

// label, color를 넘기지 않으면 기본값이 사용됩니다
<Button onClick={handleClick} />          {/* label='확인', color='blue' */}
<Button label="취소" color="gray" onClick={handleCancel} />
```

**Props는 읽기 전용**

```jsx
// ❌ props를 직접 수정하면 안 됩니다
function BadComponent({ count }) {
  count = count + 1; // 오류 발생
}

// ✅ 부모에서 내려준 값은 그대로 사용합니다
function GoodComponent({ count }) {
  return <p>카운트: {count}</p>;
}
```

> props를 바꾸고 싶다면 부모에서 **상태(state)** 를 바꿔 새 props를 내려줘야 합니다.

**예제 파일:** `02_component.jsx`

---

## 6. useState — 화면을 바꾸는 상태 관리

> **비유: 게시판의 좋아요 버튼**  
> 버튼을 클릭했을 때 숫자가 올라가는 것처럼, **화면이 바뀌어야 하는 값**을 상태(state)로 관리합니다.  
> 일반 변수는 바꿔도 화면이 갱신되지 않지만, 상태는 바꾸는 순간 React가 화면을 자동으로 다시 그립니다.

```jsx
import { useState } from 'react';

function Counter() {
  // [현재 값,  값을 바꾸는 함수] = useState(초기값)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>초기화</button>
    </div>
  );
}
```

**왜 일반 변수가 아닌 useState를 써야 하는가?**

```jsx
// ❌ 일반 변수 — 바꿔도 화면이 갱신되지 않습니다
function BadCounter() {
  let count = 0;
  return (
    <button onClick={() => { count++; console.log(count); }}>
      클릭 ({count})  {/* 항상 0으로 표시 */}
    </button>
  );
}

// ✅ useState — 값이 바뀌면 React가 화면을 다시 그립니다
function GoodCounter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 ({count})  {/* 클릭할 때마다 숫자가 올라감 */}
    </button>
  );
}
```

**객체 상태 업데이트 — 불변성 유지**

```jsx
const [user, setUser] = useState({ name: '홍길동', age: 25 });

// ❌ 직접 수정 — React가 변경을 감지하지 못합니다
user.age = 26; // 화면 갱신 안 됨!

// ✅ spread로 새 객체 생성 — React가 변경을 감지합니다
setUser({ ...user, age: 26 }); // 화면 갱신됨
```

**함수형 업데이트 — 이전 값 기반 업데이트**

```jsx
// 이전 상태를 기반으로 업데이트할 때는 함수를 넘깁니다
// (연속 클릭 등 비동기 상황에서 더 안전합니다)
setCount(prev => prev + 1);
```

**예제 파일:** `03_useState.jsx`

---

## 7. useEffect — 렌더링 후 실행되는 작업

> **비유: 식당의 테이블 정리**  
> 손님이 앉고 나서(렌더링 후) 메뉴판을 갖다주고, 손님이 떠날 때(언마운트 시) 테이블을 치우는 것처럼,  
> useEffect는 **렌더링 이후에 해야 할 작업**을 처리합니다.  
> API 호출, 타이머 설정, 이벤트 리스너 등록 등이 대표적인 예입니다.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // useEffect(실행할 함수, [의존성 배열])
  useEffect(() => {
    // userId가 바뀔 때마다 실행됩니다
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // ← 의존성 배열: 이 값이 바뀔 때만 재실행

  if (!user) return <p>로딩 중…</p>;
  return <p>{user.name}</p>;
}
```

**의존성 배열 3가지 패턴**

```jsx
// 1. 빈 배열 [] — 마운트(첫 렌더링)될 때 딱 한 번만 실행
useEffect(() => {
  console.log('컴포넌트가 화면에 나타났습니다');
}, []);

// 2. 특정 값 [value] — value가 바뀔 때마다 실행
useEffect(() => {
  document.title = `검색어: ${query}`;
}, [query]);

// 3. 배열 생략 — 모든 렌더링마다 실행 (거의 쓰지 않음)
useEffect(() => {
  console.log('매 렌더링마다 실행');
});
```

**정리 함수 (Cleanup) — 뒷정리**

```jsx
useEffect(() => {
  // 타이머 시작
  const id = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  // 정리 함수: 컴포넌트가 사라지거나 effect가 재실행되기 직전에 호출됩니다
  return () => {
    clearInterval(id); // 타이머 정지 — 메모리 누수 방지
  };
}, []);
```

> **정리 함수가 왜 필요한가?**  
> 컴포넌트가 화면에서 사라진 후에도 타이머가 계속 실행되면 메모리 낭비·오류가 발생합니다.  
> 정리 함수에서 타이머를 멈추거나 이벤트 리스너를 제거해야 합니다.

**예제 파일:** `04_useEffect.jsx`

---

## 8. 조건부 렌더링

> **비유: 스마트폰 잠금 화면**  
> 로그인 여부에 따라 로그인 폼 또는 대시보드를 보여주는 것처럼,  
> 조건부 렌더링은 **특정 조건에 따라 다른 화면을 표시**합니다.

**3가지 패턴**

```jsx
// 패턴 1: if 문 — 반환 자체를 조건으로 나눌 때
function LoginStatus({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <LoginForm />;
  }
  return <Dashboard />;
}

// 패턴 2: 삼항 연산자 — JSX 안에서 간단히 분기할 때
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>환영합니다!</p> : <p>로그인해 주세요.</p>}
    </div>
  );
}

// 패턴 3: && 단락 평가 — 조건이 참일 때만 보여줄 때
function Notification({ hasNewMessage }) {
  return (
    <div>
      <h1>받은 편지함</h1>
      {hasNewMessage && <p>새 메시지가 있습니다!</p>}
    </div>
  );
}
```

> **`&&` 주의사항**  
> `{count && <p>있음</p>}` — count가 `0`이면 `0`이 화면에 출력됩니다!  
> `{count > 0 && <p>있음</p>}` 또는 `{!!count && <p>있음</p>}` 처럼 명시적으로 불리언으로 변환하세요.

**예제 파일:** `05_conditional_list.jsx`

---

## 9. 리스트 렌더링

> **비유: 인쇄소의 템플릿 복사**  
> 같은 양식의 카드를 사람마다 하나씩 찍어내듯,  
> `map()`으로 배열의 각 항목을 컴포넌트로 변환합니다.

```jsx
const fruits = ['사과', '바나나', '오렌지'];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

**`key` — 각 항목의 고유 신분증**

```jsx
const users = [
  { id: 1, name: '홍길동' },
  { id: 2, name: '김철수' },
  { id: 3, name: '이영희' },
];

function UserList() {
  return (
    <ul>
      {users.map(user => (
        // key는 같은 레벨의 형제 요소 중에서만 고유하면 됩니다
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

> **key에 index를 쓰면 안 되는 경우**  
> 목록의 순서가 바뀌거나 항목이 삭제·추가될 때 index를 key로 쓰면 React가 잘못 비교합니다.  
> **항상 고유하고 변하지 않는 `id`를 key로 사용하세요.**

**객체 배열에서 컴포넌트로 변환**

```jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}
```

**예제 파일:** `05_conditional_list.jsx`

---

## 10. 예제 파일 목록

| 파일 | 주제 | 핵심 개념 |
|------|------|-----------|
| `01_jsx.jsx` | JSX 문법 | JSX 규칙, Fragment, 표현식, 스타일 |
| `02_component.jsx` | 컴포넌트 · Props | 함수형 컴포넌트, Props, children, 기본값 |
| `03_useState.jsx` | 상태 관리 | useState, 불변성, 폼 상태, 토글 |
| `04_useEffect.jsx` | 사이드 이펙트 | useEffect, 의존성 배열, Cleanup |
| `05_conditional_list.jsx` | 조건부·리스트 렌더링 | if/삼항/&&, map, key |

---

## 핵심 개념 한눈에 보기

| 개념 | 한 줄 요약 |
|------|-----------|
| JSX | JS 안에 HTML처럼 작성하는 문법 (빌드 시 JS로 변환됨) |
| 컴포넌트 | 화면의 한 부분을 담당하는 독립 함수 |
| Props | 부모 → 자식으로 데이터를 전달하는 속성 (읽기 전용) |
| State | 컴포넌트 안에서 관리하는 변하는 값 (바뀌면 화면 갱신) |
| useState | 상태를 만들고 업데이트하는 훅 |
| useEffect | 렌더링 후 실행할 작업을 등록하는 훅 |
| 의존성 배열 | useEffect가 재실행될 조건을 정하는 배열 |
| Cleanup | useEffect가 끝날 때 뒷정리하는 함수 |
| key | 리스트 렌더링 시 각 항목을 식별하는 고유값 |
| 불변성 | 상태를 직접 수정하지 않고 새 값을 만들어 교체하는 원칙 |
