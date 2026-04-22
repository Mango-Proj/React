# ch03 — 데이터 요청과 서버 통신

> 비전공자도 이해하기 쉽게 비유로 배우는 React 데이터 통신

---

## 목차

1. [웹에서 데이터를 가져오는 방법](#1-웹에서-데이터를-가져오는-방법)
2. [useEffect에서 비동기 요청 — 올바른 방법](#2-useeffect에서-비동기-요청--올바른-방법)
3. [데이터·로딩·에러 3가지 상태 관리](#3-데이터로딩에러-3가지-상태-관리)
4. [디바운싱 — 불필요한 요청 줄이기](#4-디바운싱--불필요한-요청-줄이기)
5. [fetch vs axios — 차이점](#5-fetch-vs-axios--차이점)
6. [axios 인스턴스와 인터셉터](#6-axios-인스턴스와-인터셉터)
7. [TanStack Query — 스마트 데이터 관리](#7-tanstack-query--스마트-데이터-관리)
8. [useQuery — 데이터 조회](#8-usequery--데이터-조회)
9. [useMutation — 데이터 변경](#9-usemutation--데이터-변경)
10. [핵심 키워드 정리](#10-핵심-키워드-정리)

---

## 1. 웹에서 데이터를 가져오는 방법

### 비유: 배달 앱

음식을 주문하면 배달이 완료되기까지 기다려야 합니다.  
웹도 마찬가지 — 서버에 데이터를 **요청(주문)** 하고, 오기까지 **기다리고**, **받아서** 화면에 표시합니다.

```
앱 실행(화면 마운트)
      ↓
서버에 데이터 요청  ← useEffect 안에서
      ↓
잠깐 기다림 (로딩 중...)
      ↓
데이터 도착  →  화면 업데이트 (setState)
실패        →  에러 메시지 표시
```

### 대부분의 웹 서비스에서 서버 데이터가 필요한 곳

| 서비스 | 데이터 종류 |
|--------|-----------|
| 유튜브 | 추천 영상 목록, 댓글 |
| 쿠팡 | 상품 검색 결과, 리뷰 |
| 카카오톡 | 채팅 메시지, 프로필 |
| 인스타그램 | 피드, 좋아요 수 |

---

## 2. useEffect에서 비동기 요청 — 올바른 방법

### async를 useEffect에 직접 붙이면 안 됩니다

`useEffect`의 콜백 함수를 `async`로 선언하면 React 내부에서 에러가 발생합니다.  
(Promise를 반환하면 안 되는데, async 함수는 무조건 Promise를 반환하기 때문)

```jsx
// ❌ 잘못된 방법 — useEffect에 async 직접 선언
useEffect(async () => {
  const data = await fetch('API주소');
}, []);

// ✅ 올바른 방법 — 내부에 별도 async 함수를 만들어 호출
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('API주소');
    const data = await response.json();
  };

  fetchData(); // ← 정의하고 즉시 호출
}, []);
```

---

## 3. 데이터·로딩·에러 3가지 상태 관리

### 비유: 배달 3단계

| 단계 | 배달 상황 | React 상태 |
|------|---------|-----------|
| 주문 중 | "배달 기사 배정 중..." | `isLoading: true` |
| 도착 | 음식 받음 | `data: [...]` |
| 실패 | "배달 실패" | `error: '...'` |

```jsx
const [data, setData] = useState(null);       // 서버에서 받은 실제 데이터
const [isLoading, setIsLoading] = useState(true); // 기다리는 중?
const [error, setError] = useState(null);         // 실패 이유

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.example.com/posts');
      if (!response.ok) throw new Error('서버 오류');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false); // 성공·실패 모두 로딩 종료
    }
  };
  fetchData();
}, []);

// 조건부 렌더링
if (isLoading) return <p>불러오는 중...</p>;
if (error)     return <p>에러: {error.message}</p>;
return <div>{/* data 표시 */}</div>;
```

---

## 4. 디바운싱 — 불필요한 요청 줄이기

### 비유: 자동문

자동문은 사람이 계속 왔다 갔다 해도 멈춘 순간에만 열립니다.  
마찬가지로 검색창에 "리액트"를 입력할 때 "ㄹ", "리", "리ㅇ", "리액", "리액ㅌ", "리액트" 마다 서버에 요청하면 **6번의 불필요한 요청**이 발생합니다.

**디바운싱**: 입력이 멈춘 후 일정 시간이 지나야 실제 요청을 보냅니다.

```
입력: "리"    → 타이머 시작 (1초)
입력: "리액"  → 타이머 리셋 (1초)
입력: "리액트"→ 타이머 리셋 (1초)
────── 1초 경과 ──────
서버에 "리액트" 검색 요청 1회만 전송!
```

```jsx
useEffect(() => {
  if (searchTerm.length < 2) return; // 2글자 미만이면 무시

  const timer = setTimeout(async () => {
    const response = await fetch(`API?q=${searchTerm}`);
    const data = await response.json();
    setResults(data);
  }, 500); // 0.5초 후 실행

  // 정리 함수: 새 입력이 오면 이전 타이머 취소
  return () => clearTimeout(timer);
}, [searchTerm]);
```

---

## 5. fetch vs axios — 차이점

### fetch — 브라우저 내장 API

설치 없이 사용 가능. 하지만 직접 처리해야 할 것이 많습니다.

```jsx
fetch('https://api.example.com/posts')
  .then(response => {
    if (!response.ok) throw new Error('서버 오류'); // ← 에러를 직접 확인해야 함
    return response.json();  // ← JSON 변환도 직접
  })
  .then(data => console.log(data));
```

### axios — HTTP 클라이언트 라이브러리

```bash
npm install axios
```

JSON 변환과 에러 처리를 자동으로 해줍니다.

```jsx
import axios from 'axios';

axios.get('https://api.example.com/posts')
  .then(response => console.log(response.data)) // 자동 JSON 변환
  .catch(error => console.error(error));        // 4xx/5xx 에러 자동 감지
```

### 비교표

| 기능 | fetch | axios |
|------|-------|-------|
| 설치 | 불필요 (브라우저 내장) | `npm install axios` |
| JSON 변환 | 수동 `.json()` | 자동 (`response.data`) |
| 에러 감지 | 수동 `response.ok` 확인 | 4xx/5xx 자동 에러 |
| 요청 취소 | AbortController 필요 | 내장 기능 |
| 공통 설정 | 직접 구현 필요 | **인스턴스**로 간편 관리 |

---

## 6. axios 인스턴스와 인터셉터

### 인스턴스 — 공통 설정을 한 곳에서 관리

### 비유: 회사 공용 팩스

팩스를 보낼 때마다 수신처, 회사 이름, 날짜를 매번 쓰지 않고,  
기본 양식에 세팅해두면 본문만 작성해도 됩니다.

```jsx
// api/instance.js — 한 번만 설정
const api = axios.create({
  baseURL: 'https://api.example.com',  // 기본 URL
  timeout: 5000,                        // 5초 초과시 자동 취소
  headers: { 'Content-Type': 'application/json' },
});

// 어디서든 짧게 사용
api.get('/posts');           // https://api.example.com/posts
api.get('/users/1');         // https://api.example.com/users/1
api.post('/posts', data);    // POST 요청
```

### 인터셉터 — 경비원

### 비유: 건물 경비원

건물을 드나드는 모든 사람을 검사하는 경비원처럼,  
모든 **요청과 응답을 가로채서** 공통 처리를 합니다.

```jsx
// 요청 인터셉터 — 모든 요청에 자동으로 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 인증 토큰 자동 추가
  }
  return config;
});

// 응답 인터셉터 — 401 에러 시 자동으로 로그인 페이지로 이동
api.interceptors.response.use(
  (response) => response,     // 성공: 그대로 통과
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'; // 인증 만료 → 로그인 페이지로
    }
    return Promise.reject(error);
  }
);
```

---

## 7. TanStack Query — 스마트 데이터 관리

### 비유: 스마트 냉장고

매번 마트에 가서 재료를 사오는 대신, **스마트 냉장고가 재료를 기억**합니다.

- 냉장고에 재료가 **신선하게** 있으면? → 마트 안 가도 됨 (캐시 사용)
- 유통기한 지났으면? → 마트에서 새로 구매 (서버 재요청)
- 완전히 버린지 오래 됐으면? → 냉장고에서 삭제 (메모리 정리)

```
useEffect + fetch 방식              TanStack Query 방식
─────────────────────               ───────────────────
컴포넌트마다 로딩/에러 state 직접 관리  자동 관리
같은 데이터를 여러 컴포넌트가 각각 요청  한 번 요청 후 공유
페이지 이동 시 데이터 사라짐            캐시로 유지 (빠른 전환)
백그라운드 갱신 없음                   자동 백그라운드 갱신
```

### 설치 및 설정

```bash
npm install @tanstack/react-query
```

```jsx
// main.jsx 또는 App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5분 동안 신선 (재요청 안 함)
      gcTime: 1000 * 60 * 30,    // 30분 후 캐시 메모리에서 삭제
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 모든 자식 컴포넌트에서 useQuery/useMutation 사용 가능 */}
    </QueryClientProvider>
  );
}
```

### staleTime vs gcTime

| 옵션 | 비유 | 역할 |
|------|------|------|
| `staleTime` | 식품 유통기한 | 이 시간 안에는 서버 재요청 없이 캐시 사용 |
| `gcTime` | 냉장고 보관 기한 | 이 시간 지나면 캐시 메모리에서 완전 삭제 |

---

## 8. useQuery — 데이터 조회

### 기본 사용법

```jsx
import { useQuery } from '@tanstack/react-query';

const { data, isPending, isError, error, refetch } = useQuery({
  queryKey: ['posts'],        // 이 데이터의 이름표 (캐시 키)
  queryFn: () => fetch('https://api.example.com/posts').then(r => r.json()),
});

if (isPending) return <p>로딩 중...</p>;
if (isError)   return <p>에러: {error.message}</p>;

return (
  <>
    {data.map(post => <div key={post.id}>{post.title}</div>)}
    <button onClick={() => refetch()}>새로고침</button>
  </>
);
```

### queryKey — 데이터의 이름표

```jsx
['posts']                 // "posts" 데이터
['posts', userId]         // 특정 유저의 posts (userId 바뀌면 자동 재요청)
['user', 5]               // id=5인 유저 데이터
```

### enabled — 조건부 실행

```jsx
// user 데이터가 있을 때만 posts 요청
const { data: user } = useQuery({ queryKey: ['user', id], queryFn: fetchUser });

const { data: posts } = useQuery({
  queryKey: ['posts', id],
  queryFn: fetchPosts,
  enabled: !!user,  // user가 있을 때만 실행
});
```

---

## 9. useMutation — 데이터 변경

### useQuery vs useMutation

| 구분 | 훅 | HTTP 메서드 |
|------|-----|-----------|
| 데이터 **조회** | `useQuery` | GET |
| 데이터 **생성·수정·삭제** | `useMutation` | POST / PUT / DELETE |

### 기본 사용법

```jsx
const { mutate, isPending } = useMutation({
  mutationFn: (newPost) => axios.post('/posts', newPost),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] }); // 목록 새로고침
  },
  onError: (error) => {
    alert('실패: ' + error.message);
  },
});

// 실행
mutate({ title: '새 글', content: '내용' });
```

### 낙관적 업데이트 (Optimistic Update)

### 비유: 인스타 좋아요 버튼

좋아요를 누르면 **서버 응답을 기다리지 않고** 즉시 숫자가 올라갑니다.  
실패하면 원래 숫자로 되돌아옵니다.

```jsx
const { mutate } = useMutation({
  mutationFn: addToCart,

  onMutate: async (newItem) => {
    await queryClient.cancelQueries({ queryKey: ['cart'] }); // 진행 중 요청 취소
    const previous = queryClient.getQueryData(['cart']);     // 현재 상태 저장
    queryClient.setQueryData(['cart'], old => [...old, newItem]); // 즉시 UI 업데이트
    return { previous }; // 실패 시 복원용
  },

  onError: (err, item, context) => {
    queryClient.setQueryData(['cart'], context.previous); // 실패 → 원래 상태 복원
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] }); // 성공 → 서버 데이터로 갱신
  },
});
```

---

## 10. 핵심 키워드 정리

| 키워드 | 한 줄 설명 |
|--------|-----------|
| `fetch` | 브라우저 내장 데이터 요청 API |
| `axios` | JSON 변환·에러 처리를 자동화한 HTTP 라이브러리 |
| `async/await` | 비동기 코드를 동기처럼 읽기 쉽게 작성하는 문법 |
| `try/catch/finally` | 에러 처리 구문. finally는 성공·실패 모두 실행 |
| `response.ok` | fetch 응답이 정상(200-299)인지 확인하는 속성 |
| `response.data` | axios 응답에서 실제 데이터가 담긴 속성 |
| `디바운싱` | 입력이 멈춘 후 일정 시간 뒤에만 요청을 보내는 기법 |
| `axios 인스턴스` | baseURL, timeout 등 공통 설정을 미리 정의한 axios 객체 |
| `인터셉터` | 모든 요청/응답을 가로채 공통 처리(토큰 추가, 에러 처리)를 하는 기능 |
| `TanStack Query` | 서버 데이터를 캐싱·자동관리하는 라이브러리 |
| `QueryClient` | 캐시와 쿼리 상태를 관리하는 핵심 객체 |
| `QueryClientProvider` | QueryClient를 앱 전체에 공급하는 컴포넌트 |
| `useQuery` | 서버 데이터 조회(GET)에 사용하는 훅 |
| `queryKey` | 캐시 데이터를 식별하는 고유 키 배열 |
| `queryFn` | 실제로 서버에서 데이터를 가져오는 비동기 함수 |
| `staleTime` | 캐시 데이터를 "신선"으로 간주하는 유효 시간 |
| `gcTime` | 캐시 데이터가 메모리에서 삭제되기까지의 시간 |
| `enabled` | 쿼리 실행 여부를 제어하는 옵션 (조건부 실행) |
| `refetch` | 데이터를 수동으로 재요청하는 함수 |
| `useMutation` | 서버 데이터 변경(POST/PUT/DELETE)에 사용하는 훅 |
| `mutate` | mutation을 실제로 실행하는 함수 |
| `invalidateQueries` | 특정 쿼리를 무효화해 최신 데이터를 다시 가져오게 하는 함수 |
| `낙관적 업데이트` | 서버 응답 전에 먼저 UI를 업데이트하고 실패 시 롤백하는 패턴 |

---

## 예제 파일 안내

| 파일 | 내용 |
|------|------|
| `01_fetch_basics.jsx` | fetch + useEffect, async 패턴, 3가지 상태 관리, response.ok 확인 |
| `02_debounce_search.jsx` | 디바운싱 검색, setTimeout/clearTimeout, axios 기본 사용 |
| `03_axios_instance.jsx` | axios 인스턴스, CRUD 함수 모듈화, 요청·응답 인터셉터 시뮬레이션 |
| `04_tanstack_query.jsx` | useQuery, useMutation, queryKey, enabled, invalidateQueries, 낙관적 업데이트 |

> ⚠️ **사전 설치**:
> - axios: `npm install axios`
> - TanStack Query: `npm install @tanstack/react-query`
