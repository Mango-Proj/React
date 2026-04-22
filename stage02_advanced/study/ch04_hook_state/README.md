# ch04. 훅 심화 & 상태 관리

> **이 챕터에서 배우는 것**
> React가 제공하는 심화 훅들과, 앱이 커질수록 필요해지는 "전역 상태 관리" 방법을 배웁니다.

---

## 목차

1. [useRef — 화면을 바꾸지 않는 메모장](#1-useref)
2. [useMemo / React.memo — 계산 결과 재활용](#2-usememo--reactmemo)
3. [useCallback — 함수 참조 고정하기](#3-usecallback)
4. [커스텀 훅 — 나만의 훅 만들기](#4-커스텀-훅)
5. [Props Drilling & useReducer — 상태 전달의 진화](#5-props-drilling--usereducer)
6. [Context API — 전역 방송국](#6-context-api)
7. [Zustand — 더 간단한 전역 상태 관리](#7-zustand)

---

## 1. useRef

### 비유 — 포스트잇 메모장 📝

`useState`는 값이 바뀌면 화면을 다시 그립니다. 하지만 **화면은 그대로 두고 값만 기억**하고 싶을 때가 있습니다.

`useRef`는 마치 포스트잇 메모장 같습니다. 메모에 무언가 적어도 방 안 인테리어(화면)는 달라지지 않습니다. 하지만 나중에 꺼내 볼 수는 있죠.

```
useState  →  값 바뀜 → 화면 다시 그림 ✅
useRef    →  값 바뀜 → 화면 그대로   ❌ (의도적으로)
```

### 핵심 특징

| 특징 | 설명 |
|------|------|
| `.current` 속성 | 값은 `ref.current`에 저장됩니다 |
| 리렌더링 없음 | `.current`를 바꿔도 화면은 다시 그려지지 않습니다 |
| DOM 참조 | `<input ref={inputRef} />` 로 실제 HTML 요소에 접근합니다 |

### 주요 사용 사례

**① DOM 요소에 직접 접근 (포커스, 스크롤)**
```jsx
const inputRef = useRef(null);
// 컴포넌트가 처음 나타날 때 입력창에 자동으로 포커스
useEffect(() => {
  inputRef.current.focus();
}, []);
<input ref={inputRef} />
```

**② 이전 값 기억하기**
```jsx
const prevCount = useRef(0);
useEffect(() => {
  prevCount.current = count; // 현재 값을 "이전 값"으로 저장
}, [count]);
```

**③ 타이머 ID 저장 (cleanup용)**
```jsx
const timerRef = useRef(null);
timerRef.current = setInterval(...);
return () => clearInterval(timerRef.current); // 정리
```

### useState vs useRef 비교

| 구분 | useState | useRef |
|------|----------|--------|
| 값 변경 시 화면 업데이트 | ✅ 즉시 반영 | ❌ 반영 안 됨 |
| 주된 용도 | UI에 표시되는 값 | DOM 접근, 내부 추적 값 |

---

## 2. useMemo / React.memo

### 비유 — 이미 풀어놓은 수학 문제 📄

선생님이 같은 수학 문제를 계속 풀라고 하면 낭비입니다. 한 번 풀어서 답지에 적어두고, 숫자가 바뀔 때만 다시 계산하면 됩니다.

`useMemo`는 **계산 결과를 기억**해두고, 관련 값이 바뀌지 않으면 이전 답을 그대로 씁니다.

### useMemo — 값 메모이제이션

```jsx
const sum = useMemo(() => {
  console.log('합계 계산 중...');
  return numbers.reduce((a, b) => a + b, 0);
}, [numbers]); // numbers가 바뀔 때만 다시 계산
```

**의존성 배열 규칙**

| 의존성 배열 | 언제 재계산되나 |
|-------------|----------------|
| `[a, b]` | a 또는 b가 바뀔 때만 |
| `[]` | 처음 한 번만 |
| 생략 | 매 렌더링마다 (useMemo 의미 없음) |

### React.memo — 컴포넌트 메모이제이션

`useMemo`는 **값**을 기억하고, `React.memo`는 **컴포넌트 자체**를 기억합니다.

```jsx
// props가 바뀌지 않으면 이 컴포넌트는 다시 그려지지 않습니다
const Car = React.memo(({ model }) => {
  console.log(`Rendering: ${model}`);
  return <li>{model}</li>;
});
```

### useMemo vs React.memo 비교

| 구분 | useMemo | React.memo |
|------|---------|------------|
| 대상 | 계산된 **값** | **컴포넌트** 전체 |
| 형태 | 훅 (함수 안에서 호출) | 고차 컴포넌트 (컴포넌트 감싸기) |
| 목적 | 무거운 연산 결과 재사용 | 불필요한 리렌더링 방지 |

> ⚠️ **주의**: 메모이제이션도 비용이 듭니다. 가볍고 단순한 계산에는 오히려 손해일 수 있으니, 정말 무겁거나 자주 렌더링되는 경우에만 쓰세요.

---

## 3. useCallback

### 비유 — 단축번호 저장 📱

React는 컴포넌트가 리렌더링될 때마다 내부 함수를 새로 만듭니다. 마치 친구 전화번호를 매번 새 종이에 다시 적는 것과 같습니다. "같은 번호"인데도 객체 주소가 달라서 자식 컴포넌트 입장에서는 "새 props를 받았다"고 인식합니다.

`useCallback`은 함수를 **단축번호에 저장**해두고, 관련 값이 바뀌지 않으면 같은 함수 참조를 재사용합니다.

```jsx
const fetchUser = useCallback(() => {
  fetch(`/api/users/${userId}`);
}, [userId]); // userId가 바뀔 때만 함수를 새로 만듦
```

### React.memo + useCallback 조합

두 개를 함께 쓰면 시너지가 납니다.

```jsx
// Button: props가 안 바뀌면 리렌더링 안 함
const Button = React.memo(({ onClick }) => {
  return <button onClick={onClick}>클릭</button>;
});

const App = () => {
  // handleClick의 참조를 고정 → Button은 리렌더링되지 않음
  const handleClick = useCallback(() => {
    console.log('클릭!');
  }, []);

  return <Button onClick={handleClick} />;
};
```

### useMemo vs useCallback 비교

| 구분 | useMemo | useCallback |
|------|---------|-------------|
| 기억하는 것 | 계산된 **값** | **함수** 참조 |
| 반환 값 | 메모이제이션된 값 | 메모이제이션된 함수 |
| 예시 | 무거운 필터/정렬 결과 | 자식에게 넘기는 이벤트 핸들러 |

---

## 4. 커스텀 훅

### 비유 — 요리 레시피 카드 🍳

볶음밥을 만드는 과정(재료 꺼내기 → 씻기 → 볶기)이 여러 요리에서 반복된다면, 별도의 레시피 카드로 만들어 꺼내 쓰면 편리합니다.

커스텀 훅은 **반복되는 로직을 별도 함수로 분리**해서 어디서든 재사용할 수 있게 해줍니다.

### 규칙

- 이름은 반드시 `use`로 시작해야 합니다 (`useFetchData`, `useLocalStorage`, ...)
- 내부에서 기존 React 훅(`useState`, `useEffect` 등)을 자유롭게 사용합니다

### 기본 구조

```jsx
// hooks/useFetchData.js
function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [url]);

  return { data, loading, error };
}
```

### 사용 — 컴포넌트가 깔끔해집니다

```jsx
const PostList = () => {
  const { data, loading, error } = useFetchData('/api/posts');

  if (loading) return <p>불러오는 중...</p>;
  if (error)   return <p>에러 발생!</p>;
  return <ul>{data.map(post => <li key={post.id}>{post.title}</li>)}</ul>;
};
```

### 데이터 캐싱

같은 URL을 여러 번 요청하지 않도록 캐시를 추가할 수 있습니다.

```jsx
const cache = {}; // 모듈 스코프에 저장

function useFetchData(url) {
  // 캐시가 있으면 초기값으로 바로 사용
  const [data, setData] = useState(cache[url] || null);
  const [loading, setLoading] = useState(!cache[url]);
  // ...
  if (cache[url]) {
    setData(cache[url]); // 캐시 히트: 네트워크 요청 없음
  } else {
    // 실제 fetch 후 cache[url] = result 로 저장
  }
}
```

---

## 5. Props Drilling & useReducer

### Props Drilling — 전화 메시지 전달 📞

데이터를 `할아버지 → 아빠 → 나`처럼 여러 단계로 전달하면, 중간의 아빠는 내용도 모르면서 그냥 전달만 하게 됩니다. 이것을 **Props Drilling**이라 합니다.

```
Products (데이터 있음)
  └─ ProductCard (그냥 전달만...)
       └─ LikeBadge (여기서 실제로 사용)
```

컴포넌트 계층이 깊어질수록 수정이 어려워집니다.

### 상태 끌어올리기 (State Lifting)

여러 자식이 같은 데이터를 필요로 할 때, 가장 가까운 **공통 부모로 state를 올리고** props로 내려주는 방법입니다.

```jsx
// 부모가 state를 갖고, 자식들에게 props로 전달
const [products, setProducts] = useState([...]);
const handleToggleLike = (id) =>
  setProducts(products.map(p => p.id === id ? {...p, isLiked: !p.isLiked} : p));
```

### useReducer — 은행 창구 🏦

상태가 여러 개이고, 변경 방식도 복잡해지면 `useState`를 여러 개 쓰는 것이 혼란스러워집니다.

`useReducer`는 은행 창구처럼 동작합니다.
- **고객(컴포넌트)** 은 번호표(action)를 뽑습니다
- **창구(reducer)** 는 번호표를 보고 업무를 처리해 새로운 상태를 돌려줍니다

```
dispatch({ type: 'LIKE' })
    ↓
reducer(현재 state, action)
    ↓
새로운 state 반환
```

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

| 구성요소 | 역할 |
|----------|------|
| `state` | 현재 상태 |
| `dispatch(action)` | 상태 변경 요청 발생 |
| `reducer(state, action)` | 요청을 받아 새 상태를 반환하는 순수 함수 |
| `initialState` | 초기 상태 |

```jsx
function videoReducer(state, action) {
  switch (action.type) {
    case 'LIKE':        return { ...state, likes: state.likes + 1 };
    case 'DISLIKE':     return { ...state, dislikes: state.dislikes + 1 };
    case 'ADD_COMMENT': return { ...state, comments: [...state.comments, action.payload] };
    default:            return state;
  }
}
```

> ⚠️ reducer는 항상 **새 객체**를 반환해야 합니다 (불변성 유지). 기존 state를 직접 수정하지 마세요.

---

## 6. Context API

### 비유 — 방송국 📻

Props Drilling은 일일이 사람마다 전화해서 알리는 것과 같습니다. **Context API는 방송국**입니다. 방송국이 신호를 한 번 내보내면, 라디오(useContext)를 가진 모든 컴포넌트가 바로 수신할 수 있습니다.

### 기본 3단계

```
① createContext()   — 방송국 채널 개설
② <Context.Provider value={...}>  — 방송 송출 시작
③ useContext(Context)  — 라디오로 수신
```

```jsx
// ThemeContext.jsx — ① 채널 개설 + ② 방송 송출
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

```jsx
// 어디서든 수신 가능
const { isDark, setIsDark } = useContext(ThemeContext);
```

### Context API + useReducer 조합

상태가 복잡해지면 `useReducer`를 Context와 함께 씁니다. 전역으로 공유되는 복잡한 상태(로그인, 장바구니 등)에 적합합니다.

```jsx
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { isLoggedIn: false, user: null });
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 여러 Context 중첩

```jsx
const App = () => (
  <AuthProvider>
    <CartProvider>
      <ThemeProvider>
        <MainComponent />
      </ThemeProvider>
    </CartProvider>
  </AuthProvider>
);
```

> ⚠️ Provider로 감싼 컴포넌트만 Context를 사용할 수 있습니다. Provider 밖에서는 사용 불가.

---

## 7. Zustand

### 비유 — 공용 냉장고 🧊

Context API는 방송국처럼 모든 구독자에게 신호를 보내지만, 관련 없는 컴포넌트도 함께 리렌더링될 수 있습니다.

Zustand는 **공용 냉장고**입니다. 냉장고에서 원하는 음식(state)만 꺼내고, 그 음식이 바뀔 때만 알림을 받습니다. 다른 음식이 바뀌어도 신경 쓰지 않습니다.

### 설치

```bash
npm install zustand
```

### 스토어 생성

```jsx
// stores/useCountStore.js
import { create } from 'zustand';

const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 컴포넌트에서 사용

```jsx
const Counter = () => {
  const { count, increment, decrement } = useCountStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

### 특정 상태만 구독 (성능 최적화)

```jsx
// count만 구독 → count가 바뀔 때만 리렌더링됨
const count = useCountStore((state) => state.count);
```

### Context API vs Zustand 비교

| 구분 | Context API | Zustand |
|------|-------------|---------|
| 설정 코드량 | 많음 (Provider, createContext 등) | 적음 (create 한 번) |
| 선택적 구독 | 어려움 | 쉬움 (selector 함수) |
| 외부 패키지 | 불필요 | zustand 설치 필요 |
| 적합한 상황 | 테마, 언어 등 가벼운 전역 값 | 장바구니, 인증 등 복잡한 전역 상태 |

---

## 키워드 정리

| 키워드 | 한 줄 요약 |
|--------|-----------|
| `useRef` | 화면을 바꾸지 않고 값/DOM 참조를 유지 |
| `.current` | useRef가 값을 저장하는 속성 |
| `useMemo` | 계산 결과를 기억해 불필요한 재연산 방지 |
| `React.memo` | 컴포넌트 자체를 기억해 불필요한 리렌더링 방지 |
| `useCallback` | 함수 참조를 고정해 자식 컴포넌트 리렌더링 방지 |
| 메모이제이션 | 이전 결과를 기억해 재사용하는 최적화 기법 |
| 커스텀 훅 | 반복 로직을 `use`로 시작하는 함수로 분리 |
| Props Drilling | 중간 컴포넌트를 거쳐 props를 전달하는 문제 |
| 상태 끌어올리기 | 공통 부모로 state를 올려 여러 자식이 공유 |
| `useReducer` | 복잡한 상태를 reducer 함수로 체계적으로 관리 |
| `dispatch` | useReducer에서 상태 변경 요청을 보내는 함수 |
| `reducer` | action을 받아 새 state를 반환하는 순수 함수 |
| `action` | dispatch로 전달하는 `{ type, payload }` 객체 |
| Context API | 중간 컴포넌트를 건너뛰고 전역으로 데이터 공유 |
| `createContext` | Context 객체를 생성하는 함수 |
| `Provider` | Context 데이터를 하위 컴포넌트에 공급하는 컴포넌트 |
| `useContext` | Provider가 제공하는 값을 수신하는 훅 |
| Zustand | 가볍고 선택적 구독이 가능한 전역 상태 라이브러리 |
| `create` | Zustand 스토어를 생성하는 함수 |

---

## 예제 파일 목록

| 파일 | 다루는 내용 |
|------|------------|
| `01_useRef.jsx` | useRef 기본, DOM 접근, 이전 값 기억, 타이머 관리 |
| `02_useMemo.jsx` | useMemo 기본, React.memo, 최적화 비교 데모 |
| `03_useCallback.jsx` | useCallback 기본, React.memo 조합, 실전 패턴 |
| `04_custom_hook.jsx` | 커스텀 훅 만들기, 데이터 캐싱 |
| `05_useReducer.jsx` | Props Drilling 문제, useReducer 기본/실전 |
| `06_context_api.jsx` | Context API 기본, useReducer 조합, 다중 Context |
| `07_zustand.jsx` | Zustand 스토어, 선택적 구독, 장바구니 예제 |
