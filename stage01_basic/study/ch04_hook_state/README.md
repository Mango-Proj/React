# ch04 — Hook과 상태 관리

> 비전공자도 이해하기 쉽게 비유로 배우는 React 상태 관리 심화

---

## 목차

1. [컴포넌트 생명 주기](#1-컴포넌트-생명-주기)
2. [useEffect — 외부와 소통하기](#2-useeffect--외부와-소통하기)
3. [useEffect 실전 패턴](#3-useeffect-실전-패턴)
4. [state 설계 원칙 4가지](#4-state-설계-원칙-4가지)
5. [객체·배열 state 업데이트](#5-객체배열-state-업데이트)
6. [핵심 키워드 정리](#6-핵심-키워드-정리)

---

## 1. 컴포넌트 생명 주기

### 비유: 화분의 일생

컴포넌트는 화면에 나타나고 사라지는 과정을 거칩니다.  
마치 화분처럼 심고(마운트), 물을 주고(업데이트), 꽃이 지는(언마운트) 3단계가 있습니다.

```
[심기 🌱]  →  [물주기 💧]  →  [꽃이 짐 🍂]
  마운트         업데이트        언마운트
(처음 등장)   (상태/props 변화)   (화면에서 제거)
```

| 단계 | 언제 발생? | 하는 일 |
|------|-----------|---------|
| **마운트** | 컴포넌트가 화면에 처음 등장 | API 데이터 불러오기, 타이머 시작 |
| **업데이트** | state 또는 props가 바뀔 때 | 변경된 데이터로 화면 갱신 |
| **언마운트** | 컴포넌트가 화면에서 사라질 때 | 타이머 정리, 이벤트 리스너 해제 |

### 업데이트가 발생하는 3가지 조건

```
1. 컴포넌트의 state가 변경됐을 때
2. 전달받은 props가 변경됐을 때
3. 부모 컴포넌트가 업데이트됐을 때
```

---

## 2. useEffect — 외부와 소통하기

### 비유: 알림 서비스 구독

`useEffect`는 **"화면에 나타나면 구독 시작, 사라지면 구독 해제"** 하는 알림 서비스입니다.

예를 들어 날씨 앱을 만든다면:
- 앱이 켜지면(마운트) → 날씨 데이터 요청 시작
- 도시가 바뀌면(업데이트) → 새 도시 날씨 재요청
- 앱이 꺼지면(언마운트) → 실시간 업데이트 연결 해제

### 기본 구조

```jsx
useEffect(() => {
  // ① 설정 코드 (마운트 / 업데이트 시 실행)
  console.log('효과 시작!');

  return () => {
    // ② 정리 코드 (언마운트 / 다음 업데이트 전 실행)
    console.log('이전 효과 정리!');
  };
}, [의존성]);  // ③ 언제 실행할지 결정하는 배열
```

### 의존성 배열의 3가지 형태

```jsx
// 형태 1: 배열 생략 → 렌더링마다 매번 실행 (잘 안 씀)
useEffect(() => { ... });

// 형태 2: 빈 배열 [] → 마운트 시 딱 한 번만 실행
useEffect(() => { ... }, []);

// 형태 3: 값이 있는 배열 → 해당 값이 바뀔 때마다 실행
useEffect(() => { ... }, [userId, isLoggedIn]);
```

| 의존성 배열 | 실행 시점 | 사용 예 |
|------------|---------|---------|
| 생략 | 매 렌더링마다 | (거의 사용 안 함) |
| `[]` | 마운트 시 1번 | 초기 데이터 불러오기 |
| `[value]` | value 바뀔 때마다 | 검색어 변경 시 재요청 |

### 생명 주기별 동작 순서

```
마운트:   설정 코드 실행
업데이트: 정리 코드(이전 값) → 설정 코드(새로운 값)
언마운트: 정리 코드 실행
```

---

## 3. useEffect 실전 패턴

### 패턴 1 — 마운트 시 데이터 불러오기

```jsx
function DataLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ message: '데이터 로드 완료!' });
      setIsLoading(false);
    }, 2000);
  }, []); // 마운트 시 1번만

  return <div>{isLoading ? '로딩 중...' : data.message}</div>;
}
```

### 패턴 2 — 조건에 따라 다르게 불러오기

```jsx
// isLoggedIn 값이 바뀔 때마다 실행
useEffect(() => {
  if (isLoggedIn) {
    // 로그인 상태 → 사용자 정보 불러오기
    fetchUserData();
  } else {
    // 로그아웃 → 사용자 정보 초기화
    setUser(null);
  }
}, [isLoggedIn]); // isLoggedIn이 바뀔 때 재실행
```

### 패턴 3 — 이벤트 리스너 등록 + 정리

```jsx
useEffect(() => {
  function handleMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
  
  window.addEventListener('pointermove', handleMove);  // 등록
  
  return () => {
    window.removeEventListener('pointermove', handleMove); // 정리 (메모리 누수 방지)
  };
}, []);
```

> 💡 **정리 함수가 중요한 이유**: 이벤트 리스너를 해제하지 않으면 컴포넌트가 사라져도  
> 메모리에 계속 남아 **메모리 누수(memory leak)** 가 발생합니다.

---

## 4. state 설계 원칙 4가지

### 원칙 1 — 연관된 state 묶기

항상 함께 바뀌는 값은 하나의 객체로 묶으세요.

```jsx
// ❌ 나쁜 예: 항상 함께 바뀌는데 따로 관리
const [x, setX] = useState(0);
const [y, setY] = useState(0);
setX(e.clientX);
setY(e.clientY); // setX, setY 두 번 호출

// ✅ 좋은 예: 하나의 객체로 묶기
const [position, setPosition] = useState({ x: 0, y: 0 });
setPosition({ x: e.clientX, y: e.clientY }); // 한 번에!
```

### 원칙 2 — 불필요한 state 피하기

다른 state에서 **계산 가능한 값**은 새 state로 만들지 않습니다.

```jsx
// ❌ 나쁜 예: fullName을 별도 state로 관리 (중복 상태!)
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');  // ← 불필요!

// ✅ 좋은 예: 렌더링 시 계산
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const fullName = `${firstName} ${lastName}`;  // 계산으로 충분
```

### 원칙 3 — state 모순 피하기

서로 충돌 가능한 여러 state 대신, **하나의 상태값**으로 관리하세요.

```jsx
// ❌ 나쁜 예: isSending과 isSent가 동시에 true가 될 수 있음
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);

// ✅ 좋은 예: 하나의 status로 통합
const [status, setStatus] = useState('typing'); // 'typing' | 'sending' | 'sent'
const isSending = status === 'sending';
const isSent = status === 'sent';
```

### 원칙 4 — 불변성 유지하기

### 비유: 원본 서류와 사본

불변성이란 **원본을 건드리지 않고 복사본을 새로 만들어 수정**하는 원칙입니다.

```
원본 서류 (state) → 그대로 유지
      ↓ 복사
사본 + 변경 내용 → setState에 전달 → 화면 업데이트
```

```jsx
// ❌ 잘못된 방법: 원본 직접 수정 (React가 변경 감지 못함!)
state.count = state.count + 1;  // ← 이렇게 하면 리렌더링 안 됨

// ✅ 올바른 방법: 새 값을 setState에 전달
setCount(count + 1);  // ← 새 값 전달
setUser({ ...user, name: '새이름' });  // ← 복사 후 변경
```

> 💡 **왜 직접 수정하면 안 될까?**  
> React는 "참조 주소"만 비교합니다. 내부 값만 바꾸면 같은 주소라 변경을 감지 못해  
> 화면이 업데이트되지 않습니다.

---

## 5. 객체·배열 state 업데이트

### 객체 state 업데이트

스프레드 연산자(`...`)로 기존 객체를 복사하고, 바꿀 값만 덮어씁니다.

```jsx
// 이름만 변경, 나머지는 그대로
setUser({ ...user, name: '새이름' });

// 중첩 객체 변경 (주소의 city만 변경)
setUser({
  ...user,           // 바깥 객체 복사
  address: {
    ...user.address, // 내부 address 복사
    city: '부산',    // city만 변경
  },
});
```

### 배열 state 업데이트

```jsx
// 항목 추가: 스프레드로 새 배열 생성
setTodos([...todos, newTodo]);

// 항목 삭제: filter로 새 배열 생성
setTodos(todos.filter(todo => todo.id !== targetId));

// 항목 수정: map으로 새 배열 생성
setTodos(todos.map(todo =>
  todo.id === targetId ? { ...todo, done: true } : todo
));
```

> ⚠️ **주의**: `push`, `pop`, `splice` 같은 배열 직접 수정 메서드는 사용하지 않습니다.  
> `filter`, `map`, 스프레드 연산자처럼 **새 배열을 반환하는 방법**을 사용하세요.

---

## 6. 핵심 키워드 정리

| 키워드 | 한 줄 설명 |
|--------|-----------|
| `마운트` | 컴포넌트가 화면에 처음 등장하는 것 |
| `언마운트` | 컴포넌트가 화면에서 사라지는 것 |
| `업데이트` | state/props 변화로 리렌더링되는 것 |
| `useEffect` | 마운트/업데이트/언마운트 시 작업을 등록하는 훅 |
| `setup 함수` | useEffect의 첫 번째 인자. 설정 코드가 담김 |
| `정리 함수` | setup 함수가 반환하는 함수. 이전 효과를 정리함 |
| `의존성 배열` | useEffect가 언제 재실행될지 결정하는 두 번째 인자 |
| `불변성` | 원본을 수정하지 않고 새 복사본으로 상태를 바꾸는 원칙 |
| `스프레드 연산자` | `{ ...obj }` — 객체/배열 복사 시 사용 |
| `메모리 누수` | 정리 함수 없이 이벤트 리스너가 계속 쌓이는 현상 |
| `얕은 비교` | React가 참조 주소만 보고 변경 여부를 판단하는 방식 |

---

## 예제 파일 안내

| 파일 | 내용 |
|------|------|
| `01_lifecycle_useEffect.jsx` | 생명 주기 시각화, 데이터 로딩, 조건부 fetch, 마우스 포인터 |
| `02_state_design.jsx` | 4가지 state 설계 원칙 (묶기, 불필요 피하기, 모순 피하기, 불변성) |
| `03_object_array_state.jsx` | 객체/중첩 객체/배열/복합 구조 state 업데이트 |
