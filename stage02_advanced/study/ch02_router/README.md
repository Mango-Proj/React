# ch02 — React Router

> 비전공자도 이해하기 쉽게 비유로 배우는 React 페이지 이동(라우팅)

---

## 목차

1. [라우터란 무엇인가?](#1-라우터란-무엇인가)
2. [React Router 설치 및 기본 설정](#2-react-router-설치-및-기본-설정)
3. [페이지 이동 — Link와 NavLink](#3-페이지-이동--link와-navlink)
4. [중첩 라우팅 — 공통 레이아웃 유지하기](#4-중첩-라우팅--공통-레이아웃-유지하기)
5. [동적 라우팅 — URL 파라미터](#5-동적-라우팅--url-파라미터)
6. [useNavigate — 코드로 페이지 이동](#6-usenavigate--코드로-페이지-이동)
7. [핵심 키워드 정리](#7-핵심-키워드-정리)

---

## 1. 라우터란 무엇인가?

### 비유: 건물 안내 데스크

큰 백화점에 들어가면 안내 데스크가 있습니다.  
"식품관은 B1, 의류는 2층, 가전은 4층" — URL에 따라 어느 컴포넌트를 보여줄지 결정합니다.

```
URL 주소              →  보여줄 화면(컴포넌트)
─────────────────────────────────────────────
/                    →  홈 페이지
/videos              →  영상 목록
/videos/react-101    →  리액트 입문 강의 상세
/login               →  로그인 페이지
/profile             →  내 프로필
```

### 일반 웹사이트 vs React Router

| 구분 | 일반 웹사이트 | React Router (SPA) |
|------|------------|-------------------|
| 페이지 이동 | 서버에서 새 HTML 파일 전송 | JS로 컴포넌트만 교체 |
| 화면 깜빡임 | 있음 (새로고침) | 없음 (부드러운 전환) |
| URL 변경 | 실제 서버 요청 | 브라우저 주소만 변경 |

### SPA란?

**Single Page Application** — HTML 파일은 하나지만, JS로 내용을 바꿔가며  
마치 여러 페이지처럼 보이게 만드는 방식입니다.  
유튜브, Gmail, 카카오 웹이 모두 SPA입니다.

---

## 2. React Router 설치 및 기본 설정

### 설치

```bash
npm install react-router-dom
```

### 방법 1 — createBrowserRouter (권장, 최신 방식)

`main.jsx`에서 라우터를 정의하고 전체 앱에 적용합니다.

```jsx
// main.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import VideoList from './pages/VideoList';

const router = createBrowserRouter([
  { path: '/',       element: <Home /> },
  { path: '/videos', element: <VideoList /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
```

### 방법 2 — BrowserRouter + Routes (구 방식, 여전히 많이 사용)

```jsx
// main.jsx 또는 App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Home />} />
        <Route path="/videos" element={<VideoList />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 3. 페이지 이동 — Link와 NavLink

### Link — `<a>` 태그 대신 사용

```jsx
// ❌ HTML의 <a> 태그 — 페이지 전체 새로고침 발생!
<a href="/videos">영상 목록</a>

// ✅ React Router의 <Link> — 새로고침 없이 화면만 교체
import { Link } from 'react-router-dom';
<Link to="/videos">영상 목록</Link>
```

### NavLink — 현재 페이지 메뉴에 강조 스타일 자동 적용

```jsx
import { NavLink } from 'react-router-dom';

// isActive가 true면 현재 페이지의 링크
<NavLink
  to="/videos"
  style={({ isActive }) => ({
    color: isActive ? '#6366f1' : '#374151',
    fontWeight: isActive ? 700 : 400,
  })}
>
  영상 목록
</NavLink>
```

---

## 4. 중첩 라우팅 — 공통 레이아웃 유지하기

### 비유: 건물 외벽은 그대로, 내부만 바뀐다

백화점 외벽(헤더, 네비게이션, 푸터)은 층마다 동일합니다.  
층을 이동해도 외벽은 그대로이고 **내부 전시물만 바뀝니다**.

React의 중첩 라우팅도 같습니다:

```
[헤더 네비게이션]         ← RootLayout (항상 표시)
[      내용 영역      ]   ← <Outlet /> 자리: 경로에 따라 내용 교체
[     푸터 영역      ]    ← RootLayout (항상 표시)
```

### 구현 방법

```jsx
// 1. RootLayout 컴포넌트 — 헤더+푸터 항상 표시, <Outlet/>이 내용 자리
import { Outlet, Link } from 'react-router-dom';

function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/videos">영상 목록</Link>
      </nav>

      <main>
        <Outlet />  {/* ← 자식 경로 컴포넌트가 여기에 렌더링됨 */}
      </main>

      <footer>푸터</footer>
    </>
  );
}

// 2. 라우터 설정 — children으로 자식 경로 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,  // 공통 레이아웃
    children: [
      { index: true,          element: <Home /> },        // '/'
      { path: 'videos',       element: <VideoList /> },   // '/videos'
      { path: 'videos/:id',   element: <VideoDetail /> }, // '/videos/123'
    ],
  },
]);
```

### index 라우트란?

`index: true`는 **부모 경로와 정확히 일치할 때** 렌더링되는 기본 자식입니다.

```
/          → index: true  → <Home />      (path='/'와 정확히 일치)
/videos    → path='videos' → <VideoList />
/videos/1  → path='videos/:id' → <VideoDetail />
```

---

## 5. 동적 라우팅 — URL 파라미터

### 비유: 유튜브 영상 URL

유튜브는 모든 영상마다 별도 페이지를 만들지 않습니다.  
하나의 `VideoDetail` 컴포넌트가 URL의 **영상 ID**를 읽어 해당 영상을 보여줍니다.

```
https://youtube.com/watch?v=AB123  →  AB123 영상
https://youtube.com/watch?v=CD456  →  CD456 영상
                              ↑
                           파라미터 (동적으로 변하는 부분)
```

### 콜론(:)으로 파라미터 정의

```jsx
// ':videoId' 부분이 어떤 값이 와도 매칭
{ path: 'videos/:videoId', element: <VideoDetail /> }

// URL 예시
/videos/react-101   →  videoId = 'react-101'
/videos/hooks-deep  →  videoId = 'hooks-deep'
/videos/AB123       →  videoId = 'AB123'
```

### useParams() — URL에서 파라미터 값 읽기

```jsx
import { useParams } from 'react-router-dom';

function VideoDetail() {
  const { videoId } = useParams();  // URL의 :videoId 값을 가져옴

  // videoId를 이용해 해당 영상 데이터 조회
  const video = videoData.find(v => v.id === videoId);

  return <h1>{video.title}</h1>;
}
```

---

## 6. useNavigate — 코드로 페이지 이동

### 비유: 자동 리다이렉트

로그인 폼에서 "로그인" 버튼을 클릭하면 자동으로 홈으로 이동하는 것처럼,  
**버튼 클릭이나 특정 조건 충족 시** 코드로 페이지를 이동시킵니다.

```jsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 처리 후...
    navigate('/');          // 홈으로 이동
    navigate(-1);           // 뒤로가기
    navigate('/videos', { replace: true }); // 히스토리 교체 (뒤로가기 막기)
  };

  return <button onClick={handleLogin}>로그인</button>;
}
```

### Link vs useNavigate 언제 쓸까?

| 상황 | 사용 |
|------|------|
| 메뉴 링크, 버튼 클릭으로 단순 이동 | `<Link to="...">` |
| 조건 처리 후 이동 (로그인 완료, 폼 제출) | `useNavigate()` |
| 현재 경로 강조 필요한 메뉴 | `<NavLink>` |

---

## 7. 핵심 키워드 정리

| 키워드 | 한 줄 설명 |
|--------|-----------|
| `Router` | URL과 컴포넌트를 연결하는 시스템 |
| `createBrowserRouter` | 라우터 설정을 배열로 정의하는 함수 (최신) |
| `RouterProvider` | 라우터를 전체 앱에 제공하는 컴포넌트 |
| `BrowserRouter` | 라우터 기능을 앱에 제공하는 컴포넌트 (구 방식) |
| `Routes` | 여러 Route 중 현재 URL과 맞는 하나를 선택 |
| `Route` | path와 element를 연결하는 단위 |
| `path` | URL 경로 패턴 (`'/videos/:id'` 형태) |
| `element` | 해당 경로에서 렌더링할 컴포넌트 |
| `children` | 중첩 라우트를 정의하는 배열 |
| `index` | 부모 경로와 정확히 일치할 때 렌더링되는 기본 자식 |
| `Outlet` | 부모 레이아웃에서 자식 컴포넌트가 삽입되는 자리 |
| `Link` | 새로고침 없이 페이지를 이동하는 컴포넌트 |
| `NavLink` | 현재 경로일 때 스타일을 자동 적용하는 Link |
| `useParams` | URL 파라미터 값을 읽는 훅 |
| `useNavigate` | 코드로 페이지를 이동시키는 훅 |
| `동적 라우팅` | `:param` 형태로 변하는 URL 부분을 처리 |
| `SPA` | 페이지 전환 없이 JS로 화면을 교체하는 앱 방식 |

---

## 예제 파일 안내

| 파일 | 내용 |
|------|------|
| `01_router_setup.jsx` | 라우터 설정 구조, Link vs a 태그, NavLink 활성 스타일 |
| `02_nested_routing.jsx` | RootLayout + Outlet, 중첩 라우트 설정, index 라우트 |
| `03_dynamic_routing.jsx` | 동적 파라미터(:id), useParams, useNavigate, 404 처리 |

> ⚠️ **사전 설치 필요**: `npm install react-router-dom`
